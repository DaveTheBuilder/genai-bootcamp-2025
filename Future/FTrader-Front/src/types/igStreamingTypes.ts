export interface MarketUpdate {
    epic: string;
    bid: number;
    offer: number;
    high: number;
    low: number;
    last_traded_price: number;
    last_traded_volume: number;
    percentage_change: number;
    net_change: number;
    timestamp: string;
    market_status: string;
}
