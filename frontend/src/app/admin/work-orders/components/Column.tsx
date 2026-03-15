'use client'

import { useWorkOrders } from '@/hooks/useWorkOrders'
import { Card } from '@/components/ui/card'
import { WorkOrderCard } from '@/components/workorder/WorkOrderCard'

interface ColumnProps {
  title: string
  status: string
}

export function Column({ title, status }: ColumnProps) {
  const { data: workOrders } = useWorkOrders()

  const columnWorkOrders = workOrders?.filter(
    (wo) => wo.status === status
  ) || []

  return (
    <div className="w-80 flex-shrink-0">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium">
          {columnWorkOrders.length}
        </span>
      </div>

      <div className="space-y-3 rounded-lg bg-gray-100 p-4 min-h-96">
        {columnWorkOrders.length > 0 ? (
          columnWorkOrders.map((workOrder) => (
            <Card key={workOrder.id} className="p-3">
              <WorkOrderCard workOrder={workOrder} />
            </Card>
          ))
        ) : (
          <p className="text-center text-sm text-gray-500">작업 없음</p>
        )}
      </div>
    </div>
  )
}
