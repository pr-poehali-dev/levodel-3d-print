import json
import base64
import os
import uuid
import boto3
from datetime import datetime

def handler(event: dict, context) -> dict:
    '''Загрузка STL и PNG файлов в S3 хранилище'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        file_data = body.get('fileData', '')
        file_name = body.get('fileName', '')
        file_type = body.get('fileType', '')
        
        if not file_data or not file_name:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Файл не предоставлен'})
            }
        
        # Декодируем base64
        file_bytes = base64.b64decode(file_data)
        
        # Генерируем уникальное имя файла
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_id = str(uuid.uuid4())[:8]
        extension = file_name.split('.')[-1] if '.' in file_name else 'bin'
        new_filename = f"uploads/{timestamp}_{unique_id}.{extension}"
        
        # Подключаемся к S3
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        # Определяем Content-Type
        content_type = 'application/octet-stream'
        if extension.lower() == 'stl':
            content_type = 'model/stl'
        elif extension.lower() in ['png', 'jpg', 'jpeg']:
            content_type = f'image/{extension.lower()}'
        
        # Загружаем файл
        s3.put_object(
            Bucket='files',
            Key=new_filename,
            Body=file_bytes,
            ContentType=content_type
        )
        
        # Формируем CDN URL
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{new_filename}"
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'fileUrl': cdn_url,
                'fileName': new_filename,
                'fileType': extension
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка загрузки: {str(e)}'})
        }
