#!/usr/bin/env bash
set -euo pipefail

# Converts local raster images to modern formats:
# - PNG  -> lossless AVIF + lossless WebP
# - JPEG -> high-quality AVIF + high-quality WebP (JPEG is already lossy)
# Outputs are written next to the originals as "name.avif" and "name.webp".

usage() {
  cat <<'EOF'
Usage: tools/convert-images.sh [--all] [path ...]

Options:
  --all     Re-encode even if outputs already exist and are newer.

Args:
  path      Optional file or directory paths to scan.
            Defaults to the repository root.

Examples:
  tools/convert-images.sh
  tools/convert-images.sh images/
  tools/convert-images.sh --all images/
EOF
}

FORCE=0
TARGETS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      usage
      exit 0
      ;;
    --all)
      FORCE=1
      shift
      ;;
    *)
      TARGETS+=("$1")
      shift
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ ${#TARGETS[@]} -eq 0 ]]; then
  TARGETS=("$REPO_ROOT")
else
  # Normalize relative paths to be relative to repo root.
  for i in "${!TARGETS[@]}"; do
    if [[ "${TARGETS[$i]}" != /* ]]; then
      TARGETS[$i]="$REPO_ROOT/${TARGETS[$i]}"
    fi
  done
fi

if ! command -v avifenc >/dev/null 2>&1; then
  echo "Missing 'avifenc'. Install with: brew install libavif" >&2
  exit 1
fi

if ! command -v cwebp >/dev/null 2>&1; then
  echo "Missing 'cwebp'. Install with: brew install webp" >&2
  exit 1
fi

# Encoders
encode_avif() {
  local input="$1"; local output="$2"; local ext="$3"
  if [[ "$ext" == "png" ]]; then
    avifenc -l -s 6 -j all "$input" "$output" >/dev/null
  else
    avifenc -q 95 -s 6 -j all "$input" "$output" >/dev/null
  fi
}

encode_webp() {
  local input="$1"; local output="$2"; local ext="$3"
  if [[ "$ext" == "png" ]]; then
    cwebp -lossless -z 9 "$input" -o "$output" >/dev/null
  else
    cwebp -q 92 "$input" -o "$output" >/dev/null
  fi
}

should_write() {
  local input="$1"; local output="$2"
  if [[ $FORCE -eq 1 ]]; then
    return 0
  fi
  if [[ ! -f "$output" ]]; then
    return 0
  fi
  # Rebuild if input is newer than output
  if [[ "$input" -nt "$output" ]]; then
    return 0
  fi
  return 1
}

converted=0
skipped=0
errors=0

# Find images under the given targets. Use -print0 to safely handle spaces.
while IFS= read -r -d '' f; do
  # Skip already-generated outputs
  case "$f" in
    *.avif|*.webp) continue ;;
  esac

  ext="${f##*.}"
  ext_lc="$(printf '%s' "$ext" | tr '[:upper:]' '[:lower:]')"

  base="${f%.*}"
  avif_out="${base}.avif"
  webp_out="${base}.webp"

  did_something=0

  if should_write "$f" "$avif_out"; then
    if encode_avif "$f" "$avif_out" "$ext_lc"; then
      did_something=1
    else
      echo "AVIF encode failed: $f" >&2
      errors=$((errors + 1))
    fi
  fi

  if should_write "$f" "$webp_out"; then
    if encode_webp "$f" "$webp_out" "$ext_lc"; then
      did_something=1
    else
      echo "WebP encode failed: $f" >&2
      errors=$((errors + 1))
    fi
  fi

  if [[ $did_something -eq 1 ]]; then
    converted=$((converted + 1))
  else
    skipped=$((skipped + 1))
  fi

done < <(
  find "${TARGETS[@]}" \
    -type d \( -name .git -o -name node_modules -o -name dist -o -name build \) -prune -false \
    -o -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0
)

echo "Done. Updated: $converted | Up-to-date: $skipped | Errors: $errors"

if [[ $errors -gt 0 ]]; then
  exit 2
fi
