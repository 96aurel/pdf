import { useState } from 'react'

export function useFileUpload() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const reset = () => {
    setFiles([])
    setResult(null)
    setError(null)
  }

  return { files, setFiles, loading, setLoading, result, setResult, error, setError, reset }
}
