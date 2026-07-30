import { motion } from 'framer-motion'
import { toDateKey } from '../lib/slots'

const WEEKDAY_LABELS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']

export default function DatePicker({ dates, selectedDate, onSelect }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {dates.map((date, i) => {
        const key = toDateKey(date)
        const isSelected = selectedDate && toDateKey(selectedDate) === key
        return (
          <motion.button
            key={key}
            type="button"
            onClick={() => onSelect(date)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            className={`flex min-w-[64px] flex-col items-center gap-1 rounded-2xl border px-3 py-3 transition-colors duration-150 ${
              isSelected
                ? 'border-transparent bg-gradient-to-br from-accent to-accent-2 text-white shadow-lg shadow-accent/30'
                : 'border-border bg-card text-fg hover:border-accent/50'
            }`}
          >
            <span className="text-xs opacity-80">{WEEKDAY_LABELS[date.getDay()]}</span>
            <span className="text-lg font-bold">{date.getDate()}</span>
            <span className="text-[10px] opacity-70">{date.toLocaleDateString('he-IL', { month: 'short' })}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
