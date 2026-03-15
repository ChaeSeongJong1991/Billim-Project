'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface WorkOrderFormData {
  title: string
  description: string
  category: string
  priority: string
}

export function WorkOrderForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<WorkOrderFormData>({
    title: '',
    description: '',
    category: '',
    priority: 'normal',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // API 호출 예정
      console.log('Submitting:', formData)
      router.push('/work-orders')
    } catch (error) {
      console.error('Error creating work order:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">제목</label>
          <Input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="mt-2"
            placeholder="민원 제목을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">설명</label>
          <textarea
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-2 w-full rounded-md border border-gray-300 p-2"
            placeholder="민원 내용을 입력하세요"
            rows={5}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">카테고리</label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="mt-2 w-full rounded-md border border-gray-300 p-2"
            >
              <option value="">선택하세요</option>
              <option value="plumbing">배관</option>
              <option value="electrical">전기</option>
              <option value="cleaning">청소</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">우선순위</label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="mt-2 w-full rounded-md border border-gray-300 p-2"
            >
              <option value="low">낮음</option>
              <option value="normal">보통</option>
              <option value="high">높음</option>
              <option value="urgent">긴급</option>
            </select>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? '작성 중...' : '민원 작성'}
        </Button>
      </form>
    </Card>
  )
}
