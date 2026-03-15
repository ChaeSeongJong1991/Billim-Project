'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Guide {
  id: string
  title: string
  category?: string
  description?: string
  createdAt?: string
}

interface GuideCardProps {
  guide: Guide
}

export function GuideCard({ guide }: GuideCardProps) {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold">{guide.title}</h3>
          {guide.category && (
            <Badge variant="secondary">{guide.category}</Badge>
          )}
        </div>

        {guide.description && (
          <p className="text-sm text-gray-600">{guide.description}</p>
        )}

        {guide.createdAt && (
          <p className="text-xs text-gray-500">
            {new Date(guide.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </Card>
  )
}
