'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

interface ImageUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
}

export function ImageUploadZone({
  onFilesSelected,
  maxFiles = 5,
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    )

    const combinedFiles = [...files, ...droppedFiles].slice(0, maxFiles)
    setFiles(combinedFiles)
    onFilesSelected(combinedFiles)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    const combinedFiles = [...files, ...selectedFiles].slice(0, maxFiles)
    setFiles(combinedFiles)
    onFilesSelected(combinedFiles)
  }

  return (
    <div
      className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">이미지를 드래그하거나 클릭하세요</p>
        <p className="text-xs text-gray-600">
          최대 {maxFiles}개 파일 선택 가능
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
        >
          파일 선택
        </button>
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded bg-gray-200"
            >
              <Image
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
