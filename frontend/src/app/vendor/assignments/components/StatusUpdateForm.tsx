'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface StatusUpdateFormProps {
  assignmentId?: string
}

const STATUS_OPTIONS = [
  { value: 'pending', label: '접수' },
  { value: 'in_progress', label: '진행 중' },
  { value: 'completed', label: '완료' },
]

export function StatusUpdateForm({ assignmentId }: StatusUpdateFormProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStatus) return

    setIsLoading(true)
    try {
      // API 호출 예정
      console.log('Updating status:', {
        assignmentId,
        status: selectedStatus,
        notes,
      })
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-bold">상태 업데이트</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">새로운 상태</label>
          <select
            required
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

        <div>
          <label className="block text-sm font-medium">
            작업 메모 (선택)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 p-2"
            placeholder="작업 진행 상황을 입력하세요"
            rows={4}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? '업데이트 중...' : '상태 업데이트'}
        </Button>
      </form>
    </Card>
  )
}
