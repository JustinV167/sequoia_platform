#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$ROOT/.env"
COMPOSE_ENV_ARGS=()

if [[ -f "$ENV_FILE" ]]; then
  COMPOSE_ENV_ARGS=(--env-file "$ENV_FILE")
else
  echo "⚠ No existe $ENV_FILE. Se usarán los valores por defecto de docker-compose." >&2
  echo "  Copiá .env.example a .env y completá los secretos." >&2
fi

echo "▶ Creando red compartida..."
docker network create sequoia_net 2>/dev/null || true

echo "▶ Levantando PostgreSQL + MongoDB..."
docker compose "${COMPOSE_ENV_ARGS[@]}" -f "$ROOT/database/docker-compose.yml" up -d --wait

echo "▶ Levantando api + front + mongo..."
docker compose "${COMPOSE_ENV_ARGS[@]}" -f "$ROOT/docker-compose.yml" up -d --build --force-recreate

echo ""
echo "✓ Servicios arriba:"
echo "  PostgreSQL : 5432"
echo "  MongoDB    : 27017"
echo "  API        : http://localhost:3001/api"
echo "  Front      : http://localhost:5173"
echo ""
echo "Logs (Ctrl+C para salir):"
echo ""

docker compose "${COMPOSE_ENV_ARGS[@]}" \
  -f "$ROOT/database/docker-compose.yml" \
  -f "$ROOT/docker-compose.yml" logs -f
