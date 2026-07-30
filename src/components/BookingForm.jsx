import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { getAvailableSlots, getUpcomingOpenDates, toDateKey } from '../lib/slots'
import { clearMyAppointment, getMyAppointment, saveMyAppointment } from '../lib/myAppointment'
import Section from './Section'
import Card from './Card'
import DatePicker from './DatePicker'
import TimeSlotGrid from './TimeSlotGrid'
import Input from './Input'
import Button from './Button'

const PHONE_REGEX = /^0\d{8,9}$/

function formatHebrewDate(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export default function BookingForm() {
  const dates = useMemo(() => getUpcomingOpenDates(21), [])
  const [selectedDate, setSelectedDate] = useState(dates[0])
  const [takenTimes, setTakenTimes] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(true)
  const [selectedTime, setSelectedTime] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [myAppointment, setMyAppointment] = useState(undefined) // undefined = still checking, null = none
  const [showBookAnother, setShowBookAnother] = useState(false)

  useEffect(() => {
    const saved = getMyAppointment()
    if (!saved) {
      setMyAppointment(null)
      return
    }
    let cancelled = false
    supabase
      .from('appointments')
      .select('id, date, time')
      .eq('id', saved.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        const todayKey = toDateKey(new Date())
        if (data && data.date >= todayKey) {
          setMyAppointment(data)
        } else {
          clearMyAppointment()
          setMyAppointment(null)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoadingSlots(true)
    setSelectedTime(null)

    supabase
      .from('appointments')
      .select('time')
      .eq('date', toDateKey(selectedDate))
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          console.error(error)
          setTakenTimes([])
        } else {
          setTakenTimes(data.map((row) => row.time))
        }
        setLoadingSlots(false)
      })

    return () => {
      cancelled = true
    }
  }, [selectedDate])

  const availableSlots = useMemo(
    () => getAvailableSlots(selectedDate, takenTimes),
    [selectedDate, takenTimes],
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')

    if (!selectedTime) {
      setFormError('בחרו שעה לתור')
      return
    }
    if (name.trim().length < 2) {
      setFormError('נא להזין שם מלא')
      return
    }
    if (!PHONE_REGEX.test(phone.trim())) {
      setFormError('נא להזין מספר טלפון תקין (לדוגמה 0501234567)')
      return
    }

    setSubmitting(true)
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        customer_name: name.trim(),
        phone: phone.trim(),
        date: toDateKey(selectedDate),
        time: selectedTime,
      })
      .select('id, date, time')
      .single()
    setSubmitting(false)

    if (error) {
      if (error.code === '23505') {
        setFormError('אופס, השעה הזו נתפסה הרגע. בחרו שעה אחרת.')
        setTakenTimes((prev) => [...prev, selectedTime])
        setSelectedTime(null)
      } else {
        setFormError('משהו השתבש, נסו שוב בעוד רגע.')
        console.error(error)
      }
      return
    }

    saveMyAppointment(data)
    setMyAppointment(data)
    setSubmitted(true)
  }

  function resetForm() {
    setSubmitted(false)
    setName('')
    setPhone('')
    setSelectedTime(null)
  }

  const hasExistingAppointment = myAppointment && !showBookAnother

  return (
    <Section id="booking" className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold font-display sm:text-4xl">קביעת תור</h2>
        <p className="mt-3 text-muted">בחרו יום ושעה שנוחים לכם, ואנחנו נשמור לכם מקום.</p>
      </div>

      <Card className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {!submitted && hasExistingAppointment ? (
            <motion.div
              key="existing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent-2">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">כבר יש לכם תור קבוע</h3>
              <p className="text-muted">
                {formatHebrewDate(myAppointment.date)} בשעה {myAppointment.time}. מחכים לכם במספרה.
              </p>
              <Button variant="outline" onClick={() => setShowBookAnother(true)} className="mt-2">
                קביעת תור נוסף בכל זאת
              </Button>
            </motion.div>
          ) : submitted ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-4 py-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-2 text-white"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-bold">התור נקבע בהצלחה!</h3>
              <p className="text-muted">
                {selectedDate.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })} בשעה{' '}
                {selectedTime}. מחכים לכם במספרה.
              </p>
              <Button variant="outline" onClick={resetForm} className="mt-2">
                קביעת תור נוסף
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              <div>
                <p className="mb-3 text-sm font-semibold text-fg/90">בחרו תאריך</p>
                <DatePicker dates={dates} selectedDate={selectedDate} onSelect={setSelectedDate} />
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-fg/90">בחרו שעה</p>
                <TimeSlotGrid
                  slots={availableSlots}
                  selectedTime={selectedTime}
                  onSelect={setSelectedTime}
                  loading={loadingSlots}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="שם מלא" placeholder="ישראל ישראלי" value={name} onChange={(e) => setName(e.target.value)} />
                <Input
                  label="טלפון"
                  type="tel"
                  placeholder="050-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <AnimatePresence>
                {formError && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm font-medium text-danger"
                  >
                    {formError}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button type="submit" variant="primary" disabled={submitting} className="w-full py-3.5 text-base">
                {submitting ? 'קובע תור...' : 'אישור קביעת תור'}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </Card>
    </Section>
  )
}
