import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '민원 작성',
  description: '새로운 민원을 등록하세요',
}

export default function CreateWorkOrderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
