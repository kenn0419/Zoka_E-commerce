# Zoka E-commerce - High-Performance Multi-vendor Ecosystem

Zoka is a scalable Multi-vendor Marketplace built with **NestJS**, **Prisma**, and **PostgreSQL**, leveraging **Redis** for high-speed data access and real-time reliability.



## ⚡ Powering Performance with Redis

In this project, **Redis** is not just a cache but a core component for system stability:

- **Distributed Caching:** Cached frequently accessed data (Product Catalogs, Categories) to reduce PostgreSQL load, achieving **<50ms** retrieval time.
- **Session Management:** Stored JWT Refresh Tokens and user sessions in Redis for fast, stateless authentication.
- **Rate Limiting:** Implemented request throttling to protect sensitive endpoints (Login, Flash Sale) from brute-force and DDoS attacks.
- **Real-time Synchronization:** Used Redis as a Pub/Sub mechanism to ensure consistent WebSocket message delivery across multiple server instances.
- **Flash Sale Handling:** Leveraged Redis atomic operations to manage high-concurrency stock counts, preventing **overselling** during peak traffic.

## 🚀 Core Features

- **Multi-vendor Engine:** Independent seller dashboards with granular RBAC permissions.
- **Advanced Promotion:** Global/Shop/Product-scope Coupons and scheduled Flash Sales.
- **Real-time Messaging:** Low-latency chat and instant notifications via WebSockets.
- **Secure Payments:** Integrated Momo/VNPay with automated webhook status updates.

## 🛠 Tech Stack

- **Frontend:** ReactJS(Typescript), Ant Design, Zustand, SASS
- **Backend:** Node.js, NestJS (TypeScript)
- **Database:** PostgreSQL & Prisma ORM
- **In-Memory DB:** **Redis (Caching & Rate Limiting)**
- **Real-time:** Socket.io
- **DevOps:** Docker, Environment-based configurations



## 🏗 Database & Architecture

- **Normalization:** Clean PostgreSQL schema with strategic indexing on `Order.code`, `User.email`, and `Product.slug`.
- **Data Integrity:** Used `priceSnapshot` in Cart/Order models to lock prices at checkout, ensuring historical accuracy.

## 📖 Installation

1. Clone repo: `git clone https://github.com/kenn0419/Zoka_E-commerce.git`
2. Install: `npm install`
3. **Setup Redis:** Ensure a Redis instance is running (Local or Docker).
4. **Setup PostgreSQL:** Ensure a PostgreSQL instance is running (Local or Docker).
5. Config `.env properties`
6. Run: `npm run start`
