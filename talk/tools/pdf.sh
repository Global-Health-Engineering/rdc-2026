#!/bin/sh
# Print a rendered reveal.js deck to a 16:9 PDF, one page per slide.
# Usage: sh tools/pdf.sh <deck.html> <deck.pdf>
set -e
node "$(dirname "$0")/pdf.mjs" "$1" "$2"
