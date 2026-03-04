const fs = require('fs');

// Supprimer les fichiers immédiatement (après envoi)
const deleteFiles = (...filePaths) => {
  filePaths.forEach((fp) => {
    try {
      if (fp && fs.existsSync(fp)) fs.unlinkSync(fp);
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  });
};

// Supprimer un fichier après délai (défaut 1 heure)
const scheduleCleanup = (filePath, delayMs = 3600000) => {
  setTimeout(() => {
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (err) {
      console.error('Erreur nettoyage fichier:', err);
    }
  }, delayMs);
};

module.exports = { deleteFiles, scheduleCleanup };
