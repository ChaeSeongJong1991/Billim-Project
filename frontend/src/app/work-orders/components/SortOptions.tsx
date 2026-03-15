'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface SortOptionsProps {
  onSortChange?: (sortBy: SortOption) => void
}

type SortOption = 'latest' | 'oldest' | 'priority_high' | 'priority_low'

export function SortOptions({ onSortChange }: SortOptionsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('latest')

  const handleSort = (option: SortOption) => {
    setSortBy(option)
    onSortChange?.(option)
  }

  return (
    <div className="rounded-lg border p-4">
      <p className="mb-3 text-sm font-medium">정렬</p>
      <div className="space-y-2">
        <Button
          variant={sortBy === 'latest' ? 'default' : 'outline'}
          size="sm"
          className="w-full justify-start"
          onClick={() => handleSort('latest')}
        >
          최신순
        </Button>
        <Button
          variant={sortBy === 'oldest' ? 'default' : 'outline'}
          size="sm"
          className="w-full justify-start"
          onClick={() => handleSort('oldest')}
        >
          오래된순
        </Button>
        <Button
          variant={sortBy === 'priority_high' ? 'default' : 'outline'}
          size="sm"
          className="w-full justify-start"
          onClick={() => handleSort('priority_high')}
        >
          우선순위 높음
        </Button>
        <Button
          variant={sortBy === 'priority_low' ? 'default' : 'outline'}
          size="sm"
          className="w-full justify-start"
          onClick={() => handleSort('priority_low')}
        >
          우선순위 낮음
        </Button>
      </div>
    </div>
  )
}
