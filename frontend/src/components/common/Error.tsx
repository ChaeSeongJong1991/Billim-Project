'use client'

import { AlertCircle } from 'lucide-react'

interface ErrorProps {
  message: string
  retry?: () => void
}

export function Error({ message, retry }: ErrorProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <div>
          <p className="font-medium text-red-800">{message}</p>
          {retry && (
            <button
              onClick={retry}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              다시 시도
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
