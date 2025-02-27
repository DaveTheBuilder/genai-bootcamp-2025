import boto3

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")

def get_embedding(text):
    response = bedrock.invoke_model(
        modelId="amazon.titan-embed-text-v1",
        contentType="application/json",
        accept="application/json",
        body='{"inputText": "' + text + '"}'
    )
    return response['body'].read()
