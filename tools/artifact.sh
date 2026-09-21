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
grep -rl '"/invitation/' "$out/assets" | xargs -r sed -i 's#"/invitation/#"invitation/#g'
grep -rl '(/fonts/' "$out/assets" | xargs -r sed -i 's#(/fonts/#(fonts/#g'
sed -i 's#href="/fonts/#href="fonts/#g' "$out/index.html"
# The share-preview image, which is a meta tag rather than an asset Vite rewrites.
sed -i 's#content="/invitation/#content="invitation/#g' "$out/index.html"

echo
echo "$out ready:"
find "$out" -type f | sed "s#^$out/##" | sort
