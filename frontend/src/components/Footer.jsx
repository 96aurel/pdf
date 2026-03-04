import { FaFilePdf } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
            <FaFilePdf className="text-red-500" /> PDFTools
          </div>
          <p className="text-sm">Votre boîte à outils PDF & fichiers 100% gratuite et sécurisée.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Outils PDF</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/fusionner" className="hover:text-white">Fusionner PDF</Link></li>
            <li><Link to="/diviser" className="hover:text-white">Diviser PDF</Link></li>
            <li><Link to="/compresser" className="hover:text-white">Compresser PDF</Link></li>
            <li><Link to="/proteger" className="hover:text-white">Protéger PDF</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Conversions</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/convertir-vers-pdf" className="hover:text-white">Fichier → PDF</Link></li>
            <li><Link to="/convertir-depuis-pdf" className="hover:text-white">PDF → Fichier</Link></li>
            <li><Link to="/convertir-image" className="hover:text-white">Convertir Image</Link></li>
            <li><Link to="/ocr" className="hover:text-white">OCR</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs mt-8 text-gray-500">
        © {new Date().getFullYear()} PDFTools — Tous droits réservés. Les fichiers sont supprimés automatiquement après traitement.
      </div>
    </footer>
  )
}
