"""
Update IG API tokens for streaming API
"""
import os
import sys
import json
import logging
import requests
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def update_ig_tokens():
    """
    Update IG API tokens for streaming API
    
    This script gets a new CST and X-SECURITY-TOKEN from the IG API
    and updates the environment variables or database.
    """
    # Get credentials from environment
    identifier = os.getenv('IG_IDENTIFIER')
    password = os.getenv('IG_PASSWORD')
    api_key = os.getenv('IG_API_KEY')
    is_demo = os.getenv('IG_DEMO', 'True').lower() in ('true', '1', 't')
    
    if not all([identifier, password, api_key]):
        logger.error("Missing IG API credentials. Please set IG_IDENTIFIER, IG_PASSWORD, and IG_API_KEY environment variables.")
        return False
    
    # Determine API URL
    base_url = "https://demo-api.ig.com/gateway/deal" if is_demo else "https://api.ig.com/gateway/deal"
    session_url = f"{base_url}/session"
    
    # Prepare headers and payload
    headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8',
        'X-IG-API-KEY': api_key,
        'Version': '2'
    }
    
    payload = {
        'identifier': identifier,
        'password': password
    }
    
    try:
        # Make session request
        logger.info(f"Requesting new session from IG API (Demo: {is_demo})")
        response = requests.post(session_url, headers=headers, json=payload)
        
        if response.status_code != 200:
            logger.error(f"Failed to get session: {response.status_code} - {response.text}")
            return False
        
        # Extract tokens
        cst = response.headers.get('CST')
        security_token = response.headers.get('X-SECURITY-TOKEN')
        
        if not cst or not security_token:
            logger.error("Failed to get CST or X-SECURITY-TOKEN from response")
            return False
        
        logger.info("Successfully obtained new tokens")
        
        # Set up Django environment
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ftrader.settings')
        import django
        django.setup()
        
        # Update user tokens in database
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        # Get admin user
        admin = User.objects.filter(is_superuser=True).first()
        if not admin:
            logger.error("No admin user found")
            return False
        
        # Update tokens
        admin.ig_cst = cst
        admin.ig_security_token = security_token
        admin.ig_active_session = True
        admin.save()
        
        logger.info(f"Updated tokens for user: {admin.username}")
        
        # Print tokens for reference
        logger.info(f"CST: {cst[:10]}...")
        logger.info(f"X-SECURITY-TOKEN: {security_token[:10]}...")
        
        # Also update environment variables for testing
        os.environ['IG_CST'] = cst
        os.environ['IG_SECURITY_TOKEN'] = security_token
        
        return True
    
    except Exception as e:
        logger.exception(f"Error updating tokens: {str(e)}")
        return False

if __name__ == "__main__":
    success = update_ig_tokens()
    sys.exit(0 if success else 1)
