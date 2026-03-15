'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TimelineItem {
  id: string
  label: string
  timestamp: Date
  description?: string
  status: 'completed' | 'in-progress' | 'pending'
}

export interface TimelineProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[]
  orientation?: 'vertical' | 'horizontal'
}

const statusColorMap = {
  completed: {
    dot: 'bg-green-500',
    line: 'bg-green-200 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
  },
  'in-progress': {
    dot: 'bg-blue-500',
    line: 'bg-blue-200 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
  },
  pending: {
    dot: 'bg-gray-300 dark:bg-gray-600',
    line: 'bg-gray-200 dark:bg-gray-800',
    text: 'text-gray-500 dark:text-gray-400',
  },
}

/**
 * Timeline: 단계별 진행 로그 컴포넌트
 *
 * @example
 * const items = [
 *   { id: '1', label: '접수', timestamp: new Date(), status: 'completed' },
 *   { id: '2', label: '진행 중', timestamp: new Date(), status: 'in-progress' },
 *   { id: '3', label: '완료 대기', timestamp: new Date(), status: 'pending' },
 * ]
 * <Timeline items={items} />
 */
function TimelineComponent({
  items,
  orientation = 'vertical',
  className,
  ...props
}: TimelineProps) {
  return (
    <div
      className={cn(
        'relative',
        orientation === 'horizontal' && 'flex gap-4',
        className
      )}
      {...props}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const colors = statusColorMap[item.status]

        return (
          <div
            key={item.id}
            className={cn(
              'flex',
              orientation === 'vertical' ? 'flex-col' : 'flex-col'
            )}
          >
            {/* Timeline dot */}
            <div className="relative flex items-start">
              <div className="relative z-10 flex h-10 w-10 items-center justify-center">
                <div className={cn('h-3 w-3 rounded-full', colors.dot)} />
              </div>

              {/* Timeline line */}
              {!isLast && orientation === 'vertical' && (
                <div
                  className={cn(
                    'absolute left-[18px] top-10 h-12 w-1',
                    colors.line
                  )}
                />
              )}

              <div className="flex-1 px-4">
                <div className="flex flex-col gap-1">
                  <h4 className="font-semibold text-sm text-foreground">
                    {item.label}
                  </h4>
                  <time className="text-xs text-muted-foreground">
                    {item.timestamp.toLocaleString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                  {item.description && (
                    <p className={cn('text-sm mt-1', colors.text)}>
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const Timeline = React.memo(
  TimelineComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.items === nextProps.items &&
      prevProps.orientation === nextProps.orientation &&
      prevProps.className === nextProps.className
    )
  }
)

Timeline.displayName = 'Timeline'

export { Timeline }
