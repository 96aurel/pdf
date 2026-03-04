import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFilesForText } from '../utils/api'

export default function ComparePDF() {
  const [file1, setFile1] = useState(null)
  const [file2, setFile2] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const onDrop1 = useCallback((accepted) => {
    if (accepted.length > 0) setFile1(accepted[0])
  }, [])

  const onDrop2 = useCallback((accepted) => {
    if (accepted.length > 0) setFile2(accepted[0])
  }, [])

  const handleCompare = async () => {
    if (!file1 || !file2) {
      toast.error('Veuillez sélectionner deux fichiers PDF')
      return
    }
    setLoading(true)
    try {
      const data = await uploadFilesForText('/pdf/compare', [file1, file2])
      setResult(data)
      toast.success('✅ Comparaison terminée !')
    } catch {
      toast.error('❌ Une erreur est survenue lors de la comparaison')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">🔍 Comparer deux PDF</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Comparez le contenu textuel de deux fichiers PDF.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">📄 Premier PDF</h3>
          <DropZone
            onDrop={onDrop1}
            accept={{ 'application/pdf': ['.pdf'] }}
            label="Premier PDF"
          />
          {file1 && <p className="mt-2 text-sm text-green-600 dark:text-green-400">✅ {file1.name}</p>}
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">📄 Second PDF</h3>
          <DropZone
            onDrop={onDrop2}
            accept={{ 'application/pdf': ['.pdf'] }}
            label="Second PDF"
          />
          {file2 && <p className="mt-2 text-sm text-green-600 dark:text-green-400">✅ {file2.name}</p>}
        </div>
      </div>

      <button
        onClick={handleCompare}
        disabled={loading || !file1 || !file2}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Comparaison en cours...' : 'Comparer les PDF'}
      </button>

      {result && (
        <div className="mt-8">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">Résultats de la comparaison</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">📄 {file1?.name}</h4>
              <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap max-h-60 overflow-y-auto">{result.text1}</pre>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
              <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">📄 {file2?.name}</h4>
              <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap max-h-60 overflow-y-auto">{result.text2}</pre>
            </div>
          </div>
          {result.identical !== undefined && (
            <div className={`mt-4 p-4 rounded-xl text-center font-semibold ${result.identical ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
              {result.identical ? '✅ Les deux PDF ont un contenu identique' : '⚠️ Les deux PDF ont des contenus différents'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
