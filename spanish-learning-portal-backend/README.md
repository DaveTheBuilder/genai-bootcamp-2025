# Spanish Learning Portal - Backend

This is the backend service for the Spanish Learning Portal application. It provides APIs for vocabulary management, learning activities, and AWS Polly integration for text-to-speech.

## Docker Setup

The application is containerized using Docker for easy deployment and development.

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Django settings
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# AWS Configuration (for Polly text-to-speech)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=eu-west-1
```

### Running the Application

1. Build and start the containers:

```bash
docker-compose up -d
```

2. The backend API will be available at: http://localhost:8000/
3. ChromaDB (for vector embeddings) will be available at: http://localhost:8001/

### Development Workflow

- View logs:
```bash
docker-compose logs -f
```

- Stop the containers:
```bash
docker-compose down
```

- Rebuild after making changes:
```bash
docker-compose up -d --build
```

### API Endpoints

The API documentation is available at http://localhost:8000/api/ when the server is running.

## Manual Setup (without Docker)

If you prefer to run the application without Docker:

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Start the development server:
```bash
python manage.py runserver
```
