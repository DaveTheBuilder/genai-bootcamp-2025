from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class InfluxService:
    def __init__(self):
        self.client = InfluxDBClient(
            url="http://influxdb:8086",
            token=settings.INFLUXDB_TOKEN,
            org=settings.INFLUXDB_ORG
        )
        self.write_api = self.client.write_api(write_options=SYNCHRONOUS)
        self.bucket = settings.INFLUXDB_BUCKET

    def write_market_data(self, epic, data):
        """
        Write market data to InfluxDB
        
        Args:
            epic (str): The market epic identifier
            data (dict): Market data containing price, volume, timestamp, etc.
        """
        try:
            point = Point("market_data")\
                .tag("epic", epic)\
                .field("bid", data.get('bid', 0))\
                .field("offer", data.get('offer', 0))\
                .field("high", data.get('high', 0))\
                .field("low", data.get('low', 0))\
                .field("volume", data.get('volume', 0))\
                .time(data.get('timestamp'))

            self.write_api.write(bucket=self.bucket, record=point)
            logger.info(f"Successfully wrote market data for {epic}")
            
        except Exception as e:
            logger.error(f"Error writing to InfluxDB: {str(e)}")
            raise

    def query_market_data(self, epic, start_time, end_time=None):
        """
        Query market data from InfluxDB
        
        Args:
            epic (str): The market epic identifier
            start_time (str): Start time for query (RFC3339 format)
            end_time (str, optional): End time for query. Defaults to None.
            
        Returns:
            dict: Query results
        """
        try:
            query = f"from(bucket: \"{self.bucket}\")\n"\
                   f"|> range(start: {start_time})\n"\
                   f"|> filter(fn: (r) => r._measurement == \"market_data\")\n"\
                   f"|> filter(fn: (r) => r.epic == \"{epic}\")"

            if end_time:
                query += f"\n|> range(end: {end_time})"

            result = self.client.query_api().query(query)
            return result
            
        except Exception as e:
            logger.error(f"Error querying InfluxDB: {str(e)}")
            raise

    def close(self):
        """Close the InfluxDB connection"""
        self.client.close()

# Create a singleton instance
influx_service = InfluxService()
