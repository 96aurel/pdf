const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const sharp = require('sharp');
const upload = require('../middleware/upload');
const { deleteFiles } = require('../middleware/cleanup');

// POST /to-pdf — Convert image or text to PDF
router.post('/to-pdf', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  try {
    const ext = path.extname(file.originalname).toLowerCase();
    const doc = await PDFDocument.create();

    if (['.jpg', '.jpeg', '.png', '.webp', '.bmp'].includes(ext)) {
      // Convert image to PDF
      let imageBytes = fs.readFileSync(file.path);

      // Normalize to PNG/JPG for pdf-lib
      let embeddedImage;
      if (ext === '.png') {
        embeddedImage = await doc.embedPng(imageBytes);
      } else {
        // Convert to JPEG via sharp
        const jpegBuffer = await sharp(imageBytes).jpeg({ quality: 90 }).toBuffer();
        embeddedImage = await doc.embedJpg(jpegBuffer);
      }

      const { width, height } = embeddedImage;
      const page = doc.addPage([width, height]);
      page.drawImage(embeddedImage, { x: 0, y: 0, width, height });

    } else if (ext === '.txt' || ext === '.html') {
      let content = fs.readFileSync(file.path, 'utf-8');
      if (ext === '.html') {
        // Strip HTML tags
        content = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      }
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const margin = 50;
      const pageWidth = 595;
      const pageHeight = 842;
      const lineHeight = fontSize * 1.4;
      const maxWidth = pageWidth - margin * 2;

      const words = content.split(/\s+/);
      const lines = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      let page = doc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      for (const line of lines) {
        if (y < margin) {
          page = doc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
        y -= lineHeight;
      }

    } else if (ext === '.docx') {
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ path: file.path });
      const content = result.value;
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      const margin = 50;
      const pageWidth = 595;
      const pageHeight = 842;
      const lineHeight = fontSize * 1.4;
      const maxWidth = pageWidth - margin * 2;

      const words = content.split(/\s+/);
      const lines = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      let page = doc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - margin;

      for (const line of lines) {
        if (y < margin) {
          page = doc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
        y -= lineHeight;
      }

    } else if (ext === '.xlsx') {
      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(file.path);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const fontSize = 10;
      const margin = 30;
      const pageWidth = 842;
      const pageHeight = 595;
      const lineHeight = fontSize * 1.6;

      workbook.eachSheet((sheet) => {
        let page = doc.addPage([pageWidth, pageHeight]);
        let y = pageHeight - margin;

        page.drawText(`Feuille: ${sheet.name}`, { x: margin, y, size: fontSize + 2, font, color: rgb(0.2, 0.2, 0.8) });
        y -= lineHeight * 1.5;

        sheet.eachRow((row) => {
          if (y < margin) {
            page = doc.addPage([pageWidth, pageHeight]);
            y = pageHeight - margin;
          }
          // exceljs row.values is 1-indexed; index 0 is always undefined
          const rowText = row.values
            .slice(1)
            .map(cell => (cell !== undefined && cell !== null ? String(cell) : ''))
            .join(' | ');
          const truncated = rowText.length > 100 ? rowText.substring(0, 100) + '...' : rowText;
          page.drawText(truncated, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
          y -= lineHeight;
        });
      });
    } else {
      deleteFiles(file.path);
      return res.status(400).json({ error: 'Format non supporté' });
    }

    const pdfBytes = await doc.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${path.basename(file.originalname, ext)}.pdf"`,
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la conversion' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /from-pdf — Convert PDF to text or image
router.post('/from-pdf', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  const { format = 'txt' } = req.body;
  try {
    const bytes = fs.readFileSync(file.path);

    if (format === 'txt' || format === 'html') {
      const doc = await PDFDocument.load(bytes);
      const pageCount = doc.getPageCount();
      const content = format === 'html'
        ? `<!DOCTYPE html><html><body><p>PDF avec ${pageCount} page(s). Utilisez l'outil OCR pour extraire le texte d'un PDF scanné.</p></body></html>`
        : `PDF avec ${pageCount} page(s).\n\nPour extraire le texte d'un PDF numérisé, utilisez l'outil OCR.`;

      const contentType = format === 'html' ? 'text/html' : 'text/plain';
      const filename = format === 'html' ? 'converti.html' : 'converti.txt';
      res.set({
        'Content-Type': `${contentType}; charset=utf-8`,
        'Content-Disposition': `attachment; filename="${filename}"`,
      });
      res.send(content);

    } else if (format === 'jpg' || format === 'png') {
      // Create a simple image representation
      const doc = await PDFDocument.load(bytes);
      const pageCount = doc.getPageCount();
      const firstPage = doc.getPages()[0];
      const { width, height } = firstPage.getSize();

      // Generate a placeholder image with page info using sharp
      const imgWidth = Math.min(Math.round(width), 1240);
      const imgHeight = Math.min(Math.round(height), 1754);

      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${imgWidth}" height="${imgHeight}">
        <rect width="100%" height="100%" fill="white"/>
        <text x="50%" y="45%" font-family="Arial" font-size="24" fill="#333" text-anchor="middle">PDF - ${pageCount} page(s)</text>
        <text x="50%" y="55%" font-family="Arial" font-size="16" fill="#666" text-anchor="middle">Utilisez OCR pour extraire le texte</text>
      </svg>`;

      const imgBuffer = await sharp(Buffer.from(svgContent))
        .toFormat(format)
        .toBuffer();

      res.set({
        'Content-Type': format === 'jpg' ? 'image/jpeg' : 'image/png',
        'Content-Disposition': `attachment; filename="converti.${format}"`,
      });
      res.send(imgBuffer);
    } else {
      return res.status(400).json({ error: 'Format non supporté' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la conversion' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /image — Convert image format
router.post('/image', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  const { format = 'png', quality = '85' } = req.body;
  try {
    let sharpInstance = sharp(file.path);
    const q = Math.min(100, Math.max(1, parseInt(quality)));

    switch (format.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: q });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality: q });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: q });
        break;
      case 'gif':
        sharpInstance = sharpInstance.gif();
        break;
      case 'bmp':
        sharpInstance = sharpInstance.bmp();
        break;
      default:
        sharpInstance = sharpInstance.png();
    }

    const buffer = await sharpInstance.toBuffer();
    const mime = format === 'jpg' || format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
    res.set({
      'Content-Type': mime,
      'Content-Disposition': `attachment; filename="converti.${format}"`,
    });
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la conversion' });
  } finally {
    deleteFiles(file.path);
  }
});

module.exports = router;
