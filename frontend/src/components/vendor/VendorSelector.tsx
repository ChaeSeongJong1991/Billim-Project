'use client'

import { useVendors } from '@/hooks/useVendors'
import { Spinner } from '@/components/common/Spinner'

interface VendorSelectorProps {
  value: string
  onChange: (vendorId: string) => void
  disabled?: boolean
}

export function VendorSelector({
  value,
  onChange,
  disabled = false,
}: VendorSelectorProps) {
  const { data: vendors, isLoading } = useVendors()

  if (isLoading) return <Spinner />

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full rounded-md border border-gray-300 p-2 disabled:bg-gray-100"
    >
      <option value="">협력업체를 선택하세요</option>
      {vendors?.map((vendor) => (
        <option key={vendor.id} value={vendor.id}>
          {vendor.name}
        </option>
      ))}
    </select>
  )
}
