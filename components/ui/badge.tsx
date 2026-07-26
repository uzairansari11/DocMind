import { cn } from '@/lib/utils';
import * as React from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'destructive';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors',
        variant === 'default'     && 'bg-muted text-muted-foreground ring-border',
        variant === 'primary'     && 'bg-primary/10 text-primary ring-primary/30',
        variant === 'success'     && 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30 dark:text-emerald-400',
        variant === 'warning'     && 'bg-amber-500/10 text-amber-600 ring-amber-500/30 dark:text-amber-400',
        variant === 'destructive' && 'bg-destructive/10 text-destructive ring-destructive/30',
        className,
      )}
      {...props}
    />
  );
}
