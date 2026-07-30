import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../lib/AuthContext'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'

export default function AdminLogin() {
  const { session } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (signInError) {
      setError('אימייל או סיסמה שגויים.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <Card className="p-8">
          <h1 className="text-center text-2xl font-extrabold font-display">כניסת בעל העסק</h1>
          <p className="mt-2 text-center text-sm text-muted">התחברות לניהול התורים של המספרה</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Input
              label="אימייל"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="סיסמה"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm font-medium text-danger">{error}</p>}
            <Button type="submit" variant="primary" disabled={loading} className="mt-2 w-full">
              {loading ? 'מתחבר...' : 'התחברות'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
