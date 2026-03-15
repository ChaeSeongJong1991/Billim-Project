import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '민원 관리',
  description: '민원 생성, 조회, 상태 변경',
}

export default function WorkOrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
