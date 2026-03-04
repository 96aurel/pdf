import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFiles } from '../utils/api'

export default function EditPDF() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [page, setPage] = useState('1')
  const [x, setX] = useState('50')
  const [y, setY] = useState('50')
  const [fontSize, setFontSize] = useState('12')
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const handleEdit = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier PDF')
      return
    }
    if (!text.trim()) {
      toast.error('Veuillez saisir un texte à ajouter')
      return
    }
    setLoading(true)
    try {
      const blob = await uploadFiles('/pdf/add-text', file, { text, page, x, y, fontSize })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'édité.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ Texte ajouté avec succès !')
    } catch {
      toast.error('❌ Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">✏️ Éditer un PDF</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Ajoutez du texte sur une page de votre PDF.</p>

      <DropZone
        onDrop={onDrop}
        accept={{ 'application/pdf': ['.pdf'] }}
        label="Glissez votre fichier PDF ici"
      />

      {file && <p className="mt-3 text-sm text-green-600 dark:text-green-400">✅ {file.name} sélectionné</p>}

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texte à ajouter</label>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Votre texte..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Numéro de page</label>
            <input
              type="number"
              value={page}
              onChange={e => setPage(e.target.value)}
              min="1"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Taille de police</label>
            <input
              type="number"
              value={fontSize}
              onChange={e => setFontSize(e.target.value)}
              min="6"
              max="72"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position X (pts)</label>
            <input
              type="number"
              value={x}
              onChange={e => setX(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position Y (pts)</label>
            <input
              type="number"
              value={y}
              onChange={e => setY(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleEdit}
        disabled={loading || !file}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Ajout du texte...' : 'Ajouter le texte'}
      </button>
    </div>
  )
}
