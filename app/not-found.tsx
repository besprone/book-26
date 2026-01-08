import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <h1 className="text-6xl font-bold mb-4 text-gray-900 dark:text-white">404</h1>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
        Página no encontrada
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Lo sentimos, la página que buscas no existe.
      </p>
      <Link
        href="/"
        className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition inline-block"
      >
        Volver al inicio
      </Link>
    </div>
  )
}


