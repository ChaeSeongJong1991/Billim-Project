'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export interface VendorFormData {
  name: string
  phone: string
  category: string
  email?: string
  address?: string
  specialties?: string[]
}

export interface VendorFormProps {
  initialData?: Partial<VendorFormData> & { id?: string }
  onSubmit?: (data: VendorFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  error?: string | null
}

export function VendorForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading: externalLoading = false,
  error: externalError = null,
}: VendorFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<VendorFormData>({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    category: initialData?.category || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    specialties: initialData?.specialties || [],
  })
  const [isLoading, setIsLoading] = useState(externalLoading)
  const [error, setError] = useState(externalError)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (onSubmit) {
        await onSubmit(formData)
      }
      router.push('/admin/vendors')
    } catch (err) {
      const message = err instanceof Error ? err.message : '협력업체 등록에 실패했습니다'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      router.back()
    }
  }

  return (
    <Card className="p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">업체명</label>
          <Input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="mt-2"
            placeholder="협력업체 이름"
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
            <option value="cleaning">청소</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">연락처</label>
          <Input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="mt-2"
            placeholder="010-0000-0000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">이메일</label>
          <Input
            type="email"
            value={formData.email || ''}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mt-2"
            placeholder="example@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">주소</label>
          <Input
            type="text"
            value={formData.address || ''}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="mt-2"
            placeholder="협력업체 주소"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? '등록 중...' : '협력업체 등록'}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={handleCancel}
            className="flex-1"
          >
            취소
          </Button>
        </div>
      </form>
    </Card>
  )
}
