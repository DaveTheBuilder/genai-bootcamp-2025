import axios from 'axios';
import { Market, UserMarketStream, StreamingError } from '@/types/marketTypes';

export class MarketStreamingService {
    private readonly API_URL = `${process.env.REACT_APP_API_URL}/api/market-data/user-market-stream/`;

    async getStreamingMarkets(): Promise<UserMarketStream[]> {
        try {
            const response = await axios.get(`${this.API_URL}get-streaming-markets/`);
            return response.data;
        } catch (error: any) {
            const streamingError: StreamingError = {
                message: `Error fetching streaming markets: ${error.message}`,
                type: 'CONNECTION_ERROR'
            };
            throw streamingError;
        }
    }

    async toggleStreaming(marketId: number): Promise<UserMarketStream> {
        try {
            const response = await axios.post(`${this.API_URL}toggle-streaming/`, {
                market_id: marketId
            });
            return response.data;
        } catch (error: any) {
            const streamingError: StreamingError = {
                message: `Error toggling streaming: ${error.message}`,
                type: 'CONNECTION_ERROR'
            };
            throw streamingError;
        }
    }

    async getMarketById(marketId: number): Promise<Market> {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/market-data/markets/${marketId}/`);
            return response.data;
        } catch (error: any) {
            const streamingError: StreamingError = {
                message: `Error fetching market details: ${error.message}`,
                type: 'CONNECTION_ERROR'
            };
            throw streamingError;
        }
    }

    async searchMarkets(query: string): Promise<Market[]> {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/market-data/markets/search/`, {
                params: { q: query }
            });
            return response.data;
        } catch (error: any) {
            const streamingError: StreamingError = {
                message: `Error searching markets: ${error.message}`,
                type: 'CONNECTION_ERROR'
            };
            throw streamingError;
        }
    }
}

export const marketStreamingService = new MarketStreamingService();
