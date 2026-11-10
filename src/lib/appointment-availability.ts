export interface AvailabilityWindow {
  day_of_week: number
  start_time: string
  end_time: string
}

export interface AvailabilityExceptionWindow {
  start_date: string
  end_date: string
  start_time: string | null
  end_time: string | null
}

export interface ExistingAppointmentWindow {
  scheduled_at: string
  duration_minutes: number | null
}

function minutesSinceMidnight(value: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value)
  if (!match) return null
  return Number(match[1]) * 60 + Number(match[2])
}

export function isWithinAvailability(
  date: string,
  start: string,
  durationMinutes: number,
  windows: AvailabilityWindow[],
  exceptions: AvailabilityExceptionWindow[],
): boolean {
  const startMinutes = minutesSinceMidnight(start)
  if (startMinutes === null || durationMinutes <= 0) return false

  const endMinutes = startMinutes + durationMinutes
  const dateObject = new Date(`${date}T00:00:00Z`)
  const dayOfWeek = dateObject.getUTCDay()

  const blocked = exceptions.some((exception) => {
    if (date < exception.start_date || date > exception.end_date) return false
    if (!exception.start_time || !exception.end_time) return true

    const exceptionStart = minutesSinceMidnight(exception.start_time)
    const exceptionEnd = minutesSinceMidnight(exception.end_time)
    return (
      exceptionStart !== null &&
      exceptionEnd !== null &&
      startMinutes < exceptionEnd &&
      endMinutes > exceptionStart
    )
  })

  if (blocked) return false

  // An empty schedule means availability has not been configured yet. Keep
  // the existing public booking flow functional until staff configures it.
  if (windows.length === 0) return true

  return windows.some((window) => {
    if (window.day_of_week !== dayOfWeek) return false
    const windowStart = minutesSinceMidnight(window.start_time)
    const windowEnd = minutesSinceMidnight(window.end_time)
    return (
      windowStart !== null &&
      windowEnd !== null &&
      startMinutes >= windowStart &&
      endMinutes <= windowEnd
    )
  })
}

export function overlapsExistingAppointment(
  scheduledAt: Date,
  durationMinutes: number,
  existingAppointments: ExistingAppointmentWindow[],
): boolean {
  const start = scheduledAt.getTime()
  const end = start + durationMinutes * 60_000

  return existingAppointments.some((appointment) => {
    const existingStart = new Date(appointment.scheduled_at).getTime()
    const existingDuration = appointment.duration_minutes ?? 30
    const existingEnd = existingStart + existingDuration * 60_000
    return start < existingEnd && end > existingStart
  })
}
