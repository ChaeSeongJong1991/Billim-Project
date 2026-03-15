'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
}

/**
 * FormSelect: 드롭다운 선택 필드
 *
 * @example
 * <FormSelect
 *   label="상태"
 *   options={[
 *     { value: 'pending', label: '대기중' },
 *     { value: 'done', label: '완료' },
 *   ]}
 * />
 */
export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, hint, required, options = [], children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-input focus:border-primary focus:ring-primary/20'
          )}
          {...props}
        >
          <option value="">선택하세요</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          {children}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'
