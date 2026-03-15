'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  onUpload?: (files: File[]) => void
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    const newPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    )
    setPreviews(newPreviews)
    onUpload?.(selectedFiles)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)

    const newPreviews = droppedFiles.map((file) =>
      URL.createObjectURL(file)
    )
    setPreviews(newPreviews)
    onUpload?.(droppedFiles)
  }

  return (
    <Card
      className="cursor-pointer border-2 border-dashed p-6 text-center transition-colors hover:border-blue-500"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="space-y-3">
        <p className="text-sm font-medium">이미지 업로드</p>
        <p className="text-xs text-gray-600">
          드래그하여 놓거나 클릭하여 선택
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          size="sm"
        >
          파일 선택
        </Button>
      </div>

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="aspect-square rounded overflow-hidden bg-gray-100">
              <Image
                src={preview}
                alt={`Preview ${index}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
