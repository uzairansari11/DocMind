import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: (isOpen: boolean) => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  children,
  footer,
  className,
}: CustomModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-[500px] p-0 overflow-hidden border-border/50", className)}>
        <div className="p-6 bg-card border-b border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {Icon && <Icon className="h-5 w-5 text-primary" />}
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto bg-card/50">
          {children}
        </div>
        
        {footer && (
          <DialogFooter className="p-6 bg-card border-t border-border/50">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
