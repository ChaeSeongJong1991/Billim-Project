'use client'

export function Spinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="space-y-4 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
        <p className="text-sm text-gray-600">로딩 중...</p>
      </div>
    </div>
  )
}
