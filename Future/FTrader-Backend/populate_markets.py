#!/usr/bin/env python
import os
import sys
import logging
import json
import pika
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from datetime import datetime

# Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ftrader.settings')

import django
from django.conf import settings
django.setup()

from market_data.models import Market
from market_data.utils import search_markets
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)

# Get the admin user
User = get_user_model()
admin_user = User.objects.filter(is_staff=True).first()

if not admin_user:
    logger.error("No admin user found!")
    sys.exit(1)

# List of market types to search for
MARKET_TYPES = [
    'FOREX',
    'INDICES',
    'SHARES',
    'COMMODITIES',
    'BONDS',
    'ETFS'
]

# RabbitMQ connection settings
RABBITMQ_HOST = os.environ.get('RABBITMQ_HOST', 'localhost')
RABBITMQ_PORT = int(os.environ.get('RABBITMQ_PORT', 5672))
RABBITMQ_USER = os.environ.get('RABBITMQ_USER', 'guest')
RABBITMQ_PASSWORD = os.environ.get('RABBITMQ_PASSWORD', 'guest')
MARKET_DATA_QUEUE = 'market_data_queue'

# InfluxDB client
influx_client = InfluxDBClient(
    url=settings.INFLUXDB_URL,
    token=settings.INFLUXDB_TOKEN,
    org=settings.INFLUXDB_ORG
)
write_api = influx_client.write_api(write_options=SYNCHRONOUS)

# RabbitMQ connection
def get_rabbitmq_connection():
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=RABBITMQ_HOST,
            port=RABBITMQ_PORT,
            credentials=credentials
        )
    )
    return connection

# Send market data to RabbitMQ
def send_to_rabbitmq(market_data):
    try:
        connection = get_rabbitmq_connection()
        channel = connection.channel()
        
        # Declare the queue
        channel.queue_declare(queue=MARKET_DATA_QUEUE, durable=True)
        
        # Send message
        channel.basic_publish(
            exchange='',
            routing_key=MARKET_DATA_QUEUE,
            body=json.dumps(market_data),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Make message persistent
            )
        )
        
        logger.info(f"Sent market data to RabbitMQ: {market_data['epic']}")
        connection.close()
        
    except Exception as e:
        logger.error(f"Error sending to RabbitMQ: {str(e)}")
        raise

# Write market data to InfluxDB
def write_to_influxdb(market_data):
    try:
        point = Point("market_data")\
            .tag("epic", market_data['epic'])\
            .tag("instrument_type", market_data['instrumentType'])\
            .field("bid", float(market_data.get('bidPrice', {}).get('bid', 0)))\
            .field("offer", float(market_data.get('offerPrice', {}).get('bid', 0)))\
            .field("high", float(market_data.get('highPrice', {}).get('bid', 0)))\
            .field("low", float(market_data.get('lowPrice', {}).get('bid', 0)))\
            .field("change_pct", float(market_data.get('changePct', 0)))\
            .field("net_change", float(market_data.get('netChange', 0)))\
            .time(datetime.utcnow())
        
        write_api.write(bucket=settings.INFLUXDB_BUCKET, record=point)
        logger.info(f"Wrote market data to InfluxDB: {market_data['epic']}")
        
    except Exception as e:
        logger.error(f"Error writing to InfluxDB: {str(e)}")
        raise

# Search for markets and save them
def populate_markets():
    logger.info("Starting market data population...")
    
    for market_type in MARKET_TYPES:
        logger.info(f"Searching for {market_type} markets...")
        
        success, markets, error_message = search_markets(
            user=admin_user,
            search_term=market_type,
            market_type=market_type,
            limit=100  # Adjust limit as needed
        )
        
        if not success:
            logger.error(f"Error searching for {market_type} markets: {error_message}")
            continue
        
        for market_data in markets:
            try:
                # Save to database
                market, created = Market.objects.update_or_create(
                    epic=market_data['epic'],
                    defaults={
                        'name': market_data['name'],
                        'instrument_type': market_data['instrumentType'],
                        'expiry': market_data.get('expiry'),
                        'high': market_data.get('highPrice', {}).get('bid'),
                        'low': market_data.get('lowPrice', {}).get('bid'),
                        'percentage_change': market_data.get('changePct'),
                        'net_change': market_data.get('netChange'),
                        'bid': market_data.get('bidPrice', {}).get('bid'),
                        'offer': market_data.get('offerPrice', {}).get('bid'),
                    }
                )
                
                if created:
                    logger.info(f"Created new market: {market.name} ({market.epic})")
                else:
                    logger.info(f"Updated market: {market.name} ({market.epic})")
                    
                # Send to RabbitMQ
                send_to_rabbitmq(market_data)
                
                # Write to InfluxDB
                write_to_influxdb(market_data)
                    
            except Exception as e:
                logger.error(f"Error processing market {market_data['epic']}: {str(e)}")
                continue
    
    logger.info("Market data population completed!")

if __name__ == '__main__':
    try:
        populate_markets()
    except Exception as e:
        logger.error(f"Error in main: {str(e)}")
        sys.exit(1)
