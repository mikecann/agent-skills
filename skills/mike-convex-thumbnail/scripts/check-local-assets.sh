#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: bash scripts/check-local-assets.sh [options]

Validate Mike's local thumbnail assets on macOS and print their absolute paths.

Options:
  --photo-dir PATH  Override the Google Drive cutout photo folder
  --asset-dir PATH  Override the Convex brand asset folder
  -h, --help        Show this help

Environment overrides:
  MIKE_THUMBNAIL_PHOTO_DIR
  MIKE_THUMBNAIL_ASSET_DIR
EOF
}

fail() {
  printf 'Error: %s\n' "$*" >&2
  exit 1
}

photo_dir="${MIKE_THUMBNAIL_PHOTO_DIR:-}"
asset_dir="${MIKE_THUMBNAIL_ASSET_DIR:-$HOME/Assets/Images}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --photo-dir)
      [[ $# -ge 2 ]] || fail "--photo-dir requires a path"
      photo_dir="$2"
      shift 2
      ;;
    --asset-dir)
      [[ $# -ge 2 ]] || fail "--asset-dir requires a path"
      asset_dir="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "unknown option: $1"
      ;;
  esac
done

if [[ -z "$photo_dir" ]]; then
  shopt -s nullglob
  photo_candidates=()

  for drive_root in "$HOME"/Library/CloudStorage/GoogleDrive-*; do
    candidate="$drive_root/My Drive/Personal/Photos of Me/convex/Backgrounds Removed"
    if [[ -d "$candidate" ]]; then
      photo_candidates+=("$candidate")
    fi
  done

  case "${#photo_candidates[@]}" in
    0)
      fail "could not find the Google Drive cutout folder under ~/Library/CloudStorage/GoogleDrive-*"
      ;;
    1)
      photo_dir="${photo_candidates[0]}"
      ;;
    *)
      printf 'Found more than one Google Drive cutout folder:\n' >&2
      printf '  %s\n' "${photo_candidates[@]}" >&2
      fail "choose one with --photo-dir"
      ;;
  esac
fi

required_assets=(
  "$asset_dir/symbol-color (1).png"
  "$asset_dir/logo-color.png"
  "$asset_dir/wordmark-white.png"
  "$asset_dir/symbol-white.png"
)

preferred_photos=(
  "$photo_dir/WIN_20250626_10_41_38_Pro.png"
  "$photo_dir/WIN_20250626_10_39_35_Pro.png"
  "$photo_dir/WIN_20250701_07_35_49_Pro.png"
  "$photo_dir/WIN_20250701_07_36_01_Pro.png"
  "$photo_dir/WIN_20250701_07_34_53_Pro.png"
)

missing=()

if [[ ! -d "$photo_dir" ]]; then
  missing+=("$photo_dir")
fi

if [[ ! -d "$asset_dir" ]]; then
  missing+=("$asset_dir")
fi

for file_path in "${required_assets[@]}" "${preferred_photos[@]}"; do
  if [[ ! -f "$file_path" ]]; then
    missing+=("$file_path")
  fi
done

if [[ ${#missing[@]} -gt 0 ]]; then
  printf 'Missing Mike/Convex thumbnail assets:\n' >&2
  printf '  %s\n' "${missing[@]}" >&2
  exit 1
fi

printf 'Mike/Convex thumbnail assets found.\n\n'
printf 'Mike photo folder:\n  %s\n\n' "$photo_dir"
printf 'Preferred Mike photos:\n'
printf '  %s\n' "${preferred_photos[@]}"
printf '\nConvex brand assets:\n'
printf '  %s\n' "${required_assets[@]}"
