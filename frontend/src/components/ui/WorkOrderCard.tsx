'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { StatusBadge } from './StatusBadge'

export interface WorkOrderCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  title: string
  status: '접수' | '진행' | '완료'
  priority?: '높음' | '중간' | '낮음'
  dueDate?: Date
  assignee?: {
    name: string
    avatar?: string
  }
  description?: string
  href?: string
}

/**
 * WorkOrderCard: 민원 카드 컴포넌트
 *
 * @example
 * <WorkOrderCard
 *   id="wo-001"
 *   title="보일러 점검"
 *   status="진행"
 *   priority="높음"
 *   dueDate={new Date()}
 *   assignee={{ name: '김철수' }}
 *   href="/workorders/wo-001"
 * />
 */
function WorkOrderCardComponent({
  id,
  title,
  status,
  priority = '중간',
  dueDate,
  assignee,
  description,
  href,
  className,
  ...props
}: WorkOrderCardProps) {
  const isOverdue =
    dueDate && new Date() > dueDate && status !== '완료'

  const cardContent = (
    <div className={cn(
      'rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md dark:bg-card/50',
      className
    )} {...props}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-base text-foreground leading-tight">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">#{id}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={status} size="xs" />
          {priority && <StatusBadge priority={priority} size="xs" />}
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
          {description}
        </p>
      )}

      {/* Metadata */}
      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs">
        {dueDate && (
          <div className="flex items-center gap-1">
            <svg
              className={cn(
                'h-4 w-4',
                isOverdue ? 'text-red-500' : 'text-muted-foreground'
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
              {dueDate.toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        )}

        {assignee && (
          <div className="flex items-center gap-2">
            {assignee.avatar ? (
              <div className="relative h-5 w-5 rounded-full overflow-hidden">
                <Image
                  src={assignee.avatar}
                  alt={assignee.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-xs font-semibold">
                  {assignee.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-muted-foreground">{assignee.name}</span>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {isOverdue && (
        <div className="mt-3 flex items-center gap-1.5 rounded-sm bg-red-50 px-2 py-1.5 dark:bg-red-950/30">
          <svg
            className="h-3.5 w-3.5 text-red-600 dark:text-red-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs font-medium text-red-700 dark:text-red-300">
            기한 초과
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    )
  }

  return cardContent
}

const WorkOrderCard = React.memo(
  WorkOrderCardComponent,
  (prevProps, nextProps) => {
    // Props가 동일하면 리렌더링 스킵
    return (
      prevProps.id === nextProps.id &&
      prevProps.title === nextProps.title &&
      prevProps.status === nextProps.status &&
      prevProps.priority === nextProps.priority &&
      prevProps.description === nextProps.description &&
      prevProps.href === nextProps.href &&
      prevProps.className === nextProps.className &&
      prevProps.dueDate?.getTime() === nextProps.dueDate?.getTime() &&
      prevProps.assignee?.name === nextProps.assignee?.name &&
      prevProps.assignee?.avatar === nextProps.assignee?.avatar
    )
  }
)

WorkOrderCard.displayName = 'WorkOrderCard'

export { WorkOrderCard }
