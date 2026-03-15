'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const STATUS_OPTIONS = [
  { value: 'pending', label: '대기' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'completed', label: '완료' },
]

export function StatusChangeForm() {
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async () => {
    if (!selectedStatus) return

    setIsLoading(true)
    try {
      // API 호출 예정
      console.log('Changing status to:', selectedStatus)
    } catch (error) {
      console.error('Error changing status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-bold">상태 변경</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">새로운 상태</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 p-2"
          >
            <option value="">선택하세요</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleStatusChange}
          disabled={isLoading || !selectedStatus}
          className="w-full"
        >
          {isLoading ? '변경 중...' : '상태 변경'}
        </Button>
      </div>
    </Card>
  )
}
