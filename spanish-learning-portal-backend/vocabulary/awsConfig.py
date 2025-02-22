import boto3
import os 
from dotenv import load_dotenv

   # Load environment variables from .env.local
load_dotenv('.env.local')

# Load AWS credentials from environment variables
access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
region = os.getenv('AWS_REGION', 'eu-west-1')

# Create a Polly client
polly = boto3.client(
    'polly',
    aws_access_key_id=access_key_id,
    aws_secret_access_key=secret_access_key,
    region_name=region
)
