'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useWorkOrders } from '@/hooks/useWorkOrders'
import { Spinner } from '@/components/common/Spinner'

export function RecentWorkOrders() {
  const { data: workOrders, isLoading } = useWorkOrders()

  if (isLoading) return <Spinner />

  const recentOrders = workOrders?.slice(0, 5) || []

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-bold">최근 민원</h3>

      {recentOrders.length > 0 ? (
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border-b pb-3 last:border-b-0"
            >
              <div className="flex-1">
                <p className="font-medium">{order.title}</p>
                <p className="text-xs text-gray-600">{order.category}</p>
              </div>
              <Badge variant="secondary">{order.status}</Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">등록된 민원이 없습니다</p>
      )}
    </Card>
  )
}
