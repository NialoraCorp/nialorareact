#!/usr/bin/env bash
# Build çıktısını (dist/) GitHub'daki `deploy` dalına yayınlar. Plesk → Git bu dalı httpdocs'a çeker.
#   npm run deploy
set -euo pipefail
cd "$(dirname "$0")/.."
BRANCH="${DEPLOY_BRANCH:-deploy}"
SRC_SHA="$(git rev-parse --short HEAD)"
npm run build >/dev/null
TMP="$(mktemp -d)"
trap 'git worktree remove --force "$TMP" >/dev/null 2>&1 || true' EXIT
if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
  git fetch -q origin "$BRANCH"
  git worktree add -q "$TMP" "origin/$BRANCH"
else
  git worktree add -q --detach "$TMP"
  git -C "$TMP" checkout -q --orphan "$BRANCH"
  git -C "$TMP" rm -rfq . >/dev/null 2>&1 || true
fi
# eski içerik temizlenir, dist kopyalanır (kullanılmayan eski videolar hariç)
find "$TMP" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
rsync -a --exclude 'bg-mobile.gif' --exclude 'bg-mobile.mp4' --exclude 'bg-mobile.webm' --exclude 'bg-new.mp4' --exclude 'bg.mp4' --exclude '.DS_Store' dist/ "$TMP"/
git -C "$TMP" add -A
if git -C "$TMP" diff --cached --quiet; then echo "deploy: değişiklik yok"; exit 0; fi
git -C "$TMP" -c user.name="$(git config user.name)" -c user.email="$(git config user.email)" commit -q -m "Deploy ${SRC_SHA}" -m "Built from main@${SRC_SHA}"
git -C "$TMP" push -q origin "HEAD:refs/heads/$BRANCH"
echo "deploy: origin/$BRANCH ← main@${SRC_SHA}"
