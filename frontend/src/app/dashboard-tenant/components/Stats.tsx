'use client'

import { useWorkOrders } from '@/hooks/useWorkOrders'
import { StatCard } from './StatCard'

export function Stats() {
  const { data: workOrders } = useWorkOrders()

  const stats = {
    total: workOrders?.length || 0,
    pending: workOrders?.filter((wo) => wo.status === 'pending').length || 0,
    inProgress:
      workOrders?.filter((wo) => wo.status === 'in_progress').length || 0,
    completed:
      workOrders?.filter((wo) => wo.status === 'completed').length || 0,
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard title="총 민원" value={stats.total} />
      <StatCard title="대기 중" value={stats.pending} trend="neutral" />
      <StatCard title="진행 중" value={stats.inProgress} trend="up" />
      <StatCard title="완료" value={stats.completed} trend="up" />
    </div>
  )
}
