// Field sets for different subscription types based on IG API requirements
export const MARKET_FIELDS = [
  'BID', 'OFFER', 'HIGH', 'LOW',
  'MID_OPEN', 'CHANGE', 'CHANGE_PCT',
  'MARKET_DELAY', 'MARKET_STATE', 'UPDATE_TIME'
];

export const CHART_FIELDS = [
  'LTV', 'TTV', 'UTM',
  'DAY_OPEN_MID', 'DAY_NET_CHG_MID', 'DAY_PERC_CHG_MID',
  'DAY_HIGH', 'DAY_LOW',
  'OFR_OPEN', 'OFR_HIGH', 'OFR_LOW', 'OFR_CLOSE',
  'BID_OPEN', 'BID_HIGH', 'BID_LOW', 'BID_CLOSE',
  'LTP_OPEN', 'LTP_HIGH', 'LTP_LOW', 'LTP_CLOSE',
  'CONS_END', 'CONS_TICK_COUNT'
];

export const CHART_TICK_FIELDS = [
  'BID', 'OFR', 'LTP', 'LTV', 'TTV', 'UTM',
  'DAY_OPEN_MID', 'DAY_NET_CHG_MID', 'DAY_PERC_CHG_MID',
  'DAY_HIGH', 'DAY_LOW'
];

// New field sets for enhanced features
export const VOLUME_PROFILE_FIELDS = [
  'PRICE_LEVEL', 'VOLUME', 'BUY_VOLUME', 'SELL_VOLUME',
  'UTM', 'TICK_COUNT'
];

export const ORDER_FLOW_FIELDS = [
  'TRADE_SIZE', 'TRADE_PRICE', 'TRADE_SIDE',
  'AGGRESSOR', 'CLUSTER_ID', 'UTM'
];

export const MARKET_DEPTH_FIELDS = [
  'LEVEL', 'BID_PRICE', 'BID_SIZE',
  'OFR_PRICE', 'OFR_SIZE', 'BUY_LIQUIDITY',
  'SELL_LIQUIDITY', 'IMBALANCE_RATIO'
];

// Resolution mapping for multi-timeframe analysis
export const TIMEFRAME_RESOLUTIONS = {
  '1M': 'ONE_MINUTE',
  '5M': 'FIVE_MINUTE',
  '15M': 'FIFTEEN_MINUTE',
  '30M': 'THIRTY_MINUTE',
  '1H': 'HOUR',
  '4H': 'FOUR_HOUR',
  '1D': 'DAILY'
};
