import { Metadata } from 'next'
import { AssignmentList } from './components/AssignmentList'
import { StatusUpdateForm } from './components/StatusUpdateForm'

export const metadata: Metadata = {
  title: '배정된 민원',
  description: '협력업체에게 배정된 민원 목록',
}

export default function VendorAssignmentsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">배정된 민원</h1>
        <p className="mt-2 text-gray-600">할당된 민원을 확인하고 상태를 업데이트하세요</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AssignmentList />
        </div>
        <div>
          <StatusUpdateForm />
        </div>
      </div>
    </div>
  )
}
