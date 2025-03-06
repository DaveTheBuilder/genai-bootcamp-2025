from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from tools.extract_vocabulary import extract_vocabulary
from tools.get_page_content import get_page_content
from tools.search_web import search_web_serp

app = FastAPI()

class MessageRequest(BaseModel):
    message_request: str

@app.post('/api/agent')
async def get_lyrics(request: MessageRequest):
    try:
        # Use search_web to find lyrics
        lyrics = await search_web_serp(request.message_request)
        # Extract vocabulary from the lyrics
        vocabulary = await extract_vocabulary(lyrics)
        return {'lyrics': lyrics, 'vocabulary': vocabulary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
