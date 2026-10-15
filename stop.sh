#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "▶ Parando api + front..."
docker compose -f "$ROOT/docker-compose.yml" down

echo "▶ Parando base de datos..."
docker compose -f "$ROOT/database/docker-compose.yml" down

echo "✓ Todo detenido."
