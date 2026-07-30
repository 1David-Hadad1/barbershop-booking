import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import AppointmentCard from '../components/AppointmentCard'
import Button from '../components/Button'
import Card from '../components/Card'

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadAppointments() {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true })

    if (fetchError) {
      setError('שגיאה בטעינת התורים.')
      console.error(fetchError)
    } else {
      setAppointments(data)
      setError('')
    }
    setLoading(false)
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  async function handleDelete(id) {
    const { error: deleteError } = await supabase.from('appointments').delete().eq('id', id)
    if (deleteError) {
      console.error(deleteError)
      return
    }
    setAppointments((prev) => prev.filter((a) => a.id !== id))
  }

  async function handleReschedule(id, { date, time }) {
    const { data, error: updateError } = await supabase
      .from('appointments')
      .update({ date, time })
      .eq('id', id)
      .select()
      .single()

    if (!updateError) {
      setAppointments((prev) => prev.map((a) => (a.id === id ? data : a)))
    }
    return { error: updateError }
  }

  const grouped = useMemo(() => {
    const map = new Map()
    for (const appt of appointments) {
      if (!map.has(appt.date)) map.set(appt.date, [])
      map.get(appt.date).push(appt)
    }
    return [...map.entries()]
  }, [appointments])

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-extrabold font-display">יומן תורים · מספרה</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={loadAppointments} className="px-3 py-1.5 text-xs">
              רענון
            </Button>
            <Button variant="outline" onClick={() => supabase.auth.signOut()} className="px-3 py-1.5 text-xs">
              התנתקות
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {loading && <p className="text-muted">טוען תורים...</p>}
        {error && <p className="text-danger">{error}</p>}

        {!loading && !error && grouped.length === 0 && (
          <Card className="p-8 text-center text-muted">אין תורים קבועים כרגע.</Card>
        )}

        <div className="flex flex-col gap-8">
          {grouped.map(([date, items], i) => (
            <motion.section
              key={date}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 className="mb-3 text-sm font-bold text-muted">
                {new Date(date).toLocaleDateString('he-IL', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
                <span className="mr-2 text-accent-2">· {items.length} תורים</span>
              </h2>
              <div className="flex flex-col gap-2">
                <AnimatePresence>
                  {items.map((appt) => (
                    <AppointmentCard
                      key={appt.id}
                      appointment={appt}
                      onDelete={handleDelete}
                      onReschedule={handleReschedule}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </motion.section>
          ))}
        </div>
      </main>
    </div>
  )
}
