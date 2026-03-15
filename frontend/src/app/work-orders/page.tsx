import { Metadata } from 'next'
import { WorkOrderList } from './components/WorkOrderList'
import { FilterBar } from './components/FilterBar'
import { SortOptions } from './components/SortOptions'

export const metadata: Metadata = {
  title: '민원 목록',
  description: '등록된 민원 목록 조회 및 관리',
}

export default function WorkOrdersPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">민원 목록</h1>
          <p className="mt-2 text-gray-600">등록된 모든 민원을 확인하세요</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <FilterBar />
        </div>
        <div>
          <SortOptions />
        </div>
      </div>

      <WorkOrderList />
    </div>
  )
}
