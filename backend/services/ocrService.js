const { createWorker } = require('tesseract.js');

async function extractText(filePath, lang = 'fra') {
  const worker = await createWorker(lang);
  const { data: { text } } = await worker.recognize(filePath);
  await worker.terminate();
  return text;
}

module.exports = { extractText };
