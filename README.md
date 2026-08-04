# URL Shortener

## Prerequisites

- Docker Desktop
- Git
- MongoDB Atlas account

## Setup

```bash
git clone <repo-url>
cd url-shortener
```

Create a `.env` file from `.env.example` and update the MongoDB Atlas connection string.

Run:

```bash
docker compose up --build -d
```

Backend:

```
http://localhost:5000
```
