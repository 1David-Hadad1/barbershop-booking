export default function Footer() {
  return (
    <footer className="border-t border-border/60 py-10 text-center text-sm text-muted">
      <p>מספרה · רח׳ הרצל 12, תל אביב · ראשון–חמישי 9:00–18:00</p>
      <p className="mt-1">© {new Date().getFullYear()} כל הזכויות שמורות</p>
    </footer>
  )
}
