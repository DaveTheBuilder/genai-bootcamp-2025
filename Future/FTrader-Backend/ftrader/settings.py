"""
Django settings for ftrader project.
"""

import os
from datetime import timedelta
from pathlib import Path
from dotenv import load_dotenv
from celery.schedules import crontab

# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-key-for-dev-only')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    
    # Third-party apps
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'corsheaders',
    'django_filters',
    'channels',
    
    # Local apps
    'users',
    'authentication',
    'market_data',
    'trading',
    'portfolio',
    'notifications',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',  # Required by django-allauth
]

ROOT_URLCONF = 'ftrader.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'ftrader.wsgi.application'
ASGI_APPLICATION = 'ftrader.asgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'ftrader'),
        'USER': os.environ.get('DB_USER', 'ftrader_user'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'ftrader_password'),
        'HOST': os.environ.get('DB_HOST', 'db'),
        'PORT': os.environ.get('DB_PORT', '5432'),
        'OPTIONS': {
            'sslmode': 'disable',
            'connect_timeout': 10,
            'options': '-c statement_timeout=30000'  # 30 seconds
        }
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files
MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom user model
AUTH_USER_MODEL = 'users.User'

# Django Rest Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
}

# Simple JWT settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=int(os.environ.get('JWT_ACCESS_TOKEN_LIFETIME', 15))),
    'REFRESH_TOKEN_LIFETIME': timedelta(minutes=int(os.environ.get('JWT_REFRESH_TOKEN_LIFETIME', 1440))),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

# Django AllAuth settings
SITE_ID = 1
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_UNIQUE_EMAIL = True

# CORS settings
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:8080,http://127.0.0.1:8080,http://localhost:5173,http://127.0.0.1:5173').split(',')
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True  # For development only, remove in production
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Celery settings
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'amqp://admin:admin123@localhost:5672//')
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://admin:admin123@localhost:6379/0')
#CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', 'amqp://guest:guest@localhost:5672//')
#CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')

CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE

