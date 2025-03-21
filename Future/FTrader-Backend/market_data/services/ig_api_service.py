from typing import Dict, List, Optional
import requests
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class IGAPIService:
    def __init__(self, user):
        self.user = user
        self.api_url = settings.IG_API_URL
        self.streaming_url = settings.IG_STREAMING_URL
        self.headers = self._get_headers()

    def _get_headers(self) -> Dict[str, str]:
        return {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
            'X-IG-API-KEY': self.user.ig_api_key,
            'CST': self.user.ig_cst,
            'X-SECURITY-TOKEN': self.user.ig_security_token,
            'Version': '1'
        }

    def search_markets(self, search_term: str, market_type: Optional[str] = None) -> List[Dict]:
        """
        Search for markets using IG API
        """
        try:
            params = {
                'searchTerm': search_term,
                'max': 100
            }
            
            if market_type:
                params['marketType'] = market_type
                
            response = requests.get(
                f"{self.api_url}/gateway/deal/markets", 
                headers=self.headers,
                params=params
            )
            
            response.raise_for_status()
            return response.json()['markets']
            
        except Exception as e:
            logger.error(f"Error searching markets: {str(e)}")
            return []

    def get_market_details(self, epic: str) -> Optional[Dict]:
        """
        Get detailed market information
        """
        try:
            response = requests.get(
                f"{self.api_url}/gateway/deal/markets/{epic}",
                headers=self.headers
            )
            
            response.raise_for_status()
            return response.json()
            
        except Exception as e:
            logger.error(f"Error getting market details for {epic}: {str(e)}")
            return None

    def get_price_history(self, epic: str, resolution: str, from_date: str, to_date: str = None) -> Optional[Dict]:
        """
        Get historical price data
        """
        try:
            params = {
                'resolution': resolution,
                'from': from_date
            }
            
            if to_date:
                params['to'] = to_date
                
            response = requests.get(
                f"{self.api_url}/gateway/deal/prices/{epic}",
                headers=self.headers,
                params=params
            )
            
            response.raise_for_status()
            return response.json()
            
        except Exception as e:
            logger.error(f"Error getting price history for {epic}: {str(e)}")
            return None
