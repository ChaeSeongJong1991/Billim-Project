'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const statusBadgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors',
  {
    variants: {
      status: {
        접수: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        진행: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        완료: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      },
      priority: {
        높음: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        중간: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
        낮음: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
      },
      size: {
        xs: 'text-xs px-2 py-0.5',
        sm: 'text-xs px-2.5 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof statusBadgeVariants> {
  status?: '접수' | '진행' | '완료'
  priority?: '높음' | '중간' | '낮음'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  dot?: boolean
}

/**
 * StatusBadge: 상태/우선순위 배지 컴포넌트
 *
 * @example
 * // 상태 배지
 * <StatusBadge status="진행" size="md" />
 *
 * // 우선순위 배지
 * <StatusBadge priority="높음" size="sm" />
 *
 * // 상태 표시기
 * <StatusBadge status="완료" dot />
 */
function StatusBadgeComponent({
  className,
  status,
  priority,
  size = 'sm',
  dot = false,
  children,
  ...props
}: StatusBadgeProps) {
  const variant = status || priority

  return (
    <div
      className={cn(
        statusBadgeVariants({
          status: status as '접수' | '진행' | '완료' | undefined,
          priority: priority as '높음' | '중간' | '낮음' | undefined,
          size,
        }),
        className
      )}
      {...props}
    >
      {dot && (
        <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-current opacity-75" />
      )}
      {children || variant}
    </div>
  )
}

const StatusBadge = React.memo(
  StatusBadgeComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.status === nextProps.status &&
      prevProps.priority === nextProps.priority &&
      prevProps.size === nextProps.size &&
      prevProps.dot === nextProps.dot &&
      prevProps.className === nextProps.className &&
      prevProps.children === nextProps.children
    )
  }
)

StatusBadge.displayName = 'StatusBadge'

export { StatusBadge, statusBadgeVariants }
