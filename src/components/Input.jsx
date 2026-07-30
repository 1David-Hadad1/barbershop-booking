export default function Input({ label, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && <span className="font-medium text-fg/90">{label}</span>}
      <input
        className={`rounded-xl border border-border bg-bg-soft px-4 py-3 text-fg placeholder:text-muted outline-none transition-colors duration-150 focus:border-accent focus:ring-2 focus:ring-accent/30 ${className}`}
        {...props}
      />
    </label>
  )
}
