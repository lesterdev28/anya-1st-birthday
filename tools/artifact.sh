#!/usr/bin/env bash
#
# Builds the invitation for publishing as a Claude artifact.
#
# Two differences from `npm run build`. The bundle is built with a relative base, because
# an artifact is served from a path rather than from the root of a domain. And the handful
# of absolute paths that live in strings rather than in imports — the audio, the photos,
# the fonts — are rewritten afterwards, because Vite's `base` only rewrites what it can
# see in the module graph and those are looked up at runtime.
set -euo pipefail

cd "$(dirname "$0")/.."
out="dist-artifact"

rm -rf "$out"
npx vite build --base=./ --outDir "$out"

# Runtime string paths, which `base` never touched.
#
# Each grep is allowed to find nothing. Under `set -e` a grep that matches nothing exits
# 1 and takes the whole script with it, which once meant a build where Vite had started
# rewriting the font URLs itself silently skipped every rewrite after that line — and the
# share-preview path, the last one, was the one that mattered.
rewrite() {
  local pattern=$1 replacement=$2
  shift 2
  local files
  files=$(grep -rl "$pattern" "$@" || true)
  [ -n "$files" ] && echo "$files" | xargs sed -i "s#$pattern#$replacement#g"
  return 0
}

rewrite '"/invitation/' '"invitation/' "$out/assets"
rewrite '(/fonts/' '(fonts/' "$out/assets"
rewrite 'href="/fonts/' 'href="fonts/' "$out/index.html"
# The share-preview image, which is a meta tag rather than an asset Vite rewrites.
rewrite 'content="/invitation/' 'content="invitation/' "$out/index.html"

# Nothing may reach the artifact still pointing at the root of a domain.
if grep -rq '"/invitation/\|content="/invitation/\|href="/fonts/' "$out"; then
  echo "error: absolute paths survived the rewrite" >&2
  grep -rn '"/invitation/\|content="/invitation/\|href="/fonts/' "$out" | head >&2
  exit 1
fi

echo
echo "$out ready:"
find "$out" -type f | sed "s#^$out/##" | sort
