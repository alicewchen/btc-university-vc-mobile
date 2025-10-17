#!/usr/bin/env bash
# Generate a short, optimized GIF preview from the hosted demo MP4.
# Requirements: curl (or wget), ffmpeg, gifsicle (optional but recommended)

set -euo pipefail

OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/assets"
mkdir -p "$OUT_DIR"

VIDEO_URL_RAW="https://link.storjshare.io/raw/jw6goid3wpkbztskdbzkvfeva75q/vc-mobile/videos/20251017%20Bitcoin%20University%20Mobile%20Video%20Demo.mp4"

# Create a portable temp dir (works on macOS and Linux)
TMP_DIR=$(mktemp -d 2>/dev/null || { echo "Failed to create temp dir" >&2; exit 1; })
TMP_VIDEO="$TMP_DIR/demo.mp4"
TMP_GIF="$TMP_DIR/demo.gif"
FINAL_GIF="$OUT_DIR/demo-preview.gif"

cleanup() {
  rm -rf "$TMP_DIR" || true
}
trap cleanup EXIT

echo "Checking dependencies..."
if ! command -v curl >/dev/null 2>&1; then
  echo "Error: curl is required. Install it and re-run." >&2
  exit 2
fi
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg is required. Install it (e.g. brew install ffmpeg) and re-run." >&2
  exit 2
fi

echo "Downloading demo video..."
curl -L "$VIDEO_URL_RAW" -o "$TMP_VIDEO"

echo "Creating GIF (this may take a while)..."
# Extract a short 4-second clip starting at 3s, scale to width 720 while preserving aspect, 15 fps
ffmpeg -y -ss 3 -t 4 -i "$TMP_VIDEO" -vf "scale=720:-1:flags=lanczos,fps=15" -gifflags -transdiff "$TMP_GIF"

if command -v gifsicle >/dev/null 2>&1; then
  echo "Optimizing GIF with gifsicle..."
  gifsicle -O3 "$TMP_GIF" -o "$FINAL_GIF"
else
  echo "gifsicle not found, moving generated GIF without extra optimization"
  mv "$TMP_GIF" "$FINAL_GIF"
fi

echo "GIF saved to: $FINAL_GIF"
echo "Done. Add $FINAL_GIF to Git if you want it committed to the repo."
