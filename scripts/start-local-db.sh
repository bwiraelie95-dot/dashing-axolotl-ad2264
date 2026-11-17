#!/usr/bin/env bash
set -euo pipefail
project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
db_dir="$project_dir/.local-db"
if mariadb-admin --no-defaults --socket="$db_dir/run/mysql.sock" ping >/dev/null 2>&1; then
  echo 'ACV MariaDB is already running on port 3307.'
  exit 0
fi
if [ ! -d "$db_dir/data/mysql" ]; then
  echo 'Local database is not initialized.' >&2
  exit 1
fi
mkdir -p "$db_dir/run"
db_command=("$(command -v mariadbd)" --no-defaults --datadir="$db_dir/data" --socket="$db_dir/run/mysql.sock" --pid-file="$db_dir/run/mysql.pid" --port=3307 --bind-address=127.0.0.1 --log-error="$db_dir/server.log")
# A user service survives the terminal or development tool that launched it.
if command -v systemd-run >/dev/null && systemctl --user show-environment >/dev/null 2>&1; then
  unit="acv-mysql-$(printf '%s' "$project_dir" | sha256sum | cut -c1-12)"
  if ! systemctl --user is-active --quiet "$unit"; then
    systemd-run --user --unit="$unit" --collect --property=Restart=on-failure --property=RestartSec=3 "${db_command[@]}"
  fi
else
  nohup "${db_command[@]}" > "$db_dir/launcher.log" 2>&1 < /dev/null &
fi
for attempt in {1..50}; do
  if mariadb-admin --no-defaults --socket="$db_dir/run/mysql.sock" ping >/dev/null 2>&1; then
    echo 'ACV MariaDB ready on 127.0.0.1:3307.'
    exit 0
  fi
  sleep 0.2
done
echo 'Database startup failed. See .local-db/server.log.' >&2
exit 1
