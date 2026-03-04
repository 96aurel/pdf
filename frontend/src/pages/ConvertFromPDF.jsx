import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFiles } from '../utils/api'

export default function ConvertFromPDF() {
  const [file, setFile] = useState(null)
  const [format, setFormat] = useState('txt')
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const handleConvert = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier PDF')
      return
    }
    setLoading(true)
    try {
      const blob = await uploadFiles('/convert/from-pdf', file, { format })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const extMap = { txt: 'txt', jpg: 'jpg', png: 'png', html: 'html' }
      a.download = `converti.${extMap[format] || format}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ Conversion réussie !')
    } catch {
      toast.error('❌ Une erreur est survenue lors de la conversion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">📁 Convertir depuis PDF</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Exportez votre PDF vers différents formats.</p>

      <DropZone
        onDrop={onDrop}
        accept={{ 'application/pdf': ['.pdf'] }}
        label="Glissez votre fichier PDF ici"
      />

      {file && <p className="mt-3 text-sm text-green-600 dark:text-green-400">✅ {file.name} sélectionné</p>}

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Format de sortie</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: 'txt', label: '📝 Texte', desc: '.txt' },
            { value: 'jpg', label: '🖼️ Image JPG', desc: '.jpg' },
            { value: 'png', label: '🖼️ Image PNG', desc: '.png' },
            { value: 'html', label: '🌐 HTML', desc: '.html' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setFormat(opt.value)}
              className={`p-3 rounded-xl border-2 transition text-left ${format === opt.value ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
            >
              <div className="font-semibold text-gray-800 dark:text-white text-sm">{opt.label}</div>
              <div className="text-xs text-gray-400">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleConvert}
        disabled={loading || !file}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Conversion en cours...' : 'Convertir'}
      </button>
    </div>
  )
}
