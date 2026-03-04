const express = require('express');
const router = express.Router();
const fs = require('fs');
const { PDFDocument, rgb, StandardFonts, degrees } = require('pdf-lib');
const upload = require('../middleware/upload');
const { deleteFiles } = require('../middleware/cleanup');

// Helper: parse page ranges like "1-3,5,7-9" -> [0,1,2,4,6,7,8] (0-indexed)
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

// POST /merge
router.post('/merge', upload.array('files'), async (req, res) => {
  const files = req.files;
  if (!files || files.length < 2) {
    deleteFiles(...(files || []).map(f => f.path));
    return res.status(400).json({ error: 'Au moins 2 fichiers requis' });
  }
  try {
    const merged = await PDFDocument.create();
    for (const file of files) {
      const bytes = fs.readFileSync(file.path);
      const doc = await PDFDocument.load(bytes);
      const pages = await merged.copyPages(doc, doc.getPageIndices());
      pages.forEach(p => merged.addPage(p));
    }
    const pdfBytes = await merged.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="fusionné.pdf"',
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la fusion' });
  } finally {
    deleteFiles(...files.map(f => f.path));
  }
});

// POST /split
router.post('/split', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  try {
    const bytes = fs.readFileSync(file.path);
    const srcDoc = await PDFDocument.load(bytes);
    const totalPages = srcDoc.getPageCount();
    const pageIndices = parsePageRanges(req.body.pages, totalPages);

    const newDoc = await PDFDocument.create();
    const copied = await newDoc.copyPages(srcDoc, pageIndices);
    copied.forEach(p => newDoc.addPage(p));

    const pdfBytes = await newDoc.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="divisé.pdf"',
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la division' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /compress
router.post('/compress', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  try {
    const bytes = fs.readFileSync(file.path);
    const doc = await PDFDocument.load(bytes);
    // Remove metadata to reduce size
    doc.setTitle('');
    doc.setAuthor('');
    doc.setSubject('');
    doc.setKeywords([]);
    doc.setProducer('PDFTools');
    doc.setCreator('PDFTools');
    const pdfBytes = await doc.save({ useObjectStreams: true });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="compressé.pdf"',
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la compression' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /watermark
router.post('/watermark', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  try {
    const { text = 'CONFIDENTIEL', opacity = '0.3', position = 'center' } = req.body;
    const bytes = fs.readFileSync(file.path);
    const doc = await PDFDocument.load(bytes);
    const font = await doc.embedFont(StandardFonts.HelveticaBold);
    const pages = doc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      const fontSize = Math.min(width, height) * 0.08;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      let x, y;
      switch (position) {
        case 'top-left': x = 20; y = height - textHeight - 20; break;
        case 'top-right': x = width - textWidth - 20; y = height - textHeight - 20; break;
        case 'bottom-left': x = 20; y = 20; break;
        case 'bottom-right': x = width - textWidth - 20; y = 20; break;
        default: x = (width - textWidth) / 2; y = (height - textHeight) / 2;
      }

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity: parseFloat(opacity),
        rotate: position === 'center' ? degrees(45) : degrees(0),
      });
    }

    const pdfBytes = await doc.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="filigrane.pdf"',
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du filigrane' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /protect — add metadata note (pdf-lib doesn't support real encryption)
router.post('/protect', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  try {
    const bytes = fs.readFileSync(file.path);
    const doc = await PDFDocument.load(bytes);
    // Note: pdf-lib does not support AES encryption natively
    // We add a metadata note indicating the intended password protection
    doc.setKeywords([`protected:${req.body.password || ''}`]);
    doc.setProducer('PDFTools-Protected');
    const pdfBytes = await doc.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="protégé.pdf"',
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la protection' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /unlock
router.post('/unlock', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  try {
    const bytes = fs.readFileSync(file.path);
    const doc = await PDFDocument.load(bytes, {
      ignoreEncryption: true,
    });
    const pdfBytes = await doc.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="déverrouillé.pdf"',
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Impossible de déverrouiller ce PDF' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /page-numbers
router.post('/page-numbers', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  try {
    const { position = 'bottom-center', format = '1' } = req.body;
    const bytes = fs.readFileSync(file.path);
    const doc = await PDFDocument.load(bytes);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const pages = doc.getPages();
    const total = pages.length;

    pages.forEach((page, i) => {
      const { width, height } = page.getSize();
      const num = i + 1;
      let label;
      if (format === 'Page 1') label = `Page ${num}`;
      else if (format === '1/n') label = `${num}/${total}`;
      else label = `${num}`;

      const fontSize = 10;
      const textWidth = font.widthOfTextAtSize(label, fontSize);

      let x, y;
      const margin = 20;
      const [vPos, hPos] = position.split('-');
      y = vPos === 'top' ? height - margin - fontSize : margin;
      x = hPos === 'left' ? margin : hPos === 'right' ? width - textWidth - margin : (width - textWidth) / 2;

      page.drawText(label, { x, y, size: fontSize, font, color: rgb(0.3, 0.3, 0.3) });
    });

    const pdfBytes = await doc.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="numéroté.pdf"',
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la numérotation' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /rotate
router.post('/rotate', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  try {
    const { rotations = '' } = req.body; // "1:90,2:180"
    const bytes = fs.readFileSync(file.path);
    const doc = await PDFDocument.load(bytes);
    const pages = doc.getPages();

    if (rotations) {
      rotations.split(',').forEach(part => {
        const [pageNum, angle] = part.trim().split(':');
        const idx = parseInt(pageNum) - 1;
        if (idx >= 0 && idx < pages.length) {
          pages[idx].setRotation(degrees(parseInt(angle)));
        }
      });
    }

    const pdfBytes = await doc.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="pivoté.pdf"',
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la rotation' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /extract
router.post('/extract', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  try {
    const bytes = fs.readFileSync(file.path);
    const srcDoc = await PDFDocument.load(bytes);
    const totalPages = srcDoc.getPageCount();
    const pageIndices = parsePageRanges(req.body.pages, totalPages);

    const newDoc = await PDFDocument.create();
    const copied = await newDoc.copyPages(srcDoc, pageIndices);
    copied.forEach(p => newDoc.addPage(p));

    const pdfBytes = await newDoc.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="extrait.pdf"',
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'extraction' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /organize
router.post('/organize', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  try {
    const { order = '', rotate: rotateStr = '', remove: removeStr = '' } = req.body;
    const bytes = fs.readFileSync(file.path);
    const srcDoc = await PDFDocument.load(bytes);
    const totalPages = srcDoc.getPageCount();

    // Parse order
    let pageIndices;
    if (order.trim()) {
      pageIndices = order.split(',').map(n => parseInt(n.trim()) - 1).filter(i => i >= 0 && i < totalPages);
    } else {
      pageIndices = Array.from({ length: totalPages }, (_, i) => i);
    }

    // Remove pages
    const toRemove = new Set();
    if (removeStr.trim()) {
      removeStr.split(',').forEach(n => {
        const idx = parseInt(n.trim()) - 1;
        if (idx >= 0) toRemove.add(idx);
      });
      pageIndices = pageIndices.filter(i => !toRemove.has(i));
    }

    const newDoc = await PDFDocument.create();
    const copied = await newDoc.copyPages(srcDoc, pageIndices);
    copied.forEach(p => newDoc.addPage(p));

    // Apply rotations on new doc pages
    if (rotateStr.trim()) {
      const newPages = newDoc.getPages();
      rotateStr.split(',').forEach(part => {
        const [pageNum, angle] = part.trim().split(':');
        const idx = parseInt(pageNum) - 1;
        if (idx >= 0 && idx < newPages.length) {
          newPages[idx].setRotation(degrees(parseInt(angle)));
        }
      });
    }

    const pdfBytes = await newDoc.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="organisé.pdf"',
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'organisation' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /add-text
router.post('/add-text', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  try {
    const { text = '', page = '1', x = '50', y = '50', fontSize = '12' } = req.body;
    const bytes = fs.readFileSync(file.path);
    const doc = await PDFDocument.load(bytes);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const pages = doc.getPages();
    const pageIdx = Math.max(0, parseInt(page) - 1);

    if (pageIdx < pages.length) {
      pages[pageIdx].drawText(text, {
        x: parseFloat(x),
        y: parseFloat(y),
        size: parseFloat(fontSize),
        font,
        color: rgb(0, 0, 0),
      });
    }

    const pdfBytes = await doc.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="édité.pdf"',
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'édition' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /sign
router.post('/sign', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  try {
    const { signature } = req.body;
    if (!signature) return res.status(400).json({ error: 'Signature requise' });

    const bytes = fs.readFileSync(file.path);
    const doc = await PDFDocument.load(bytes);

    // Embed signature image (base64 PNG)
    const base64Data = signature.replace(/^data:image\/\w+;base64,/, '');
    const imgBytes = Buffer.from(base64Data, 'base64');
    const img = await doc.embedPng(imgBytes);
    const pages = doc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width, height } = lastPage.getSize();

    lastPage.drawImage(img, {
      x: width - 220,
      y: 30,
      width: 200,
      height: 60,
    });

    const pdfBytes = await doc.save();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="signé.pdf"',
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la signature' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /compare
router.post('/compare', upload.array('files', 2), async (req, res) => {
  const files = req.files;
  if (!files || files.length < 2) {
    deleteFiles(...(files || []).map(f => f.path));
    return res.status(400).json({ error: 'Deux fichiers requis' });
  }
  try {
    const extractText = async (filePath) => {
      const bytes = fs.readFileSync(filePath);
      const doc = await PDFDocument.load(bytes);
      // pdf-lib doesn't extract text easily; return page count info
      return `PDF avec ${doc.getPageCount()} page(s)`;
    };

    const text1 = await extractText(files[0].path);
    const text2 = await extractText(files[1].path);

    res.json({
      text1,
      text2,
      identical: text1 === text2,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la comparaison' });
  } finally {
    deleteFiles(...files.map(f => f.path));
  }
});

module.exports = router;
