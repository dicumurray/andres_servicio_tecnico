export function HomeProcess() {
  const steps = [
    { title: 'Recibimos el equipo', description: 'Verificamos el estado inicial y registramos incidencias.' },
    { title: 'Diagnosticamos', description: 'Analizamos la falla con herramientas de medición.' },
    { title: 'Presupuestamos', description: 'Le enviamos un presupuesto claro y detallado.' },
    { title: 'Reparamos', description: 'Ejecutamos el trabajo con criterio técnico.' },
    { title: 'Probamos', description: 'Verificamos el funcionamiento antes de entregar.' },
    { title: 'Entregamos', description: 'Le entregamos el equipo reparado con garantía.' },
  ]

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-xl font-semibold text-body mb-2 text-center">Cómo trabajamos</h2>
        <p className="text-sm text-muted mb-12 text-center">
          Un proceso claro y comunicado en cada paso.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Número */}
              <div className="mb-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent text-white text-sm font-semibold">
                {i + 1}
              </div>
              <h3 className="text-sm font-semibold text-body">{step.title}</h3>
              <p className="mt-1 text-xs text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
