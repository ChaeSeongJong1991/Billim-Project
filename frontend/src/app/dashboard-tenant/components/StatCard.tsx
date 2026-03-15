'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  subtext?: string
}

export function StatCard({
  title,
  value,
  trend = 'neutral',
  subtext,
}: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {getTrendIcon()}
          </div>
          {subtext && (
            <p className="mt-2 text-xs text-gray-500">{subtext}</p>
          )}
        </div>
      </div>
    </Card>
  )
}
