'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FormCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  description?: string
}

/**
 * FormCheckbox: 체크박스 필드
 *
 * @example
 * <FormCheckbox
 *   label="약관에 동의합니다"
 *   error={errors.terms}
 * />
 */
export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, error, description, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2">
          <input
            ref={ref}
            type="checkbox"
            className={cn(
              'mt-1 h-4 w-4 rounded border-2 accent-primary cursor-pointer',
              error ? 'border-red-500' : 'border-input'
            )}
            {...props}
          />
          <div className="flex-1">
            {label && (
              <label className="text-sm font-medium text-foreground cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
        {error && <p className="text-xs text-red-500 ml-6">{error}</p>}
      </div>
    )
  }
)

FormCheckbox.displayName = 'FormCheckbox'
