import { useDropzone } from 'react-dropzone'
import { FiUploadCloud } from 'react-icons/fi'

export default function DropZone({ onDrop, accept, multiple = false, label = 'Glissez vos fichiers ici' }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  })

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-200
        ${isDragActive ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-red-400 bg-gray-50 dark:bg-gray-800'}`}
    >
      <input {...getInputProps()} />
      <FiUploadCloud className="mx-auto text-5xl text-red-400 mb-4" />
      <p className="text-lg font-medium text-gray-700 dark:text-gray-200">{isDragActive ? 'Déposez vos fichiers...' : label}</p>
      <p className="text-sm text-gray-400 mt-2">ou cliquez pour sélectionner</p>
    </div>
  )
}
