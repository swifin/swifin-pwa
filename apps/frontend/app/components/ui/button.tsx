// apps/frontend/components/ui/button.tsx
'use client'

import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline'
}

export function Button({ children, className, variant = 'default', ...props }: ButtonProps) {
  const base = 'font-semibold py-2 px-4 rounded transition-colors duration-200'
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
  }

  return (
    <button
      className={clsx(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  )
}

