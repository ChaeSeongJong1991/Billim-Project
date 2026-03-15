'use client'

import { useWorkOrders } from '@/hooks/useWorkOrders'
import { WorkOrderCard } from '@/components/workorder/WorkOrderCard'
import { Spinner } from '@/components/common/Spinner'
import { Error } from '@/components/common/Error'

export function WorkOrderList() {
  const { data: workOrders, isLoading, error } = useWorkOrders()

  if (isLoading) return <Spinner />
  if (error) return <Error message="민원 목록을 불러올 수 없습니다" />

  return (
    <div className="space-y-4">
      {workOrders && workOrders.length > 0 ? (
        workOrders.map((workOrder) => (
          <WorkOrderCard key={workOrder.id} workOrder={workOrder} />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          등록된 민원이 없습니다
        </div>
      )}
    </div>
  )
}
