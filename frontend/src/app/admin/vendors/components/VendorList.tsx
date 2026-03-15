'use client'

import { useVendors } from '@/hooks/useVendors'
import { VendorCard } from '@/components/vendor/VendorCard'
import { Spinner } from '@/components/common/Spinner'
import { Error } from '@/components/common/Error'

export function VendorList() {
  const { data: vendors, isLoading, error } = useVendors()

  if (isLoading) return <Spinner />
  if (error) return <Error message="협력업체 목록을 불러올 수 없습니다" />

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {vendors && vendors.length > 0 ? (
        vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} />
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-gray-500">
          등록된 협력업체가 없습니다
        </div>
      )}
    </div>
  )
}
