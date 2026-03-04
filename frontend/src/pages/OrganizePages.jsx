import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFiles } from '../utils/api'

export default function OrganizePages() {
  const [file, setFile] = useState(null)
  const [order, setOrder] = useState('')
  const [rotate, setRotate] = useState('')
  const [remove, setRemove] = useState('')
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const handleOrganize = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier PDF')
      return
    }
    setLoading(true)
    try {
      const blob = await uploadFiles('/pdf/organize', file, { order, rotate, remove })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'organisé.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ Pages organisées avec succès !')
    } catch {
      toast.error('❌ Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">📑 Organiser les pages</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Réarranger, pivoter ou supprimer des pages de votre PDF.</p>

      <DropZone
        onDrop={onDrop}
        accept={{ 'application/pdf': ['.pdf'] }}
        label="Glissez votre fichier PDF ici"
      />

      {file && <p className="mt-3 text-sm text-green-600 dark:text-green-400">✅ {file.name} sélectionné</p>}

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Réarranger les pages (ex : 3,1,2)
          </label>
          <input
            type="text"
            value={order}
            onChange={e => setOrder(e.target.value)}
            placeholder="3,1,2"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pivoter des pages (ex : 1:90,2:180 — page:angle)
          </label>
          <input
            type="text"
            value={rotate}
            onChange={e => setRotate(e.target.value)}
            placeholder="1:90,2:180"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Supprimer des pages (ex : 4,5)
          </label>
          <input
            type="text"
            value={remove}
            onChange={e => setRemove(e.target.value)}
            placeholder="4,5"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
      </div>

      <button
        onClick={handleOrganize}
        disabled={loading || !file}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Organisation en cours...' : 'Organiser les pages'}
      </button>
    </div>
  )
}
