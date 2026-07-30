const STORAGE_KEY = 'my_appointment'

export function saveMyAppointment(appointment) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointment))
  } catch {
    // localStorage unavailable (private mode etc) - safe to ignore, it's just a convenience.
  }
}

export function getMyAppointment() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.id || !parsed?.date || !parsed?.time) return null
    return parsed
  } catch {
    return null
  }
}

export function clearMyAppointment() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
