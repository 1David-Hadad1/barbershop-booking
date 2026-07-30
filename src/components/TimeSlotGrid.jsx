import { AnimatePresence, motion } from 'framer-motion'

export default function TimeSlotGrid({ slots, selectedTime, onSelect, loading }) {
  if (loading) {
    return <p className="text-muted text-sm py-6">טוען שעות פנויות...</p>
  }

  if (!slots.length) {
    return (
      <p className="text-muted text-sm py-6">אין שעות פנויות ביום הזה, נסו לבחור תאריך אחר.</p>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slots.join(',')}
        className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5"
      >
        {slots.map((time, i) => {
          const isSelected = selectedTime === time
          return (
            <motion.button
              key={time}
              type="button"
              onClick={() => onSelect(time)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                isSelected
                  ? 'border-transparent bg-gradient-to-br from-accent to-accent-2 text-white shadow-lg shadow-accent/30'
                  : 'border-border bg-card text-fg hover:border-accent/50'
              }`}
            >
              {time}
            </motion.button>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}
