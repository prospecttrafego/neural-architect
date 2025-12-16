#!/bin/bash
set -e

echo "deploy: pulling changes..."
git pull

echo "deploy: building and starting containers..."
cd docker
docker-compose up -d --build

echo "deploy: applying migrations..."
docker-compose exec backend uv run alembic upgrade head

echo "deploy: done! Services are running."
