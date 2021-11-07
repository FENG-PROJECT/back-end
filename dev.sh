#!/bin/bash

# Exit on first error
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)

# Delete services (optional)
pm2 delete ecosystem.config.yaml

# Clear logs (optional)
rm -rf ./logs
rm -rf ~/.pm2/logs/*
pm2 flush

# Start services
pm2 start ecosystem.config.yaml

# Watch logs
pm2 logs
