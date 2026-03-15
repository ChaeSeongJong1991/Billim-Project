'use client'

import { Card } from '@/components/ui/card'

interface TimelineEvent {
  timestamp: string
  status: string
  message: string
}

export function Timeline() {
  const events: TimelineEvent[] = [
    {
      timestamp: new Date().toISOString(),
      status: 'created',
      message: '민원이 생성되었습니다',
    },
  ]

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-bold">진행 현황</h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              {index < events.length - 1 && (
                <div className="mt-2 h-8 w-0.5 bg-gray-300" />
              )}
            </div>
            <div className="pb-4">
              <p className="text-sm font-medium">{event.message}</p>
              <p className="text-xs text-gray-600">
                {new Date(event.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
