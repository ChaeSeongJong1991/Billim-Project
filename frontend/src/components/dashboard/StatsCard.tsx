'use client'

import { Card } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: string | number
  subtext?: string
  icon?: React.ReactNode
}

export function StatsCard({
  title,
  value,
  subtext,
  icon,
}: StatsCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
          {subtext && (
            <p className="mt-1 text-xs text-gray-500">{subtext}</p>
          )}
        </div>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
    </Card>
  )
}
