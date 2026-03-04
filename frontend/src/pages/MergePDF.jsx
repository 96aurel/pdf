import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { FiTrash2 } from 'react-icons/fi'
import DropZone from '../components/DropZone'
import { uploadFiles } from '../utils/api'

export default function MergePDF() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    setFiles(prev => [...prev, ...accepted])
  }, [])

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Veuillez sélectionner au moins 2 fichiers PDF')
      return
    }
    setLoading(true)
    try {
      const blob = await uploadFiles('/pdf/merge', files)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'fusionné.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ PDF fusionné avec succès !')
    } catch {
      toast.error('❌ Une erreur est survenue lors de la fusion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">🔗 Fusionner des PDF</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Combinez plusieurs fichiers PDF en un seul document.</p>

      <DropZone
        onDrop={onDrop}
        accept={{ 'application/pdf': ['.pdf'] }}
        multiple
        label="Glissez vos fichiers PDF ici"
      />

      {files.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Fichiers sélectionnés ({files.length})</h3>
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1">{f.name}</span>
              <span className="text-xs text-gray-400 mx-3">{(f.size / 1024).toFixed(0)} Ko</span>
              <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleMerge}
        disabled={loading || files.length < 2}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Fusion en cours...' : 'Fusionner les PDF'}
      </button>
    </div>
  )
}
