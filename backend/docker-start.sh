#!/bin/bash

# Docker deployment script for PingBot

echo "🚀 Starting PingBot Docker deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from env.example..."
    cp env.example .env
    echo "📝 Please update .env file with your configuration before continuing."
    echo "   Required: DB_URL, CLERK_SECRET_KEY, and other API keys"
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo "📊 Service status:"
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo "📝 View logs: docker-compose logs -f"
echo "🌐 API available at: http://localhost:8000"
echo "📚 API docs at: http://localhost:8000/docs"

