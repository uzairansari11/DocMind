'use client';

import { motion } from 'framer-motion';

const FloatingElement = ({ children, delay = 0, duration = 10, xRange, yRange, className }: any) => {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        x: xRange,
        y: yRange,
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-gradient-to-b from-sky-50 to-white dark:from-sky-950 dark:to-background">
      {/* Playful Colorful Blobs */}
      <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] animate-pulse rounded-full bg-cyan-300/30 dark:bg-cyan-600/20 blur-[100px]" style={{ animationDuration: '8s' }} />
      <div className="absolute -right-[10%] top-[20%] h-[40%] w-[40%] animate-pulse rounded-full bg-pink-300/30 dark:bg-pink-600/20 blur-[100px]" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute -bottom-[10%] left-[20%] h-[50%] w-[50%] animate-pulse rounded-full bg-yellow-300/30 dark:bg-yellow-600/20 blur-[100px]" style={{ animationDuration: '12s', animationDelay: '1s' }} />

      {/* Floating Cartoon SVGs */}
      <FloatingElement className="top-[10%] left-[15%]" xRange={[0, 40, 0]} yRange={[0, -50, 0]} duration={12}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500/40 drop-shadow-lg">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </FloatingElement>

      <FloatingElement className="top-[40%] right-[10%]" xRange={[0, -60, 0]} yRange={[0, 40, 0]} delay={2} duration={15}>
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-pink-500/40 drop-shadow-lg">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </FloatingElement>

      <FloatingElement className="bottom-[15%] left-[8%]" xRange={[0, 50, 0]} yRange={[0, -30, 0]} delay={1} duration={10}>
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500/50 drop-shadow-lg">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </FloatingElement>

      <FloatingElement className="top-[20%] left-[60%]" xRange={[0, -30, 0]} yRange={[0, -40, 0]} delay={3} duration={18}>
        <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500/30 drop-shadow-lg">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <line x1="8" y1="16" x2="8" y2="16" />
          <line x1="16" y1="16" x2="16" y2="16" />
        </svg>
      </FloatingElement>

      <FloatingElement className="bottom-[25%] right-[20%]" xRange={[0, 40, 0]} yRange={[0, 50, 0]} delay={4} duration={14}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500/30 drop-shadow-lg">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      </FloatingElement>

      <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]" />
    </div>
  );
}
