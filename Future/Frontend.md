# Trading Application Frontend Development Prompt

## Overview
Develop a **React-based frontend** for a trading application. Initially, it will consume a **REST API**, but it should be designed to easily switch to **WebSockets** or **GraphQL** for real-time updates. The UI must be built using **Tailwind CSS**, support **OAuth2 authentication**, and function as a **Progressive Web App (PWA)** for mobile compatibility.

## Core Requirements
- **React Frontend**: Modern, component-based architecture.
- **API Integration**: Use REST API for now, but design for WebSockets/GraphQL integration later.
- **State Management**: Lightweight state management (Zustand, Recoil, or Context API).
- **Tailwind CSS**: For styling and UI consistency.
- **OAuth2 Authentication**: Implement secure user authentication using OAuth2.
- **PWA Support**: Enable service workers, offline support, and mobile-friendly UI.
- **Dark Mode Support**: Implement a toggle between light and dark modes.

## Pages to Create
1. **Login & Authentication**
   - OAuth2 authentication (Google, GitHub, or broker-specific login).
   - Secure session handling with refresh tokens.

2. **Dashboard**
   - Displays portfolio summary (holdings, balances, P&L).
   - Market watchlist (real-time prices).
   - Recent trade activity.

3. **Market Data**
   - Live market data (charts, order book, recent trades).
   - Ability to switch between different asset classes (stocks, crypto, forex).

4. **Order Execution**
   - Place, modify, and cancel orders.
   - Support for market, limit, stop-loss, and conditional orders.

5. **Trade History**
   - View past trades with filtering options.
   - P&L analysis.

6. **Portfolio Management**
   - Track holdings, allocation breakdown, and performance.

7. **Settings & Notifications**
   - User preferences (currency, time zone, dark mode).
   - Notification settings (trade alerts, margin calls).

## Best Practices
- **Component-Based Design**: Modular and reusable UI components.
- **Lazy Loading & Code Splitting**: Optimize performance with dynamic imports.
- **Responsive Design**: Fully functional across desktop, tablet, and mobile devices.
- **Accessibility (A11Y)**: Ensure proper ARIA attributes and keyboard navigation.

## Expected Deliverables
- A fully functional React frontend.
- API integration (with mock endpoints for testing).
- Tailwind CSS styling.
- OAuth2 authentication.
- PWA implementation with service workers.
- Placeholder WebSocket/GraphQL configuration for future expansion.

# Trading Application API Endpoints

## **Authentication API** (`/auth`)
- **`POST /auth/login`** – Authenticate using OAuth2 (Google, GitHub, Broker API).
- **`POST /auth/logout`** – Logout and invalidate the session.
- **`GET /auth/user`** – Get the authenticated user’s profile.
- **`POST /auth/refresh`** – Refresh the access token when it expires.

## **Market Data API** (`/market`)
- **`GET /market/tickers`** – Fetch real-time price data for watchlist assets.
- **`GET /market/orderbook/{symbol}`** – Retrieve order book data for a given asset.
- **`GET /market/trades/{symbol}`** – Get recent trades for an asset.
- **`GET /market/chart/{symbol}?interval=1m`** – Fetch historical OHLCV (Open, High, Low, Close, Volume) data.
- **`GET /market/news`** – Fetch latest financial news.

## **Order Execution API** (`/orders`)
- **`POST /orders/place`** – Submit a new order (market, limit, stop-loss, etc.).
- **`GET /orders/{order_id}`** – Retrieve order details.
- **`PUT /orders/{order_id}/modify`** – Modify an open order.
- **`DELETE /orders/{order_id}`** – Cancel an open order.
- **`GET /orders/history`** – Get past orders with filters (date, status, type).

## **Portfolio API** (`/portfolio`)
- **`GET /portfolio/holdings`** – Fetch current holdings and allocations.
- **`GET /portfolio/performance`** – Get P&L performance over time.
- **`GET /portfolio/summary`** – Retrieve total account balance and margin status.

## **Trade History API** (`/trades`)
- **`GET /trades/history`** – Fetch executed trades with filters (date, symbol).
- **`GET /trades/{trade_id}`** – Retrieve details of a specific trade.

## **User Preferences & Settings API** (`/user`)
- **`GET /user/settings`** – Fetch user settings (currency, notifications, dark mode).
- **`PUT /user/settings`** – Update user preferences.
- **`GET /user/notifications`** – Fetch trade alerts and system notifications.

---

## **WebSocket Events** (For Future Real-Time Support)
- **`ws://market/tickers`** – Subscribe to real-time price updates.
- **`ws://market/orderbook/{symbol}`** – Stream live order book changes.
- **`ws://orders/updates`** – Get live updates on order execution status.

