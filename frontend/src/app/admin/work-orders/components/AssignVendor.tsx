'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useVendors } from '@/hooks/useVendors'

export function AssignVendor() {
  const { data: vendors } = useVendors()
  const [selectedVendor, setSelectedVendor] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAssign = async () => {
    if (!selectedVendor) return

    setIsLoading(true)
    try {
      // API 호출 예정
      console.log('Assigning vendor:', selectedVendor)
    } catch (error) {
      console.error('Error assigning vendor:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-bold">협력업체 배정</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">협력업체 선택</label>
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 p-2"
          >
            <option value="">선택하세요</option>
            {vendors?.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={handleAssign}
          disabled={isLoading || !selectedVendor}
          className="w-full"
        >
          {isLoading ? '배정 중...' : '협력업체 배정'}
        </Button>
      </div>
    </Card>
  )
}
