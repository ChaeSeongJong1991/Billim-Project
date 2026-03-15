import { Metadata } from 'next'
import { MaintenanceList } from './components/MaintenanceList'
import { FilterByCategory } from './components/FilterByCategory'

export const metadata: Metadata = {
  title: '예방정비 가이드',
  description: '예방정비 가이드 목록 조회 및 관리',
}

export default function AdminMaintenanceGuidesPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">예방정비 가이드</h1>
        <p className="mt-2 text-gray-600">예방정비 관련 정보를 제공하세요</p>
      </div>

      <div>
        <FilterByCategory />
      </div>

      <MaintenanceList />
    </div>
  )
}
