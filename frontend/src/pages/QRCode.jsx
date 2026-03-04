import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export default function QRCode() {
  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState('256')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [QRLib, setQRLib] = useState(null)

  useEffect(() => {
    import('qrcode').then(mod => setQRLib(mod.default || mod))
  }, [])

  useEffect(() => {
    if (!QRLib || !text) return
    QRLib.toDataURL(text, {
      width: parseInt(size),
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: 'M',
    }).then(url => setQrDataUrl(url)).catch(() => {})
  }, [text, size, fgColor, bgColor, QRLib])

  const handleDownload = () => {
    if (!qrDataUrl) return
    const a = document.createElement('a')
    a.href = qrDataUrl
    a.download = 'qrcode.png'
    a.click()
    toast.success('✅ QR Code téléchargé !')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">📱 Générateur de QR Code</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Créez des QR codes personnalisés pour vos URLs ou textes.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texte ou URL</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              placeholder="https://example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Taille : {size}×{size}px
            </label>
            <input
              type="range"
              min="128"
              max="512"
              step="32"
              value={size}
              onChange={e => setSize(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Couleur QR</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={e => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                />
                <span className="text-sm text-gray-500">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fond</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={e => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                />
                <span className="text-sm text-gray-500">{bgColor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          {qrDataUrl ? (
            <>
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                style={{ width: Math.min(parseInt(size), 256), height: Math.min(parseInt(size), 256) }}
              />
              <button
                onClick={handleDownload}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition"
              >
                ⬇️ Télécharger en PNG
              </button>
            </>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-5xl mb-3">📱</p>
              <p>Saisissez un texte pour générer le QR code</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
