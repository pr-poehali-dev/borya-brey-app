import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    '''Получение подключения к базе данных'''
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: dict, context) -> dict:
    '''API для управления пользователями и бонусами'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
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
            phone = params.get('phone')
            
            if user_id:
                cur.execute('SELECT * FROM users WHERE id = %s', (user_id,))
                user = cur.fetchone()
                
                if user:
                    cur.execute('''
                        SELECT * FROM bonus_history 
                        WHERE user_id = %s 
                        ORDER BY created_at DESC 
                        LIMIT 50
                    ''', (user_id,))
                    bonus_history = cur.fetchall()
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({
                            'user': user,
                            'bonus_history': bonus_history
                        }, default=str),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'User not found'}),
                        'isBase64Encoded': False
                    }
            
            elif phone:
                cur.execute('SELECT * FROM users WHERE phone = %s', (phone,))
                user = cur.fetchone()
                
                if user:
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'user': user}, default=str),
                        'isBase64Encoded': False
                    }
                else:
                    return {
                        'statusCode': 404,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps({'error': 'User not found'}),
                        'isBase64Encoded': False
                    }
            
            else:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'user_id or phone required'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            phone = data.get('phone')
            name = data.get('name')
            email = data.get('email')
            
            if not phone or not name:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'phone and name are required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                INSERT INTO users (phone, name, email, bonus_points)
                VALUES (%s, %s, %s, 0)
                ON CONFLICT (phone) DO UPDATE 
                SET name = EXCLUDED.name, email = EXCLUDED.email
                RETURNING *
            ''', (phone, name, email))
            
            user = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'user': user}, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            user_id = data.get('user_id')
            bonus_points = data.get('bonus_points')
            
            if not user_id or bonus_points is None:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'user_id and bonus_points required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute('''
                UPDATE users 
                SET bonus_points = bonus_points + %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
            ''', (bonus_points, user_id))
            
            user = cur.fetchone()
            
            if user:
                cur.execute('''
                    INSERT INTO bonus_history (user_id, points, type, description)
                    VALUES (%s, %s, %s, %s)
                ''', (user_id, bonus_points, 'manual', 'Начисление/списание бонусов'))
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'user': user}, default=str),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'User not found'}),
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
