#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$ROOT/.env"
COMPOSE_ENV_ARGS=()

if [[ -f "$ENV_FILE" ]]; then
  COMPOSE_ENV_ARGS=(--env-file "$ENV_FILE")
fi

echo "▶ Parando api + front + mongo..."
docker compose "${COMPOSE_ENV_ARGS[@]}" -f "$ROOT/docker-compose.yml" down

echo "▶ Parando PostgreSQL + MongoDB..."
docker compose "${COMPOSE_ENV_ARGS[@]}" -f "$ROOT/database/docker-compose.yml" down

echo "✓ Todo detenido."
