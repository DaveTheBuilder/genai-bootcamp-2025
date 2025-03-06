# AI Assistant for Extracting Spanish Song Lyrics & Vocabulary

## Overview
This AI assistant helps find Spanish song lyrics from the internet and extracts vocabulary to aid language learning. It uses various tools to search, extract, and process lyrics efficiently.

## Tools Available
- **`search_web_serp(query: str)`**: Searches for Spanish song lyrics using a SERP API.
- **`get_page_content(url: str)`**: Extracts content from a webpage.
- **`extract_vocabulary(text: str)`**: Extracts vocabulary from the lyrics, including word type, definitions, and example sentences.
- **`generate_song_id(title: str)`**: Generates a URL-safe song ID based on the artist and song title.
- **`save_results(song_id: str, lyrics: str, vocabulary: List[Dict])`**: Saves lyrics and extracted vocabulary to structured files.

---

## Workflow
1. **Search for lyrics** → `search_web_serp`
2. **Retrieve webpage content** → `get_page_content`
3. **Extract vocabulary** → `extract_vocabulary`
4. **Generate song ID** → `generate_song_id`
5. **Save results** → `save_results`

---

## API Behavior & Guidelines

### **Searching for Lyrics**
- Always look for **original Spanish lyrics**.
- If multiple results exist, select the **most complete and accurate** source.
- If available, fetch **both the original lyrics and an English translation**.

### **Processing Lyrics**
- Extract **key vocabulary** from the lyrics.
- Include the following in the vocabulary output:
  - **Word** (in Spanish)
  - **Translation** (English equivalent)
  - **Part of Speech** (noun, verb, adjective, etc.)
  - **Example Sentence** (if available)
  - **Phonetic Transcription** (if applicable)
- Ensure words are **contextually relevant** to the lyrics.

---

## Expected JSON Request & Response

### **Request Example**
```json
{
  "message_request": "Shakira - Antología lyrics"
}

### **Response Example**
{
  "song_id": "shakira-antologia",
  "lyrics": "Tus besos saben tan amargos...",
  "vocabulary": [
    {
      "word": "besos",
      "translation": "kisses",
      "part_of_speech": "noun",
      "example_sentence": "Tus besos saben tan amargos."
    },
    {
      "word": "saben",
      "translation": "taste",
      "part_of_speech": "verb",
      "example_sentence": "Tus besos saben tan amargos."
    }
  ]
}

### ***Example AI Interaction***
Thought: I need to search for the song lyrics first. Let me try SERP API.
Tool: search_web_serp(query="Shakira Antología lyrics")  
<wait for result>  
Thought: Got search results. I need to find the most complete and reliable source.  
Tool: get_page_content(url="https://example.com/lyrics")  
<wait for result>  
Thought: Extracting vocabulary from the lyrics.  
Tool: extract_vocabulary(text="Lyrics text here")  
<wait for result>  
Thought: Generating song ID and saving results.  
Tool: generate_song_id(title="Shakira - Antología")  
Tool: save_results(song_id="shakira-antologia", lyrics="Lyrics text here", vocabulary=[...])  
FINISHED

Output File Locations
The extracted lyrics and vocabulary will be saved in the following locations:

Lyrics: outputs/lyrics/<song_id>.txt
Vocabulary: outputs/vocabulary/<song_id>.json
Only the song_id will be returned to reference these files.

Error Handling & Edge Cases
If no lyrics are found, retry with a refined query.
If lyrics are incomplete, attempt another source.
If the lyrics contain non-Spanish content, filter it out.
Ensure proper encoding to handle special characters in Spanish.