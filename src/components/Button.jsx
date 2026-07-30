import { motion } from 'framer-motion'

const variants = {
  primary:
    'bg-gradient-to-l from-accent to-accent-2 text-white shadow-lg shadow-accent/20 hover:shadow-accent/40',
  outline: 'border border-border text-fg hover:bg-card hover:border-accent/50',
  ghost: 'text-muted hover:text-fg hover:bg-card',
  danger: 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
}

export default function Button({
  as: Component = motion.button,
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
