import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function ToolCard({ icon, title, description, to, color = 'red' }) {
  const colorMap = {
    red: 'bg-red-50 dark:bg-red-900/20 hover:border-red-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 hover:border-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 hover:border-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 hover:border-purple-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 hover:border-orange-400',
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Link to={to} className={`block p-5 rounded-xl border-2 border-transparent ${colorMap[color]} transition-all duration-200 shadow-sm hover:shadow-md`}>
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </Link>
    </motion.div>
  )
}
