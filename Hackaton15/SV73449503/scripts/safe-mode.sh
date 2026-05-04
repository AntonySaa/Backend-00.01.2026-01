#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SUP_PID_FILE="/tmp/courier-safe-supervisor.pid"
SRV_PID_FILE="/tmp/courier-safe-server.pid"
LOG_FILE="/tmp/courier-safe.log"
SUP_LOG_FILE="/tmp/courier-safe-supervisor.log"

is_running() {
  local pid="$1"
  [[ -n "$pid" ]] && kill -0 "$pid" >/dev/null 2>&1
}

start_safe() {
  if [[ -f "$SUP_PID_FILE" ]]; then
    local current
    current="$(cat "$SUP_PID_FILE" 2>/dev/null || true)"
    if is_running "$current"; then
      echo "SAFE_MODE ya activo. supervisor_pid=$current"
      exit 0
    fi
  fi

  : >"$SUP_LOG_FILE"
  nohup bash "$ROOT_DIR/scripts/safe-supervisor.sh" >>"$SUP_LOG_FILE" 2>&1 &
  local sup_pid=$!
  echo "$sup_pid" >"$SUP_PID_FILE"

  sleep 1
  if is_running "$sup_pid"; then
    echo "SAFE_MODE activo. supervisor_pid=$sup_pid"
    echo "Server log: $LOG_FILE"
    echo "Supervisor log: $SUP_LOG_FILE"
  else
    echo "No se pudo iniciar SAFE_MODE. Revisa: $SUP_LOG_FILE"
    exit 1
  fi
}

stop_safe() {
  local sup=""
  local srv=""

  [[ -f "$SUP_PID_FILE" ]] && sup="$(cat "$SUP_PID_FILE" 2>/dev/null || true)"
  [[ -f "$SRV_PID_FILE" ]] && srv="$(cat "$SRV_PID_FILE" 2>/dev/null || true)"

  if is_running "$sup"; then
    kill "$sup" || true
    echo "Supervisor detenido: $sup"
  fi

  if is_running "$srv"; then
    kill "$srv" || true
    echo "Servidor detenido: $srv"
  fi

  rm -f "$SUP_PID_FILE" "$SRV_PID_FILE"
}

status_safe() {
  local sup=""
  local srv=""
  [[ -f "$SUP_PID_FILE" ]] && sup="$(cat "$SUP_PID_FILE" 2>/dev/null || true)"
  [[ -f "$SRV_PID_FILE" ]] && srv="$(cat "$SRV_PID_FILE" 2>/dev/null || true)"

  if is_running "$sup"; then
    echo "Supervisor: ACTIVO (pid=$sup)"
  else
    echo "Supervisor: INACTIVO"
  fi

  if is_running "$srv"; then
    echo "Servidor: ACTIVO (pid=$srv)"
  else
    echo "Servidor: INACTIVO"
  fi

  echo "Server log: $LOG_FILE"
  echo "Supervisor log: $SUP_LOG_FILE"
}

case "${1:-}" in
  start)
    start_safe
    ;;
  stop)
    stop_safe
    ;;
  restart)
    stop_safe
    start_safe
    ;;
  status)
    status_safe
    ;;
  *)
    echo "Uso: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac
