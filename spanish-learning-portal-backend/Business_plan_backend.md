# Backend

## Business Goal

A language learning school wants to build a prototype of learning portal which will act as three things:
Inventory of possible vocabulary that can be learned
Act as a  Learning record store (LRS), providing correct and wrong score on practice vocabulary
A unified launchpad to launch different learning apps

You have been tasked with creating the backend API of the application.

## Technical Restrictions

- Use SQLite3 as the database
- You can use any language or framework
- Does not require authentication/authorization, assume there is a single user
- The API will always return JSON

### Leverage AI-coding assistants to write your backend code

- Cursor
- Windsurf Codeium
- Github Copilot
- Amazon Q Developer
- Google Code Assist

## Technical Specification

## API Endpoints

### GET /api/dashboard/last_study_session
Returns information about the most recent study session.

#### JSON Response
```json
{
  "id": 123,
  "group_id": 456,
  "created_at": "2025-02-08T17:20:23-05:00",
  "study_activity_id": 789,
  "group_id": 456,
  "group_name": "Basic Greetings"
}
```

### GET /api/dashboard/study_progress
Returns study progress statistics.
Please note that the frontend will determine progress bar based on total words studied and total available words.

#### JSON Response

```json
{
  "total_words_studied": 3,
  "total_available_words": 124,
}
```

### GET /api/dashboard/quick-stats

Returns quick overview statistics.

#### JSON Response
```json
{
  "success_rate": 80.0,
  "total_study_sessions": 4,
  "total_active_groups": 3,
  "study_streak_days": 4
}
```

### GET /api/study_activities/:id

#### JSON Response
```json
{
  "id": 1,
  "name": "Vocabulary Quiz",
  "thumbnail_url": "https://example.com/thumbnail.jpg",
  "description": "Practice your vocabulary with flashcards"
}
```

### GET /api/study_activities/:id/study_sessions

- pagination with 100 items per page

```json
{
  "items": [
    {
      "id": 123,
      "activity_name": "Vocabulary Quiz",
      "group_name": "Basic Greetings",
      "start_time": "2025-02-08T17:20:23-05:00",
      "end_time": "2025-02-08T17:30:23-05:00",
      "review_items_count": 20
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 100,
    "items_per_page": 20
  }
}
```

### POST /api/study_activities

#### Request Params
- group_id integer
- study_activity_id integer

#### JSON Response
{
  "id": 124,
  "group_id": 123
}

### GET /api/words

- pagination with 100 items per page

#### JSON Response
```json
{
  "items": [
    {
      "Spanish": "Hola",
      "english": "hello",
      "correct_count": 5,
      "wrong_count": 2
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 500,
    "items_per_page": 100
  }
}
```

### GET /api/words/:id
#### JSON Response
```json
{
  "Spanish": "Hola",
  "english": "hello",
  "stats": {
    "correct_count": 5,
    "wrong_count": 2
  },
  "groups": [
    {
      "id": 1,
      "name": "Basic Greetings"
    }
  ]
}
```

### GET /api/groups
- pagination with 100 items per page
#### JSON Response
```json
{
  "items": [
    {
      "id": 1,
      "name": "Basic Greetings",
      "word_count": 20
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 10,
    "items_per_page": 100
  }
}
```

### GET /api/groups/:id
#### JSON Response
```json
{
  "id": 1,
  "name": "Basic Greetings",
  "stats": {
    "total_word_count": 20
  }
}
```

### GET /api/groups/:id/words
#### JSON Response
```json
{
  "items": [
    {
      "Spanish": "Hola",
      "english": "hello",
      "correct_count": 5,
      "wrong_count": 2
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 20,
    "items_per_page": 100
  }
}
```

### GET /api/groups/:id/study_sessions
#### JSON Response
```json
{
  "items": [
    {
      "id": 123,
      "activity_name": "Vocabulary Quiz",
      "group_name": "Basic Greetings",
      "start_time": "2025-02-08T17:20:23-05:00",
      "end_time": "2025-02-08T17:30:23-05:00",
      "review_items_count": 20
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 5,
    "items_per_page": 100
  }
}
```

