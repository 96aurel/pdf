export default function ProgressBar({ progress = 0 }) {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
      <div
        className="bg-gradient-to-r from-red-500 to-orange-400 h-3 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
