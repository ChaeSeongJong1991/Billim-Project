'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface Vendor {
  id: string
  name: string
  category?: string
  phone?: string
  status?: string
}

interface VendorCardProps {
  vendor: Vendor
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link href={`/admin/vendors/${vendor.id}`}>
      <Card className="cursor-pointer p-4 transition-all hover:shadow-md">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold">{vendor.name}</h3>
            {vendor.status && (
              <Badge variant="secondary">{vendor.status}</Badge>
            )}
          </div>

          {vendor.category && (
            <p className="text-sm text-gray-600">{vendor.category}</p>
          )}

          {vendor.phone && (
            <p className="text-sm text-gray-600">{vendor.phone}</p>
          )}
        </div>
      </Card>
    </Link>
  )
}
