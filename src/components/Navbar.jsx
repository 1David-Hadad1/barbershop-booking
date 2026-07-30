import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Logo() {
  return (
    <span className="flex items-center gap-2 text-lg font-extrabold font-display tracking-tight">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <line x1="20" y1="4" x2="8.12" y2="15.88" />
          <line x1="14.47" y1="14.48" x2="20" y2="20" />
          <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
      </span>
      מספרה
    </span>
  )
}

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 border-b border-border/60 bg-bg/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <a href="#booking" className="hover:text-fg transition-colors">
            קביעת תור
          </a>
          <a href="#about" className="hidden sm:inline hover:text-fg transition-colors">
            אודות
          </a>
          <Link to="/admin" className="rounded-lg border border-border px-3 py-1.5 hover:border-accent hover:text-fg transition-colors">
            כניסת בעל העסק
          </Link>
        </nav>
      </div>
    </motion.header>
  )
}
