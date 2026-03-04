import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFiles } from '../utils/api'

export default function PageNumbers() {
  const [file, setFile] = useState(null)
  const [position, setPosition] = useState('bottom-center')
  const [format, setFormat] = useState('1')
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const handlePageNumbers = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier PDF')
      return
    }
    setLoading(true)
    try {
      const blob = await uploadFiles('/pdf/page-numbers', file, { position, format })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'numéroté.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ Numérotation ajoutée avec succès !')
    } catch {
      toast.error('❌ Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">🔢 Numérotation des pages</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Ajoutez automatiquement des numéros de page à votre PDF.</p>

      <DropZone
        onDrop={onDrop}
        accept={{ 'application/pdf': ['.pdf'] }}
        label="Glissez votre fichier PDF ici"
      />

      {file && <p className="mt-3 text-sm text-green-600 dark:text-green-400">✅ {file.name} sélectionné</p>}

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
          <select
            value={position}
            onChange={e => setPosition(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="bottom-center">Bas — Centre</option>
            <option value="bottom-left">Bas — Gauche</option>
            <option value="bottom-right">Bas — Droite</option>
            <option value="top-center">Haut — Centre</option>
            <option value="top-left">Haut — Gauche</option>
            <option value="top-right">Haut — Droite</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Format</label>
          <select
            value={format}
            onChange={e => setFormat(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="1">1, 2, 3...</option>
            <option value="Page 1">Page 1, Page 2...</option>
            <option value="1/n">1/10, 2/10...</option>
          </select>
        </div>
      </div>

      <button
        onClick={handlePageNumbers}
        disabled={loading || !file}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Ajout des numéros...' : 'Ajouter la numérotation'}
      </button>
    </div>
  )
}
