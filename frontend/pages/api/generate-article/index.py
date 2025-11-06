from http import HTTPStatus
import json
import os
import sys
from typing import Dict, Any

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))}

# Import your script
from article_script import main as generate_article

def handler(event, context):
    try:
        # Parse the request body
        body = json.loads(event.get('body', '{}'))
        
        # Get parameters with defaults
        query = body.get('query', '')
        count = int(body.get('count', 1))
        category = body.get('category', 'news')
        
        if not query:
            return {
                'statusCode': HTTPStatus.BAD_REQUEST,
                'body': json.dumps({'error': 'Query parameter is required'})
            }
        
        # Call your script's main function
        result = generate_article(query, count=count, category=category)
        
        return {
            'statusCode': HTTPStatus.OK,
            'body': json.dumps(result)
        }
        
    except Exception as e:
        return {
            'statusCode': HTTPStatus.INTERNAL_SERVER_ERROR,
            'body': json.dumps({
                'error': 'Failed to generate article',
                'details': str(e)
            })
        }
