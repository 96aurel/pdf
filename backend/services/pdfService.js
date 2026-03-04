const fs = require('fs');
const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');

async function loadPDF(filePath) {
  const bytes = fs.readFileSync(filePath);
  return PDFDocument.load(bytes);
}

function parsePageRanges(rangeStr, totalPages) {
  if (!rangeStr || !rangeStr.trim()) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }
  const pages = new Set();
  rangeStr.split(',').forEach(part => {
    part = part.trim();
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim()) - 1);
      for (let i = start; i <= Math.min(end, totalPages - 1); i++) {
        if (i >= 0) pages.add(i);
      }
    } else {
      const p = parseInt(part) - 1;
      if (p >= 0 && p < totalPages) pages.add(p);
    }
  });
  return Array.from(pages).sort((a, b) => a - b);
}

module.exports = { loadPDF, parsePageRanges };
