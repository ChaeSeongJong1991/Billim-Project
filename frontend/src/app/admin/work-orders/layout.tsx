import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '민원 관리 (관리자)',
  description: '모든 민원을 칸반 형태로 관리하세요',
}

export default function AdminWorkOrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
