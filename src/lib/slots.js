export const OPEN_HOUR = 9
export const CLOSE_HOUR = 18
export const SLOT_MINUTES = 20
export const CLOSED_WEEKDAYS = [5, 6] // Friday, Saturday (Date#getDay())

export function isClosedDay(date) {
  return CLOSED_WEEKDAYS.includes(date.getDay())
}

export function toDateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getUpcomingOpenDates(daysAhead = 21) {
  const dates = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  for (let i = 0; dates.length < daysAhead && i < daysAhead * 2; i++) {
    const candidate = new Date(cursor)
    candidate.setDate(cursor.getDate() + i)
    if (!isClosedDay(candidate)) dates.push(candidate)
  }
  return dates
}

export function getAllSlotsForDay() {
  const slots = []
  const totalMinutes = (CLOSE_HOUR - OPEN_HOUR) * 60
  for (let m = 0; m < totalMinutes; m += SLOT_MINUTES) {
    const hour = OPEN_HOUR + Math.floor(m / 60)
    const minute = m % 60
    slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`)
  }
  return slots
}

export function getAvailableSlots(date, takenTimes = []) {
  const allSlots = getAllSlotsForDay()
  const isToday = toDateKey(date) === toDateKey(new Date())
  const now = new Date()

  return allSlots.filter((slot) => {
    if (takenTimes.includes(slot)) return false
    if (isToday) {
      const [h, m] = slot.split(':').map(Number)
      const slotTime = new Date(date)
      slotTime.setHours(h, m, 0, 0)
      if (slotTime <= now) return false
    }
    return true
  })
}
