#!/bin/sh
# Render the deck, take the screenshots and print the PDF. Run from talk/deck-c.
set -e
/Applications/RStudio.app/Contents/Resources/app/quarto/bin/quarto render deck.qmd >/dev/null 2>&1
node ../tools/shot.mjs deck.html shots --early
sh ../tools/pdf.sh deck.html deck.pdf
pdfinfo deck.pdf | grep -E "Pages|Page size"
tr -d '\n ' < shots/report.json; echo
