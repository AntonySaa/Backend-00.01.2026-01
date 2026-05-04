#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRV_PID_FILE="/tmp/courier-safe-server.pid"
LOG_FILE="/tmp/courier-safe.log"
PORT="${PORT:-3000}"
HOST="${HOST:-127.0.0.1}"

while true; do
  cd "$ROOT_DIR" || exit 1
  HOST="$HOST" PORT="$PORT" node src/server.js >>"$LOG_FILE" 2>&1 &
  child_pid=$!
  echo "$child_pid" >"$SRV_PID_FILE"

  wait "$child_pid"
  exit_code=$?
  printf '[%s] reinicio: node salio con codigo %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$exit_code" >>"$LOG_FILE"
  sleep 1
done
