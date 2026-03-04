const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const upload = require('../middleware/upload');
const { deleteFiles } = require('../middleware/cleanup');

// POST /compress
router.post('/compress', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  const { quality = '80' } = req.body;
  try {
    const q = Math.min(100, Math.max(1, parseInt(quality)));
    const info = await sharp(file.path).metadata();
    const format = info.format || 'jpeg';

    let sharpInstance = sharp(file.path);
    if (format === 'png') {
      sharpInstance = sharpInstance.png({ quality: q, compressionLevel: 9 });
    } else if (format === 'webp') {
      sharpInstance = sharpInstance.webp({ quality: q });
    } else {
      sharpInstance = sharpInstance.jpeg({ quality: q });
    }

    const buffer = await sharpInstance.toBuffer();
    const mime = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
    const ext = format === 'png' ? 'png' : format === 'webp' ? 'webp' : 'jpg';

    res.set({
      'Content-Type': mime,
      'Content-Disposition': `attachment; filename="compressé.${ext}"`,
    });
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la compression' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /resize
router.post('/resize', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  const { width, height } = req.body;
  try {
    const info = await sharp(file.path).metadata();
    const format = info.format || 'jpeg';

    const resizeOpts = {};
    if (width) resizeOpts.width = parseInt(width);
    if (height) resizeOpts.height = parseInt(height);

    const buffer = await sharp(file.path)
      .resize(resizeOpts)
      .toFormat(format)
      .toBuffer();

    const mime = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
    const ext = format === 'png' ? 'png' : format === 'webp' ? 'webp' : 'jpg';

    res.set({
      'Content-Type': mime,
      'Content-Disposition': `attachment; filename="redimensionné.${ext}"`,
    });
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du redimensionnement' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /crop
router.post('/crop', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  const { left = '0', top = '0', width = '200', height = '200' } = req.body;
  try {
    const info = await sharp(file.path).metadata();
    const format = info.format || 'jpeg';

    const buffer = await sharp(file.path)
      .extract({
        left: parseInt(left),
        top: parseInt(top),
        width: parseInt(width),
        height: parseInt(height),
      })
      .toFormat(format)
      .toBuffer();

    const mime = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
    const ext = format === 'png' ? 'png' : format === 'webp' ? 'webp' : 'jpg';

    res.set({
      'Content-Type': mime,
      'Content-Disposition': `attachment; filename="recadré.${ext}"`,
    });
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors du recadrage' });
  } finally {
    deleteFiles(file.path);
  }
});

// POST /convert
router.post('/convert', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Fichier requis' });
  const { format = 'png', quality = '85' } = req.body;
  try {
    const q = Math.min(100, Math.max(1, parseInt(quality)));
    let sharpInstance = sharp(file.path);

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
