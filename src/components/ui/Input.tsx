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
      <label className="block text-sm font-medium text-amber-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border-amber-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 p-3 border text-gray-900 placeholder-gray-500 bg-white"
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
    </div>
  );
}
