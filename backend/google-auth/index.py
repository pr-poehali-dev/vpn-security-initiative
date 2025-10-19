'''
Business: Google OAuth authentication for VPN users
Args: event with httpMethod, queryStringParameters (code, redirect_uri), body
      context with request_id
Returns: HTTP response with user data or authorization URL
'''

import json
import os
import urllib.request
import urllib.parse
from typing import Dict, Any

GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', '')
GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        redirect_uri = params.get('redirect_uri', '')
        
        if not redirect_uri:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'redirect_uri required'})
            }
        
        auth_url = (
            f'https://accounts.google.com/o/oauth2/v2/auth?'
            f'client_id={GOOGLE_CLIENT_ID}&'
            f'redirect_uri={urllib.parse.quote(redirect_uri)}&'
            f'response_type=code&'
            f'scope=openid%20email%20profile&'
            f'access_type=offline'
        )
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'auth_url': auth_url})
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        code = body_data.get('code', '')
        redirect_uri = body_data.get('redirect_uri', '')
        
        if not code or not redirect_uri:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'code and redirect_uri required'})
            }
        
        token_data = urllib.parse.urlencode({
            'code': code,
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code'
        }).encode()
        
        token_req = urllib.request.Request(GOOGLE_TOKEN_URL, data=token_data, method='POST')
        token_req.add_header('Content-Type', 'application/x-www-form-urlencoded')
        
        with urllib.request.urlopen(token_req) as response:
            token_response = json.loads(response.read().decode())
        
        access_token = token_response.get('access_token', '')
        
        userinfo_req = urllib.request.Request(GOOGLE_USERINFO_URL)
        userinfo_req.add_header('Authorization', f'Bearer {access_token}')
        
        with urllib.request.urlopen(userinfo_req) as response:
            user_data = json.loads(response.read().decode())
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'user': {
                    'id': user_data.get('id'),
                    'email': user_data.get('email'),
                    'name': user_data.get('name'),
                    'picture': user_data.get('picture'),
                    'verified_email': user_data.get('verified_email', False)
                },
                'access_token': access_token
            })
        }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
