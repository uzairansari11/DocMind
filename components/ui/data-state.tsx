import { ReactNode } from "react";
import { Loader2, LucideIcon, AlertCircle } from "lucide-react";

interface DataStateProps {
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | string | null;
  isEmpty?: boolean;
  
  loadingMessage?: string;
  
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  
  children: ReactNode;
}

export function DataState({
  isLoading,
  isError,
  error,
  isEmpty,
  loadingMessage = "Loading...",
  emptyIcon: EmptyIcon,
  emptyTitle = "No data found",
  emptyDescription,
  emptyAction,
  children
}: DataStateProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col h-40 items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">{loadingMessage}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col min-h-[300px] items-center justify-center rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 p-12 text-center animate-in fade-in duration-500">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 shadow-sm">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="mb-2 text-lg font-medium tracking-tight text-destructive">Something went wrong</h3>
        <p className="max-w-sm text-sm text-destructive/80">
          {error instanceof Error ? error.message : typeof error === 'string' ? error : "An unexpected error occurred while fetching data."}
        </p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 p-12 text-center animate-in fade-in duration-500">
        {EmptyIcon && (
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted shadow-sm">
            <EmptyIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <h3 className="mb-2 text-lg font-normal tracking-tight text-foreground">{emptyTitle}</h3>
        {emptyDescription && (
          <p className="mb-8 max-w-sm text-sm text-muted-foreground">
            {emptyDescription}
          </p>
        )}
        {emptyAction}
      </div>
    );
  }

  return <>{children}</>;
}
