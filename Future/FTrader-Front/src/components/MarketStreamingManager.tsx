'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Market, UserMarketStream } from '@/types/marketTypes';
import { StreamingError } from '@/services/igStreamingService';
import { marketStreamingService } from '../services/marketStreamingService';
import { useStreamErrorHandler } from '../hooks/useStreamErrorHandler';
import StreamErrorBanner from '../components/StreamErrorBanner';

interface MarketStreamingManagerProps {
    initialMarkets?: Market[];
}

export const MarketStreamingManager: React.FC<MarketStreamingManagerProps> = ({ initialMarkets = [] }) => {
    const [streamingMarkets, setStreamingMarkets] = useState<UserMarketStream[]>([]);
    const [allMarkets, setAllMarkets] = useState<Market[]>(initialMarkets);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    
    // Use the stream error handler hook
    const { streamError, isOfflineMode, handleRetry, enableOfflineMode } = useStreamErrorHandler();

    useEffect(() => {
        loadStreamingMarkets();
    }, []);

    const loadStreamingMarkets = async () => {
        try {
            const markets = await marketStreamingService.getStreamingMarkets();
            setStreamingMarkets(markets);
            setIsLoading(false);
        } catch (error: any) {
            const streamingError: StreamingError = {
                code: 'MARKET_FETCH_ERROR',
                message: error.message,
                description: 'Failed to fetch streaming markets',
                timestamp: new Date().toISOString(),
                recoverable: true,
                type: 'CONNECTION_ERROR'
            };
            toast({
                title: "Error",
                description: streamingError.message,
                variant: "destructive"
            });
            enableOfflineMode();
        }
    };

    const toggleStreaming = async (marketId: number) => {
        try {
            const updatedMarket = await marketStreamingService.toggleStreaming(marketId);
            setStreamingMarkets(prev => 
                prev.map(m => m.id === updatedMarket.id ? updatedMarket : m)
            );
            toast({
                title: "Success",
                description: `Streaming status updated for market`,
                variant: "default"
            });
        } catch (error: any) {
            const streamingError: StreamingError = {
                code: 'STREAM_TOGGLE_ERROR',
                message: error.message,
                description: 'Failed to toggle streaming',
                timestamp: new Date().toISOString(),
                recoverable: true,
                type: 'CONNECTION_ERROR'
            };
            toast({
                title: "Error",
                description: streamingError.message,
                variant: "destructive"
            });
        }
    };

    const handleSearch = async (query: string) => {
        if (query.length < 2) {
            setAllMarkets(initialMarkets);
            return;
        }

        try {
            const markets = await marketStreamingService.searchMarkets(query);
            setAllMarkets(markets);
        } catch (error: any) {
            const streamingError: StreamingError = {
                code: 'MARKET_SEARCH_ERROR',
                message: error.message,
                description: 'Failed to search markets',
                timestamp: new Date().toISOString(),
                recoverable: true,
                type: 'CONNECTION_ERROR'
            };
            toast({
                title: "Error",
                description: streamingError.message,
                variant: "destructive"
            });
        }
    };

    if (isOfflineMode) {
        return (
            <StreamErrorBanner
                error={streamError}
                isOfflineMode={isOfflineMode}
                onRetry={handleRetry}
                onEnableOfflineMode={enableOfflineMode}
            />
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Market Streaming Manager</h2>

            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            handleSearch(e.target.value);
                        }}
                        placeholder="Search markets..."
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-xl font-semibold mb-4">Streaming Markets</h3>
                    <div className="space-y-2">
                        {streamingMarkets.map((market) => (
                            <div key={market.id} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                    <h4 className="font-medium">{market.market_name}</h4>
                                    <p className="text-sm text-gray-600">EPIC: {market.market}</p>
                                </div>
                                <button
                                    onClick={() => toggleStreaming(market.market)}
                                    className={`px-4 py-2 rounded ${
                                        market.is_streaming
                                            ? 'bg-red-500 hover:bg-red-600 text-white'
                                            : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                                >
                                    {market.is_streaming ? 'Stop Streaming' : 'Start Streaming'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="text-xl font-semibold mb-4">Available Markets</h3>
                    <div className="space-y-2">
                        {allMarkets.map((market) => (
                            <div key={market.epic} className="flex items-center justify-between p-2 border rounded">
                                <div>
                                    <h4 className="font-medium">{market.name}</h4>
                                    <p className="text-sm text-gray-600">EPIC: {market.epic}</p>
                                </div>
                                <button
                                    onClick={() => toggleStreaming(market.market_id)}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                                >
                                    Add to Streaming
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
