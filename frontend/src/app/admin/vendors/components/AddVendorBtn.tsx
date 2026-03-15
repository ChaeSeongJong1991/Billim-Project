'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export function AddVendorBtn() {
  return (
    <Link href="/admin/vendors/create">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        협력업체 추가
      </Button>
    </Link>
  )
}
