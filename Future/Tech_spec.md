# Trading Application Development Prompt

## Overview
I need to build a **trading application** that follows best practices in architecture, security, scalability, and maintainability. The application should support **real-time trading, market data analysis, and order execution** across multiple asset classes (stocks, ETFs, crypto, or forex).

## Core Requirements
- **Market Data Handling**: Fetch real-time and historical market data from APIs (e.g., Alpaca, Binance, Interactive Brokers). Implement efficient data storage and caching.
- **Order Execution**: Allow placing, modifying, and canceling orders. Support market, limit, stop-loss, and conditional orders.
- **Trading Strategies**: Support both manual trading and algorithmic strategies (e.g., moving averages, momentum trading, AI-driven models).
- **Risk Management**: Implement position sizing, stop-loss, take-profit, and exposure limits.
- **Portfolio Management**: Track positions, P&L, and risk metrics with real-time updates.

## Architectural Best Practices
- **Microservices Architecture**: Separate market data, order execution, strategy engine, and UI into independent services.
- **Event-Driven Architecture**: Use Kafka, RabbitMQ, or WebSockets for real-time trade execution and data updates.
- **Cloud-Native Deployment**: Deploy using Kubernetes (EKS, AKS, or GKE) or serverless functions where applicable.
- **Scalability & Performance**: Use distributed computing where needed, and optimize API calls to reduce latency.
- **Security**: Implement OAuth2 for authentication, encrypt sensitive data, and apply API rate limiting.

## Technology Stack
- **Backend**: Python (FastAPI, Django, or Flask) or Node.js
- **Frontend**: React, Next.js, or Vue.js
- **Database**: PostgreSQL, MongoDB, or Redis for caching
- **Messaging**: Kafka, RabbitMQ, or WebSockets for low-latency updates
- **Infrastructure**: AWS (Lambda, ECS, S3, RDS), Azure, or GCP
- **Machine Learning** (optional): TensorFlow/PyTorch for AI-driven trading models

## Additional Features
- **Backtesting Module**: Allow users to test strategies on historical data before deploying.
- **Paper Trading Mode**: Simulated trading environment for users to test strategies without risk.
- **Mobile Support**: Responsive web UI or native mobile apps.

## Expectations
Please design a **scalable, secure, and efficient architecture** while ensuring **low latency** for real-time trading. Let me know if you need any refinements!
