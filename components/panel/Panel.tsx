'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Logo from '@/components/Logo'
import { anilloFoco } from '@/lib/estilos-boton'
import { PERIODOS, type Cifra, type DatosPanel, type Periodo } from '@/lib/panel/tipos'

const CADA_MS = 30_000
const ENLACE_POSTHOG = 'https://us.posthog.com/project/214407/dashboard/2309490'

const tarjeta = 'rounded-xl border border-gray-300 bg-white p-5'

function haceCuanto(iso: string, ahora: number): string {
  const s = Math.max(0, Math.round((ahora - new Date(iso).getTime()) / 1000))
  if (s < 60) return `hace ${s} s`
  const m = Math.round(s / 60)
  if (m < 60) return `hace ${m} min`
  const d = new Date(iso)
  const hora = d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
  const hoy = new Date(ahora)
  const ayer = new Date(ahora - 86400000)
  if (d.toDateString() === hoy.toDateString()) return `Hoy ${hora}`
  if (d.toDateString() === ayer.toDateString()) return `Ayer ${hora}`
  return `${d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })} ${hora}`
}

function duracion(s: number): string {
  if (s < 60) return `${s} s`
  const m = Math.floor(s / 60)
  const r = s % 60
  return r ? `${m} min ${r} s` : `${m} min`
}

function llegada(fuente: string): string {
  if (fuente === 'Directo') return 'entró directo'
  if (fuente.startsWith('Postulación · ')) return `enlace de ${fuente.slice('Postulación · '.length)}`
  if (fuente === 'CV') return 'llegó desde tu CV'
  return `llegó por ${fuente}`
}

function cambio(c: Cifra, comparacion: string): { texto: string; sube: boolean } {
  const d = c.valor - c.anterior
  if (d === 0) return { texto: 'Sin cambio', sube: false }
  return { texto: `${d > 0 ? '+' : ''}${d} ${comparacion}`, sube: d > 0 }
}

function Punto({ color, pulso = false }: { color: string; pulso?: boolean }) {
  return (
    <span aria-hidden className="relative inline-flex h-2.5 w-2.5 shrink-0">
      {/* Anillo que crece y se desvanece mientras hay gente en el sitio. */}
      {pulso && (
        <span className={`absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping motion-safe:[animation-duration:2s] motion-reduce:hidden ${color}`} />
      )}
      <span className={`relative inline-block h-2.5 w-2.5 rounded-full ${color}`} />
    </span>
  )
}

