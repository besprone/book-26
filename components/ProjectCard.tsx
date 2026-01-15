'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from './Button'
import Badge from './Badge'
import { Image as ImageIcon } from 'lucide-react'
import ImageWithSkeleton from './ImageWithSkeleton'
import { getPostHog } from '@/lib/posthog'

interface ProjectCardProps {
  title: string
  description: string
  image?: string
  technologies: string[]
  slug: string
}

export default function ProjectCard({
  title,
  description,
  image,
  technologies,
  slug,
}: ProjectCardProps) {
  const pathname = usePathname()
  
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const sourcePage = pathname || 'unknown'
      try {
        const posthog = getPostHog()
        if (posthog && (posthog as any).__loaded) {
          posthog.capture('project_clicked', {
            project_slug: slug,
            project_title: title,
            source_page: sourcePage,
          })
        }
      } catch (e) {}
    }
  }

  return (
    <Link
      href={`/proyectos/${slug}`}
      onClick={handleClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-800 transition-all duration-300 transform hover:-translate-y-2 group"
    >
      <div className="h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden rounded-t-xl">
        {image ? (
          <div className="absolute inset-0 w-full h-full">
            <ImageWithSkeleton
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              aspectRatio="landscape"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-16 h-16 text-gray-500 dark:text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.slice(0, 3).map((tech) => (
            <Badge
              key={tech}
              variant="technology"
              technology={tech as 'UX' | 'Dev' | 'Data'}
              size="md"
              shape="rounded"
            >
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex justify-end">
          <span className="text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 px-3 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition text-sm font-medium">
            Ver caso
          </span>
        </div>
      </div>
    </Link>
  )
}

