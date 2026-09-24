#!/usr/bin/env bash
# ==============================================================================
# Cloudflare Tunnel Launcher for Engineering Practice Engine
# ==============================================================================
set -euo pipefail

PORT="${1:-3000}"
MODE="${2:-quick}" # quick, config, token
TOKEN="${3:-}"

echo "============================================================"
echo "    Cloudflare Tunnel for Engineering Practice Engine       "
echo "============================================================"

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "[ERROR] 'cloudflared' could not be found."
    echo "Install it via your package manager or from: https://github.com/cloudflare/cloudflared/releases"
    exit 1
fi

echo "[INFO] Detected $(cloudflared --version)"

# Check if local port is active
if command -v nc &> /dev/null; then
    if nc -z 127.0.0.1 "$PORT" 2>/dev/null; then
        echo "[SUCCESS] Local Next.js app is listening on http://localhost:$PORT"
    else
        echo "[WARNING] No active service detected on http://localhost:$PORT. Ensure 'npm run dev' is running."
    fi
fi

echo ""

case "$MODE" in
    quick)
        echo "[MODE] Starting Quick Cloudflare Tunnel for http://localhost:$PORT..."
        echo "[INFO] A public https://*.trycloudflare.com URL will be displayed below."
        echo "------------------------------------------------------------"
        exec cloudflared tunnel --url "http://localhost:$PORT"
        ;;
    config)
        CONFIG_PATH="$(dirname "$0")/../cloudflare/config.yml"
        if [ ! -f "$CONFIG_PATH" ]; then
            echo "[ERROR] Config file not found at $CONFIG_PATH"
            exit 1
        fi
        echo "[MODE] Starting Named Cloudflare Tunnel with config: $CONFIG_PATH"
        exec cloudflared tunnel --config "$CONFIG_PATH" run
        ;;
    token)
        if [ -z "$TOKEN" ]; then
            echo "[ERROR] Token required for token mode."
            echo "Usage: ./scripts/start-cloudflare-tunnel.sh <PORT> token <TOKEN>"
            exit 1
        fi
        echo "[MODE] Starting Cloudflare Tunnel with Zero Trust Token..."
        exec cloudflared tunnel run --token "$TOKEN"
        ;;
    *)
        echo "[ERROR] Unknown mode '$MODE'. Use 'quick', 'config', or 'token'."
        exit 1
        ;;
esac
