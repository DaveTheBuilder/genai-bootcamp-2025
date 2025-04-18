# GenAI Bootcamp 2025 - Projects

This repository contains multiple projects developed during the GenAI Bootcamp 2025. Each project demonstrates different aspects of AI and language learning applications.

## Projects Overview

### 1. Spanish Learning Portal

A comprehensive web application for learning Spanish, featuring interactive exercises, vocabulary management, and AI-powered conversation practice.

#### Spanish Learning Portal - Frontend

The frontend application built with React, TypeScript, and Vite.

##### Docker Setup

**Prerequisites:**
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

**Running the Frontend:**

1. Navigate to the frontend directory:
```bash
cd spanish-learning-portal-frontend
```

2. Build and start the frontend container:
```bash
docker-compose up -d
```

3. The frontend will be available at: http://localhost:5173/

**Development Workflow:**
- View logs: `docker-compose logs -f`
- Stop the container: `docker-compose down`
- Rebuild after changes: `docker-compose up -d --build`

**Manual Setup (without Docker):**
```bash
cd spanish-learning-portal-frontend
npm install
npm run dev
```

#### Spanish Learning Portal - Backend

The backend application built with Django, AWS Bedrock, and ChromaDB for vector search.

##### Docker Setup

**Prerequisites:**
- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- AWS account with Bedrock access (optional, falls back to mock data)

**Environment Setup:**
Create a `.env.local` file in the backend directory with:
```
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
```

**Running the Backend:**
1. Navigate to the backend directory:
```bash
cd spanish-learning-portal-backend
```

2. Build and start the backend container:
```bash
docker-compose up -d
```

3. The backend API will be available at: http://localhost:8000/api/

**Development Workflow:**
- View logs: `docker-compose logs -f`
- Stop the container: `docker-compose down`
- Rebuild after changes: `docker-compose up -d --build`

**Manual Setup (without Docker):**
```bash
cd spanish-learning-portal-backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Song-Vocab

A tool for extracting vocabulary from Spanish songs and creating learning materials.

#### Setup and Installation

**Prerequisites:**
- Python 3.9+
- [Ollama](https://ollama.ai/) (for local LLM support)

**Installation:**
1. Navigate to the Song-vocab directory:
```bash
cd Song-vocab
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env.local` file with:
```
SERPER_API_KEY=your_serper_api_key  # For web search
```

**Running the Application:**
```bash
python agent.py
```

## Screenshots

The `Image_evidence` directory contains screenshots of the Spanish Learning Portal in action:

- Spanish Hangman Game
- Spanish Listening Practice
- Spanish Writing Practice
- Translation Game
- Missing Letter Exercise

## Features

### Spanish Learning Portal
- Interactive vocabulary learning
- Conversation practice with AI
- Writing exercises
- Listening comprehension
- Translation games
- Progress tracking

### Song-Vocab
- Extract vocabulary from Spanish songs
- Generate learning materials
- Web search integration
- Local LLM support via Ollama

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Django, Django REST Framework, AWS Bedrock, ChromaDB
- **Containerization**: Docker, Docker Compose
- **AI/ML**: AWS Bedrock, Ollama, Vector Embeddings
- **Tools**: Python, FastAPI, BeautifulSoup
