import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import { FaFilePdf } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const { dark, setDark } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { to: '/', label: 'Accueil' },
    { to: '/fusionner', label: 'PDF' },
    { to: '/convertir-vers-pdf', label: 'Convertir' },
    { to: '/outils-image', label: 'Images' },
    { to: '/ocr', label: 'OCR' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-red-600">
          <FaFilePdf /> PDFTools
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.to} to={l.to} className="text-gray-700 dark:text-gray-200 hover:text-red-600 font-medium transition">
              {l.label}
            </Link>
          ))}
          <button onClick={() => setDark(!dark)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            {dark ? <FiSun className="text-yellow-400 text-xl" /> : <FiMoon className="text-gray-600 text-xl" />}
          </button>
        </div>
        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 pb-4 flex flex-col gap-3">
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-200 hover:text-red-600 font-medium">
              {l.label}
            </Link>
          ))}
          <button onClick={() => setDark(!dark)} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            {dark ? <><FiSun className="text-yellow-400" /> Mode clair</> : <><FiMoon /> Mode sombre</>}
          </button>
        </div>
      )}
    </nav>
  )
}
