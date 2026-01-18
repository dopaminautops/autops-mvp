#!/usr/bin/env bash
set -u

# Resume (SIGCONT) previously suspended dev servers.
# - Reads PIDs from .suspended_pids if available
# - Falls back to pattern resume if file missing

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SUSPEND_FILE="$ROOT_DIR/.suspended_pids"

VITE_PATTERN=${VITE_PATTERN:-"vite"}
UVICORN_PATTERN=${UVICORN_PATTERN:-"uvicorn"}

echo "Resuming dev servers (patterns: $VITE_PATTERN, $UVICORN_PATTERN)"

if [[ -f "$SUSPEND_FILE" && -s "$SUSPEND_FILE" ]]; then
  while IFS=: read -r name pid; do
    if [[ -n "$pid" && $(ps -o stat= -p "$pid" 2>/dev/null || true) ]]; then
      echo "Resuming $name (PID $pid)"
      kill -CONT "$pid" || echo "Failed to CONT $pid";
    else
      echo "PID $pid for $name not found or process exited; trying pattern resume.";
      pkill -CONT -f "$name" || true
    fi
  done <"$SUSPEND_FILE"
  rm -f "$SUSPEND_FILE"
else
  echo "No suspend file found, resuming by pattern..."
  pkill -CONT -f "$VITE_PATTERN" || true
  pkill -CONT -f "$UVICORN_PATTERN" || true
fi

echo "Resume attempt complete. Check process state with ps or ss." 
