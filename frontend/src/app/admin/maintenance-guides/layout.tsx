import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '예방정비 가이드',
  description: '예방정비 가이드 목록 조회 및 관리',
}

export default function AdminMaintenanceGuidesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
