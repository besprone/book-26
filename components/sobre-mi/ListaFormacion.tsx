interface ListaFormacionProps {
  titulo: string
  items: { nombre: string; institucion: string; año: string }[]
}

/** Lista compacta de cursos o estudios, con el año a la derecha. */
export default function ListaFormacion({ titulo, items }: ListaFormacionProps) {
  return (
    <div>
      <h3 className="text-xl font-normal mb-3 text-gray-900 dark:text-white">{titulo}</h3>
      <ul role="list">
        {items.map((item) => (
          <li
            key={`${item.nombre}-${item.institucion}`}
            className="flex items-start justify-between gap-4 py-3.5 border-b border-gray-300 dark:border-gray-700"
          >
            <div className="min-w-0">
              <p className="text-base leading-snug text-gray-900 dark:text-white">{item.nombre}</p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.institucion}</p>
            </div>
            <span className="flex-none text-sm text-primary-500 dark:text-primary-300">{item.año}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
