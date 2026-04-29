#!/bin/bash
# Run the Instagram scraper with retry logic.
# Usage: bash run_scraper.sh
# Run this after Instagram's rate limit clears (usually 30-60 minutes).

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Label Gabriel Scraper ==="
echo "Will scrape https://www.instagram.com/label_gabriel/"
echo ""

cd "$SCRIPT_DIR"
pip install -r requirements.txt -q

# Run with conservative delays baked into the script
python scrape.py label_gabriel

# If successful, copy images to website/public/
if [ $? -eq 0 ]; then
    echo ""
    echo "→ Copying images to website/public/images/"
    mkdir -p "$PROJECT_DIR/website/public/images"
    cp "$PROJECT_DIR/data/images/"*.jpg "$PROJECT_DIR/website/public/images/" 2>/dev/null || true
    echo "✓ Done. Run 'cd website && npm run dev' to see the full site."
fi
