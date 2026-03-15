'use client'

import { Card } from '@/components/ui/card'

export function VendorStats() {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-bold">협력업체 통계</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm font-medium text-gray-600">완료한 업무</p>
          <p className="mt-2 text-2xl font-bold">24</p>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm font-medium text-gray-600">평균 평점</p>
          <p className="mt-2 text-2xl font-bold">4.8</p>
        </div>

        <div className="rounded-lg bg-yellow-50 p-4">
          <p className="text-sm font-medium text-gray-600">평균 소요일</p>
          <p className="mt-2 text-2xl font-bold">2.5</p>
        </div>

        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm font-medium text-gray-600">재작업율</p>
          <p className="mt-2 text-2xl font-bold">5%</p>
        </div>
      </div>
    </Card>
  )
}
