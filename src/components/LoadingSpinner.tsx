'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export default function LoadingSpinner({ 
  className, 
  size = 'md',
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-primary/20 border-t-primary shadow-sm",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="mt-4 text-sm text-muted-foreground font-medium animate-pulse-soft">{text}</p>
      )}
    </div>
  )
}
