import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CartoonAvatarProps {
  isTalking: boolean;
  role: 'host' | 'expert';
  className?: string;
}

export function CartoonAvatar({ isTalking, role, className }: CartoonAvatarProps) {
  const isHost = role === 'host';
  // Host (Boy): Blue shirt, yellow skin, dark hair
  // Expert (Girl): Pink shirt, light skin, brown hair
  const shirtColor = isHost ? '#1e293b' : '#ec4899'; 
  const skinColor = isHost ? '#fde047' : '#ffedd5';
  const hairColor = isHost ? '#0f172a' : '#451a03';

  return (
    <div className={cn("relative w-32 h-40 flex flex-col items-center justify-end", className)}>
      {/* Left Arm */}
      <motion.div 
        animate={isTalking ? { rotate: [-10, -45, -10] } : { rotate: 0 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        style={{ transformOrigin: "top center", backgroundColor: shirtColor }}
        className="absolute bottom-4 left-2 w-7 h-16 rounded-full z-0"
      />
      
      {/* Right Arm */}
      <motion.div 
        animate={isTalking ? { rotate: [10, 50, 10] } : { rotate: 0 }}
        transition={{ repeat: Infinity, duration: 1.8, delay: 0.2, ease: "easeInOut" }}
        style={{ transformOrigin: "top center", backgroundColor: shirtColor }}
        className="absolute bottom-4 right-2 w-7 h-16 rounded-full z-0"
      />

      {/* Body */}
      <div className="w-28 h-20 rounded-t-[50px] relative z-10" style={{ backgroundColor: shirtColor }}>
        {/* Detail */}
        {isHost ? (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-12 bg-white flex justify-center">
            <div className="w-2 h-10 bg-red-600 mt-2 rounded-b-sm" />
          </div>
        ) : (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/20 rounded-b-full" />
        )}
      </div>
      
      {/* Head */}
      <motion.div 
        animate={isTalking ? { rotate: [-2, 2, -2], y: [-1, 1, -1] } : { rotate: 0, y: 0 }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-16 w-20 h-24 rounded-[40px] flex flex-col items-center z-20 overflow-hidden shadow-sm"
        style={{ backgroundColor: skinColor }}
      >
        {/* Hair */}
        <div className={cn("w-full h-8", !isHost && "h-12")} style={{ backgroundColor: hairColor }} />
        {!isHost && (
          // Extra hair for girl (Bob style)
          <div className="absolute top-8 w-full flex justify-between px-1">
             <div className="w-4 h-10 rounded-b-full" style={{ backgroundColor: hairColor }} />
             <div className="w-4 h-10 rounded-b-full" style={{ backgroundColor: hairColor }} />
          </div>
        )}
        
        {/* Eyes */}
        <div className="flex gap-4 mt-4 relative z-10">
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
        </div>
        
        {/* Glasses (Host maybe?) Let's put glasses on the boy instead */}
        {isHost && (
          <div className="absolute top-[44px] flex gap-1 items-center z-10">
            <div className="w-7 h-5 border-2 border-slate-900 rounded-lg" />
            <div className="w-2 h-0.5 bg-slate-900" />
            <div className="w-7 h-5 border-2 border-slate-900 rounded-lg" />
          </div>
        )}
        
        {/* Mouth */}
        <div className="relative mt-4 z-10">
          <motion.div 
            animate={isTalking ? { height: [4, 12, 4], width: [14, 10, 14], borderRadius: ["10px", "50%", "10px"] } : { height: 4, width: 14, borderRadius: "10px" }}
            transition={{ repeat: Infinity, duration: 0.3 }}
            className="bg-slate-900"
          />
        </div>
      </motion.div>
    </div>
  )
}
