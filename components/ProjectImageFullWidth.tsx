interface ProjectImageFullWidthProps {
  src: string
  alt: string
}

export default function ProjectImageFullWidth({ src, alt }: ProjectImageFullWidthProps) {
  return (
    <div className="my-12 md:my-16">
      <div className="w-full h-64 md:h-80 lg:h-96 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}

