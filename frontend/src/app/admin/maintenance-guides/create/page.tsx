import { Metadata } from 'next'
import { MaintenanceForm } from '../components/MaintenanceForm'

export const metadata: Metadata = {
  title: '새 가이드 작성',
  description: '새로운 예방정비 가이드를 작성하세요',
}

export default function CreateMaintenanceGuidePage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">새 가이드 작성</h1>
        <p className="mt-2 text-gray-600">예방정비 가이드를 추가하세요</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <MaintenanceForm />
      </div>
    </div>
  )
}
