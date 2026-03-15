'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export interface GalleryImage {
  id: string
  src: string
  alt?: string
  caption?: string
}

export interface ImageGalleryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  images: GalleryImage[]
  onDelete?: (id: string) => void
  onAdd?: (file: File) => void
  maxWidth?: number
  columns?: number
  enableDelete?: boolean
  enableAdd?: boolean
}

/**
 * ImageGallery: 반응형 사진 갤러리 컴포넌트
 *
 * @example
 * <ImageGallery
 *   images={[{ id: '1', src: '/image.jpg', alt: 'Image' }]}
 *   onDelete={(id) => console.log('Delete', id)}
 *   onAdd={(file) => console.log('Add', file)}
 *   columns={3}
 *   enableDelete
 *   enableAdd
 * />
 */
function ImageGalleryComponent({
  images,
  onDelete,
  onAdd,
  enableDelete = false,
  enableAdd = false,
  className,
  ...props
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onAdd?.(file)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(id)
  }

  return (
    <div className={cn('w-full', className)} {...props}>
      {/* Gallery Grid */}
      <div
        className={cn(
          'grid gap-3',
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        )}
      >
        {images.map((image) => (
          <div
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer"
            onClick={() => setSelectedImage(image.id)}
          >
            <Image
              src={image.src}
              alt={image.alt || 'Gallery image'}
              fill
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20">
              {enableDelete && onDelete && (
                <button
                  onClick={(e) => handleDelete(image.id, e)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Delete image"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Caption */}
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2">
                <p className="text-xs text-white truncate">{image.caption}</p>
              </div>
            )}
          </div>
        ))}

        {/* Add Image Button */}
        {enableAdd && onAdd && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-primary hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-900/50 dark:hover:bg-gray-800"
          >
            <div className="flex h-full w-full items-center justify-center flex-col gap-2">
              <svg
                className="h-6 w-6 text-gray-400 group-hover:text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-xs text-gray-500 group-hover:text-primary">
                이미지 추가
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Add image"
            />
          </button>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close preview"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {images.find((img) => img.id === selectedImage) && (
            <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <Image
                src={images.find((img) => img.id === selectedImage)?.src || ''}
                alt="Preview"
                fill
                className="rounded-lg object-contain"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const ImageGallery = React.memo(
  ImageGalleryComponent,
  (prevProps, nextProps) => {
    // images 배열이 동일한지 확인 (얕은 비교로 충분)
    return (
      prevProps.images === nextProps.images &&
      prevProps.enableDelete === nextProps.enableDelete &&
      prevProps.enableAdd === nextProps.enableAdd &&
      prevProps.className === nextProps.className &&
      prevProps.onDelete === nextProps.onDelete &&
      prevProps.onAdd === nextProps.onAdd
    )
  }
)

ImageGallery.displayName = 'ImageGallery'

export { ImageGallery }
