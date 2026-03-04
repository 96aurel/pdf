import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFilesForText } from '../utils/api'

export default function OCR() {
  const [file, setFile] = useState(null)
  const [lang, setLang] = useState('fra')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const handleOCR = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier')
      return
    }
    setLoading(true)
    setText('')
    try {
      const data = await uploadFilesForText('/ocr/extract', file, { lang })
      setText(data.text || '')
      toast.success('✅ Texte extrait avec succès !')
    } catch {
      toast.error('❌ Une erreur est survenue lors de l\'extraction')
    } finally {
      setLoading(false)
    }
  }

  const copyText = () => {
    navigator.clipboard.writeText(text)
    toast.success('📋 Texte copié !')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">🔤 OCR — Reconnaissance de texte</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Extrayez le texte d'une image ou d'un PDF numérisé.</p>

      <DropZone
        onDrop={onDrop}
        accept={{
          'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff'],
          'application/pdf': ['.pdf'],
        }}
        label="Glissez votre image ou PDF ici"
      />

      {file && <p className="mt-3 text-sm text-green-600 dark:text-green-400">✅ {file.name} sélectionné</p>}

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Langue du document</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'fra', label: '🇫🇷 Français' },
            { value: 'eng', label: '🇬🇧 Anglais' },
            { value: 'spa', label: '🇪🇸 Espagnol' },
            { value: 'ara', label: '🇸🇦 Arabe' },
          ].map(l => (
            <button
              key={l.value}
              onClick={() => setLang(l.value)}
              className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition ${lang === l.value ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-600' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleOCR}
        disabled={loading || !file}
        className="mt-6 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Extraction en cours...' : 'Extraire le texte'}
      </button>

      {text && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">Texte extrait</h3>
            <button onClick={copyText} className="text-sm text-red-600 hover:text-red-700 font-medium">
              📋 Copier
            </button>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full h-60 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-y"
          />
        </div>
      )}
    </div>
  )
}
