import { cn } from '@/lib/utils';
import * as React from 'react';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground',
        'outline-none ring-offset-background transition-all duration-200',
        'focus:border-ring focus:ring-2 focus:ring-ring/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  ),
);

Select.displayName = 'Select';
