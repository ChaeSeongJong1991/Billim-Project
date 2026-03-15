import { Metadata } from 'next'
import { WorkOrderForm } from './components/WorkOrderForm'

export const metadata: Metadata = {
  title: '민원 작성',
  description: '새로운 민원을 등록하세요',
}

export default function CreateWorkOrderPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">민원 작성</h1>
        <p className="mt-2 text-gray-600">새로운 민원을 등록해주세요</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <WorkOrderForm />
      </div>
    </div>
  )
}
