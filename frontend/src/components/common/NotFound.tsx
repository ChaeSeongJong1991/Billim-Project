'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface NotFoundProps {
  title?: string
  message?: string
  action?: {
    label: string
    href: string
  }
}

export function NotFound({
  title = '페이지를 찾을 수 없습니다',
  message = '요청하신 페이지가 존재하지 않습니다.',
  action,
}: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-gray-600">{message}</p>

      {action && (
        <Link href={action.href}>
          <Button>{action.label}</Button>
        </Link>
      )}
    </div>
  )
}
