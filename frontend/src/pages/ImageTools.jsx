import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFiles } from '../utils/api'

export default function ImageTools() {
  const [file, setFile] = useState(null)
  const [tab, setTab] = useState('compress')
  const [loading, setLoading] = useState(false)

  // Compress
  const [quality, setQuality] = useState('80')

  // Resize
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')

  // Crop
  const [cropLeft, setCropLeft] = useState('0')
  const [cropTop, setCropTop] = useState('0')
  const [cropWidth, setCropWidth] = useState('200')
  const [cropHeight, setCropHeight] = useState('200')

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const handleProcess = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner une image')
      return
    }
    setLoading(true)
    try {
      let blob
      const ext = file.name.split('.').pop().toLowerCase()

      if (tab === 'compress') {
        blob = await uploadFiles('/image/compress', file, { quality })
      } else if (tab === 'resize') {
        blob = await uploadFiles('/image/resize', file, { width, height })
      } else {
        blob = await uploadFiles('/image/crop', file, { left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
      }

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${tab}.${ext}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ Image traitée avec succès !')
    } catch {
      toast.error('❌ Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'compress', label: '🗜️ Compresser' },
    { id: 'resize', label: '↔️ Redimensionner' },
    { id: 'crop', label: '✂️ Recadrer' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">🖼️ Outils Image</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Compressez, redimensionnez ou recadrez vos images.</p>

      <DropZone
        onDrop={onDrop}
        accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'] }}
        label="Glissez votre image ici"
      />

      {file && <p className="mt-3 text-sm text-green-600 dark:text-green-400">✅ {file.name} sélectionné</p>}

      <div className="mt-6">
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 font-medium text-sm transition border-b-2 -mb-px ${tab === t.id ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'compress' && (
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
        )}

        {tab === 'resize' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Largeur (px)</label>
              <input
                type="number"
                value={width}
                onChange={e => setWidth(e.target.value)}
                placeholder="Auto"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hauteur (px)</label>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
                placeholder="Auto"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          </div>
        )}

        {tab === 'crop' && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Gauche (px)', value: cropLeft, setter: setCropLeft },
              { label: 'Haut (px)', value: cropTop, setter: setCropTop },
              { label: 'Largeur (px)', value: cropWidth, setter: setCropWidth },
              { label: 'Hauteur (px)', value: cropHeight, setter: setCropHeight },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                <input
                  type="number"
                  value={field.value}
                  onChange={e => field.setter(e.target.value)}
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleProcess}
        disabled={loading || !file}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Traitement en cours...' : tabs.find(t => t.id === tab)?.label.replace(/^[^ ]+ /, '')}
      </button>
    </div>
  )
}
