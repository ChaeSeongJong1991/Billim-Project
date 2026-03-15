'use client'

import { Button } from '@/components/ui/button'

interface PrioritySelectorProps {
  value: string
  onChange: (priority: string) => void
}

const PRIORITIES = [
  { id: 'low', name: '낮음', color: 'bg-green-100 text-green-800' },
  { id: 'normal', name: '보통', color: 'bg-blue-100 text-blue-800' },
  { id: 'high', name: '높음', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'urgent', name: '긴급', color: 'bg-red-100 text-red-800' },
]

export function PrioritySelector({
  value,
  onChange,
}: PrioritySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">우선순위 선택</label>
      <div className="flex flex-wrap gap-2">
        {PRIORITIES.map((priority) => (
          <Button
            key={priority.id}
            variant={value === priority.id ? 'default' : 'outline'}
            onClick={() => onChange(priority.id)}
            className={value === priority.id ? '' : priority.color}
          >
            {priority.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
