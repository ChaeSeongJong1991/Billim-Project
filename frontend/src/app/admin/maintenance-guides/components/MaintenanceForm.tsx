'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface MaintenanceFormData {
  title: string
  description: string
  category: string
  content: string
}

export function MaintenanceForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<MaintenanceFormData>({
    title: '',
    description: '',
    category: '',
    content: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // API 호출 예정
      console.log('Submitting:', formData)
      router.push('/admin/maintenance-guides')
    } catch (error) {
      console.error('Error creating guide:', error)
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
            placeholder="가이드 제목"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">설명</label>
          <Input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="mt-2"
            placeholder="간단한 설명"
          />
        </div>

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
            <option value="cooling">냉난방</option>
            <option value="safety">안전</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">상세 내용</label>
          <textarea
            required
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="mt-2 w-full rounded-md border border-gray-300 p-2"
            placeholder="상세 내용을 입력하세요"
            rows={8}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? '작성 중...' : '가이드 작성'}
        </Button>
      </form>
    </Card>
  )
}
