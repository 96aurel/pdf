const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'] }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Rate limiting: max 60 requests per minute per IP for API routes
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, veuillez réessayer dans une minute.' },
});
app.use('/api/', apiLimiter);

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
