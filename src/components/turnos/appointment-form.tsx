'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { createSupabaseWebClient } from '@/lib/supabase-web'
import { Button, Input, Select, Textarea, Label } from '@/components/ui/primitives'
import { SubmitButton } from '@/components/ui/submit-button'
import { Alert } from '@/components/ui/alert'

// Tipos locales (el DB schema no existe en este entorno de desarrollo).
interface ServiceOption {
  id: string
  name: string
  slug: string
  duration: number | null
}

const appointmentSchema = z.object({
  service_id: z.string().min(1, 'Seleccioná un servicio'),
  date: z.string().min(1, 'Seleccioná una fecha'),
  time: z.string().min(1, 'Seleccioná un horario'),
  name: z.string().min(2, 'Ingresá tu nombre'),
  surname: z.string().min(2, 'Ingresá tu apellido'),
  phone: z.string().min(8, 'Ingresá un teléfono válido'),
  email: z.string().email('Ingresá un email válido').optional().or(z.literal('')),
  device_brand: z.string().min(1, 'Ingresá la marca'),
  device_model: z.string().min(1, 'Ingresá el modelo'),
  failure_description: z.string().min(10, 'Describí la falla con al menos 10 caracteres'),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof appointmentSchema>

const initialForm: FormData = {
  service_id: '',
  date: '',
  time: '',
  name: '',
  surname: '',
  phone: '',
  email: '',
  device_brand: '',
  device_model: '',
  failure_description: '',
  notes: '',
}

export function AppointmentForm({ services }: { services: ServiceOption[] }) {
  const router = useRouter()
  const supabase = createSupabaseWebClient()
  const [isPending, startTransition] = useTransition()
  const [step, setStep] = useState<'service' | 'datetime' | 'personal' | 'confirm' | 'done'>('service')
  const [form, setForm] = useState<FormData>(initialForm)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [formErrors, setFormErrors] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ appointment_number: string; message: string } | null>(null)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [whatsappSuccess, setWhatsappSuccess] = useState(false)

  // Cargar horarios disponibles cuando se selecciona fecha.
  const loadAvailableTimes = async (date: string) => {
    if (!date) {
      setAvailableTimes([])
      return
    }

    // Lógica de disponibilidad — en MVP, retornamos horarios genéricos.
    // En producción, esto vendría de la tabla availability + availability_exceptions.
    const baseHours = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
                       '13:00', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30']

    // Simulación: algunos horarios "ocupados" para demostrar UI.
    const occupied = new Set<string>()
    if (date === new Date().toISOString().split('T')[0]) {
      occupied.add('09:00')
      occupied.add('10:00')
    }

    setAvailableTimes(baseHours.filter(h => !occupied.has(h)))
    setSelectedTime('')
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setSelectedTime('')
    setAvailableTimes([])
    if (date) {
      loadAvailableTimes(date)
    }
  }

  const validateStep = (currentStep: typeof step): boolean => {
    try {
      if (currentStep === 'service') {
        appointmentSchema.omit({ date: true, time: true, name: true, surname: true, phone: true, email: true, device_brand: true, device_model: true, failure_description: true, notes: true }).parse({ service_id: form.service_id })
        setErrors(prev => ({ ...prev, service_id: undefined }))
      } else if (currentStep === 'datetime') {
        appointmentSchema.omit({ service_id: true, name: true, surname: true, phone: true, email: true, device_brand: true, device_model: true, failure_description: true, notes: true }).parse({ date: form.date, time: form.time })
        setErrors(prev => ({ ...prev, date: undefined, time: undefined }))
      } else if (currentStep === 'personal') {
        const dataToValidate: Partial<FormData> = {
          name: form.name,
          surname: form.surname,
          phone: form.phone,
          email: form.email || '',
          device_brand: form.device_brand,
          device_model: form.device_model,
          failure_description: form.failure_description,
          notes: form.notes || undefined,
        }
        appointmentSchema.omit({ service_id: true, date: true, time: true }).parse(dataToValidate)
        setErrors(prev => ({ ...prev, name: undefined, surname: undefined, phone: undefined, email: undefined, device_brand: undefined, device_model: undefined, failure_description: undefined, notes: undefined }))
      }
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Partial<FormData> = {}
        for (const issue of err.issues) {
          if (issue.path.length > 0) {
            const field = issue.path[0] as keyof FormData
            newErrors[field] = issue.message
          }
        }
        setErrors(newErrors)
      }
      return false
    }
  }

  const nextStep = () => {
    if (step === 'service' && validateStep('service')) {
      setStep('datetime')
    } else if (step === 'datetime' && validateStep('datetime')) {
      setStep('personal')
    } else if (step === 'personal' && validateStep('personal')) {
      setStep('confirm')
    }
  }

  const prevStep = () => {
    if (step === 'datetime') setStep('service')
    else if (step === 'personal') setStep('datetime')
    else if (step === 'confirm') setStep('personal')
  }

  const handleWhatsApp = async () => {
    const service = services.find(s => s.id === form.service_id)
    const message = `Hola Andrés, quiero solicitar un turno para revisar un ${form.device_brand} ${form.device_model} que no carga.`
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/+541123992527?text=${encoded}`, '_blank')
    setWhatsappSuccess(true)
  }

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const supabase = createSupabaseWebClient()

      const { data: { user } } = await supabase.auth.getUser()

      const appointmentData = {
        service_id: formData.service_id,
        scheduled_at: `${formData.date}T${formData.time}:00`,
        duration_minutes: services.find(s => s.id === formData.service_id)?.duration ?? 60,
        status: 'requested',
        customer_name: formData.name,
        customer_surname: formData.surname,
        customer_phone: formData.phone,
        customer_email: formData.email,
        device_brand: formData.device_brand,
        device_model: formData.device_model,
        failure_description: formData.failure_description,
        notes: formData.notes,
      }

      const { data: insertData, error } = await supabase
        .from('appointments')
        .insert({
          ...appointmentData,
        })
        .select('appointment_number, id')
        .single()

      if (error) {
        console.error('Error creando appointment:', error)
        setFormErrors('No se pudo crear el turno. Intentá nuevamente.')
        return
      }

      // El appointment_number se genera con la función de DB (generate_appointment_number).
      // En desarrollo sin DB connected, usamos placeholder.
      const appointmentNumber = (insertData as { appointment_number?: string; id?: string } | null)?.appointment_number ?? `TUR-${new Date().getFullYear()}-000001`

      setSuccess({
        appointment_number: appointmentNumber,
        message: 'Turno solicitado correctamente. Te enviaremos una confirmación por WhatsApp o email cuando esté disponible.',
      })
      setStep('done')
    })
  }

  // Renderizado por paso.
  if (success) {
    return (
      <div>
        <div className="rounded-lg border border-success/30 bg-success/10 p-6 text-center">
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-success/20">
            <svg className="h-6 w-6 text-success" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-success">Turno solicitado</h2>
          <p className="mt-2 text-sm text-body">
            Tu número de turno es: <span className="font-mono font-bold">{success.appointment_number}</span>
          </p>
          <p className="mt-2 text-sm text-muted">{success.message}</p>
          <div className="mt-4 flex flex-col gap-2">
            <SubmitButton onClick={() => setSuccess(null)} className="w-full">
              Solicitar otro turno
            </SubmitButton>
            <a
              href={`https://wa.me/+541123992527?text=Hola%20Andres,%20tengo%20el%20turno%20${success.appointment_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full rounded-md h-10 px-5 text-sm font-medium bg-elevated text-body border border-default hover:bg-muted hover:text-body transition-colors"
            >
              Confirmar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Progreso */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>1. Servicio</span>
          <span>2. Fecha y hora</span>
          <span>3. Tus datos</span>
          <span>4. Confirmar</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${((['service', 'datetime', 'personal', 'confirm', 'done'] as const).indexOf(step) / 4) * 100}%` }}
            role="progressbar"
            aria-valuenow={(['service', 'datetime', 'personal', 'confirm', 'done'] as const).indexOf(step)}
            aria-valuemin={0}
            aria-valuemax={4}
          />
        </div>
      </div>

      {/* Paso 1: Servicio */}
      {step === 'service' && (
        <div>
          <div className="mb-4">
            <Label htmlFor="service_id">Servicio</Label>
            <Select
              id="service_id"
              value={form.service_id}
              onChange={(e) => {
                setForm(prev => ({ ...prev, service_id: e.target.value }))
                setErrors(prev => ({ ...prev, service_id: undefined }))
              }}
              onBlur={() => {
                if (!form.service_id) {
                  setErrors(prev => ({ ...prev, service_id: 'Seleccioná un servicio' }))
                }
              }}
              aria-describedby={errors.service_id ? 'service_id-error' : undefined}
              className={errors.service_id ? 'border-error' : ''}
            >
              <option value="">Seleccioná un servicio...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.duration ? `(${s.duration} min aprox.)` : ''}
                </option>
              ))}
            </Select>
            {errors.service_id && (
              <p id="service_id-error" className="mt-1 text-xs text-error">{errors.service_id}</p>
            )}
          </div>

          <div className="flex justify-end">
            <SubmitButton onClick={nextStep} className="w-full sm:w-auto">
              Siguiente
            </SubmitButton>
          </div>
        </div>
      )}

      {/* Paso 2: Fecha y hora */}
      {step === 'datetime' && (
        <div>
          <div className="mb-4">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setForm(prev => ({ ...prev, date: e.target.value }))
                handleDateChange(e.target.value)
                setErrors(prev => ({ ...prev, date: undefined }))
              }}
              onBlur={() => {
                if (!form.date) {
                  setErrors(prev => ({ ...prev, date: 'Seleccioná una fecha' }))
                }
              }}
              aria-describedby={errors.date ? 'date-error' : undefined}
              className={errors.date ? 'border-error' : ''}
            />
            {errors.date && (
              <p id="date-error" className="mt-1 text-xs text-error">{errors.date}</p>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor="time">Horario</Label>
            <Select
              id="time"
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(e.target.value)
                setForm(prev => ({ ...prev, time: e.target.value }))
                setErrors(prev => ({ ...prev, time: undefined }))
              }}
              onBlur={() => {
                if (!selectedTime) {
                  setErrors(prev => ({ ...prev, time: 'Seleccioná un horario' }))
                }
              }}
              aria-describedby={errors.time ? 'time-error' : undefined}
              className={errors.time ? 'border-error' : ''}
            >
              <option value="">Seleccioná un horario...</option>
              {availableTimes.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            {availableTimes.length === 0 && selectedDate && (
              <p className="mt-1 text-xs text-muted">Cargando horarios disponibles...</p>
            )}
            {availableTimes.length === 0 && !selectedDate && (
              <p className="mt-1 text-xs text-muted">Seleccioná una fecha para ver los horarios.</p>
            )}
            {errors.time && (
              <p id="time-error" className="mt-1 text-xs text-error">{errors.time}</p>
            )}
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={prevStep}>
              Atrás
            </Button>
            <SubmitButton onClick={nextStep} className="ml-auto">
              Siguiente
            </SubmitButton>
          </div>
        </div>
      )}

      {/* Paso 3: Datos personales */}
      {step === 'personal' && (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, name: e.target.value }))
                  setErrors(prev => ({ ...prev, name: undefined }))
                }}
                onBlur={() => {
                  if (form.name.length < 2) {
                    setErrors(prev => ({ ...prev, name: 'Ingresá tu nombre' }))
                  }
                }}
                className={errors.name ? 'border-error' : ''}
              />
              {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="surname">Apellido</Label>
              <Input
                id="surname"
                value={form.surname}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, surname: e.target.value }))
                  setErrors(prev => ({ ...prev, surname: undefined }))
                }}
                onBlur={() => {
                  if (form.surname.length < 2) {
                    setErrors(prev => ({ ...prev, surname: 'Ingresá tu apellido' }))
                  }
                }}
                className={errors.surname ? 'border-error' : ''}
              />
              {errors.surname && <p className="mt-1 text-xs text-error">{errors.surname}</p>}
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+54 221 123 4567"
              value={form.phone}
              onChange={(e) => {
                setForm(prev => ({ ...prev, phone: e.target.value }))
                setErrors(prev => ({ ...prev, phone: undefined }))
              }}
              onBlur={() => {
                if (form.phone.length < 8) {
                  setErrors(prev => ({ ...prev, phone: 'Ingresá un teléfono válido' }))
                }
              }}
              className={errors.phone ? 'border-error' : ''}
            />
            {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone}</p>}
          </div>

          <div className="mb-4">
            <Label htmlFor="email">Email (opcional)</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => {
                setForm(prev => ({ ...prev, email: e.target.value }))
                setErrors(prev => ({ ...prev, email: undefined }))
              }}
              onBlur={() => {
                if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
                  setErrors(prev => ({ ...prev, email: 'Ingresá un email válido' }))
                }
              }}
              className={errors.email ? 'border-error' : ''}
            />
            {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <Label htmlFor="device_brand">Marca del dispositivo</Label>
              <Input
                id="device_brand"
                value={form.device_brand}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, device_brand: e.target.value }))
                  setErrors(prev => ({ ...prev, device_brand: undefined }))
                }}
                onBlur={() => {
                  if (!form.device_brand) {
                    setErrors(prev => ({ ...prev, device_brand: 'Ingresá la marca' }))
                  }
                }}
                className={errors.device_brand ? 'border-error' : ''}
              />
              {errors.device_brand && <p className="mt-1 text-xs text-error">{errors.device_brand}</p>}
            </div>
            <div>
              <Label htmlFor="device_model">Modelo</Label>
              <Input
                id="device_model"
                value={form.device_model}
                onChange={(e) => {
                  setForm(prev => ({ ...prev, device_model: e.target.value }))
                  setErrors(prev => ({ ...prev, device_model: undefined }))
                }}
                onBlur={() => {
                  if (!form.device_model) {
                    setErrors(prev => ({ ...prev, device_model: 'Ingresá el modelo' }))
                  }
                }}
                className={errors.device_model ? 'border-error' : ''}
              />
              {errors.device_model && <p className="mt-1 text-xs text-error">{errors.device_model}</p>}
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="failure_description">Descripción de la falla</Label>
            <Textarea
              id="failure_description"
              value={form.failure_description}
              onChange={(e) => {
                setForm(prev => ({ ...prev, failure_description: e.target.value }))
                setErrors(prev => ({ ...prev, failure_description: undefined }))
              }}
              onBlur={() => {
                if (form.failure_description.length < 10) {
                  setErrors(prev => ({ ...prev, failure_description: 'Describí la falla con al menos 10 caracteres' }))
                }
              }}
              rows={3}
              className={errors.failure_description ? 'border-error' : ''}
            />
            {errors.failure_description && (
              <p className="mt-1 text-xs text-error">{errors.failure_description}</p>
            )}
          </div>

          <div className="mb-4">
            <Label htmlFor="notes">Notas adicionales (opcional)</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => {
                setForm(prev => ({ ...prev, notes: e.target.value }))
              }}
              rows={2}
            />
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={prevStep}>
              Atrás
            </Button>
            <SubmitButton onClick={nextStep} className="ml-auto">
              Siguiente
            </SubmitButton>
          </div>
        </div>
      )}

      {/* Paso 4: Confirmar */}
      {step === 'confirm' && (
        <div>
          <h3 className="text-base font-semibold text-body mb-3">Resumen del turno</h3>

          <div className="rounded-lg border border-default bg-muted/50 p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Servicio:</span>
              <span className="font-medium">{services.find(s => s.id === form.service_id)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Fecha:</span>
              <span className="font-medium">
                {form.date ? new Date(form.date).toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Horario:</span>
              <span className="font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Cliente:</span>
              <span className="font-medium">{form.name} {form.surname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Teléfono:</span>
              <span className="font-medium">{form.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Email:</span>
              <span className="font-medium">{form.email || 'No proporcionado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Dispositivo:</span>
              <span className="font-medium">{form.device_brand} {form.device_model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Falla:</span>
              <span className="font-medium text-body">{form.failure_description}</span>
            </div>
            {form.notes && (
              <div className="flex justify-between">
                <span className="text-muted">Notas:</span>
                <span className="font-medium text-body">{form.notes}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <Button type="button" variant="ghost" onClick={prevStep} className="flex-1">
              Atrás
            </Button>
            <SubmitButton onClick={() => handleSubmit(form)} className="flex-1">
              Confirmar turno
            </SubmitButton>
          </div>

          <div className="mt-4">
            <Button type="button" variant="outline" onClick={handleWhatsApp} className="w-full">
              También podés consultar por WhatsApp
            </Button>
            {whatsappSuccess && (
              <p className="mt-2 text-xs text-success">Se abrió WhatsApp con el mensaje prellenado.</p>
            )}
          </div>
        </div>
      )}

      {/* Errores generales */}
      {formErrors && (
        <Alert variant="error" className="mt-4">
          {formErrors}
        </Alert>
      )}
    </div>
  )
}
