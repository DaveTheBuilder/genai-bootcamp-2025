#!/bin/bash

# Wait for PostgreSQL to be ready
if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for PostgreSQL..."

    # Use pg_isready to check PostgreSQL status
    while ! pg_isready -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME"; do
        echo "PostgreSQL is not ready yet. Retrying..."
        sleep 1
    done

    echo "PostgreSQL is ready"
fi


# Apply database migrations
python manage.py migrate

# Create superuser if not exists
python manage.py create_superuser_if_not_exists

# Ensure static directories exist and have proper permissions
mkdir -p /app/staticfiles
chmod -R 755 /app/staticfiles

# Collect static files with error handling
echo "Collecting static files..."
python manage.py collectstatic --no-input --clear || {
    echo "Error during collectstatic. Retrying with more verbose output..."
    python manage.py collectstatic --no-input --clear -v 2
}

exec "$@"
