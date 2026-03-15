'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function VendorInfo() {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-bold">협력업체 정보</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-600">업체명</p>
          <p className="mt-1">협력업체 미배정</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">상태</p>
          <Badge className="mt-1">미배정</Badge>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">연락처</p>
          <p className="mt-1 text-gray-600">-</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">예상 소요 시간</p>
          <p className="mt-1 text-gray-600">-</p>
        </div>
      </div>
    </Card>
  )
}