function Barras({ items, vacio }: { items: [string, number][]; vacio: string }) {
  if (!items.length) return <p className="text-sm text-gray-600">{vacio}</p>
  const max = Math.max(...items.map((i) => i[1]))
  return (
    <ul className="flex flex-col gap-3">
      {items.map(([etiqueta, n]) => (
        <li key={etiqueta} className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[15px]">
            <span>{etiqueta}</span>
            <span className="font-medium tabular-nums">{n}</span>
          </div>
          <div className="h-2 rounded bg-[#e6ecf5]">
            <div className="h-2 rounded bg-primary-500" style={{ width: `${Math.max(3, (n / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function Panel() {
  const [periodo, setPeriodo] = useState<Periodo>('7d')
  // Datos guardados por periodo: al cambiar de pestaña nunca se muestran los
  // números de otro periodo.
  const [porPeriodo, setPorPeriodo] = useState<Partial<Record<Periodo, DatosPanel>>>({})
  const [cargando, setCargando] = useState(true)
  const [fallo, setFallo] = useState(false)
  const [ahora, setAhora] = useState(() => Date.now())
  const pedido = useRef<AbortController | null>(null)
  const datos = porPeriodo[periodo] ?? null

  const cargar = useCallback(async (p: Periodo) => {
    // Si había una consulta en curso, sobre todo de otro periodo, se cancela.
    pedido.current?.abort()
    const control = new AbortController()
    pedido.current = control
    setCargando(true)
    try {
      const res = await fetch(`/api/panel/datos?periodo=${p}`, { cache: 'no-store', signal: control.signal })
      if (res.status === 401) {
        window.location.reload()
        return
      }
      if (!res.ok) throw new Error(String(res.status))
      const nuevos = (await res.json()) as DatosPanel
      setPorPeriodo((antes) => ({ ...antes, [p]: nuevos }))
      setFallo(false)
    } catch (error) {
      if (control.signal.aborted) return
      setFallo(true)
    } finally {
      if (pedido.current === control) setCargando(false)
    }
  }, [])

  // Se actualiza solo mientras la pestaña está a la vista.
  useEffect(() => {
    cargar(periodo)
    const intervalo = setInterval(() => {
      if (document.visibilityState === 'visible') cargar(periodo)
    }, CADA_MS)
    const alVolver = () => document.visibilityState === 'visible' && cargar(periodo)
    document.addEventListener('visibilitychange', alVolver)
    return () => {
      clearInterval(intervalo)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [periodo, cargar])

  useEffect(() => {
    const reloj = setInterval(() => setAhora(Date.now()), 5000)
    return () => clearInterval(reloj)
  }, [])

  // Bloques de carga al cambiar de periodo o al volver tras más de un minuto.
  // La actualización de cada 30 s no los muestra, para que no parpadee.
  const viejos = !datos || ahora - new Date(datos.actualizado).getTime() > 2 * CADA_MS
  const mostrarBloques = !datos || (cargando && viejos)

  const comparacion = PERIODOS.find((p) => p.valor === periodo)!.comparacion
  const destacadas = new Set(['cv', 'mensajes'])

  return (
    <main className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 pb-8 pt-5 lg:gap-6 lg:px-10 lg:pt-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between lg:gap-5">
          <Logo href="/" rastrear={false} />
          <div className="hidden lg:block">
            <h1 className="text-2xl font-semibold">Tu portafolio</h1>
            <Actualizado datos={mostrarBloques ? null : datos} cargando={cargando} ahora={ahora} />
          </div>
          <EnVivo fallo={fallo} className="lg:hidden" />
        </div>
        <div className="lg:hidden">
          <h1 className="text-[28px] font-semibold leading-tight">Tu portafolio</h1>
          <Actualizado datos={mostrarBloques ? null : datos} cargando={cargando} ahora={ahora} />
        </div>
        <div className="flex items-center gap-3">
          <div role="tablist" aria-label="Periodo" className="flex flex-1 gap-1 rounded-full bg-[#e6ecf5] p-1 lg:flex-none">
            {PERIODOS.map((p) => (
              <button
                key={p.valor}
                role="tab"
                aria-selected={periodo === p.valor}
                onClick={() => setPeriodo(p.valor)}
                className={`flex-1 whitespace-nowrap rounded-full px-[18px] py-2 text-sm transition lg:flex-none ${anilloFoco} ${
                  periodo === p.valor ? 'bg-white font-semibold text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {p.etiqueta}
              </button>
            ))}
          </div>
          <EnVivo fallo={fallo} className="hidden lg:flex" />
        </div>
      </header>

      {datos?.muestra && (
        <p className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-900">Datos de ejemplo: falta la llave de PostHog en local.</p>
      )}

      {fallo && datos && !mostrarBloques && (
        <section className={tarjeta} aria-live="polite">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Punto color="bg-[#e4765e]" /> No se pudo actualizar
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Mostramos los datos de {haceCuanto(datos.actualizado, ahora)}. Lo volvemos a intentar solos.
          </p>
        </section>
      )}

      {mostrarBloques || !datos ? (
        fallo && !cargando ? (
          <p className="py-16 text-center text-gray-600">No se pudieron cargar los datos. Lo volvemos a intentar solos.</p>
        ) : (
          <Esqueleto />
        )
      ) : (
        <>
          {/* En celular «Ahora mismo» va primero; en escritorio, las cifras. */}
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[392px_1fr] lg:items-stretch lg:gap-x-4 lg:gap-y-6">
          <section aria-label="Cifras del periodo" className="order-2 grid grid-cols-2 gap-3 lg:order-1 lg:col-span-2 lg:grid-cols-4 lg:gap-4">
            {datos.cifras.map((c) => {
              const dest = destacadas.has(c.clave)
              const d = cambio(c, comparacion)
              return (
                <div
                  key={c.clave}
                  className={`flex flex-col gap-1 rounded-xl border p-4 lg:px-5 lg:py-[18px] ${
                    dest ? 'border-primary-100 bg-primary-50' : 'border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-[13px] text-gray-600 lg:text-sm">{c.etiqueta}</span>
                  <span className={`text-[32px] font-semibold leading-tight tabular-nums lg:text-4xl ${dest ? 'text-primary-500' : ''}`}>
                    {c.valor}
                  </span>
                  <span className={`text-xs lg:text-[13px] ${d.sube ? 'text-[#108512]' : 'text-gray-600'}`}>{d.texto}</span>
                </div>
              )
            })}
          </section>

            <div className="order-1 lg:order-2">
              <AhoraMismo datos={datos} ahora={ahora} />
            </div>
            <section className={`order-3 ${tarjeta}`}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Quién abrió tus enlaces</h2>
                <span className="hidden text-[13px] text-gray-600 lg:inline">{PERIODOS.find((p) => p.valor === periodo)!.etiqueta}</span>
              </div>
              {datos.enlaces.length ? (
                <ul className="mt-4">
                  {datos.enlaces.map((e) => (
                    <li key={e.etiqueta} className="flex items-center gap-3 border-t border-gray-300 py-3 last:pb-0 lg:gap-4">
                      <div className="min-w-0 flex-1 lg:grid lg:grid-cols-2 lg:gap-4">
                        <p className="font-medium lg:text-[15px]">{e.etiqueta}</p>
                        <p className="text-[13px] text-gray-600 lg:text-sm">{e.detalle}</p>
                      </div>
                      <span className="shrink-0 text-[13px] text-gray-600 lg:w-[120px] lg:text-sm">{haceCuanto(e.ultimo, ahora)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-[21px] text-gray-600">
                  Todavía nadie llegó con un enlace con seguimiento. Usa uno distinto en cada postulación para saber quién abrió tu portafolio.
                </p>
              )}
            </section>
          </div>

          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-3">
            <section className={tarjeta}>
              <Titulo texto="De dónde llegan" extra="visitantes" />
              <div className="mt-4">
                <Barras items={datos.fuentes} vacio="Sin visitas en este periodo." />
              </div>
            </section>
            <section className={tarjeta}>
              <Titulo texto="Casos más vistos" extra="personas" />
              <div className="mt-4">
                <Barras items={datos.casos} vacio="Nadie ha abierto un caso en este periodo." />
              </div>
            </section>
            <section className={tarjeta}>
              <Titulo texto="Actividad reciente" />
              {datos.actividad.length ? (
                <ul className="mt-4 flex flex-col gap-4">
                  {datos.actividad.map((a, i) => (
                    <li key={i} className="flex gap-3">
                      <span aria-hidden className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                      <div>
                        <p className="text-[15px] leading-[21px]">{a.texto}</p>
                        <p className="text-xs text-gray-600">{haceCuanto(a.cuando, ahora)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-gray-600">Sin actividad en este periodo.</p>
              )}
            </section>
          </div>
        </>
      )}

      <a
        href={ENLACE_POSTHOG}
        target="_blank"
        rel="noreferrer"
        className={`self-center rounded-lg pt-1 text-sm font-medium text-primary-500 hover:text-primary-700 ${anilloFoco}`}
      >
        Abrir en PostHog →
      </a>
    </main>
  )
}

function Titulo({ texto, extra }: { texto: string; extra?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">{texto}</h2>
      {extra && <span className="text-[13px] text-gray-600">{extra}</span>}
    </div>
  )
}

function Actualizado({ datos, cargando, ahora }: { datos: DatosPanel | null; cargando: boolean; ahora: number }) {
  return (
    <p className="mt-1 text-[13px] text-gray-600">
      {!datos || cargando ? 'Actualizando…' : `Actualizado ${haceCuanto(datos.actualizado, ahora)}`} · sin bots ni tus visitas
    </p>
  )
}

/** Bloque gris con el brillo de los skeletons del sitio. */
function Bloque({ className }: { className: string }) {
  return (
    <span aria-hidden className={`relative block overflow-hidden rounded-md bg-[#e6ecf5] ${className}`}>
      <span className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </span>
  )
}

function Esqueleto() {
  const caja = `${tarjeta} flex flex-col gap-3.5`
  return (
    <div role="status" aria-label="Actualizando datos" className="flex flex-col gap-4 lg:grid lg:grid-cols-[392px_1fr] lg:gap-x-4 lg:gap-y-6">
      <div className="order-2 grid grid-cols-2 gap-3 lg:order-1 lg:col-span-2 lg:grid-cols-4 lg:gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-2.5 rounded-xl border border-gray-300 bg-white p-4">
            <Bloque className="h-3 w-24" />
            <Bloque className="h-8 w-12" />
            <Bloque className="h-2.5 w-28" />
          </div>
        ))}
      </div>
      <div className={`order-1 lg:order-2 ${caja}`}>
        <Bloque className="h-4 w-32" />
        <Bloque className="h-10 w-16" />
        <Bloque className="h-3 w-60 max-w-full" />
        <Bloque className="h-3 w-44" />
      </div>
      <div className={`order-3 ${caja}`}>
        <Bloque className="h-4 w-44" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-2">
            <Bloque className="h-3 w-64 max-w-full" />
            <Bloque className="h-2.5 w-40" />
          </div>
        ))}
      </div>
    </div>
  )
}

function EnVivo({ fallo, className = '' }: { fallo: boolean; className?: string }) {
  return (
    <span className={`flex items-center gap-1.5 rounded-full border border-gray-300 bg-white py-1.5 pl-2.5 pr-3 text-[13px] font-medium ${className}`}>
      <Punto color={fallo ? 'bg-[#e4765e]' : 'bg-[#108512]'} />
      {fallo ? 'Sin conexión' : 'En vivo'}
    </span>
  )
}

function AhoraMismo({ datos, ahora }: { datos: DatosPanel; ahora: number }) {
  const n = datos.ahora.length
  return (
    <section className={`h-full ${tarjeta}`} aria-live="polite">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Punto color={n ? 'bg-[#108512]' : 'bg-gray-400'} pulso={n > 0} /> Ahora mismo
      </h2>
      {n ? (
        <>
          <p className="mt-4 flex items-baseline gap-2">
            <span className="text-[44px] font-semibold leading-none tabular-nums">{n}</span>
            <span className="text-[15px] text-gray-600">{n === 1 ? 'persona en el sitio' : 'personas en el sitio'}</span>
          </p>
          <ul className="mt-4">
            {datos.ahora.map((p, i) => (
              <li key={i} className="border-t border-gray-300 py-3 last:pb-0">
                <p className="font-medium">{p.pagina}</p>
                <p className="text-[13px] text-gray-600">
                  {p.pais} · {llegada(p.fuente)} · {duracion(p.segundos)}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p className="mt-4">Nadie en el sitio ahora mismo.</p>
          {datos.ultimaVisita && (
            <p className="mt-2 text-[13px] text-gray-600">
              La última visita fue {haceCuanto(datos.ultimaVisita.cuando, ahora).replace(/^Hoy/, 'hoy a las').replace(/^Ayer/, 'ayer a las')}, desde{' '}
              {datos.ultimaVisita.pais}, en {datos.ultimaVisita.pagina}.
            </p>
          )}
        </>
      )}
    </section>
  )
}
