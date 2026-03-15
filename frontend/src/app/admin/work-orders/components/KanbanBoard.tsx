'use client'

import { Column } from './Column'

const COLUMNS = [
  { id: 'pending', title: '신규 접수', status: 'pending' },
  { id: 'in_progress', title: '진행 중', status: 'in_progress' },
  { id: 'completed', title: '완료', status: 'completed' },
]

export function KanbanBoard() {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-6 min-w-max p-6">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            title={column.title}
            status={column.status}
          />
        ))}
      </div>
    </div>
  )
}
