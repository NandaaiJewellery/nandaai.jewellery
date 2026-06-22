# API Gateway (Microservices Architecture)

A centralized API Gateway that handles authentication (JWT RS256), request routing, and secure communication between frontend and backend microservices.

---

## 🚀 Features

- JWT Authentication using **RS256 (Public/Private Key)**
- Centralized request routing to microservices
- Internal service protection using `x-internal-secret`
- Header injection (`x-user-id`, `x-user-email`)
- Scalable and production-ready structure

---

## 📦 Tech Stack

- Node.js
- Express.js
- TypeScript
- http-proxy-middleware
- jsonwebtoken

---

## 🔐 Step 1: Generate RSA Keys (OpenSSL)

We use **RS256**, which requires a **private key (for signing)** and a **public key (for verification)**.

### Generate Private Key (RSA 2048)

```bash
openssl genrsa -out private.key 2048
```

### Generate Public Key

```bash
openssl rsa -in private.key -pubout -out public.key
```

---

## 🔄 Step 2: Convert Keys to Base64

Render (and env systems) work best with single-line values.

### Encode Private Key

```bash
base64 -w 0 private.key
```

### Encode Public Key

```bash
base64 -w 0 public.key
```

Copy both outputs.

---

## ⚙️ Step 3: Environment Variables

Create a `.env` file in root:

```env
PORT=3000

# RSA Public Key (Base64 encoded)
JWT_PUBLIC_KEY=YOUR_BASE64_PUBLIC_KEY

# Internal secret (shared across services)
INTERNAL_SECRET=supersecret123

# Microservice URLs
PRODUCT_SERVICE_URL=http://localhost:4001
ORDER_SERVICE_URL=http://localhost:4002
```

---

## 🧠 Step 4: Decode Keys in Code

In your auth middleware:

```ts
const publicKey = Buffer.from(process.env.JWT_PUBLIC_KEY!, "base64").toString(
  "utf-8"
);
```

---

## 📥 Step 5: Install Dependencies

```bash
npm install
```

---

## ▶️ Step 6: Run the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

---

## 🧪 Health Check

```http
GET /health
```

Response:

```json
{
  "status": "ok",
  "service": "api-gateway"
}
```

---

## 🔐 Authentication Flow

1. User logs in via Auth Service
2. Receives JWT (signed with **private key**)
3. Frontend sends JWT to API Gateway
4. Gateway verifies using **public key**
5. Gateway injects:

   - `x-user-id`
   - `x-user-email`
   - `x-internal-secret`

6. Request forwarded to microservice

---

## 📡 API Documentation

### Base URL

```
http://localhost:3000
```

---

### 🧾 Orders

#### Create Order

```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**

```json
{
  "items": [{ "productId": "p1", "quantity": 2 }],
  "totalAmount": 4999
}
```

**Response:**

```json
{
  "message": "Order created successfully",
  "order": {
    "id": "order_123",
    "userId": "123",
    "items": [...],
    "totalAmount": 4999
  }
}
```

---

#### Get Orders

```http
GET /orders
Authorization: Bearer <token>
```

**Response:**

```json
{
  "orders": [...]
}
```

---

### 📦 Products

#### Get Products

```http
GET /products
Authorization: Bearer <token>
```

---

## 🔁 Request Flow

```
Frontend → API Gateway → Microservice → API Gateway → Frontend
```

---

## 🔒 Internal Security

All microservices are protected using:

```
x-internal-secret
```

Only API Gateway can communicate with services.

---

## ⚠️ Important Notes

- Never expose microservice URLs to frontend
- Never store private key in API Gateway
- Always use HTTPS in production
- Rotate keys periodically

---

## 🧠 Architecture Overview

```
Client
  ↓
API Gateway (Auth + Routing)
  ↓
Microservices (Orders, Products, etc.)
```

---

## 📌 Future Improvements

- Rate limiting
- Caching layer (Redis)
- Request aggregation (/dashboard)
- Circuit breaker pattern
- Logging & monitoring

---

## 👨‍💻 Author

Built as part of a microservices architecture system.
