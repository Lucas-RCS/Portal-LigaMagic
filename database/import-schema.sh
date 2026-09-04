#!/usr/bin/env bash
set -euo pipefail

MYSQL_CONTAINER="${MYSQL_CONTAINER:-mysql}"
MYSQL_USER="${MYSQL_USER:-root}"
MYSQL_PASSWORD="${MYSQL_PASSWORD:-root}"
SQL_FILE="${SQL_FILE:-database/schema.sql}"

if ! docker ps --format '{{.Names}}' | grep -qx "$MYSQL_CONTAINER"; then
  echo "Container '$MYSQL_CONTAINER' não está em execução."
  exit 1
fi

if [[ ! -f "$SQL_FILE" ]]; then
  echo "Arquivo SQL não encontrado: $SQL_FILE"
  exit 1
fi

docker exec -i "$MYSQL_CONTAINER" mysql \
  --default-character-set=utf8mb4 \
  -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" < "$SQL_FILE"

echo "Schema importado com sucesso no banco do container '$MYSQL_CONTAINER'."