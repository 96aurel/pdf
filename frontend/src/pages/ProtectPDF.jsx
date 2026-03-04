import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFiles } from '../utils/api'

export default function ProtectPDF() {
  const [file, setFile] = useState(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  const handleProtect = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier PDF')
      return
    }
    if (!password) {
      toast.error('Veuillez saisir un mot de passe')
      return
    }
    if (password !== confirm) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    setLoading(true)
    try {
      const blob = await uploadFiles('/pdf/protect', file, { password })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'protégé.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ PDF protégé avec succès !')
    } catch {
      toast.error('❌ Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">🔒 Protéger un PDF</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Sécurisez votre PDF avec un mot de passe.</p>

      <DropZone
        onDrop={onDrop}
        accept={{ 'application/pdf': ['.pdf'] }}
        label="Glissez votre fichier PDF ici"
      />

      {file && <p className="mt-3 text-sm text-green-600 dark:text-green-400">✅ {file.name} sélectionné</p>}

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Confirmer le mot de passe"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
      </div>

      <button
        onClick={handleProtect}
        disabled={loading || !file}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Protection en cours...' : 'Protéger le PDF'}
      </button>
    </div>
  )
}
