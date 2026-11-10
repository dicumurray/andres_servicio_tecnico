import { describe, expect, it } from 'vitest'
import {
  isWithinAvailability,
  overlapsExistingAppointment,
} from '@/lib/appointment-availability'

describe('appointment availability', () => {
  const monday = [{ day_of_week: 1, start_time: '09:00', end_time: '17:00' }]

  it('accepts a slot inside the configured window', () => {
    expect(isWithinAvailability('2026-11-02', '10:00', 60, monday, [])).toBe(true)
  })

  it('rejects a slot that exceeds the configured window', () => {
    expect(isWithinAvailability('2026-11-02', '16:30', 60, monday, [])).toBe(false)
  })

  it('rejects full-day and partial exceptions', () => {
    expect(isWithinAvailability(
      '2026-11-02',
      '10:00',
      60,
      monday,
      [{ start_date: '2026-11-02', end_date: '2026-11-02', start_time: null, end_time: null }],
    )).toBe(false)

    expect(isWithinAvailability(
      '2026-11-02',
      '12:00',
      60,
      monday,
      [{ start_date: '2026-11-02', end_date: '2026-11-02', start_time: '12:30', end_time: '14:00' }],
    )).toBe(false)
  })

  it('allows adjacent appointments but rejects overlaps', () => {
    const existing = [{ scheduled_at: '2026-11-02T13:00:00Z', duration_minutes: 60 }]
    expect(overlapsExistingAppointment(new Date('2026-11-02T14:00:00Z'), 60, existing)).toBe(false)
    expect(overlapsExistingAppointment(new Date('2026-11-02T13:30:00Z'), 60, existing)).toBe(true)
  })
})
