#!/bin/bash
# Build and run the Docker container for local development.
set -e

IMAGE="${1:-app}"
PORT="${2:-3000}"

echo "Building $IMAGE..."
docker build -t "$IMAGE" .

echo "Starting on port $PORT"
docker run --rm -p "$PORT:$PORT" --env-file .env "$IMAGE"
