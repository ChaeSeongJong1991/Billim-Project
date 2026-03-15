'use client'

import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { ReactNode } from 'react'

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  action?: ReactNode
}

export function Alert({
  type = 'info',
  title,
  message,
  action,
}: AlertProps) {
  const config = {
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      titleColor: 'text-blue-900',
      textColor: 'text-blue-800',
    },
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      titleColor: 'text-green-900',
      textColor: 'text-green-800',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      titleColor: 'text-yellow-900',
      textColor: 'text-yellow-800',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-900',
      textColor: 'text-red-800',
    },
  }

  const { icon: Icon, bgColor, borderColor, titleColor, textColor } =
    config[type]

  return (
    <div
      className={`rounded-lg border ${borderColor} ${bgColor} p-4`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 ${textColor}`} />
        <div className="flex-1">
          <h3 className={`font-semibold ${titleColor}`}>{title}</h3>
          <p className={`mt-1 text-sm ${textColor}`}>{message}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
      </div>
    </div>
  )
}
