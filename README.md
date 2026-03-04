# 🛠️ PDFTools — Votre boîte à outils PDF & Fichiers

Application web complète de gestion de PDF et de conversion de fichiers, entièrement en français. Similaire à iLovePDF, elle propose plus de 20 outils gratuits et sécurisés.

## ✨ Fonctionnalités

### 📄 Outils PDF
- **Fusionner** — Combiner plusieurs PDF en un seul
- **Diviser** — Séparer un PDF en plusieurs fichiers
- **Compresser** — Réduire la taille d'un PDF
- **Organiser** — Réarranger, pivoter ou supprimer des pages
- **Extraire** — Extraire des pages spécifiques
- **Filigrane** — Ajouter un texte en filigrane
- **Numérotation** — Ajouter des numéros de page
- **Protéger** — Sécuriser un PDF avec un mot de passe
- **Déverrouiller** — Retirer la protection d'un PDF
- **Signer** — Ajouter une signature
- **Éditer** — Ajouter du texte sur un PDF
- **Comparer** — Comparer deux PDF

### 🔄 Conversions
- **Vers PDF** — Convertir Word, Excel, images, TXT en PDF
- **Depuis PDF** — Extraire texte, images depuis un PDF
- **Convertir Image** — Changer le format d'une image

### 🖼️ Outils Image
- Compresser, redimensionner, recadrer des images

### 🤖 IA & Avancé
- **OCR** — Extraire le texte d'une image ou d'un PDF numérisé
- **Générateur QR Code** — Créer des QR codes personnalisés

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm 9+

### Backend

```bash
cd backend
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173`

## 🏗️ Stack Technique

| Couche | Technologies |
|--------|-------------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express |
| PDF | pdf-lib |
| Images | sharp |
| Conversion | mammoth (Word), xlsx (Excel) |
| OCR | tesseract.js |
| Upload | multer |

## 📁 Structure du projet

```
pdf/
├── frontend/          # Application React
│   ├── src/
│   │   ├── pages/     # Pages de l'application
│   │   ├── components/# Composants réutilisables
│   │   ├── context/   # Contextes React
│   │   ├── hooks/     # Hooks personnalisés
│   │   └── utils/     # Utilitaires
│   └── ...
└── backend/           # API Express
    ├── routes/        # Routes API
    ├── middleware/    # Middleware (upload, cleanup)
    └── services/      # Services métier
```

## 🔒 Sécurité & Confidentialité

- Les fichiers uploadés sont automatiquement supprimés après traitement
- Aucun fichier n'est stocké en permanence sur le serveur
- Traitement 100% local, aucune donnée envoyée à des tiers

## 📝 Licence

MIT — © 2024 PDFTools
