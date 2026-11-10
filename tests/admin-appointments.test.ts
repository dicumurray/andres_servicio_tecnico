import { beforeEach, describe, expect, it, vi } from 'vitest'

const createClientMock = vi.fn()

vi.mock('@/lib/supabase-server', () => ({
  createClient: createClientMock,
}))

const appointmentId = '11111111-1111-4111-8111-111111111111'

function createSupabaseMock(options: {
  user?: { id: string } | null
  profile?: { role: string; status: string } | null
  profileError?: Error | null
  appointment?: { id: string; status: string; appointment_number: string } | null
  appointmentError?: Error | null
}) {
  const appointmentUpdate = vi.fn()
  const appointmentEq = vi.fn()
  const appointmentIn = vi.fn()
  const appointmentSelect = vi.fn()
  const appointmentMaybeSingle = vi.fn()

  appointmentUpdate.mockReturnValue({ eq: appointmentEq })
  appointmentEq.mockReturnValue({ in: appointmentIn })
  appointmentIn.mockReturnValue({ select: appointmentSelect })
  appointmentSelect.mockReturnValue({ maybeSingle: appointmentMaybeSingle })
  appointmentMaybeSingle.mockResolvedValue({
    data: options.appointment ?? null,
    error: options.appointmentError ?? null,
  })

  const profileMaybeSingle = vi.fn().mockResolvedValue({
    data: options.profile ?? null,
    error: options.profileError ?? null,
  })
  const profileEq = vi.fn().mockReturnValue({ maybeSingle: profileMaybeSingle })
  const profileSelect = vi.fn().mockReturnValue({ eq: profileEq })

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: options.user ?? null },
        error: null,
      }),
    },
    from: vi.fn((table: string) => {
      if (table === 'profiles') return { select: profileSelect }
      return { update: appointmentUpdate }
    }),
  }
}

async function patch(action: string) {
  const { PATCH } = await import('@/app/api/admin/appointments/[id]/route')
  return PATCH(
    new Request('http://localhost/api/admin/appointments/' + appointmentId, {
      method: 'PATCH',
      body: JSON.stringify({ action }),
      headers: { 'content-type': 'application/json' },
    }),
    { params: Promise.resolve({ id: appointmentId }) },
  )
}

describe('administrative appointment API', () => {
  beforeEach(() => {
    vi.resetModules()
    createClientMock.mockReset()
  })

  it('rejects users without a session', async () => {
    createClientMock.mockResolvedValue(createSupabaseMock({ user: null }))
    expect((await patch('confirm')).status).toBe(401)
  })

  it.each([
    ['customer', 'active'],
    ['admin', 'inactive'],
  ])('rejects %s/%s profiles', async (role, status) => {
    createClientMock.mockResolvedValue(createSupabaseMock({
      user: { id: 'user-1' },
      profile: { role, status },
    }))
    expect((await patch('confirm')).status).toBe(403)
  })

  it.each(['admin', 'technician'])('allows active %s profiles', async (role) => {
    createClientMock.mockResolvedValue(createSupabaseMock({
      user: { id: 'user-1' },
      profile: { role, status: 'active' },
      appointment: {
        id: appointmentId,
        status: 'confirmed',
        appointment_number: 'TUR-2026-000001',
      },
    }))
    const response = await patch('confirm')
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ status: 'confirmed' })
  })

  it.each([
    ['confirm', 'confirmed'],
    ['reject', 'cancelled_by_technician'],
    ['cancel', 'cancelled_by_technician'],
  ])('maps %s to %s', async (action, expectedStatus) => {
    const supabase = createSupabaseMock({
      user: { id: 'user-1' },
      profile: { role: 'admin', status: 'active' },
      appointment: { id: appointmentId, status: expectedStatus, appointment_number: 'TUR-2026-000001' },
    })
    createClientMock.mockResolvedValue(supabase)
    expect((await patch(action)).status).toBe(200)
  })
})
