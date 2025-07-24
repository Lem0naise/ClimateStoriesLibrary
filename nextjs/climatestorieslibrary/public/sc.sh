#!/bin/bash

# Script to generate various favicon sizes from a source favicon.ico file.
# Requires ImageMagick to be installed.

# Usage: ./generate_favicons.sh input_favicon.ico [output_directory]

# --- Configuration ---
SOURCE_FAVICON="$1"
OUTPUT_DIR="${2:-favicons}" # Default output directory is 'favicons'

# Array of desired favicon sizes (widthxheight)
# Common sizes for web development:
# 16x16 (standard), 32x32 (retina), 48x48 (chrome), 64x64, 128x128, 192x192 (PWA), 512x512 (splash screen)
# Apple Touch Icons: 180x180
FAVICON_SIZES=(
    "16x16"
    "32x32"
    "48x48"
    "64x64"
    "96x96"
    "128x128"
    "192x192"
    "256x256"
    "384x384"
    "512x512"
    "180x180" # Apple Touch Icon
)

# --- Script Logic ---

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick (convert command) is not installed."
    echo "Please install it before running this script."
    exit 1
fi

# Check if a source favicon is provided
if [ -z "$SOURCE_FAVICON" ]; then
    echo "Usage: $0 <input_favicon.ico> [output_directory]"
    echo "Example: $0 favicon.ico public/images/favicons"
    exit 1
fi

# Check if the source favicon exists
if [ ! -f "$SOURCE_FAVICON" ]; then
    echo "Error: Source favicon '$SOURCE_FAVICON' not found."
    exit 1
fi

# Create the output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

echo "Generating favicons from '$SOURCE_FAVICON' into '$OUTPUT_DIR'..."

# Generate standard ICO file with multiple sizes
convert "$SOURCE_FAVICON" \
    -define icon:auto-resize="${FAVICON_SIZES[*]}" \
    "${OUTPUT_DIR}/favicon.ico"

echo "Generated: ${OUTPUT_DIR}/favicon.ico (multi-sized ICO)"

# Generate individual PNG files for various sizes
for size in "${FAVICON_SIZES[@]}"; do
    width=$(echo "$size" | cut -d'x' -f1)
    height=$(echo "$size" | cut -d'x' -f2)
    output_filename="${OUTPUT_DIR}/favicon-${width}x${height}.png"

    convert "$SOURCE_FAVICON" -resize "${width}x${height}" "$output_filename"
    echo "Generated: $output_filename"
done

# Generate Apple Touch Icon
convert "$SOURCE_FAVICON" -resize 180x180 "${OUTPUT_DIR}/apple-touch-icon.png"
echo "Generated: ${OUTPUT_DIR}/apple-touch-icon.png (Apple Touch Icon)"

echo "Favicon generation complete!"
echo "Remember to link these favicons in your HTML:"
echo '<link rel="icon" href="/favicons/favicon.ico" sizes="any">'
echo '<link rel="icon" href="/favicons/favicon-16x16.png" type="image/png" sizes="16x16">'
echo '<link rel="icon" href="/favicons/favicon-32x32.png" type="image/png" sizes="32x32">'
echo '<link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png">'
echo '<link rel="manifest" href="/site.webmanifest"> (For PWA, if you have one)'
