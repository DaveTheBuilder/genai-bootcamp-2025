# Tech Specs

## Business Goal
We want to create a program that will find lyrics off the internet for a target song in a specific language and produce vocabulary to be imported into our database.

## Technical Requirements

- FastAPI
- Ollama via the Ollama Python SDK
    - Llama 3.2:3B
- Instructor (for structured JSON output)
- SQLite3 (for database)
- duckduckgo-search (to search for lyrics)

## API Endpoints

### GetLyrics POST /api/agent

### Behaviour

This endpoint goes to our agent, which uses the ReAct framework so that it can go to the internet, find multiple possible versions of lyrics, extract the correct lyrics, and format them into vocabulary.

#### Tools Available:
- `tools/extract_vocabulary.py`
- `tools/get_page_content.py`
- `tools/search_web.py`

### JSON Request Parameters
- `message_request` (str): A string that describes the song and/or artist to get lyrics for a song from the internet.

### JSON Response
- `lyrics` (str): The lyrics of the song.
- `vocabulary` (list): A list of vocabulary words found in the lyrics.

