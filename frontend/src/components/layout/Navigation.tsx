'use client'

import Link from 'next/link'

export function Navigation() {
  return (
    <nav className="space-y-1">
      <Link
        href="/work-orders"
        className="block rounded px-4 py-2 hover:bg-gray-100"
      >
        민원
      </Link>
      <Link
        href="/dashboard-tenant"
        className="block rounded px-4 py-2 hover:bg-gray-100"
      >
        대시보드
      </Link>
    </nav>
  )
}
