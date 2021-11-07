
#!/bin/bash

# Exit on first error
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)

docker-compose down
docker volume prune -f
docker-compose up -d

sleep 5
docker ps