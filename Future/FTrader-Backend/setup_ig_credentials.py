import os
import sys
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ftrader.settings')
django.setup()

# Import necessary modules
from django.contrib.auth import get_user_model
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_ig_credentials():
    """Set up IG API credentials for the admin user"""
    User = get_user_model()
    
    try:
        # Get the admin user
        user = User.objects.get(username='admin')
        
        # Set IG API credentials
        user.ig_api_key = 'test_api_key'
        user.ig_cst = 'test_cst'
        user.ig_security_token = 'test_security_token'
        user.ig_active_session = True
        user.use_demo_account = True  # Use demo account for testing
        
        # Save the user
        user.save()
        
        logger.info(f"IG API credentials set for user: {user.username}")
        return True
            
    except Exception as e:
        logger.exception(f"Error setting IG API credentials: {str(e)}")
        return False

if __name__ == "__main__":
    success = setup_ig_credentials()
    sys.exit(0 if success else 1)
