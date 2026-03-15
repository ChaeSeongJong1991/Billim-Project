'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LoadingStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'spinner' | 'skeleton' | 'pulse'
  size?: 'sm' | 'md' | 'lg'
  count?: number
  fullHeight?: boolean
  message?: string
}

const Skeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'rounded-md bg-muted/50 dark:bg-muted/20 animate-pulse',
      className
    )}
  />
)

const Spinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-muted border-t-primary',
        sizeMap[size]
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

const PulseLoader = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeMap = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  }

  return (
    <div className="flex items-center justify-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-primary',
            sizeMap[size],
            'animate-bounce',
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * SkeletonCard: 카드 모양의 스켈레톤 로더
 */
const SkeletonCard = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'rounded-lg border bg-card p-4 space-y-3',
      className
    )}
  >
    <div className="flex items-start gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-16" />
    <Skeleton className="h-8 w-1/3" />
  </div>
)

/**
 * SkeletonLine: 텍스트 라인 스켈레톤
 */
const SkeletonLine = ({ className }: { className?: string }) => (
  <Skeleton className={cn('h-4 w-full', className)} />
)

/**
 * SkeletonTable: 테이블 행 스켈레톤
 */
const SkeletonTable = ({ columns = 3, rows = 3 }: { columns?: number; rows?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-3">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton key={j} className="flex-1 h-10" />
        ))}
      </div>
    ))}
  </div>
)

/**
 * LoadingState: 로딩 상태 표시 컴포넌트
 *
 * @example
 * // 스피너 로더
 * <LoadingState type="spinner" size="md" message="로딩 중..." />
 *
 * // 스켈레톤 로더
 * <LoadingState type="skeleton" count={3} />
 *
 * // 펄스 애니메이션
 * <LoadingState type="pulse" size="sm" />
 *
 * // 전체 높이 로더
 * <LoadingState type="spinner" fullHeight message="데이터 로딩 중..." />
 */
function LoadingState({
  type = 'spinner',
  size = 'md',
  count = 1,
  fullHeight = false,
  message,
  className,
  ...props
}: LoadingStateProps) {
  const containerClassName = cn(
    'flex flex-col items-center justify-center gap-4',
    fullHeight && 'min-h-screen',
    !fullHeight && 'py-8',
    className
  )

  if (type === 'skeleton') {
    return (
      <div className={cn('w-full space-y-3', className)} {...props}>
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (type === 'pulse') {
    return (
      <div className={containerClassName} {...props}>
        <PulseLoader size={size} />
        {message && (
          <p className="text-sm text-muted-foreground text-center">{message}</p>
        )}
      </div>
    )
  }

  return (
    <div className={containerClassName} {...props}>
      <Spinner size={size} />
      {message && (
        <p className="text-sm text-muted-foreground text-center">{message}</p>
      )}
    </div>
  )
}

export {
  LoadingState,
  Skeleton,
  Spinner,
  PulseLoader,
  SkeletonCard,
  SkeletonLine,
  SkeletonTable,
}
