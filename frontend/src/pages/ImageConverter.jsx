import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFiles } from '../utils/api'

export default function ImageConverter() {
  const [file, setFile] = useState(null)
  const [format, setFormat] = useState('png')
  const [quality, setQuality] = useState('85')
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const handleConvert = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner une image')
      return
    }
    setLoading(true)
    try {
      const blob = await uploadFiles('/image/convert', file, { format, quality })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `converti.${format}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ Image convertie avec succès !')
    } catch {
      toast.error('❌ Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">🔄 Convertir une image</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Changez le format de votre image facilement.</p>

      <DropZone
        onDrop={onDrop}
        accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'] }}
        label="Glissez votre image ici"
      />

      {file && <p className="mt-3 text-sm text-green-600 dark:text-green-400">✅ {file.name} sélectionné</p>}

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Format de sortie</label>
          <div className="flex flex-wrap gap-2">
            {['jpg', 'png', 'webp', 'gif', 'bmp'].map(fmt => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition uppercase text-sm ${format === fmt ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'}`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Qualité : {quality}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={e => setQuality(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <button
        onClick={handleConvert}
        disabled={loading || !file}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Conversion en cours...' : 'Convertir l\'image'}
      </button>
    </div>
  )
}
