import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { getAvailableSlots, getUpcomingOpenDates, toDateKey } from '../lib/slots'
import Button from './Button'
import DatePicker from './DatePicker'
import TimeSlotGrid from './TimeSlotGrid'

function toWhatsAppLink(phone) {
  const digits = phone.replace(/\D/g, '')
  const intl = digits.startsWith('0') ? `972${digits.slice(1)}` : digits
  return `https://wa.me/${intl}`
}

function parseDateKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export default function AppointmentCard({ appointment, onDelete, onReschedule }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [editing, setEditing] = useState(false)
  const dates = useMemo(() => getUpcomingOpenDates(21), [])
  const [editDate, setEditDate] = useState(() => parseDateKey(appointment.date))
  const [editTime, setEditTime] = useState(appointment.time)
  const [editTakenTimes, setEditTakenTimes] = useState([])
  const [editLoading, setEditLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState('')

  useEffect(() => {
    if (!editing) return
    let cancelled = false
    setEditLoading(true)
    supabase
      .from('appointments')
      .select('time')
      .eq('date', toDateKey(editDate))
      .neq('id', appointment.id)
      .then(({ data, error }) => {
        if (cancelled) return
        setEditTakenTimes(error ? [] : data.map((row) => row.time))
        setEditLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [editing, editDate, appointment.id])

  const availableEditSlots = useMemo(() => {
    const slots = getAvailableSlots(editDate, editTakenTimes)
    const ownCurrentSlot = toDateKey(editDate) === appointment.date ? appointment.time : null
    if (ownCurrentSlot && !slots.includes(ownCurrentSlot)) {
      return [...slots, ownCurrentSlot].sort()
    }
    return slots
  }, [editDate, editTakenTimes, appointment.date, appointment.time])

  function openEdit() {
    setEditDate(parseDateKey(appointment.date))
    setEditTime(appointment.time)
    setEditError('')
    setEditing(true)
  }

  async function handleSave() {
    setSaving(true)
    setEditError('')
    const { error } = await onReschedule(appointment.id, {
      date: toDateKey(editDate),
      time: editTime,
    })
    setSaving(false)
    if (error) {
      setEditError(
        error.code === '23505' ? 'השעה הזו כבר תפוסה, בחרו שעה אחרת.' : 'משהו השתבש, נסו שוב.',
      )
      return
    }
    setEditing(false)
  }

  async function handleDelete() {
    setDeleting(true)
    await onDelete(appointment.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className="rounded-xl border border-border bg-card px-4 py-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span className="rounded-lg bg-accent-soft px-3 py-1.5 text-sm font-bold text-accent-2">
            {appointment.time}
          </span>
          <div>
            <p className="font-semibold">{appointment.customer_name}</p>
            <div className="flex gap-3 text-xs text-muted">
              <a href={`tel:${appointment.phone}`} className="hover:text-accent-2 transition-colors">
                {appointment.phone}
              </a>
              <a
                href={toWhatsAppLink(appointment.phone)}
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent-2 transition-colors"
              >
                וואטסאפ
              </a>
            </div>
          </div>
        </div>

        {confirming ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">למחוק?</span>
            <Button variant="danger" onClick={handleDelete} disabled={deleting} className="px-3 py-1.5 text-xs">
              {deleting ? '...' : 'כן, מחק'}
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(false)} className="px-3 py-1.5 text-xs">
              ביטול
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={editing ? () => setEditing(false) : openEdit} className="px-3 py-1.5 text-xs">
              {editing ? 'סגירה' : 'שינוי שעה'}
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(true)} className="px-3 py-1.5 text-xs">
              מחיקה
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {editing && (
          <motion.div
            key="edit-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-col gap-4 border-t border-border pt-4">
              <div>
                <p className="mb-2 text-xs font-semibold text-muted">תאריך חדש</p>
                <DatePicker dates={dates} selectedDate={editDate} onSelect={setEditDate} />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-muted">שעה חדשה</p>
                <TimeSlotGrid
                  slots={availableEditSlots}
                  selectedTime={editTime}
                  onSelect={setEditTime}
                  loading={editLoading}
                />
              </div>
              {editError && <p className="text-sm font-medium text-danger">{editError}</p>}
              <Button variant="primary" onClick={handleSave} disabled={saving} className="w-fit px-4 py-2 text-sm">
                {saving ? 'שומר...' : 'שמירת שינוי'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