### GET /api/study_sessions
- pagination with 100 items per page
#### JSON Response
```json
{
  "items": [
    {
      "id": 123,
      "activity_name": "Vocabulary Quiz",
      "group_name": "Basic Greetings",
      "start_time": "2025-02-08T17:20:23-05:00",
      "end_time": "2025-02-08T17:30:23-05:00",
      "review_items_count": 20
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 100,
    "items_per_page": 100
  }
}
```

### GET /api/study_sessions/:id
#### JSON Response
```json
{
  "id": 123,
  "activity_name": "Vocabulary Quiz",
  "group_name": "Basic Greetings",
  "start_time": "2025-02-08T17:20:23-05:00",
  "end_time": "2025-02-08T17:30:23-05:00",
  "review_items_count": 20
}
```

### GET /api/study_sessions/:id/words
- pagination with 100 items per page
#### JSON Response
```json
{
  "items": [
    {
      "Spanish": "Hola",
      "english": "hello",
      "correct_count": 5,
      "wrong_count": 2
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 20,
    "items_per_page": 100
  }
}
```

### POST /api/reset_history
#### JSON Response
```json
{
  "success": true,
  "message": "Study history has been reset"
}
```

### POST /api/full_reset
#### JSON Response
```json
{
  "success": true,
  "message": "System has been fully reset"
}
```

### POST /api/study_sessions/:id/words/:word_id/review
#### Request Params
- id (study_session_id) integer
- word_id integer
- correct boolean

#### Request Payload
```json
{
  "correct": true
}
```

#### JSON Response
```json
{
  "success": true,
  "word_id": 1,
  "study_session_id": 123,
  "correct": true,
  "created_at": "2025-02-08T17:33:07-05:00"
}
```

## Database Schema

### Diagram

### words — Stores individual Spanish vocabulary words

- `id` (Primary Key): Unique identifier for each word
- `Spanish` (String, Required): The word written in Spanish
- `english` (String, Required): English translation of the word
- `parts` (JSON, Required): Word components stored in JSON format

### groups — Manages collections of words

- `id` (Primary Key): Unique identifier for each group
- `name` (String, Required): Name of the group
- `words_count` (Integer, Default: 0): Counter cache for the number of words in the group

### word_groups — join-table enabling many-to-many relationship between words and groups

- `word_id` (Foreign Key): References words.id
- `group_id` (Foreign Key): References groups.id

### study_activities — Defines different types of study activities available

- `id` (Primary Key): Unique identifier for each activity
- `name` (String, Required): Name of the activity (e.g., "Flashcards", "Quiz")
- `url` (String, Required): The full URL of the study activity

### study_sessions — Records individual study sessions

- `id` (Primary Key): Unique identifier for each session
- `group_id` (Foreign Key): References groups.id
- `study_activity_id` (Foreign Key): References study_activities.id
- `created_at` (Timestamp, Default: Current Time): When the session was created

### word_review_items — Tracks individual word reviews within study sessions

- `id` (Primary Key): Unique identifier for each review
- `word_id` (Foreign Key): References words.id
- `study_session_id` (Foreign Key): References study_sessions.id
- `correct` (Boolean, Required): Whether the answer was correct
- `created_at` (Timestamp, Default: Current Time): When the review occurred

## Relationships

- word belongs to groups through  word_groups
- group belongs to words through word_groups
- session belongs to a group
- session belongs to a study_activity
- session has many word_review_items
- word_review_item belongs to a study_session
- word_review_item belongs to a word

## Design Notes

- All tables use auto-incrementing primary keys
- Timestamps are automatically set on creation where applicable
- Foreign key constraints maintain referential integrity
- JSON storage for word parts allows flexible component storage
- Counter cache on groups.words_count optimizes word counting queries


