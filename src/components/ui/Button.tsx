interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "white";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export default function Button({ children, onClick, type = "button", variant = "primary", size = "md", disabled = false, className = "" }: ButtonProps) {
  const baseClasses = "rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";

  const variantClasses = {
    primary: "bg-[var(--primary)] text-[var(--button-text)] hover:bg-[var(--secondary)] focus:ring-[var(--secondary)]",
    secondary: "bg-[var(--secondary)] text-[var(--button-text)] hover:bg-[var(--primary)] focus:ring-[var(--primary)]",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    white: "bg-[var(--background-secondary)] text-[var(--primary)] border border-[var(--primary)]/20 hover:bg-[var(--background)] focus:ring-[var(--secondary)]",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-4 py-3",
  };

  // If className contains background or color overrides, don't apply variant classes
  const hasCustomBackground = className.includes("bg-") || className.includes("text-");
  const variantClass = hasCustomBackground ? "" : variantClasses[variant];

  const classes = `${baseClasses} ${variantClass} ${sizeClasses[size]} ${className}`;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
