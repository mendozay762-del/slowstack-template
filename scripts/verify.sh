#!/usr/bin/env bash
# Pre-push verification: lint + build.
# Run via `npm run verify` before pushing to catch failures locally
# instead of in a Vercel deploy cycle.

set -euo pipefail

echo "→ Linting..."
npm run lint

echo ""
echo "→ Building..."
npm run build

echo ""
echo "✅ Ready to push"
