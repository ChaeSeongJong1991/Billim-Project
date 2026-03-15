'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface FilterByCategoryProps {
  onFilterChange?: (category: string) => void
}

const CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'plumbing', name: '배관' },
  { id: 'electrical', name: '전기' },
  { id: 'cooling', name: '냉난방' },
  { id: 'safety', name: '안전' },
]

export function FilterByCategory({ onFilterChange }: FilterByCategoryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    onFilterChange?.(category)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => (
        <Button
          key={category.id}
          variant={
            activeCategory === category.id ? 'default' : 'outline'
          }
          onClick={() => handleCategoryChange(category.id)}
          size="sm"
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
