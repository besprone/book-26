import type { Metadata } from 'next'
import '../globals.css'
import SiteShell from '@/components/SiteShell'
import { metadataRaiz } from '@/lib/metadata-raiz'

export const metadata: Metadata = metadataRaiz('es')

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="es">{children}</SiteShell>
}
