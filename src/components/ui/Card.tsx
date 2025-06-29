interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return <div className={`bg-[var(--background-secondary)] rounded-lg shadow-md border border-[var(--primary)]/10 ${className}`}>{children}</div>;
}
