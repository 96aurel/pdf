import { useState, useCallback, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { uploadFiles } from '../utils/api'

export default function SignPDF() {
  const [file, setFile] = useState(null)
  const [mode, setMode] = useState('draw')
  const [signText, setSignText] = useState('')
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) setFile(accepted[0])
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
  }, [mode])

  const startDraw = (e) => {
    isDrawing.current = true
    const { offsetX, offsetY } = e.nativeEvent
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(offsetX, offsetY)
  }

  const draw = (e) => {
    if (!isDrawing.current) return
    const { offsetX, offsetY } = e.nativeEvent
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineTo(offsetX, offsetY)
    ctx.stroke()
  }

  const stopDraw = () => { isDrawing.current = false }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  const getSignatureBase64 = () => {
    if (mode === 'draw') {
      return canvasRef.current.toDataURL('image/png')
    }
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 100
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = 'italic 40px Georgia'
    ctx.fillStyle = '#1a1a1a'
    ctx.fillText(signText, 20, 65)
    return canvas.toDataURL('image/png')
  }

  const handleSign = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier PDF')
      return
    }
    if (mode === 'text' && !signText.trim()) {
      toast.error('Veuillez saisir votre signature')
      return
    }
    setLoading(true)
    try {
      const signature = getSignatureBase64()
      const blob = await uploadFiles('/pdf/sign', file, { signature })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'signé.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('✅ PDF signé avec succès !')
    } catch {
      toast.error('❌ Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">✍️ Signer un PDF</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Ajoutez votre signature sur votre PDF.</p>

      <DropZone
        onDrop={onDrop}
        accept={{ 'application/pdf': ['.pdf'] }}
        label="Glissez votre fichier PDF ici"
      />

      {file && <p className="mt-3 text-sm text-green-600 dark:text-green-400">✅ {file.name} sélectionné</p>}

      <div className="mt-6">
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setMode('draw')}
            className={`px-4 py-2 rounded-lg font-medium transition ${mode === 'draw' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            ✏️ Dessiner
          </button>
          <button
            onClick={() => setMode('text')}
            className={`px-4 py-2 rounded-lg font-medium transition ${mode === 'text' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            ⌨️ Texte
          </button>
        </div>

        {mode === 'draw' ? (
          <div>
            <canvas
              ref={canvasRef}
              width={600}
              height={150}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              className="border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-crosshair bg-white w-full"
              style={{ touchAction: 'none' }}
            />
            <button onClick={clearCanvas} className="mt-2 text-sm text-red-500 hover:text-red-700">
              🗑️ Effacer
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={signText}
            onChange={e => setSignText(e.target.value)}
            placeholder="Votre nom / signature"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 text-xl italic"
            style={{ fontFamily: 'Georgia, serif' }}
          />
        )}
      </div>

      <button
        onClick={handleSign}
        disabled={loading || !file}
        className="mt-8 w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition"
      >
        {loading ? 'Ajout de la signature...' : 'Ajouter la signature'}
      </button>
    </div>
  )
}
