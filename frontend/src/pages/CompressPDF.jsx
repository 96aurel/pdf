import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFiles } from '../utils/api'

export default function CompressPDF() {
  const [file, setFile] = useState(null)
  const [level, setLevel] = useState('medium')
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const handleCompress = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier PDF')
      return
    }
    setLoading(true)
    try {
      const blob = await uploadFiles('/pdf/compress', file, { level })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'compressé.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ PDF compressé avec succès !')
    } catch {
      toast.error('❌ Une erreur est survenue lors de la compression')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">🗜️ Compresser un PDF</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Réduisez la taille de votre fichier PDF.</p>

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
          Niveau de compression
        </label>
        <div className="flex gap-3">
          {[
            { value: 'low', label: 'Faible', desc: 'Meilleure qualité' },
            { value: 'medium', label: 'Moyen', desc: 'Équilibré' },
            { value: 'high', label: 'Fort', desc: 'Taille minimale' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setLevel(opt.value)}
              className={`flex-1 py-3 px-4 rounded-xl border-2 transition ${level === opt.value ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
            >
              <div className="font-semibold">{opt.label}</div>
              <div className="text-xs text-gray-400">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleCompress}
        disabled={loading || !file}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Compression en cours...' : 'Compresser le PDF'}
      </button>
    </div>
  )
}
