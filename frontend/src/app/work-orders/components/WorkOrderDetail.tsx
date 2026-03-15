'use client'

import { useWorkOrders } from '@/hooks/useWorkOrders'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/common/Spinner'
import { Error } from '@/components/common/Error'

interface WorkOrderDetailProps {
  id: string
}

export function WorkOrderDetail({ id }: WorkOrderDetailProps) {
  const { data: workOrders, isLoading, error } = useWorkOrders()

  if (isLoading) return <Spinner />
  if (error) return <Error message="민원 정보를 불러올 수 없습니다" />

  const workOrder = workOrders?.find((wo) => wo.id === id)

  if (!workOrder) {
    return <Error message="민원을 찾을 수 없습니다" />
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">{workOrder.title}</h2>
          <p className="mt-2 text-gray-600">{workOrder.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">카테고리</p>
            <p className="mt-1">{workOrder.category}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">우선순위</p>
            <p className="mt-1">{workOrder.priority}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">상태</p>
            <p className="mt-1">{workOrder.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">신청일</p>
            <p className="mt-1">{new Date(workOrder.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
