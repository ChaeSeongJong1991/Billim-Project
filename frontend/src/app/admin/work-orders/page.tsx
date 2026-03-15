import { Metadata } from 'next'
import { KanbanBoard } from './components/KanbanBoard'

export const metadata: Metadata = {
  title: '민원 관리 (관리자)',
  description: '모든 민원을 칸반 형태로 관리하세요',
}

export default function AdminWorkOrdersPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">민원 관리</h1>
        <p className="mt-2 text-gray-600">칸반 보드로 민원 상태를 관리하세요</p>
      </div>

      <KanbanBoard />
    </div>
  )
}
