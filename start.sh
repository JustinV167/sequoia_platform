#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "▶ Creando red compartida..."
docker network create sequoia_net 2>/dev/null || true

echo "▶ Levantando base de datos..."
docker compose -f "$ROOT/database/docker-compose.yml" up -d

echo "▶ Levantando api + front..."
docker compose -f "$ROOT/docker-compose.yml" up -d --build

echo ""
echo "✓ Servicios arriba:"
echo "  PostgreSQL : 5432"
echo "  API        : http://localhost:3001"
echo "  Front      : http://localhost:5173"
echo ""
echo "Logs (Ctrl+C para salir):"
echo ""

docker compose -f "$ROOT/database/docker-compose.yml" \
  -f "$ROOT/docker-compose.yml" logs -f
