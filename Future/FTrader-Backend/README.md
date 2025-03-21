# FTrader Backend

A comprehensive trading platform backend built with Django, Django Rest Framework, PostgreSQL, RabbitMQ, and Celery.

## Overview

FTrader is a full-featured trading platform that integrates with the IG Labs API for market data and trading operations. The backend provides a robust API for user management, market data streaming, trading operations, portfolio management, and real-time notifications.

## Features

- **User Management**: Custom user model with extended profile information
- **Authentication**: JWT-based authentication with token refresh
- **Market Data**: Real-time market data streaming via WebSockets
- **Trading**: Position and order management with IG Labs API integration
- **Portfolio**: Portfolio management with performance tracking
- **Notifications**: Real-time notifications via WebSockets
- **Background Tasks**: Celery integration for asynchronous task processing

## Tech Stack

- **Framework**: Django 4.2+
- **API**: Django Rest Framework
- **Database**: PostgreSQL
- **Message Broker**: RabbitMQ
- **Task Queue**: Celery
- **WebSockets**: Django Channels with Redis
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Django Rest Framework docs

## Project Structure

```
FTrader-Backend/
├── ftrader/                  # Main project directory
│   ├── asgi.py               # ASGI configuration
│   ├── celery.py             # Celery configuration
│   ├── routing.py            # WebSocket routing
│   ├── settings.py           # Project settings
│   ├── urls.py               # URL configuration
│   └── wsgi.py               # WSGI configuration
├── users/                    # User management app
├── authentication/           # Authentication app
├── market_data/              # Market data app
├── trading/                  # Trading app
├── portfolio/                # Portfolio management app
├── notifications/            # Notifications app
├── manage.py                 # Django management script
└── requirements.txt          # Python dependencies
```

## Apps and Components

### Users App

Handles user management with a custom user model and extended profile information.

### Authentication App

Manages user authentication, registration, and IG API authentication.

### Market Data App

Provides market data, watchlists, and price history with real-time updates via WebSockets.

### Trading App

Manages trading operations including positions, orders, and transaction history.

### Portfolio App

Tracks user portfolios, portfolio items, transactions, and performance.

### Notifications App

Delivers real-time notifications to users via WebSockets.

## WebSocket Endpoints

- `/ws/market-data/`: Market data streaming
- `/ws/trading/`: Trading updates
- `/ws/notifications/`: Real-time notifications

## API Endpoints

- `/api/auth/`: Authentication endpoints
- `/api/users/`: User management endpoints
- `/api/market-data/`: Market data endpoints
- `/api/trading/`: Trading endpoints
- `/api/portfolio/`: Portfolio management endpoints
- `/api/notifications/`: Notification endpoints
- `/api/token/refresh/`: JWT token refresh
- `/api/docs/`: API documentation

## Error Handling

The application implements robust error handling for API and WebSocket connections with:

- Comprehensive error logging
- User-friendly error messages
- Retry mechanisms for failed connections
- Offline mode support for debugging and testing
- Real-time error notifications

## Setup and Installation

### Prerequisites

- Python 3.9+
- PostgreSQL
- RabbitMQ
- Redis

### Environment Variables

Create a `.env` file in the project root with the following variables:

```
# Django settings
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database settings
DB_NAME=ftrader
DB_USER=ftrader_user
DB_PASSWORD=ftrader_password
DB_HOST=localhost
DB_PORT=5432

# JWT settings
JWT_ACCESS_TOKEN_LIFETIME=15
JWT_REFRESH_TOKEN_LIFETIME=1440

# CORS settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Celery settings
CELERY_BROKER_URL=amqp://guest:guest@localhost:5672//
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Redis settings
REDIS_HOST=localhost
REDIS_PORT=6379

# IG API settings
IG_API_KEY=your_ig_api_key
IG_IDENTIFIER=your_ig_identifier
IG_PASSWORD=your_ig_password
IG_DEMO=True
```

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/FTrader-Backend.git
   cd FTrader-Backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py create_superuser_if_not_exists
   ```

6. Start the development server:
   ```
   python manage.py runserver
   ```

7. Start Celery worker:
   ```
   celery -A ftrader worker -l info
   ```

8. Start Celery beat (for scheduled tasks):
   ```
   celery -A ftrader beat -l info
   ```

## Development

### Running Tests

```
python manage.py test
```

### Code Style

This project follows PEP 8 style guidelines. You can check your code style with:

```
flake8
```

## Deployment

For production deployment, consider the following:

1. Set `DEBUG=False` in the `.env` file
2. Use a production-ready web server like Gunicorn
3. Set up a reverse proxy with Nginx
4. Configure SSL certificates for HTTPS
5. Use a production database setup with proper backups
6. Set up monitoring and logging

## License

This project is licensed under the MIT License - see the LICENSE file for details.
