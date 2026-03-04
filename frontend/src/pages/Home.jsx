import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ToolCard from '../components/ToolCard'

const tools = [
  {
    section: '📄 Outils PDF',
    items: [
      { icon: '🔗', title: 'Fusionner PDF', description: 'Combiner plusieurs PDF en un seul fichier', to: '/fusionner', color: 'red' },
      { icon: '✂️', title: 'Diviser PDF', description: 'Séparer un PDF en plusieurs fichiers', to: '/diviser', color: 'red' },
      { icon: '🗜️', title: 'Compresser PDF', description: 'Réduire la taille de vos fichiers PDF', to: '/compresser', color: 'red' },
      { icon: '📑', title: 'Organiser Pages', description: 'Réarranger, pivoter ou supprimer des pages', to: '/organiser', color: 'red' },
      { icon: '📤', title: 'Extraire Pages', description: 'Extraire des pages spécifiques d\'un PDF', to: '/extraire', color: 'red' },
      { icon: '💧', title: 'Filigrane', description: 'Ajouter un texte en filigrane sur votre PDF', to: '/filigrane', color: 'red' },
      { icon: '🔢', title: 'Numérotation', description: 'Ajouter des numéros de page automatiquement', to: '/numerotation', color: 'red' },
      { icon: '🔒', title: 'Protéger PDF', description: 'Sécuriser votre PDF avec un mot de passe', to: '/proteger', color: 'red' },
      { icon: '🔓', title: 'Déverrouiller PDF', description: 'Retirer la protection d\'un PDF', to: '/deverrouiller', color: 'red' },
      { icon: '✍️', title: 'Signer PDF', description: 'Ajouter votre signature sur un PDF', to: '/signer', color: 'red' },
      { icon: '✏️', title: 'Éditer PDF', description: 'Ajouter du texte sur votre PDF', to: '/editer', color: 'red' },
      { icon: '🔍', title: 'Comparer PDF', description: 'Comparer deux PDF et trouver les différences', to: '/comparer', color: 'red' },
    ]
  },
  {
    section: '🔄 Convertir',
    items: [
      { icon: '📄', title: 'Vers PDF', description: 'Convertir Word, Excel, images en PDF', to: '/convertir-vers-pdf', color: 'blue' },
      { icon: '📁', title: 'Depuis PDF', description: 'Exporter un PDF en Word, image ou texte', to: '/convertir-depuis-pdf', color: 'blue' },
      { icon: '🖼️', title: 'Convertir Image', description: 'Changer le format d\'une image', to: '/convertir-image', color: 'blue' },
    ]
  },
  {
    section: '🖼️ Outils Image',
    items: [
      { icon: '🗜️', title: 'Compresser Image', description: 'Réduire le poids de vos images', to: '/outils-image', color: 'green' },
      { icon: '↔️', title: 'Redimensionner', description: 'Changer la taille de vos images', to: '/outils-image', color: 'green' },
      { icon: '✂️', title: 'Recadrer', description: 'Rogner vos images facilement', to: '/outils-image', color: 'green' },
    ]
  },
  {
    section: '🤖 IA & Avancé',
    items: [
      { icon: '🔤', title: 'OCR', description: 'Extraire le texte d\'une image ou d\'un PDF', to: '/ocr', color: 'purple' },
      { icon: '📱', title: 'Générateur QR Code', description: 'Créer des QR codes personnalisés', to: '/qrcode', color: 'purple' },
    ]
  }
]

export default function Home() {
  const [search, setSearch] = useState('')

  const filtered = tools.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(section => section.items.length > 0)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-red-600 via-red-500 to-orange-400 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-4"
          >
            🛠️ Votre boîte à outils PDF & Fichiers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl opacity-90 mb-8"
          >
            Fusionnez, divisez, convertissez et éditez vos fichiers gratuitement.<br />
            100% en ligne, aucune installation requise.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <a href="#outils" className="bg-white text-red-600 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition text-lg inline-block">
              Découvrir les outils →
            </a>
          </motion.div>
          <div className="flex justify-center gap-8 mt-10 text-sm opacity-80">
            <span>✅ 20+ outils</span>
            <span>✅ 100% gratuit</span>
            <span>✅ Fichiers supprimés automatiquement</span>
          </div>
        </div>
      </section>

      {/* Search */}
      <section id="outils" className="max-w-7xl mx-auto px-4 py-10">
        <div className="max-w-xl mx-auto mb-10">
          <input
            type="text"
            placeholder="🔍 Rechercher un outil..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 text-base"
          />
        </div>

        {filtered.map(section => (
          <div key={section.section} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{section.section}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {section.items.map(item => (
                <ToolCard key={item.to + item.title} {...item} />
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl">Aucun outil trouvé pour "{search}"</p>
          </div>
        )}
      </section>
    </div>
  )
}
