import { Metadata } from 'next'
import { StatCard } from './components/StatCard'
import { RecentWorkOrders } from './components/RecentWorkOrders'
import { Stats } from './components/Stats'

export const metadata: Metadata = {
  title: '임차인 대시보드',
  description: '민원 및 계약 정보 한눈에 보기',
}

export default function DashboardTenantPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="mt-2 text-gray-600">임차인 계정의 요약 정보입니다</p>
      </div>

      <Stats />

      <div className="grid gap-6 lg:grid-cols-3">
        <StatCard title="진행 중인 민원" value="3" trend="up" />
        <StatCard title="완료된 민원" value="12" trend="down" />
        <StatCard title="대기 중인 민원" value="1" trend="neutral" />
      </div>

      <RecentWorkOrders />
    </div>
  )
}
