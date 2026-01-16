import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    '''Отправка заказа на email через Gmail SMTP'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        name = body.get('name', '')
        phone = body.get('phone', '')
        email = body.get('email', '')
        length = body.get('length', '')
        width = body.get('width', '')
        height = body.get('height', '')
        material = body.get('material', 'pla')
        quantity = body.get('quantity', '1')
        description = body.get('description', '')
        file_link = body.get('fileLink', '')
        
        if not name or not phone:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Имя и телефон обязательны'}),
                'isBase64Encoded': False
            }
        
        smtp_email = os.environ.get('SMTP_EMAIL')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        recipient_email = 'zamuraevmaksim62@gmail.com'
        
        if not smtp_email or not smtp_password:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'SMTP credentials not configured'}),
                'isBase64Encoded': False
            }
        
        material_names = {
            'pla': 'PLA — Экологичный',
            'abs': 'ABS — Прочный',
            'petg': 'PETG — Гибкий',
            'tpu': 'TPU — Эластичный'
        }
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #4F46E5;">🚀 Новый заказ с сайта Levodel Studio</h2>
            
            <h3 style="color: #666; border-bottom: 2px solid #4F46E5; padding-bottom: 5px;">Контактная информация</h3>
            <p><strong>Имя:</strong> {name}</p>
            <p><strong>Телефон:</strong> {phone}</p>
            {f'<p><strong>Email:</strong> {email}</p>' if email else ''}
            
            <h3 style="color: #666; border-bottom: 2px solid #4F46E5; padding-bottom: 5px; margin-top: 20px;">Параметры изделия</h3>
            {f'<p><strong>Размеры (Д×Ш×В):</strong> {length} × {width} × {height} см</p>' if length and width and height else '<p><em>Размеры не указаны</em></p>'}
            <p><strong>Материал:</strong> {material_names.get(material, material.upper())}</p>
            <p><strong>Количество:</strong> {quantity} шт.</p>
            
            {f'<h3 style="color: #666; border-bottom: 2px solid #4F46E5; padding-bottom: 5px; margin-top: 20px;">3D Модель</h3><p><a href="{file_link}" style="color: #4F46E5;">{file_link}</a></p>' if file_link else ''}
            
            {f'<h3 style="color: #666; border-bottom: 2px solid #4F46E5; padding-bottom: 5px; margin-top: 20px;">Описание заказа</h3><p style="background: #f5f5f5; padding: 10px; border-radius: 5px;">{description}</p>' if description else ''}
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px;">Заказ отправлен автоматически с сайта Levodel Studio</p>
        </body>
        </html>
        """
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'🚀 Новый заказ от {name}'
        msg['From'] = smtp_email
        msg['To'] = recipient_email
        
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(smtp_email, smtp_password)
            server.send_message(msg)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'message': 'Заказ успешно отправлен'}),
            'isBase64Encoded': False
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid JSON'}),
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
