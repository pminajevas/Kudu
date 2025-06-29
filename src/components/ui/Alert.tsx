import { useState, useEffect } from "react";

interface AlertProps {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  className?: string;
  onDismiss?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export default function Alert({ children, variant = "info", className = "", onDismiss, autoHide = true, duration = 5000 }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start with animation
    setIsAnimating(true);

    if (autoHide) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration]);

  const handleDismiss = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 300); // Match the transition duration
  };

  if (!isVisible) return null;
  const variantClasses = {
    info: "bg-[var(--background)] border-[var(--primary)]/20 text-[var(--secondary)] shadow-sm",
    success: "bg-green-50 border-green-200 text-green-700 shadow-sm",
    warning: "bg-orange-50 border-orange-200 text-orange-700 shadow-sm",
    error: "bg-red-50 border-red-200 text-red-700 shadow-sm",
  };

  const iconClasses = {
    info: "text-[var(--secondary)]",
    success: "text-green-400",
    warning: "text-orange-400",
    error: "text-red-400",
  };

  const getIcon = () => {
    switch (variant) {
      case "success":
        return (
          <svg className={`w-5 h-5 ${iconClasses[variant]}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case "warning":
        return (
          <svg className={`w-5 h-5 ${iconClasses[variant]}`} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg className={`w-5 h-5 ${iconClasses[variant]}`} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className={`w-5 h-5 ${iconClasses[variant]}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`
      border rounded-lg px-4 py-3 transition-all duration-300 ease-in-out transform
      ${isAnimating ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95"}
      ${variantClasses[variant]} ${className}
    `}
    >
      <div className="flex items-start justify-between space-x-3">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
          <div className="text-sm font-medium leading-relaxed">{children}</div>
        </div>
        <button onClick={handleDismiss} className="flex-shrink-0 ml-4 text-[var(--secondary)] hover:text-[var(--primary)] transition-colors duration-200" aria-label="Dismiss">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
