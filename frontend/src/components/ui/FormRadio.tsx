'use client'

import * as React from 'react'

export interface FormRadioProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

/**
 * FormRadio: 라디오 버튼 필드
 *
 * @example
 * <FormRadio value="option1" label="옵션 1" name="choice" />
 */
export const FormRadio = React.forwardRef<HTMLInputElement, FormRadioProps>(
  ({ label, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="radio"
          className="h-4 w-4 accent-primary cursor-pointer"
          {...props}
        />
        {label && (
          <label className="text-sm font-medium text-foreground cursor-pointer">
            {label}
          </label>
        )}
      </div>
    )
  }
)

FormRadio.displayName = 'FormRadio'
