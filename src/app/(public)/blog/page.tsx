import { AppHeader } from '@/components/layout/app-header'
import { AppFooter } from '@/components/layout/app-footer'
import Link from 'next/link'

export const metadata = {
  title: 'Blog',
  description: 'Artículos y consejos sobre reparación de electrónica y celulares. Andrés Servicio Técnico, La Plata.',
}

export default function BlogPage() {
  const posts = [
    {
      slug: 'cuidados-bateria-celular',
      title: 'Cuidados básicos de la batería del celular',
      excerpt: 'Algunas recomendaciones para alargar la vida útil de la batería de tu dispositivo.',
      date: '2026-09-10',
    },
    {
      slug: 'alargamiento-vida-util-bateria',
      title: 'Cómo alargar la vida útil de la batería de tu celular',
      excerpt: 'Consejos prácticos para cuidar la batería de litio y evitar su degradación prematura.',
      date: '2026-09-12',
    },
    {
      slug: 'pantalla-rajada-diagnostico',
      title: 'Pantalla rajada: diagnóstico y opciones',
      excerpt: 'Qué hacer cuando la pantalla se rompe y cómo evaluar si conviene repararla.',
      date: '2026-08-28',
    },
    {
      slug: 'problemas-cargador-comun',
      title: 'Problemas de cargador: causas comunes',
      excerpt: 'Por qué no carga tu celular y cuándo es momento de reparar o reemplazar.',
      date: '2026-08-15',
    },
    {
      slug: 'consejos-electronica-vida-util',
      title: 'Consejos para alargar la vida útil de tu electrónica',
      excerpt: 'Cuidados básicos para mantener tus dispositivos en buen estado por más tiempo.',
      date: '2026-09-14',
    },
  ]

  return (
    <>
      <AppHeader />
      <main className="min-h-screen bg-body px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-body mb-2">Blog</h1>
          <p className="text-base text-muted mb-8">
            Consejos, noticias y experiencias sobre reparación de electrónica y celulares.
          </p>

          {posts.length === 0 ? (
            <div className="rounded-lg border border-default bg-elevated p-8 text-center">
              <p className="text-muted">Próximamente estaremos publicando artículos y tips.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <article key={post.slug} className="rounded-lg border border-default bg-elevated p-6 hover:border-accent transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="text-lg font-semibold text-body">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-accent hover:underline"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <time className="text-xs text-muted whitespace-nowrap">
                      {new Date(post.date).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <p className="text-sm text-muted">{post.excerpt}</p>
                  <div className="mt-3">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-light hover:underline"
                    >
                      Leer artículo
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-8 rounded-lg border border-default bg-muted/50 p-6 text-center">
            <p className="text-muted mb-4">
              Solicitá un turno para diagnóstico de tu equipo.
            </p>
            <Link
              href="/turnos"
              className="inline-flex items-center justify-center rounded-md h-11 px-6 text-sm font-semibold bg-accent text-white hover:bg-accent-dark transition-colors"
            >
              Solicitar turno
            </Link>
          </div>
        </div>
      </main>
      <AppFooter />
    </>
  )
}