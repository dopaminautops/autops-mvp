#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

if [ ! -d ".venv" ]; then
  python3 -m venv .venv
fi

. .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Run uvicorn (exec replaces the shell so the process shows up as uvicorn)
exec uvicorn main:app --reload --host 0.0.0.0 --port 8002
