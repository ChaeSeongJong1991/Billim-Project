'use client'

import { Card } from '@/components/ui/card'

export function PerformanceStats() {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-bold">성과 지표</h3>

      <div className="space-y-4">
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-600">완료한 업무</p>
          <p className="mt-2 text-2xl font-bold">24</p>
          <p className="text-xs text-gray-600">누적</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-600">평균 평점</p>
          <p className="mt-2 text-2xl font-bold">4.8</p>
          <p className="text-xs text-gray-600">5.0 중</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-600">평균 소요 시간</p>
          <p className="mt-2 text-2xl font-bold">2.5</p>
          <p className="text-xs text-gray-600">일</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-600">재작업율</p>
          <p className="mt-2 text-2xl font-bold">5%</p>
          <p className="text-xs text-gray-600">최근 3개월</p>
        </div>
      </div>
    </Card>
  )
}
