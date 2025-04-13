import boto3
import os
import json
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv('.env.local')

def test_bedrock_connectivity():
    """Test connectivity to AWS Bedrock"""
    # Print AWS credentials (without exposing the actual secret)
    aws_key = os.environ.get('AWS_ACCESS_KEY_ID')
    aws_secret = os.environ.get('AWS_SECRET_ACCESS_KEY')
    aws_region = os.environ.get('AWS_REGION')
    
    print(f"AWS credentials check:")
    print(f"  - AWS_ACCESS_KEY_ID: {'Available' if aws_key else 'Missing'}")
    print(f"  - AWS_SECRET_ACCESS_KEY: {'Available' if aws_secret else 'Missing'}")
    print(f"  - AWS_REGION: {aws_region if aws_region else 'Missing'}")
    
    try:
        # Create the Bedrock client (not bedrock-runtime)
        print("\nCreating Bedrock client...")
        bedrock_client = boto3.client('bedrock', region_name=aws_region or "us-east-1")
        
        # Test if the client works by listing available models
        try:
            print("\nTesting Bedrock connectivity...")
            # Try a simple API call
            response = bedrock_client.list_foundation_models()
            print("\nSuccessfully connected to AWS Bedrock!")
            
            # Print available models
            models = response.get('modelSummaries', [])
            print(f"Available models: {len(models)}")
            
            # Print the first few models
            if models:
                print("\nSome available models:")
                for i, model in enumerate(models[:10]):  # Show first 10 models
                    print(f"  - {model.get('modelId', 'Unknown')}")
                
                # Check if our target model is available
                target_model = "amazon.nova-lite-v1:0"
                available_model_ids = [m.get('modelId') for m in models]
                if target_model in available_model_ids:
                    print(f"\nTarget model '{target_model}' is AVAILABLE")
                else:
                    print(f"\nTarget model '{target_model}' is NOT AVAILABLE in the list")
                    print("Available models that might be similar:")
                    for m in available_model_ids:
                        if "nova" in m.lower():
                            print(f"  - {m}")
            
            return True
        except Exception as e:
            print(f"\nAWS Bedrock connectivity test failed: {str(e)}")
            return False
                
    except Exception as e:
        print(f"\nFailed to initialize Bedrock client: {str(e)}")
        return False

def test_bedrock_invoke():
    """Test invoking AWS Bedrock model"""
    # Load environment variables from .env.local
    load_dotenv('.env.local')
    
    try:
        # Create the Bedrock runtime client (for model invocation)
        aws_region = os.environ.get('AWS_REGION', 'us-east-1')
        bedrock_runtime_client = boto3.client('bedrock-runtime', region_name=aws_region)
        
        # Model ID - use the original model from the codebase
        model_id = "amazon.nova-lite-v1:0"
        
        # Test prompt
        prompt = "Generate a simple Spanish dialogue question about food. Return the response in this JSON format: { 'Introduction': '...', 'Conversation': '...', 'Question': '...', 'Options': ['...', '...', '...', '...'], 'correctAnswer': ..., 'explanation': '...' }"
        
        print(f"\nInvoking Bedrock model: {model_id}")
        print(f"Prompt: {prompt}")
        
        # Create message payload for the nova model
        messages = [{
            "role": "user",
            "content": [{"text": prompt}]
        }]
        
        # Invoke the model
        response = bedrock_runtime_client.converse(
            modelId=model_id,
            messages=messages,
            inferenceConfig={"temperature": 0.7}
        )
        
        # Extract and print the response
        response_text = response['output']['message']['content'][0]['text']
        print("\nSuccessfully received response from Bedrock:")
        print(json.dumps(json.loads(response_text), indent=2))
        
        return True
    except Exception as e:
        print(f"\nError invoking Bedrock: {str(e)}")
        return False

if __name__ == "__main__":
    print("=== AWS Bedrock Connectivity Test ===")
    if test_bedrock_connectivity():
        print("\n=== AWS Bedrock Invocation Test ===")
        test_bedrock_invoke()
    print("\nTest completed.")
