from typing import List
import ollama
import logging
import json
from pydantic import BaseModel
from pathlib import Path

# Configure logging
logger = logging.getLogger(__name__)

class VocabularyItem(BaseModel):
    spanish: str
    english: str

class VocabularyResponse(BaseModel):
    vocabulary: List[VocabularyItem]

async def extract_vocabulary(text: str) -> List[dict]:
    logger.info("Starting vocabulary extraction")
    logger.debug(f"Input text length: {len(text)} characters")

    try:
        # Initialize Ollama client
        logger.debug("Initializing Ollama client")
        client = ollama.Client()

        # Load the prompt
        prompt_path = Path(__file__).parent.parent / "prompts" / "Extract-Vocabulary.md"
        logger.debug(f"Loading prompt from {prompt_path}")
        with open(prompt_path, 'r', encoding='utf-8') as f:
            prompt_template = f.read()

        # Force model to return JSON
        json_prompt = f"""{prompt_template}

Please extract vocabulary as JSON in the following format:
{{
    "vocabulary": [
        {{"spanish": "word1", "english": "word2"}},
        {{"spanish": "word3", "english": "word4"}}
    ]
}}

Text to analyze:
{text}
"""
        logger.debug(f"Constructed prompt of length {len(json_prompt)}")

        all_vocabulary = set()
        max_attempts = 3

        for attempt in range(max_attempts):
            logger.info(f"Making LLM call attempt {attempt + 1}/{max_attempts}")
            try:
                response = client.chat(
                    model="mistral:latest",
                    messages=[{"role": "user", "content": json_prompt}]
                )

                # Log full response before attempting JSON parsing
                logger.debug(f"Raw response from LLM: {response}")

                # Extract response content
                content = response.get("message", {}).get("content", "").strip()
                if not content:
                    raise ValueError("Empty response from LLM")

                # Try parsing JSON
                try:
                    response_data = json.loads(content)
                except json.JSONDecodeError:
                    logger.error(f"Invalid JSON received: {content}")
                    raise ValueError("LLM response is not valid JSON")

                if "vocabulary" not in response_data:
                    raise ValueError("Response does not contain 'vocabulary' field")

                vocabulary_items = [VocabularyItem(**item) for item in response_data["vocabulary"]]

                for item in vocabulary_items:
                    item_tuple = (item.spanish, item.english)
                    all_vocabulary.add(item_tuple)

                logger.info(f"Attempt {attempt + 1} added {len(vocabulary_items)} items")

            except Exception as e:
                logger.error(f"Error in attempt {attempt + 1}: {str(e)}")
                if attempt == max_attempts - 1:
                    raise  

        result = [{"spanish": item[0], "english": item[1]} for item in all_vocabulary]
        logger.info(f"Extracted {len(result)} unique vocabulary items")
        return result

    except Exception as e:
        logger.error(f"Failed to extract vocabulary: {str(e)}", exc_info=True)
        raise
