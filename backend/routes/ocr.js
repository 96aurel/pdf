const express = require('express');
const router = express.Router();
const path = require('path');
const upload = require('../middleware/upload');
const { deleteFiles } = require('../middleware/cleanup');

// POST /extract
router.post('/extract', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  const { lang = 'fra' } = req.body;
  try {
    const { createWorker } = require('tesseract.js');
    const worker = await createWorker(lang);
    const { data: { text } } = await worker.recognize(file.path);
    await worker.terminate();
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de l\'extraction OCR' });
  } finally {
    deleteFiles(file.path);
  }
});

module.exports = router;
