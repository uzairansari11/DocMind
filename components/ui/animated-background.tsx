'use client';

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] animate-pulse rounded-full bg-primary/20 blur-[120px]" style={{ animationDuration: '8s' }} />
      <div className="absolute -right-[10%] top-[20%] h-[40%] w-[30%] animate-pulse rounded-full bg-primary/10 blur-[100px]" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute -bottom-[10%] left-[20%] h-[50%] w-[50%] animate-pulse rounded-full bg-primary/15 blur-[120px]" style={{ animationDuration: '12s', animationDelay: '1s' }} />
      <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px]" />
    </div>
  );
}
