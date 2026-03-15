import { Metadata } from 'next'
import { VendorList } from './components/VendorList'
import { AddVendorBtn } from './components/AddVendorBtn'

export const metadata: Metadata = {
  title: '협력업체 관리',
  description: '협력업체 목록 및 관리',
}

export default function AdminVendorsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">협력업체 관리</h1>
          <p className="mt-2 text-gray-600">협력업체를 등록하고 관리하세요</p>
        </div>
        <AddVendorBtn />
      </div>

      <VendorList />
    </div>
  )
}
