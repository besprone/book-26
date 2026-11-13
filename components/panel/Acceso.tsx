'use client'

import { useState } from 'react'
import Logo from '@/components/Logo'
import { anilloFoco, baseBoton, tamanosBoton, variantesBoton } from '@/lib/estilos-boton'

type Estado = 'inicio' | 'enviando' | 'enviado' | 'error'

export default function Acceso({ enlaceVencido }: { enlaceVencido: boolean }) {
  const [correo, setCorreo] = useState('')
  const [estado, setEstado] = useState<Estado>('inicio')
  const [error, setError] = useState<string | null>(enlaceVencido ? 'Ese enlace ya venció o no es válido. Pide uno nuevo.' : null)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setEstado('enviando')
    setError(null)
    try {
      const res = await fetch('/api/panel/enlace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo }),
      })
      if (!res.ok) {
        const datos = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(datos?.error || 'No se pudo enviar el enlace.')
      }
      setEstado('enviado')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo enviar el enlace.')
      setEstado('error')
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-6 py-16">
      <Logo href="/" rastrear={false} />
      {estado === 'enviado' ? (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-semibold leading-tight">Revisa tu correo</h1>
            <p className="text-base leading-6 text-gray-600">
              Si ese correo tiene acceso, te llegará un enlace para entrar. Vence en 15 minutos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEstado('inicio')}
            className={`self-start rounded-lg font-medium text-primary-500 hover:text-primary-700 ${anilloFoco}`}
          >
            Enviar otro enlace
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-semibold leading-tight">Panel privado</h1>
            <p className="text-base leading-6 text-gray-600">
              Escribe tu correo y te mandamos un enlace para entrar. No necesitas contraseña.
            </p>
          </div>
          <form onSubmit={enviar} className="flex flex-col gap-3">
            <label htmlFor="correo" className="text-sm font-medium">
              Correo
            </label>
            <input
              id="correo"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tu@correo.com"
              className="h-12 rounded-lg border border-gray-400 bg-white px-4 text-base placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
            {error && (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={estado === 'enviando'}
              className={`${baseBoton} ${variantesBoton.primary} ${tamanosBoton.lg} w-full`}
            >
              {estado === 'enviando' ? 'Enviando…' : 'Enviarme el enlace'}
            </button>
          </form>
          <p className="text-[13px] text-gray-600">Solo funciona con el correo del dueño del sitio.</p>
        </>
      )}
    </main>
  )
}
