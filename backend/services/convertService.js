const sharp = require('sharp');

async function convertImage(inputPath, format, quality = 85) {
  const q = Math.min(100, Math.max(1, parseInt(quality)));
  let sharpInstance = sharp(inputPath);

  switch (format.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      return sharpInstance.jpeg({ quality: q }).toBuffer();
    case 'png':
      return sharpInstance.png({ quality: q }).toBuffer();
    case 'webp':
      return sharpInstance.webp({ quality: q }).toBuffer();
    case 'gif':
      return sharpInstance.gif().toBuffer();
    case 'bmp':
      return sharpInstance.bmp().toBuffer();
    default:
      return sharpInstance.png().toBuffer();
  }
}

module.exports = { convertImage };
