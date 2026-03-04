const sharp = require('sharp');

async function getImageInfo(filePath) {
  return sharp(filePath).metadata();
}

async function compressImage(filePath, quality = 80) {
  const info = await getImageInfo(filePath);
  const format = info.format || 'jpeg';
  const q = Math.min(100, Math.max(1, parseInt(quality)));

  let instance = sharp(filePath);
  if (format === 'png') return { buffer: await instance.png({ quality: q, compressionLevel: 9 }).toBuffer(), format };
  if (format === 'webp') return { buffer: await instance.webp({ quality: q }).toBuffer(), format };
  return { buffer: await instance.jpeg({ quality: q }).toBuffer(), format: 'jpeg' };
}

module.exports = { getImageInfo, compressImage };
