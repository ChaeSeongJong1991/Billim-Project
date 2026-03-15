import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '협력업체 관리',
  description: '협력업체 목록 및 관리',
}

export default function AdminVendorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
