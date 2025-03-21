export interface Market {
    epic: string;
    name: string;
    instrument_type: string;
    expiry: string;
    high: number;
    low: number;
    percentage_change: number;
    net_change: number;
    bid: number;
    offer: number;
    updated_at: string;
    streaming?: boolean;
    delay_time?: number;
    streaming_error?: StreamingError;
    scale: number;
    increment: number;
    unit: string;
    lot_size: number;
    control_ods: number;
    streaming_prices: boolean;
    scaling_factor: number;
    dealable: boolean;
    delayed_streaming: boolean;
    stream_type?: 'L1' | 'L2' | 'L3';
    update_interval?: number;
    market_id: number;
}

export interface UserMarketStream {
    id: number;
    user: number;
    market: number;
    market_name: string;
    is_streaming: boolean;
    last_updated: string;
}

export interface StreamingError {
    message: string;
    type: 'CONNECTION_ERROR' | 'AUTH_ERROR' | 'INTERNAL_ERROR' | 'UNKNOWN_ERROR';
    code?: string;
}

export interface Toast {
    title: string;
    description: string;
    variant: 'default' | 'destructive' | 'success' | 'warning';
}
