'use client'

import { Card } from '@/components/ui/card'

interface CategorySelectorProps {
  value: string
  onChange: (category: string) => void
}

const CATEGORIES = [
  { id: 'plumbing', name: '배관', icon: '🔧' },
  { id: 'electrical', name: '전기', icon: '⚡' },
  { id: 'cleaning', name: '청소', icon: '🧹' },
  { id: 'pest', name: '해충', icon: '🪳' },
  { id: 'structural', name: '구조', icon: '🏗️' },
]

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">카테고리 선택</label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {CATEGORIES.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer p-4 text-center transition-all ${
              value === category.id
                ? 'border-blue-500 bg-blue-50'
                : 'hover:border-gray-400'
            }`}
            onClick={() => onChange(category.id)}
          >
            <div className="text-2xl">{category.icon}</div>
            <p className="mt-2 text-sm font-medium">{category.name}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
