#!/bin/bash

# Stop PingBot Docker deployment

echo "🛑 Stopping PingBot services..."

docker-compose down

echo "✅ Services stopped!"

