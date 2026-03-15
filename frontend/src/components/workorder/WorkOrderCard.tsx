'use client'

import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface WorkOrder {
  id: string
  title: string
  description?: string
  category: string
  priority: string
  status: string
  createdAt: string
}

interface WorkOrderCardProps {
  workOrder: WorkOrder
}

export function WorkOrderCard({ workOrder }: WorkOrderCardProps) {
  const priorityColors: Record<string, string> = {
    low: 'bg-green-100 text-green-800',
    normal: 'bg-blue-100 text-blue-800',
    high: 'bg-yellow-100 text-yellow-800',
    urgent: 'bg-red-100 text-red-800',
  }

  return (
    <Link href={`/work-orders/${workOrder.id}`}>
      <div className="cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="flex-1 font-semibold">{workOrder.title}</h3>
            <Badge variant="secondary">{workOrder.status}</Badge>
          </div>

          {workOrder.description && (
            <p className="line-clamp-2 text-sm text-gray-600">
              {workOrder.description}
            </p>
          )}

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <Badge variant="outline">{workOrder.category}</Badge>
              <div className={`rounded px-2 py-1 text-xs font-medium ${priorityColors[workOrder.priority] || priorityColors.normal}`}>
                {workOrder.priority}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(workOrder.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
