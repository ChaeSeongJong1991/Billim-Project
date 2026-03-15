'use client'

interface TimelineEvent {
  id: string
  status: string
  timestamp: string
  message: string
}

interface StatusTimelineProps {
  events: TimelineEvent[]
}

export function StatusTimeline({ events }: StatusTimelineProps) {
  const statusColors: Record<string, string> = {
    pending: 'bg-gray-400',
    in_progress: 'bg-blue-500',
    completed: 'bg-green-500',
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div
              className={`h-3 w-3 rounded-full ${statusColors[event.status] || statusColors.pending}`}
            />
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
  )
}
