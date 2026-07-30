export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-xl shadow-black/20 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
