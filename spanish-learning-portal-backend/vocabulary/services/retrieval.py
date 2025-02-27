import chromadb

client = chromadb.PersistentClient(path="data/conversation_db")
collection = client.get_or_create_collection("conversations")

# Assuming you're using Chroma's client to query for similar conversations
def retrieve_similar_conversations(embedding: str):
    client = chromadb.Client()
    collection = client.get_or_create_collection("conversations")

    # Assuming 'embedding' is a vector representation of the conversation
    results = collection.query(query_embeddings=[embedding], n_results=5)
    return results['documents']

