import { describe, expect, it } from 'vitest'
import { PUBLIC_APPOINTMENT_STATUS } from '@/app/api/appointments/route'

describe('public appointment invariants', () => {
  it('always starts requests in manual-confirmation state', () => {
    expect(PUBLIC_APPOINTMENT_STATUS).toBe('requested')
    expect(PUBLIC_APPOINTMENT_STATUS).not.toBe('confirmed')
  })
})
