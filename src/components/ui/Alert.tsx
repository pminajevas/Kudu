interface AlertProps {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  className?: string;
}

export default function Alert({ children, variant = "info", className = "" }: AlertProps) {
  const variantClasses = {
    info: "bg-yellow-100 border-yellow-400 text-yellow-800",
    success: "bg-amber-100 border-amber-400 text-amber-800",
    warning: "bg-orange-100 border-orange-400 text-orange-800",
    error: "bg-red-100 border-red-400 text-red-800",
  };

  return <div className={`border px-4 py-3 rounded ${variantClasses[variant]} ${className}`}>{children}</div>;
}
