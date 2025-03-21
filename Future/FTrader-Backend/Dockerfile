FROM python:3.11-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        postgresql-client \
        netcat-traditional \
        python3-dev \
        build-essential \
        libatlas-base-dev \
        gfortran \
        pkg-config \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip \
    && pip install --no-cache-dir numpy pandas scikit-learn matplotlib tensorflow joblib \
    && pip install --no-cache-dir -r requirements.txt

# Install InfluxDB client
RUN pip install influxdb-client==1.36.0

# Copy entrypoint script first and fix permissions
COPY ./entrypoint.sh /app/
RUN sed -i 's/\r$//g' /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

# Copy project
COPY . /app/

# Create directories for static and media files with proper permissions
RUN mkdir -p /app/staticfiles /app/media \
    && chmod -R 755 /app/staticfiles /app/media

# Create a non-root user and set permissions
RUN useradd -m appuser \
    && chown -R appuser:appuser /app
USER appuser

ENTRYPOINT ["/app/entrypoint.sh"]
