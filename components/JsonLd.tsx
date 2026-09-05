/**
 * Inserta un bloque de datos estructurados (JSON-LD) en la página.
 *
 * Es un componente de servidor: el JSON se serializa en el build y viaja en el
 * HTML, que es donde lo buscan los rastreadores.
 *
 * El `<` se escapa como < para que un texto del contenido que incluyera
 * "</script>" no pueda cerrar la etiqueta antes de tiempo.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
