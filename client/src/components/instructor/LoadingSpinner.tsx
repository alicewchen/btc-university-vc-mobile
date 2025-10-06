import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn(
        "animate-spin rounded-full border-b-2 border-bitcoin-orange",
        sizeClasses[size]
      )} />
      {text && (
        <span className="ml-3 text-gray-600 dark:text-gray-400">{text}</span>
      )}
    </div>
  );
}

export function InlineLoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("animate-spin rounded-full h-4 w-4 border-b-2 border-current", className)} />
  );
}

export default LoadingSpinner;