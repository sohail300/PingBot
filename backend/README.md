# Running Docker Container

## Prerequisites

- Docker and Docker Compose installed
- `.env` file configured with required environment variables

## Quick Start

1. **Copy environment file (if needed):**
   ```bash
   cp env.example .env
   ```

2. **Update `.env` file with your configuration**

3. **Build and start services:**
   ```bash
   docker-compose up -d
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

## Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up -d --build

# Stop and remove volumes
docker-compose down -v
```

