const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Routes
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/convert', require('./routes/convert'));
app.use('/api/image', require('./routes/image'));
app.use('/api/ocr', require('./routes/ocr'));

app.get('/health', (req, res) => res.json({ status: 'ok', message: 'PDFTools API opérationnelle' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Serveur PDFTools démarré sur http://localhost:${PORT}`);
});
