import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFiles } from '../utils/api'

export default function SplitPDF() {
  const [file, setFile] = useState(null)
  const [pages, setPages] = useState('')
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const handleSplit = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier PDF')
      return
    }
    setLoading(true)
    try {
      const blob = await uploadFiles('/pdf/split', file, { pages })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'divisé.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ PDF divisé avec succès !')
    } catch {
      toast.error('❌ Une erreur est survenue lors de la division')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">✂️ Diviser un PDF</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Séparez un PDF en plusieurs fichiers selon les plages de pages.</p>

      <DropZone
        onDrop={onDrop}
        accept={{ 'application/pdf': ['.pdf'] }}
        label="Glissez votre fichier PDF ici"
      />

      {file && (
        <p className="mt-3 text-sm text-green-600 dark:text-green-400">✅ {file.name} sélectionné</p>
      )}

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Plages de pages (ex : 1-3, 5, 7-9) — laisser vide pour tout diviser
        </label>
        <input
          type="text"
          value={pages}
          onChange={e => setPages(e.target.value)}
          placeholder="1-3, 5, 7-9"
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      <button
        onClick={handleSplit}
        disabled={loading || !file}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Division en cours...' : 'Diviser le PDF'}
      </button>
    </div>
  )
}
