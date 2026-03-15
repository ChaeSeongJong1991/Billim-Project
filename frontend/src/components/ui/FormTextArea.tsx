'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FormTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  maxLength?: number
  showCharCount?: boolean
}

/**
 * FormTextArea: 여러 줄 텍스트 입력 필드
 *
 * @example
 * <FormTextArea
 *   label="설명"
 *   placeholder="상세 설명을 입력하세요"
 *   error={errors.description}
 *   maxLength={500}
 *   showCharCount
 * />
 */
export const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ label, error, hint, required, maxLength, showCharCount = false, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(0)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      props.onChange?.(e)
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'flex min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground outline-none transition-colors resize-none disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-input focus:border-primary focus:ring-primary/20'
          )}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        <div className="flex justify-between items-center">
          {error && <p className="text-xs text-red-500">{error}</p>}
          {!error && hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          {showCharCount && maxLength && (
            <p className="text-xs text-muted-foreground">
              {charCount} / {maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

FormTextArea.displayName = 'FormTextArea'
