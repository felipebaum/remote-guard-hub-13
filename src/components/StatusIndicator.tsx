import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "offline" | "warning";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StatusIndicator({ status, size = "md", className }: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  };

  const statusClasses = {
    online: "bg-status-online",
    offline: "bg-status-offline", 
    warning: "bg-status-warning"
  };

  return (
    <div 
      className={cn(
        "rounded-full animate-pulse",
        sizeClasses[size],
        statusClasses[status],
        className
      )}
    />
  );
}