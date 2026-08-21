#  URL Shortener

> A production-ready URL Shortener built using **Node.js, Express.js, MongoDB, Redis, and Docker**, following clean architecture and backend engineering best practices.

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-5.x-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Redis](https://img.shields.io/badge/Redis-Cache-red)
![Docker](https://img.shields.io/badge/Docker-Container-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

##  Overview

This project is a scalable URL Shortener inspired by services like **Bitly**. It converts long URLs into compact Base62-encoded short URLs while maintaining high performance through Redis caching and Dockerized deployment.

The project is designed using **Clean Architecture**, **Repository Pattern**, **Service Layer**, and follows backend engineering practices commonly used in production systems.

---

#  Features

## URL Shortening

- Generate unique Base62 short URLs
- Redirect short URLs to the original destination
- Prevent duplicate URL generation
- Race condition handling for concurrent requests

---

## Performance Optimization

- Redis Cache Aside Pattern
- Cache long URL → short ID mapping
- Cache short ID → long URL mapping
- Configurable cache TTL
- Redis LFU cache eviction

---

## Rate Limiting

- Custom Redis-based Fixed Window Rate Limiter
- Prevent API abuse
- Automatic request counter expiration
- Returns `429 Too Many Requests`
- Includes Retry-After duration

---

## Backend Architecture

- Repository Pattern
- Service Layer
- Controller Layer
- Middleware-based validation
- Global Error Handling
- Async Handler
- Winston/Morgan Logging

---

## DevOps

- Dockerized Node.js application
- Docker Compose support
- Redis container
- Custom Redis configuration
- Environment-based configuration

---

# 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Language | JavaScript (Node.js) |
| Framework | Express.js |
| Database | MongoDB Atlas |
| Cache | Redis |
| Containerization | Docker |
| Orchestration | Docker Compose |
| ODM | Mongoose |
| Logging | Morgan / Winston |
| Validation | Express Middleware |
| Architecture | Clean Architecture |

---

# 🏗 High Level Architecture

```text
                        Client
                           │
                           ▼
                  Express.js Application
                           │
      ┌────────────────────┼─────────────────────┐
      ▼                    ▼                     ▼
 Validation         Rate Limiter          Error Handler
                           │
                           ▼
                     Controller Layer
                           │
                           ▼
                      Service Layer
               (Business Logic)
                           │
          ┌────────────────┴────────────────┐
          ▼                                 ▼
  Cache Service                     Repository Layer
          │                                 │
          ▼                                 ▼
       Redis Cache                   MongoDB Atlas
```

---

# 📂 Project Structure

```text
url-shortener
│
├── src
│   ├── config
│   │   ├── db.js
│   │   └── redis.js
│   │
│   ├── controllers
│   │   └── url.controller.js
│   │
│   ├── middlewares
│   │   ├── asyncHandler.js
│   │   ├── error.middleware.js
│   │   ├── rateLimiter.js
│   │   └── validation.middleware.js
│   │
│   ├── models
│   │   ├── url.model.js
│   │   └── counter.model.js
│   │
│   ├── repositories
│   │   ├── url.repository.js
│   │   └── counter.repository.js
│   │
│   ├── routes
│   │   └── url.routes.js
│   │
│   ├── services
│   │   ├── url.service.js
│   │   ├── cache.service.js
│   │   └── base62.js
│   │
│   └── utils
│       ├── AppError.js
│       └── logger.js
│
├── Dockerfile
├── docker-compose.yml
├── redis.conf
├── package.json
├── server.js
└── README.md
```

---

#  Design Principles

This project follows several backend engineering principles:

- Separation of Concerns
- Single Responsibility Principle (SRP)
- Repository Pattern
- Service Layer Pattern
- Cache Aside Pattern
- Fail-Safe Redis Integration
- Graceful Error Handling
- Environment-Based Configuration

# ⚙️ Installation Guide

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v20 or above)
- Docker Desktop
- Git
- MongoDB Atlas Account

Verify your installation:

```bash
node -v
docker -v
docker compose version
git --version
```

---

#  Clone Repository

```bash
git clone https://github.com/SagarChau750/url_shortner/.git

cd url-shortener
```

---

#  Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=5000

MONGODB_URL=your_mongodb_atlas_connection_string

BASE_URL=http://localhost:5000

REDIS_URL=redis://redis-server:6379

CACHE_TTL=3600

RATE_LIMIT_WINDOW=60

RATE_LIMIT_MAX_REQUESTS=5
```


---

#  Running with Docker Compose

The project is fully containerized.

Simply run:

```bash
docker compose up --build -d
```

Docker Compose automatically:

- Builds the Node.js application
- Starts Redis
- Applies `redis.conf`
- Creates the Docker network
- Connects Node.js with Redis
- Exposes the backend on port **5000**

---

#  Verify the Application

Open:

```
http://localhost:5000
```

Expected response:

```
URL Shortener API is running...
```

---

#  Docker Containers

Check running containers:

```bash
docker ps
```

Expected output:

```
CONTAINER ID   IMAGE             NAME

xxxx           url-shortener     url-backend

yyyy           redis             redis-server
```

---

#  View Logs

Node.js logs

```bash
docker logs url-backend
```

Redis logs

```bash
docker logs redis-server
```

Follow live logs

```bash
docker logs -f url-backend
```

---

#  Restart Containers

```bash
docker compose restart
```

Restart only backend

```bash
docker restart url-backend
```

Restart only Redis

```bash
docker restart redis-server
```

---

#  Stop the Application

```bash
docker compose down
```

This stops and removes all containers created by Docker Compose.

---

# 🔨 Rebuild After Code Changes

Whenever you modify:

- Dockerfile
- package.json
- Node.js source code
- Redis configuration

Run:

```bash
docker compose up --build -d
```

Docker will rebuild the application image and restart the containers.

---

#  Remove Containers and Images

Stop containers

```bash
docker compose down
```

Remove images

```bash
docker image prune -a
```

Remove unused Docker resources

```bash
docker system prune -a
```

---

# Enter Running Containers

Enter Node.js container

```bash
docker exec -it url-backend sh
```

Enter Redis container

```bash
docker exec -it redis-server redis-cli
```

---

#  Useful Redis Commands

View all keys

```redis
KEYS *
```

Read a cached short URL

```redis
GET short:<shortId>
```

Read cached long URL

```redis
GET long:<longUrl>
```

Check remaining TTL

```redis
TTL short:<shortId>
```

View memory usage

```redis
INFO memory
```

Check configured memory limit

```redis
CONFIG GET maxmemory
```

Check eviction policy

```redis
CONFIG GET maxmemory-policy
```

---

#  Docker Compose Architecture

```
                    Docker Host
                         │
      ┌──────────────────┴──────────────────┐
      ▼                                     ▼
+--------------------+             +--------------------+
|   url-backend      |             |   redis-server     |
|--------------------|             |--------------------|
| Express.js         |◄──────────► | Redis Cache        |
| Controllers        |             | LFU Eviction       |
| Services           |             | TTL                |
| Repositories       |             +--------------------+
+--------------------+

```

---

#  Docker Network

Both containers communicate over the same Docker bridge network.

```
Node.js

↓

redis://redis-server:6379

↓

Redis Container
```

The backend never connects to `localhost`.

Instead, it communicates using the Redis service name defined in Docker Compose.

---

#  Common Issues

### Redis Connection Error

Check:

```bash
docker ps
```

Verify Redis is running.

---

### MongoDB Connection Error

Verify your `MONGODB_URL` inside `.env`.

---

### Port Already in Use

Find the running process:

```bash
netstat -ano | findstr :5000
```

Stop the conflicting process or change the exposed port.

---

### Docker Not Rebuilding

Force rebuild:

```bash
docker compose down

docker compose up --build --force-recreate -d
```

---

#  Quick Start (One Command)

After configuring `.env`, start the complete application using:

```bash
docker compose up --build -d
```

Within a few seconds, the backend and Redis cache will be ready to serve requests.


# 📡 API Documentation

## Base URL

```
http://localhost:5000
```

---

# 1️⃣ Create Short URL

Creates a unique Base62 encoded short URL for a given long URL.

### Endpoint

```http
POST /shorten
```

---

## Request Body

```json
{
    "longUrl": "https://www.google.com"
}
```

---

## Success Response

**Status Code**

```
201 Created
```

```json
{
    "success": true,
    "message": "Short URL created successfully",
    "data": {
        "shortId": "bM",
        "longUrl": "https://www.google.com",
        "shortUrl": "http://localhost:5000/bM"
    }
}
```

---

## Duplicate URL Response

If the URL already exists, the existing short URL is returned instead of creating a new one.

```json
{
    "success": true,
    "message": "Short URL created successfully",
    "data": {
        "shortId": "bM",
        "longUrl": "https://www.google.com",
        "shortUrl": "http://localhost:5000/bM"
    }
}
```

---

## Validation Error

```
400 Bad Request
```

```json
{
    "success": false,
    "message": "Invalid URL"
}
```

---

## Rate Limit Exceeded

```
429 Too Many Requests
```

```json
{
    "success": false,
    "message": "Too many requests. Please try again later.",
    "retryAfter": 48
}
```

---

# 2️⃣ Redirect to Original URL

Redirects the client to the original long URL.

### Endpoint

```http
GET /:shortId
```

Example

```http
GET /bM
```

---

## Success Response

```
302 Found
```

The browser is redirected to

```
https://www.google.com
```

---

## URL Not Found

```
404 Not Found
```

```json
{
    "success": false,
    "message": "URL not found"
}
```

---

# 🔄 Request Flow

```
POST /shorten

        │
        ▼
Validation Middleware
        │
        ▼
Rate Limiter
        │
        ▼
Controller
        │
        ▼
Service
        │
        ▼
Redis Cache
        │
   Cache Hit?
     │      │
    YES     NO
     │       │
     ▼       ▼
 Return   MongoDB
              │
              ▼
      Store in Redis
              │
              ▼
          Response
```

---

# 🔀 Redirect Flow

```
GET /:shortId

       │
       ▼
Rate Limiter
       │
       ▼
Controller
       │
       ▼
Cache Service
       │
       ▼
Redis

Cache Hit?
  │      │
 YES     NO
  │       │
  ▼       ▼
Return  MongoDB
          │
          ▼
    Cache in Redis
          │
          ▼
     Redirect (302)
```

---

# 📮 Example cURL Requests

## Create Short URL

```bash
curl --location 'http://localhost:5000/shorten' \
--header 'Content-Type: application/json' \
--data '{
    "longUrl":"https://www.google.com"
}'
```

---

## Redirect

```bash
curl http://localhost:5000/bM
```

---

# 📌 HTTP Status Codes

| Status Code | Meaning |
|-------------|----------|
| 200 | Request Successful |
| 201 | Short URL Created |
| 302 | Redirect to Original URL |
| 400 | Validation Error |
| 404 | URL Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

# 📊 API Execution Flow

```
Client
   │
   ▼
