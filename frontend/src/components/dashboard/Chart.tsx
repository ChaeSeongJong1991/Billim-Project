'use client'

import { Card } from '@/components/ui/card'

interface ChartProps {
  title: string
  data?: Record<string, number>
}

export function Chart({ title, data }: ChartProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-bold">{title}</h3>

      <div className="space-y-3">
        {data ? (
          Object.entries(data).map(([label, value]) => (
            <div key={label}>
              <div className="flex items-center justify-between text-sm">
                <p>{label}</p>
                <p className="font-medium">{value}</p>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${(value / 100) * 100}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">데이터 없음</p>
        )}
      </div>
    </Card>
  )
}
