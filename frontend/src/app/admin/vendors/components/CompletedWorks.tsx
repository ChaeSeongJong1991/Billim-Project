'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function CompletedWorks() {
  const works = [
    {
      id: '1',
      title: '배관 수리',
      date: '2024-03-01',
      status: 'completed',
    },
    {
      id: '2',
      title: '전기 배선 점검',
      date: '2024-02-28',
      status: 'completed',
    },
    {
      id: '3',
      title: '청소 서비스',
      date: '2024-02-25',
      status: 'completed',
    },
  ]

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-bold">최근 완료 업무</h3>

      <div className="space-y-3">
        {works.length > 0 ? (
          works.map((work) => (
            <div
              key={work.id}
              className="flex items-center justify-between border-b pb-3 last:border-b-0"
            >
              <div className="flex-1">
                <p className="font-medium">{work.title}</p>
                <p className="text-xs text-gray-600">
                  {new Date(work.date).toLocaleDateString()}
                </p>
              </div>
              <Badge>{work.status}</Badge>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">완료된 업무가 없습니다</p>
        )}
      </div>
    </Card>
  )
}
