import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PostProps {
  params: Promise<{ slug: string }>
}

const posts: Record<string, { title: string; date: string; content: string; cards?: { title: string; text: string }[] }> = {
  'cuidados-bateria-celular': {
    title: 'Cómo alargar la vida útil de la batería del celular',
    date: '2026-09-10',
    content: `
      <p>La batería es uno de los componentes que más rápido se desgasta en un celular. Con algunos cuidados simples puedes alargar su vida útil y evitar reemplazos prematuras.</p>
      
      <h3>El calor es el enemigo número uno</h3>
      <p>No dejés tu celular bajo el sol directo, en el tablero del auto o cerca de fuentes de calor. El calor degrada la batería más rápido que cualquier otro factor. En verano, tené cuidado con los bolsillos y fundas que retienen calor.</p>
      <p>Las bajas temperaturas también afectan: la capacidad de la batería disminuye temporalmente en frío intenso, pero el daño real se asocia principalmente al calor.</p>
      
      <h3>Cargas parciales vs. cargas completas</h3>
      <p>No es necesario esperar que se descargue por completo antes de cargar. Las cargas parciales son preferibles para la mayoría de las baterías modernas de litio. Idealmente, mantené la batería entre el 20% y el 80% cuando sea posible.</p>
      <p>No es necesario desenchufarlo cuando llega al 100%, pero no dejés el celular conectado a la corriente por horas una vez que está cargado.</p>
      
      <h3>Usar cargadores originales o certificados</h3>
      <p>Los cargadores de baja calidad pueden dañar la batería y el circuito de carga. Si el cargador original falla, reemplazalo por uno certificado de la misma marca o de un fabricante reconocido. Los cargadores originales garantizan la potencia y el protocolo de comunicación correcto.</p>
    `,
    cards: [
      { title: 'Señal: Descarga rápida', text: 'El celular se descarga rápidamente incluso con uso normal. Esto indica que la capacidad de la batería ha disminuído significativamente.' },
      { title: 'Señal: Calentamiento excesivo', text: 'Se calienta de forma excesiva al cargar. Un poco de calor es normal, pero si está muy caliente al tocarlo, puede ser señal de un problema en la batería o en el circuito de carga.' },
      { title: 'Señal: Apagones repentinos', text: 'Se apaga repentinamente aunque marque carga restante. Esto es un síntoma clásico de batería degradada. La batería no puede entregar la energía que el equipo necesita.' },
      { title: 'Señal: Tiempo de uso reducido', text: 'El tiempo de uso ha disminuído notablemente en los últimos meses. Si antes aguantaba un día completo y ahora no, la batería está envejeciendo.' },
      { title: '¿Qué hacer?', text: 'Si notás alguna de estas señales, vení para un diagnóstico. Reemplazar la batería es un procedimiento rutinario y te devuelve la autonomía del equipo.' },
      { title: 'Tip: Optimización de configuración', text: 'Bajá el brillo o usá el brillo automático. Limitá las apps que se actualizan en segundo plano desde Configuración > Batería. Usá wifi en lugar de datos móviles cuando esté disponible. Activá el modo de ahorro de energía cuando la batería esté baja.' },
    ],
  },
  'pantalla-rajada-diagnostico': {
    title: 'Pantalla rajada: diagnóstico y opciones',
    date: '2026-08-28',
    content: `
      <p>Una pantalla rajada puede ir desde un problema puramente estético hasta un daño funcional grave. Evaluá bien antes de decidí qué hacer.</p>
      
      <h3>Tipos de daño</h3>
      <p>Las ráfagas superficiales (vidrio solo) suelen ser solo estéticas. Las ráfagas que afectan al panel táctil o a la pantalla (píxeles muertos, líneas) son daño funcional.</p>
      
      <h3>¿Vale la pena reparar?</h3>
      <p>Depende de la antigüedad del equipo, el costo de la reparación y el valor de mercado del dispositivo. Un diagnóstico nos ayuda a decidir.</p>
      
      <h3>Precaución</h3>
      <p>No toques ni pongas presión sobre una pantalla rota. Podés ocasionar daño adicional en el panel táctil o en los componentes internos.</p>
      
      <p>Traé el equipo para que lo evaluemos y te digamos si conviene reparar o reemplazar.</p>
    `,
    cards: [
      { title: 'Ráfaga superficial (vidrio solo)', text: 'Solo el vidrio está roto. El tacto y la visualización funcionan bien. Suele ser solo un problema estético, pero tené cuidado con los cortes si el vidrio está desquilado.' },
      { title: 'Daño en panel táctil', text: 'Algunas zonas no responden al tacto, hay zonas que se activan solas o el tacto es inconsistente. Requiere reparación del panel táctil.' },
      { title: 'Píxeles muertos o líneas', text: 'La pantalla muestra líneas negras, manchas fijas o píxeles que no cambian de color. Daño en el panel LCD/OLED. El nivel de gravedad depende de cuántos píxeles estén afectados.' },
      { title: '¿Vale la pena reparar?', text: 'Depende de la antigüedad del equipo, el costo de la reparación y el valor de mercado del dispositivo. Un diagnóstico nos ayuda a decidir si conviene reparar o reemplazar.' },
    ],
  },
  'problemas-cargador-comun': {
    title: 'Problemas de cargador: causas comunes',
    date: '2026-08-15',
    content: `
      <p>Cuando el celular no carga, el problema puede estar en el cargador, el cable, el puerto de carga o en la placa. Veamos las causas más comunes y qué podés hacer.</p>
    `,
    cards: [
      { title: 'Cable dañado', text: 'Los cables se deterioran con el uso. Si el cable se doblá excesivamente o tiene partes expuestas, reemplazalo. Un cable dañado puede causar carga intermitente o lenta.' },
      { title: 'Puerto de carga sucio', text: 'La acumulación de polvo, pelusa o suciedad en el puerto de carga impide la conexión. Limpialo con cuidado (puedes usar un palillo de dientes seco o aire comprimido) puede solucionar el problema.' },
      { title: 'Puerto dañado', text: 'Si el puerto está dañado (se siente suelto, no entra bien el cable), necesita reparación. Usá un cargador de otra marca para confirmar.' },
      { title: 'Cargador defectuoso', text: 'Un cargador que no entrega la corriente adecuada puede causar carga lenta o nula. Probalo con otro dispositivo para confirmar. Si no funciona con otros equipos, reemplazalo.' },
      { title: 'Daño en la placa', text: 'Si el cargador y el cable funcionan, pero el celular no carga, puede haber daño en la placa de carga. Esto requiere diagnóstico especializado.' },
      { title: 'Batería degradada', text: 'Si el celular carga pero se descarga muy rápido, la batería puede estar degradada. Esta es una causa común en equipos más viejos. Reemplazar la batería suele resolver el problema.' },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PostProps): Promise<{ title: string }> {
  const { slug } = await params
  const post = posts[slug]
  if (!post) return { title: 'Artículo' }
  return {
    title: `${post.title} | Blog`,
  }
}

export default async function BlogPostPage({ params }: PostProps) {
  const { slug } = await params
  const post = posts[slug]

  if (!post) {
    notFound()
  }

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-body px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-body transition-colors mb-6"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Volver al blog
          </Link>

          <h1 className="text-3xl font-bold text-body mb-2">{post.title}</h1>
          <time className="text-sm text-muted mb-8">
            {new Date(post.date).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>

          <div className="rounded-lg border border-default bg-elevated p-6">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {post.cards && post.cards.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-4">
              {post.cards.map((card, i) => (
                <div key={i} className="rounded-lg border border-default bg-muted/50 p-5 hover:border-accent transition-colors">
                  <h3 className="text-base font-semibold text-body mb-2">{card.title}</h3>
                  <p className="text-sm text-muted">{card.text}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 rounded-lg border border-default bg-muted/50 p-6 text-center">
            <p className="text-muted mb-4">
              Tenés alguna duda o necesitás un diagnóstico?
            </p>
            <a
              href={`https://wa.me/+541****2527?text=Hola%20Andres,%20tengo%20una%20duda%20sobre%20tu%20artículo.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-accent bg-elevated h-11 px-6 text-sm font-semibold text-accent dark:text-accent-light hover:bg-accent hover:text-white dark:hover:bg-accent-light transition-colors"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  )
}