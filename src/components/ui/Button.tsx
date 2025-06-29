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
    primary: "bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-400",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    white: "bg-white text-black border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
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