Express Router
   │
   ▼
Validation Middleware
   │
   ▼
Redis Rate Limiter
   │
   ▼
Controller
   │
   ▼
Service Layer
   │
   ├───────────────┐
   ▼               ▼
Cache Service   Repository
   │               │
   ▼               ▼
 Redis         MongoDB
```

---

# 🧪 Testing

The APIs can be tested using:

- Postman
- Thunder Client
- cURL
- REST Client (VS Code)
- Browser (Redirect API)

---

# ✅ Functional Test Cases

| Test Case | Expected Result |
|------------|-----------------|
| Valid URL | Short URL generated |
| Duplicate URL | Existing short URL returned |
| Invalid URL | 400 Bad Request |
| Unknown Short ID | 404 Not Found |
| Cache Hit | Redis serves response |
| Cache Miss | MongoDB queried |
| More than Rate Limit | 429 Too Many Requests |
| Redis Restart | MongoDB still works (Cache repopulates) |

---

# 📈 Performance Improvements

Compared to a basic URL shortener, this implementation includes:

- Redis Cache Aside Pattern
- Duplicate URL Optimization
- Two-way Cache Mapping
- Fixed Window Redis Rate Limiter
- Clean Architecture
- Repository Pattern
- Dockerized Deployment
- Automatic Redis TTL
