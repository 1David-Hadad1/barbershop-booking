import { motion } from 'framer-motion'
import Button from './Button'

const STATS = [
  { label: 'לקוחות מרוצים', value: '500+' },
  { label: 'שנות ניסיון', value: '12' },
  { label: 'דירוג ממוצע', value: '4.9' },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero pt-20 pb-24">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-10 -right-16 h-80 w-80 rounded-full bg-accent-2/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 rounded-full border border-accent/30 bg-accent-soft px-4 py-1.5 text-xs font-semibold text-accent-2"
        >
          זמינים לקביעת תור אונליין 24/7
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl text-4xl font-extrabold font-display leading-tight sm:text-5xl md:text-6xl"
        >
          תספורת מדויקת,
          <span className="text-gradient"> בלי לחכות בתור</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 max-w-xl text-lg text-muted"
        >
          מספרה — עיצוב שיער וזקן ברמה מקצועית, באווירה נעימה. קבעו תור עכשיו
          באתר ותגיעו בדיוק בזמן שלכם, בלי שיחות טלפון ובלי המתנות.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <Button as={motion.a} href="#booking" variant="primary" className="px-8 py-3.5 text-base">
            קביעת תור עכשיו
          </Button>
          <Button as={motion.a} href="#services" variant="outline" className="px-8 py-3.5 text-base">
            השירותים שלנו
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-14 grid grid-cols-3 gap-6 rounded-2xl border border-border bg-card/60 px-6 py-5 backdrop-blur-sm sm:gap-12 sm:px-10"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl font-extrabold text-gradient sm:text-3xl">{stat.value}</span>
              <span className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