# Celery Beat schedule
CELERY_BEAT_SCHEDULE = {
    'update_market_data': {
        'task': 'market_data.tasks.update_market_data',
        'schedule': crontab(minute='*/5'),  # Every 5 minutes
        'options': {'expires': 240}
    },
    'update_price_history': {
        'task': 'market_data.tasks.update_price_history',
        'schedule': crontab(minute='15', hour='*/1'),  # Every hour at 15 minutes past
        'options': {'expires': 3600}
    },
    'check_market_alerts': {
        'task': 'market_data.tasks.check_market_alerts',
        'schedule': crontab(minute='*/2'),  # Every 2 minutes
        'options': {'expires': 120}
    },
    'cleanup_old_price_history': {
        'task': 'market_data.tasks.cleanup_old_price_history',
        'schedule': crontab(minute='0', hour='1'),  # Daily at 1 AM
        'options': {'expires': 3600}
    },
    'fetch_live_market_data': {
        'task': 'market_data.tasks.fetch_live_market_data',
        'schedule': crontab(minute='*/1'),  # Every minute
        'options': {'expires': 60}
    },
    'run_live_predictions': {
        'task': 'market_data.tasks.run_live_predictions',
        'schedule': crontab(minute='*/2'),  # Every 2 minutes
        'options': {'expires': 120}
    },
    'periodic_model_retraining': {
        'task': 'market_data.tasks.periodic_model_retraining',
        'schedule': crontab(minute='0', hour='*/6'),  # Every 6 hours
        'options': {'expires': 21600}
    },
    'update_portfolio_values': {
        'task': 'portfolio.tasks.update_portfolio_values',
        'schedule': crontab(minute='*/10'),  # Every 10 minutes
        'options': {'expires': 600}
    },
    'sync_positions_to_portfolios': {
        'task': 'portfolio.tasks.sync_positions_to_portfolios',
        'schedule': crontab(minute='*/15'),  # Every 15 minutes
        'options': {'expires': 900}
    },
    'calculate_portfolio_analytics': {
        'task': 'portfolio.tasks.calculate_portfolio_analytics',
        'schedule': crontab(minute='30', hour='*/3'),  # Every 3 hours at 30 minutes past
        'options': {'expires': 10800}
    },
    'generate_portfolio_reports': {
        'task': 'portfolio.tasks.generate_portfolio_reports',
        'schedule': crontab(minute='0', hour='8', day_of_week='1'),  # Weekly on Monday at 8 AM
        'options': {'expires': 86400}
    },
    'cleanup_portfolio_performance_history': {
        'task': 'portfolio.tasks.cleanup_portfolio_performance_history',
        'schedule': crontab(minute='0', hour='2'),  # Daily at 2 AM
        'options': {'expires': 3600}
    },
    'process_pending_orders': {
        'task': 'trading.tasks.process_pending_orders',
        'schedule': crontab(minute='*/1'),  # Every minute
        'options': {'expires': 60}
    },
    'check_stop_and_limit_levels': {
        'task': 'trading.tasks.check_stop_and_limit_levels',
        'schedule': crontab(minute='*/1'),  # Every minute
        'options': {'expires': 60}
    },
    'update_position_values': {
        'task': 'trading.tasks.update_position_values',
        'schedule': crontab(minute='*/5'),  # Every 5 minutes
        'options': {'expires': 300}
    },
    'expire_pending_orders': {
        'task': 'trading.tasks.expire_pending_orders',
        'schedule': crontab(minute='0', hour='*/1'),  # Every hour
        'options': {'expires': 3600}
    },
    'generate_trading_reports': {
        'task': 'trading.tasks.generate_trading_reports',
        'schedule': crontab(minute='0', hour='9', day_of_month='1'),  # Monthly on the 1st at 9 AM
        'options': {'expires': 86400}
    },
    'cleanup_inactive_users': {
        'task': 'users.tasks.cleanup_inactive_users',
        'schedule': crontab(minute='0', hour='3'),  # Daily at 3 AM
        'options': {'expires': 3600}
    },
    'send_inactivity_reminders': {
        'task': 'users.tasks.send_inactivity_reminders',
        'schedule': crontab(minute='0', hour='10', day_of_week='1'),  # Weekly on Monday at 10 AM
        'options': {'expires': 86400}
    },
    'update_user_statistics': {
        'task': 'users.tasks.update_user_statistics',
        'schedule': crontab(minute='0', hour='*/6'),  # Every 6 hours
        'options': {'expires': 21600}
    },
    'generate_user_activity_reports': {
        'task': 'users.tasks.generate_user_activity_reports',
        'schedule': crontab(minute='0', hour='7', day_of_week='1'),  # Weekly on Monday at 7 AM
        'options': {'expires': 86400}
    },
}

# Channels settings
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [(os.environ.get('REDIS_HOST', 'localhost'), int(os.environ.get('REDIS_PORT', 6379)))],
        },
    },
}

# IG API settings
IG_API_KEY = os.environ.get('IG_API_KEY', '')
IG_IDENTIFIER = os.environ.get('IG_IDENTIFIER', '')
IG_PASSWORD = os.environ.get('IG_PASSWORD', '')
IG_DEMO = os.environ.get('IG_DEMO', 'True') == 'True'
IG_API_URL = 'https://demo-api.ig.com/gateway/deal' if IG_DEMO else 'https://api.ig.com/gateway/deal'
IG_STREAMING_URL = 'wss://demo-apd.marketdatasystems.com' if IG_DEMO else 'wss://apd.marketdatasystems.com'

# InfluxDB Configuration
INFLUXDB_URL = os.environ.get('INFLUXDB_URL', 'http://localhost:8086')
INFLUXDB_TOKEN = os.environ.get('INFLUXDB_TOKEN', 'your_admin_token_here')
INFLUXDB_ORG = os.environ.get('INFLUXDB_ORG', 'trading')
INFLUXDB_BUCKET = os.environ.get('INFLUXDB_BUCKET', 'market_data')
