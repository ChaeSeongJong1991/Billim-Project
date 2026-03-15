'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()

  const adminLinks = [
    { href: '/admin/dashboard', label: '대시보드' },
    { href: '/admin/work-orders', label: '민원 관리' },
    { href: '/admin/vendors', label: '협력업체' },
    { href: '/admin/maintenance-guides', label: '예방정비 가이드' },
    { href: '/admin/settings', label: '설정' },
  ]

  const tenantLinks = [
    { href: '/dashboard-tenant', label: '대시보드' },
    { href: '/work-orders', label: '민원' },
  ]

  const vendorLinks = [
    { href: '/vendor/assignments', label: '배정된 민원' },
  ]

  const isAdmin = pathname.startsWith('/admin')
  const isVendor = pathname.startsWith('/vendor')
  const links = isAdmin ? adminLinks : isVendor ? vendorLinks : tenantLinks

  return (
    <aside className="w-64 border-r bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Billim</h1>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'block rounded-lg px-4 py-2 text-sm transition-colors',
              pathname === link.href
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
