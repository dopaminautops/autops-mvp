#!/usr/bin/env bash
set -u

# Suspend (SIGSTOP) dev servers without killing them.
# - Stores PIDs into .suspended_pids for resume
# - Uses ports from env or defaults VITE_PORT=5173 UVICORN_PORT=8000

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SUSPEND_FILE="$ROOT_DIR/.suspended_pids"
mkdir -p "$ROOT_DIR"

VITE_PORT=${VITE_PORT:-5173}
UVICORN_PORT=${UVICORN_PORT:-8000}

echo "Pausing dev servers (Vite port: $VITE_PORT, Uvicorn port: $UVICORN_PORT)"
>"$SUSPEND_FILE"

find_and_stop() {
  local pattern="$1"
  local port="$2"
  local name="$3"
  local pid=""

  if [[ -n "$port" ]]; then
    pid=$(lsof -t -i :$port 2>/dev/null || true)
  fi

  if [[ -z "$pid" ]]; then
    pid=$(pgrep -af "$pattern" | awk '{print $1}' | head -n 1 || true)
  fi

  if [[ -n "$pid" ]]; then
    echo "$name:$pid" >>"$SUSPEND_FILE"
    echo "Stopping $name (PID $pid)";
    kill -STOP "$pid" || echo "Failed to STOP $pid (maybe permissions)";
  else
    echo "No $name process found to suspend.";
  fi
}

find_and_stop "vite" "$VITE_PORT" "vite"
find_and_stop "uvicorn" "$UVICORN_PORT" "uvicorn"

if [[ -s "$SUSPEND_FILE" ]]; then
  echo "Saved suspended PIDs to $SUSPEND_FILE"
  cat "$SUSPEND_FILE"
else
  echo "No processes were suspended. $SUSPEND_FILE is empty.";
fi

echo "To resume later: ./scripts/resume-servers.sh" 
