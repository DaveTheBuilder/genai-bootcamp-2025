from youtube_transcript_api import YouTubeTranscriptApi
from typing import List, Dict
import re
import chromadb
from .vector import BedrockEmbeddingFunction
import os
import logging

logger = logging.getLogger(__name__)

class YouTubeService:
    def __init__(self):
        # Ensure data directory exists
        os.makedirs("data/youtube_transcripts", exist_ok=True)
        
        logger.info("Initializing YouTubeService")
        try:
            # Use Bedrock's Titan embedding model
            logger.info("Initializing embedding function")
            self.embedding_fn = BedrockEmbeddingFunction()
            
            # Initialize ChromaDB client
            logger.info("Initializing ChromaDB client")
            self.client = chromadb.PersistentClient(path="data/youtube_transcripts")
            
            # Create or get collection for transcripts
            logger.info("Getting or creating ChromaDB collection")
            self.collection = self.client.get_or_create_collection(
                name="youtube_transcripts",
                embedding_function=self.embedding_fn,
                metadata={"description": "YouTube Spanish video transcripts"}
            )
            logger.info("YouTubeService initialization complete")
            
        except Exception as e:
            logger.error(f"Failed to initialize YouTubeService: {str(e)}")
            raise Exception(f"Failed to initialize YouTubeService: {str(e)}")
        
        # Smaller chunks for better memory usage
        self.chunk_size = 500  # Reduced from 1000
        self.chunk_overlap = 100  # Reduced from 200

    def split_text(self, text: str) -> List[str]:
        """Split text into chunks with overlap and prevent infinite loops."""
        if not text:
            return []
            
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            # Calculate end of chunk
            end = min(start + self.chunk_size, text_length)
            
            # Try to break at a space or punctuation
            if end < text_length:
                # Look for the last space or punctuation within the chunk
                last_break = max(
                    text.rfind(' ', start, end),
                    text.rfind('.', start, end),
                    text.rfind(',', start, end)
                )
                
                # If a good break point is found, use it
                if last_break > start:
                    end = last_break + 1
            
            # Extract chunk
            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            
            # Move start point with overlap
            start = end - self.chunk_overlap
            
            # Prevent potential infinite loop
            if start >= end:
                break
            
            # Ensure we don't go beyond text length
            if start >= text_length:
                break
        
        return chunks

    def extract_video_id(self, url: str) -> str:
        """Extract YouTube video ID from URL."""
        logger.info(f"Extracting video ID from URL: {url}")
        patterns = [
            r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
            r'(?:youtu\.be\/)([0-9A-Za-z_-]{11})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                video_id = match.group(1)
                logger.info(f"Found video ID: {video_id}")
                return video_id
        logger.error(f"Could not extract video ID from URL: {url}")
        raise ValueError("Invalid YouTube URL")

    def get_transcript(self, video_url: str) -> List[Dict]:
        """Get transcript from YouTube video."""
        try:
            logger.info(f"Getting transcript for video: {video_url}")
            video_id = self.extract_video_id(video_url)
            
            # Get available transcripts
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            # First try to get Spanish transcript
            try:
                logger.info("Attempting to get Spanish transcript")
                transcript = transcript_list.find_transcript(['es'])
                logger.info("Successfully retrieved Spanish transcript")
                return transcript.fetch()
            except Exception as e:
                logger.info(f"No Spanish transcript available: {str(e)}")
                
                # If Spanish not available, get English and translate
                logger.info("Attempting to get English transcript and translate")
                transcript = transcript_list.find_transcript(['en'])
                spanish_transcript = transcript.translate('es')
                logger.info("Successfully retrieved and translated transcript")
                return spanish_transcript.fetch()
                
        except Exception as e:
            logger.error(f"Failed to get transcript: {str(e)}")
            raise Exception(f"Failed to get transcript: {str(e)}")

    def format_transcript(self, transcript: List[Dict]) -> str:
        """Format transcript into a single text."""
        logger.info(f"Formatting transcript with {len(transcript)} entries")
        text = " ".join([entry['text'] for entry in transcript])
        logger.info(f"Formatted transcript length: {len(text)} characters")
        return text

    def process_video(self, video_url: str) -> None:
        """Process video transcript and store in ChromaDB."""
        try:
            logger.info(f"Starting to process video: {video_url}")
            video_id = self.extract_video_id(video_url)
            
            # Check if video already exists in collection
            logger.info(f"Checking if video {video_id} already exists")
            try:
                existing = self.collection.get(
                    where={"video_id": video_id},
                    limit=1
                )
                if existing and len(existing['ids']) > 0:
                    logger.info(f"Video {video_id} already exists in collection")
                    return
            except Exception as e:
                logger.warning(f"Error checking for existing video: {str(e)}")
            
            logger.info(f"Getting transcript for video ID: {video_id}")
            transcript = self.get_transcript(video_url)
            logger.info(f"Formatting transcript")
            formatted_text = self.format_transcript(transcript)
            
            # Split text into chunks
            logger.info(f"Splitting text into chunks")
            texts = self.split_text(formatted_text)
            chunk_count = len(texts)
            logger.info(f"Split into {chunk_count} chunks")
            
            # Adjust batch size dynamically based on chunk count
            batch_size = min(max(3, chunk_count // 10), 10)
            logger.info(f"Using batch size of {batch_size}")
            
            # Process chunks in batches
            for i in range(0, chunk_count, batch_size):
                batch = texts[i:i + batch_size]
                batch_ids = [f"{video_id}_{j}" for j in range(i, i + len(batch))]
                batch_metadata = [{"video_id": video_id} for _ in batch]
                
                logger.info(f"Processing batch {i//batch_size + 1} of {(chunk_count + batch_size - 1)//batch_size}")
                try:
                    self.collection.add(
                        documents=batch,
                        ids=batch_ids,
                        metadatas=batch_metadata
                    )
                except Exception as e:
                    logger.error(f"Failed to add batch to ChromaDB: {str(e)}")
                    raise Exception(f"Failed to add batch to ChromaDB: {str(e)}")
            
            logger.info(f"Successfully processed all chunks")
            
        except Exception as e:
            logger.error(f"Failed to process video: {str(e)}")
            raise Exception(f"Failed to process video: {str(e)}")

    def search_similar_content(self, query: str, k: int = 5) -> List[str]:
        """Search for similar content in ChromaDB collection."""
        try:
            logger.info(f"Searching for content similar to: {query}")
            results = self.collection.query(
                query_texts=[query],
                n_results=k
            )
            logger.info(f"Found {len(results['documents'][0])} matching documents")
            return results['documents'][0]  # First list since we only have one query
        except Exception as e:
            logger.error(f"Failed to search content: {str(e)}")
            raise Exception(f"Failed to search content: {str(e)}")
