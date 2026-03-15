'use client'

import { useWorkOrders } from '@/hooks/useWorkOrders'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/common/Spinner'
import { Error } from '@/components/common/Error'

export function AssignmentList() {
  const { data: workOrders, isLoading, error } = useWorkOrders()

  if (isLoading) return <Spinner />
  if (error) return <Error message="배정된 민원을 불러올 수 없습니다" />

  // 현재 로그인한 협력업체에게 배정된 민원만 필터링
  const assignedOrders = workOrders || []

  return (
    <div className="space-y-4">
      {assignedOrders.length > 0 ? (
        assignedOrders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{order.title}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {order.description}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="secondary">{order.category}</Badge>
                  <Badge>{order.status}</Badge>
                </div>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>신청: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          배정된 민원이 없습니다
        </div>
      )}
    </div>
  )
}
