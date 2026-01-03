import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    '''Получение подключения к базе данных'''
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: dict, context) -> dict:
    '''API для получения информации о салонах, мастерах и услугах'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        params = event.get('queryStringParameters') or {}
        resource_type = params.get('type', 'salons')
        
        if resource_type == 'salons':
            cur.execute('SELECT * FROM salons ORDER BY id')
            salons = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'salons': salons}, default=str),
                'isBase64Encoded': False
            }
        
        elif resource_type == 'masters':
            salon_id = params.get('salon_id')
            
            if salon_id:
                cur.execute('''
                    SELECT m.*, s.name as salon_name 
                    FROM masters m 
                    JOIN salons s ON m.salon_id = s.id
                    WHERE m.salon_id = %s
                    ORDER BY m.rating DESC
                ''', (salon_id,))
            else:
                cur.execute('''
                    SELECT m.*, s.name as salon_name 
                    FROM masters m 
                    JOIN salons s ON m.salon_id = s.id
                    ORDER BY m.rating DESC
                ''')
            
            masters = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'masters': masters}, default=str),
                'isBase64Encoded': False
            }
        
        elif resource_type == 'services':
            cur.execute('SELECT * FROM services ORDER BY price')
            services = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'services': services}, default=str),
                'isBase64Encoded': False
            }
        
        elif resource_type == 'promotions':
            cur.execute('''
                SELECT * FROM promotions 
                WHERE is_active = true 
                AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
                ORDER BY created_at DESC
            ''')
            promotions = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'promotions': promotions}, default=str),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid resource type'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()