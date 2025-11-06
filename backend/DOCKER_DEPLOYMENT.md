# Docker Deployment Guide

This guide explains how to deploy the PingBot backend using Docker.

## Prerequisites

- Docker and Docker Compose installed
- External PostgreSQL database (DB_URL)
- Redis (can be local via docker-compose or external)

## Quick Start

1. **Copy environment file:**
   ```bash
   cp env.example .env
   ```

2. **Update `.env` file with your configuration:**
   - Set your external PostgreSQL `DB_URL`
   - Configure Clerk authentication keys
   - Set Redis URLs (for docker-compose, use `redis://redis:6379/0`)
   - Add webhook and email API keys

3. **Build and start services:**
   ```bash
   docker-compose up -d
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

## Services

The docker-compose setup includes:

- **app**: FastAPI application (port 8000)
- **celery-worker**: Celery worker for background tasks
- **redis**: Redis server for Celery broker/backend

## Environment Variables

Required environment variables (set in `.env`):

- `DB_URL`: PostgreSQL connection string (external database)
- `PORT`: Server port (default: 8000)
- `CLERK_SECRET_KEY`: Clerk authentication secret
- `AUTHORIZED_PARTIES`: Clerk authorized parties
- `BROKER_URL`: Redis broker URL for Celery
- `BACKEND_URL`: Redis backend URL for Celery
- `WEBHOOK_SECRET_KEY`: Webhook verification key
- `RESEND_API_KEY`: Resend email API key

## Production Deployment

For production:

1. Use external Redis (update `BROKER_URL` and `BACKEND_URL` in `.env`)
2. Use external PostgreSQL (set `DB_URL`)
3. Consider using environment variables directly instead of `.env` file
4. Set up proper logging and monitoring
5. Configure reverse proxy (nginx) for SSL/TLS

## Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f celery-worker

# Rebuild after code changes
docker-compose up -d --build

# Stop and remove volumes
docker-compose down -v
```

## Health Checks

- App health: `http://localhost:8000/`
- Redis: Automatically checked via healthcheck
- Services wait for dependencies before starting

## Troubleshooting

1. **Database connection issues**: Verify `DB_URL` is correct and accessible
2. **Redis connection issues**: Check `BROKER_URL` and `BACKEND_URL` in `.env`
3. **Port conflicts**: Change port mapping in `docker-compose.yml` if port 8000 is in use
4. **Logs location**: Logs are stored in `./logs` directory (mounted volume)

