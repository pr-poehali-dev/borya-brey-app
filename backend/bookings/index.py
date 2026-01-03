import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    '''Получение подключения к базе данных'''
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: dict, context) -> dict:
    '''API для управления бронированиями в барбершопе'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            user_id = params.get('user_id')
            
            if user_id:
                cur.execute('''
                    SELECT 
                        b.id, 
                        s.name as service_name,
                        m.name as master_name,
                        sal.name as salon_name,
                        b.booking_date,
                        b.booking_time,
                        b.status,
                        b.notes
                    FROM bookings b
                    JOIN services s ON b.service_id = s.id
                    JOIN masters m ON b.master_id = m.id
                    JOIN salons sal ON b.salon_id = sal.id
                    WHERE b.user_id = %s
                    ORDER BY b.booking_date DESC, b.booking_time DESC
                ''', (user_id,))
            else:
                cur.execute('''
                    SELECT 
                        b.id, 
                        u.name as user_name,
                        u.phone as user_phone,
                        s.name as service_name,
                        m.name as master_name,
                        sal.name as salon_name,
                        b.booking_date,
                        b.booking_time,
                        b.status
                    FROM bookings b
                    JOIN users u ON b.user_id = u.id
                    JOIN services s ON b.service_id = s.id
                    JOIN masters m ON b.master_id = m.id
                    JOIN salons sal ON b.salon_id = sal.id
                    ORDER BY b.booking_date DESC, b.booking_time DESC
                    LIMIT 100
                ''')
            
            bookings = cur.fetchall()
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'bookings': bookings}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            user_id = data.get('user_id')
            salon_id = data.get('salon_id')
            master_id = data.get('master_id')
            service_id = data.get('service_id')
            booking_date = data.get('booking_date')
            booking_time = data.get('booking_time')
            notes = data.get('notes', '')
            
            if not all([user_id, salon_id, master_id, service_id, booking_date, booking_time]):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                INSERT INTO bookings (user_id, salon_id, master_id, service_id, booking_date, booking_time, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (user_id, salon_id, master_id, service_id, booking_date, booking_time, notes))
            
            booking_id = cur.fetchone()['id']
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'booking_id': booking_id, 'message': 'Booking created successfully'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            booking_id = data.get('booking_id')
            status = data.get('status')
            
            if not booking_id or not status:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Missing booking_id or status'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                UPDATE bookings 
                SET status = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id
            ''', (status, booking_id))
            
            result = cur.fetchone()
            conn.commit()
            
            if result:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'message': 'Booking updated successfully'}),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Booking not found'}),
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
