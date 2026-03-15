'use client'

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  secondary?: {
    label: string
    href?: string
    onClick?: () => void
  }
  fullHeight?: boolean
}

const defaultIcons = {
  empty: (
    <svg
      className="h-16 w-16 text-muted-foreground/50"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  ),
  search: (
    <svg
      className="h-16 w-16 text-muted-foreground/50"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  error: (
    <svg
      className="h-16 w-16 text-red-500/50"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  no_data: (
    <svg
      className="h-16 w-16 text-muted-foreground/50"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  no_permission: (
    <svg
      className="h-16 w-16 text-muted-foreground/50"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  ),
  offline: (
    <svg
      className="h-16 w-16 text-muted-foreground/50"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
      />
    </svg>
  ),
}

/**
 * EmptyState: 빈 상태 표시 컴포넌트
 *
 * @example
 * // 검색 결과 없음
 * <EmptyState
 *   title="검색 결과 없음"
 *   description="다른 검색어를 시도해보세요"
 *   action={{ label: '처음으로', href: '/' }}
 * />
 *
 * // 데이터 없음 (초기 상태)
 * <EmptyState
 *   title="데이터가 없습니다"
 *   description="새로운 항목을 추가하여 시작하세요"
 *   action={{ label: '추가', onClick: () => {} }}
 * />
 *
 * // 권한 없음
 * <EmptyState
 *   icon={customIcon}
 *   title="접근 권한이 없습니다"
 *   description="관리자에게 문의하세요"
 * />
 *
 * // 오프라인
 * <EmptyState
 *   title="인터넷 연결이 없습니다"
 *   description="인터넷에 다시 연결한 후 시도해주세요"
 *   action={{ label: '재시도', onClick: () => location.reload() }}
 * />
 */
function EmptyState({
  icon = defaultIcons.empty,
  title,
  description,
  action,
  secondary,
  fullHeight = true,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 text-center',
        fullHeight && 'min-h-[400px]',
        className
      )}
      {...props}
    >
      {/* Icon */}
      <div className="mb-2">{icon}</div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-foreground">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm">
          {description}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-4 sm:flex-row">
        {action && (
          action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
            >
              {action.label}
            </button>
          )
        )}

        {secondary && (
          secondary.href ? (
            <Link
              href={secondary.href}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-xs hover:bg-accent h-9 px-4 py-2"
            >
              {secondary.label}
            </Link>
          ) : (
            <button
              onClick={secondary.onClick}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-xs hover:bg-accent h-9 px-4 py-2"
            >
              {secondary.label}
            </button>
          )
        )}
      </div>
    </div>
  )
}

export { EmptyState, defaultIcons }
