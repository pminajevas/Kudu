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
    primary: "bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    white: "bg-white text-black border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-4 py-3",
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
