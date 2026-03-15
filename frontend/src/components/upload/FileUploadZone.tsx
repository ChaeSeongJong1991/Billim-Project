'use client'

import { useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { X } from 'lucide-react'

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  maxFiles?: number
}

export function FileUploadZone({
  onFilesSelected,
  accept = '*',
  maxFiles = 10,
}: FileUploadZoneProps) {
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

    const droppedFiles = Array.from(e.dataTransfer.files)
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

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onFilesSelected(newFiles)
  }

  return (
    <Card className="p-6">
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
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="space-y-2">
          <p className="text-sm font-medium">파일을 드래그하거나 클릭하세요</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-3 rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
          >
            파일 선택
          </button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded bg-gray-50 p-3"
            >
              <span className="text-sm truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-600 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