# Trading Application API Documentation

## **1. Authentication API** (`/auth`)

### **Login**
#### Request (`POST /auth/login`)
```json
{
  "provider": "google",
  "access_token": "your-oauth2-token"
}
```
#### Response
```json
{
  "user_id": "12345",
  "access_token": "jwt-access-token",
  "refresh_token": "jwt-refresh-token",
  "expires_in": 3600
}
```

### **Logout**
#### Request (`POST /auth/logout`)
```json
{
  "access_token": "jwt-access-token"
}
```
#### Response
```json
{
  "message": "Logout successful"
}
```

### **Get Authenticated User**
#### Request (`GET /auth/user`)
#### Response
```json
{
  "user_id": "12345",
  "name": "John Doe",
  "email": "john@example.com",
  "preferences": {
    "currency": "USD",
    "dark_mode": true
  }
}
```

---

## **2. Market Data API** (`/market`)

### **Fetch Market Tickers**
#### Request (`GET /market/tickers`)
#### Response
```json
[
  {
    "symbol": "AAPL",
    "price": 180.25,
    "change": "+1.2%"
  },
  {
    "symbol": "BTC-USD",
    "price": 65000.50,
    "change": "-0.5%"
  }
]
```

### **Fetch Order Book**
#### Request (`GET /market/orderbook/AAPL`)
#### Response
```json
{
  "symbol": "AAPL",
  "bids": [
    { "price": 180.20, "quantity": 100 },
    { "price": 180.15, "quantity": 200 }
  ],
  "asks": [
    { "price": 180.30, "quantity": 150 },
    { "price": 180.40, "quantity": 250 }
  ]
}
```

---

## **3. Order Execution API** (`/orders`)

### **Place a New Order**
#### Request (`POST /orders/place`)
```json
{
  "user_id": "12345",
  "symbol": "AAPL",
  "order_type": "limit",
  "side": "buy",
  "price": 180.00,
  "quantity": 10
}
```
#### Response
```json
{
  "order_id": "abc123",
  "status": "pending",
  "timestamp": "2025-03-07T12:34:56Z"
}
```

### **Modify an Order**
#### Request (`PUT /orders/abc123/modify`)
```json
{
  "price": 179.50,
  "quantity": 12
}
```
#### Response
```json
{
  "order_id": "abc123",
  "status": "modified",
  "new_price": 179.50,
  "new_quantity": 12
}
```

### **Cancel an Order**
#### Request (`DELETE /orders/abc123`)
#### Response
```json
{
  "order_id": "abc123",
  "status": "canceled"
}
```

---

## **4. Portfolio API** (`/portfolio`)

### **Get Portfolio Holdings**
#### Request (`GET /portfolio/holdings`)
#### Response
```json
[
  {
    "symbol": "AAPL",
    "quantity": 50,
    "average_price": 175.00,
    "current_price": 180.25,
    "pnl": "+$262.50"
  },
  {
    "symbol": "BTC-USD",
    "quantity": 0.5,
    "average_price": 60000.00,
    "current_price": 65000.50,
    "pnl": "+$2500.25"
  }
]
```

---

## **5. Trade History API** (`/trades`)

### **Fetch Trade History**
#### Request (`GET /trades/history`)
#### Response
```json
[
  {
    "trade_id": "t12345",
    "symbol": "AAPL",
    "side": "buy",
    "price": 175.00,
    "quantity": 10,
    "timestamp": "2025-03-01T10:15:00Z"
  }
]
```

---

## **6. User Preferences & Settings API** (`/user`)

### **Get User Settings**
#### Request (`GET /user/settings`)
#### Response
```json
{
  "currency": "USD",
  "dark_mode": true,
  "notification_settings": {
    "trade_alerts": true,
    "price_alerts": false
  }
}
```

### **Update User Settings**
#### Request (`PUT /user/settings`)
```json
{
  "dark_mode": false,
  "notification_settings": {
    "trade_alerts": false,
    "price_alerts": true
  }
}
```
#### Response
```json
{
  "message": "Settings updated successfully"
}
```

---

## **7. WebSocket Events (For Future Real-Time Support)**

### **Subscribe to Real-Time Price Updates**
#### WebSocket Connection (`ws://market/tickers`)
#### Example Response
```json
{
  "symbol": "AAPL",
  "price": 181.00,
  "timestamp": "2025-03-07T12:40:00Z"
}
```

### **Order Execution Updates**
#### WebSocket Connection (`ws://orders/updates`)
#### Example Response
```json
{
  "order_id": "abc123",
  "status": "filled",
  "executed_price": 180.00,
  "executed_quantity": 10,
  "timestamp": "2025-03-07T12:45:00Z"
}


