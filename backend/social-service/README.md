# Social Service

A production-ready NestJS microservice for handling **Likes**, **Comments**, and **Shares** on products.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 10 |
| Language | TypeScript 5 |
| Database | PostgreSQL |
| ORM | Sequelize + sequelize-typescript |
| Validation | class-validator, class-transformer |
| API Docs | Swagger (`/api/docs`) |
| Rate Limiting | `@nestjs/throttler` |
| Linting | ESLint + Prettier |
| Testing | Jest (unit + e2e) |

---

## Setup & Run Locally

### 1. Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- PostgreSQL running locally (or a remote DB)

### 2. Install dependencies

```bash
cd social-service
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=social_service

THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### 4. Create the database

```sql
CREATE DATABASE social_service;
```

> Tables are created automatically on first start via `sequelize.sync({ alter: true })`.

### 5. Start the server

```bash
npm run start:dev
```

The service will be available at `http://localhost:3000`
Swagger docs at `http://localhost:3000/api/docs`

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run start:dev` | Start with hot-reload (development) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start:prod` | Run compiled production bundle |
| `npm run test` | Run unit tests |
| `npm run test:cov` | Run unit tests with coverage |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Lint and auto-fix with ESLint |
| `npm run format` | Format with Prettier |

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | HTTP port |
| `NODE_ENV` | No | `development` | `development` or `production` |
| `DB_HOST` | Yes | `localhost` | PostgreSQL host |
| `DB_PORT` | Yes | `5432` | PostgreSQL port |
| `DB_USER` | Yes | `postgres` | PostgreSQL username |
| `DB_PASS` | Yes | `postgres` | PostgreSQL password |
| `DB_NAME` | Yes | `social_service` | PostgreSQL database name |
| `THROTTLE_TTL` | No | `60` | Rate limit window in seconds |
| `THROTTLE_LIMIT` | No | `100` | Max requests per window |

---

## API Endpoints

### Mock User Authentication

All endpoints read an optional `x-user-id` header (UUID). If omitted, a random UUID is generated per request — simulating an authenticated user.

---

### Likes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/likes` | Like a product |
| `DELETE` | `/likes` | Unlike a product |
| `GET` | `/likes/:productId` | Get total like count |

**POST /likes body:**
```json
{ "productId": "550e8400-e29b-41d4-a716-446655440000" }
```

**DELETE /likes body:**
```json
{ "productId": "550e8400-e29b-41d4-a716-446655440000" }
```

**GET /likes/:productId response:**
```json
{ "productId": "...", "count": 42 }
```

---

### Comments

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/comments` | Create a comment |
| `PATCH` | `/comments/:id` | Update own comment |
| `DELETE` | `/comments/:id` | Soft-delete own comment |
| `GET` | `/comments/:productId?page=1&limit=10` | Paginated comments (newest first) |

**POST /comments body:**
```json
{
  "productId": "550e8400-e29b-41d4-a716-446655440000",
  "comment": "Great product!",
  "parentCommentId": null
}
```

**GET /comments/:productId response:**
```json
{
  "data": [ { "id": "...", "comment": "...", "userId": "...", "createdAt": "..." } ],
  "meta": { "total": 100, "page": 1, "limit": 10, "totalPages": 10 }
}
```

---

### Shares

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/shares` | Share a product (increments if already shared) |
| `GET` | `/shares/:productId` | Get total share count |

**POST /shares body:**
```json
{ "productId": "550e8400-e29b-41d4-a716-446655440000" }
```

**GET /shares/:productId response:**
```json
{ "productId": "...", "totalShares": 15 }
```

---

## Project Structure

```
src/
├── main.ts                        # Bootstrap, Swagger, global pipes
├── app.module.ts                  # Root module, CORS, throttling, middleware
├── config/
│   └── configuration.ts           # Typed env config factory
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts   # Global error handler
│   ├── interceptors/
│   │   └── logging.interceptor.ts     # Request/response logger
│   ├── middleware/
│   │   └── mock-user.middleware.ts    # Injects req.user from x-user-id header
│   └── utils/
│       └── pagination.util.ts         # Pagination helper
├── database/
│   ├── database.module.ts
│   └── database.providers.ts      # Sequelize connection + model registration
└── modules/
    ├── likes/
    │   ├── likes.model.ts          # UNIQUE(product_id, user_id)
    │   ├── likes.service.ts
    │   ├── likes.controller.ts
    │   ├── likes.providers.ts
    │   ├── likes.module.ts
    │   └── dto/
    ├── comments/
    │   ├── comments.model.ts       # Soft delete + threaded replies
    │   ├── comments.service.ts
    │   ├── comments.controller.ts
    │   ├── comments.providers.ts
    │   ├── comments.module.ts
    │   └── dto/
    └── shares/
        ├── shares.model.ts         # UNIQUE(product_id, user_id) + share_count
        ├── shares.service.ts       # Transaction-safe upsert
        ├── shares.controller.ts
        ├── shares.providers.ts
        ├── shares.module.ts
        └── dto/
```

---

## Key Design Decisions

- **Soft deletes on comments** — `is_deleted` flag; deleted comments are excluded from all reads but preserved in DB
- **Transactional shares** — every share upsert runs inside a Sequelize transaction with row-level locking to prevent race conditions
- **Duplicate like prevention** — enforced at both the application layer (409 Conflict) and DB level (UNIQUE constraint)
- **Mock user middleware** — reads `x-user-id` header to simulate an authenticated user; replace with real JWT middleware in production
- **Rate limiting** — `@nestjs/throttler` applied globally; configurable via env vars
