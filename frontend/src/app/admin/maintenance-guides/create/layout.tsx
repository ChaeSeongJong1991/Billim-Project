import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '새 가이드 작성',
  description: '새로운 예방정비 가이드를 작성하세요',
}

export default function CreateMaintenanceGuideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
