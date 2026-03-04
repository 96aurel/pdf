import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFiles } from '../utils/api'

export default function Watermark() {
  const [file, setFile] = useState(null)
  const [text, setText] = useState('CONFIDENTIEL')
  const [opacity, setOpacity] = useState('0.3')
  const [position, setPosition] = useState('center')
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const handleWatermark = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier PDF')
      return
    }
    if (!text.trim()) {
      toast.error('Veuillez saisir un texte de filigrane')
      return
    }
    setLoading(true)
    try {
      const blob = await uploadFiles('/pdf/watermark', file, { text, opacity, position })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'filigrane.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ Filigrane ajouté avec succès !')
    } catch {
      toast.error('❌ Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">💧 Ajouter un filigrane</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Apposez un texte en filigrane sur toutes les pages de votre PDF.</p>

      <DropZone
        onDrop={onDrop}
        accept={{ 'application/pdf': ['.pdf'] }}
        label="Glissez votre fichier PDF ici"
      />

      {file && <p className="mt-3 text-sm text-green-600 dark:text-green-400">✅ {file.name} sélectionné</p>}

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texte du filigrane</label>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="CONFIDENTIEL"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Opacité : {Math.round(parseFloat(opacity) * 100)}%
          </label>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={opacity}
            onChange={e => setOpacity(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
          <select
            value={position}
            onChange={e => setPosition(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="center">Centre</option>
            <option value="top-left">Haut gauche</option>
            <option value="top-right">Haut droite</option>
            <option value="bottom-left">Bas gauche</option>
            <option value="bottom-right">Bas droite</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleWatermark}
        disabled={loading || !file}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Ajout du filigrane...' : 'Ajouter le filigrane'}
      </button>
    </div>
  )
}
