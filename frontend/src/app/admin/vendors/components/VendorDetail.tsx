'use client'

import { useVendors } from '@/hooks/useVendors'
import { Card } from '@/components/ui/card'
import { Spinner } from '@/components/common/Spinner'
import { Error } from '@/components/common/Error'

interface VendorDetailProps {
  id: string
}

export function VendorDetail({ id }: VendorDetailProps) {
  const { data: vendors, isLoading, error } = useVendors()

  if (isLoading) return <Spinner />
  if (error) return <Error message="협력업체 정보를 불러올 수 없습니다" />

  const vendor = vendors?.find((v) => v.id === id)

  if (!vendor) {
    return <Error message="협력업체를 찾을 수 없습니다" />
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">{vendor.name}</h2>
          <p className="mt-2 text-gray-600">{vendor.description || '-'}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-gray-600">카테고리</p>
            <p className="mt-1">{vendor.category || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">연락처</p>
            <p className="mt-1">{vendor.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">상태</p>
            <p className="mt-1">{vendor.status || '-'}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <p className="text-sm font-medium text-gray-600">상세 정보</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="font-medium">이메일:</span> {vendor.email || '-'}
            </p>
            <p>
              <span className="font-medium">주소:</span> {vendor.address || '-'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
