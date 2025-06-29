interface InputProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}

export default function Input({ label, type, value, onChange, placeholder, required = false, minLength }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--primary)] mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border-[var(--primary)]/20 shadow-sm focus:border-[var(--primary)] focus:ring-[var(--primary)] p-3 border text-[var(--foreground)] placeholder-[var(--secondary)] bg-[var(--background-secondary)]"
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
    </div>
  );
}
