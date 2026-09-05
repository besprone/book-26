import Image from 'next/image'

interface ProjectImageFullWidthProps {
  src: string
  alt: string
}

export default function ProjectImageFullWidth({ src, alt }: ProjectImageFullWidthProps) {
  return (
    <div className="my-12 md:my-16">
      <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  )
}

