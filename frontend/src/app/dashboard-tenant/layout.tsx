import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '임차인 대시보드',
  description: '민원 및 계약 정보 한눈에 보기',
}

export default function DashboardTenantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
