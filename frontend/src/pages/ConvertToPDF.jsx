import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFiles } from '../utils/api'

const ACCEPT = {
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'text/plain': ['.txt'],
  'text/html': ['.html'],
}

export default function ConvertToPDF() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const handleConvert = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier')
      return
    }
    setLoading(true)
    try {
      const blob = await uploadFiles('/convert/to-pdf', file)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace(/\.[^.]+$/, '') + '.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ Conversion réussie !')
    } catch {
      toast.error('❌ Une erreur est survenue lors de la conversion')
    } finally {
      setLoading(false)
    }
  }

  const getFileType = () => {
    if (!file) return null
    const ext = file.name.split('.').pop().toLowerCase()
    const typeMap = {
      docx: 'Word (.docx)',
      xlsx: 'Excel (.xlsx)',
      jpg: 'Image JPG',
      jpeg: 'Image JPEG',
      png: 'Image PNG',
      webp: 'Image WebP',
      txt: 'Texte (.txt)',
      html: 'HTML',
    }
    return typeMap[ext] || ext.toUpperCase()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">📄 Convertir vers PDF</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Convertissez Word, Excel, images et textes en PDF.</p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-6">
        {['DOCX', 'XLSX', 'JPG', 'PNG', 'TXT', 'HTML'].map(fmt => (
          <div key={fmt} className="bg-gray-100 dark:bg-gray-800 rounded-lg py-2 px-3 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
            {fmt}
          </div>
        ))}
      </div>

      <DropZone
        onDrop={onDrop}
        accept={ACCEPT}
        label="Glissez votre fichier ici (Word, Excel, Image, TXT, HTML)"
      />

      {file && (
        <p className="mt-3 text-sm text-green-600 dark:text-green-400">
          ✅ {file.name} ({getFileType()}) sélectionné
        </p>
      )}

      <button
        onClick={handleConvert}
        disabled={loading || !file}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Conversion en cours...' : 'Convertir en PDF'}
      </button>
    </div>
  )
}
