'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface FilterBarProps {
  onFilterChange?: (filters: FilterState) => void
}

interface FilterState {
  status?: string
  category?: string
  search?: string
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({})

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleStatusFilter = (status: string) => {
    const newFilters = { ...filters, status }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <Input
        placeholder="민원 검색..."
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.status === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusFilter('')}
        >
          전체
        </Button>
        <Button
          variant={filters.status === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusFilter('pending')}
        >
          대기 중
        </Button>
        <Button
          variant={filters.status === 'in_progress' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusFilter('in_progress')}
        >
          진행 중
        </Button>
        <Button
          variant={filters.status === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleStatusFilter('completed')}
        >
          완료
        </Button>
      </div>
    </div>
  )
}
