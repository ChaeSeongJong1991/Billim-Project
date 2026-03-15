import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '배정된 민원',
  description: '협력업체에게 배정된 민원 목록',
}

export default function VendorAssignmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
