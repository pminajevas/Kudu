import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Card from "../ui/Card";

interface RegisterFormProps {
  onSubmit: (data: { name: string; email: string; password: string }) => void;
  onToggleMode: () => void;
}

export default function RegisterForm({ onSubmit, onToggleMode }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Card className="p-8">
      <h2 className="text-xl font-semibold mb-6 text-amber-800 text-center">
        Create Account
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          type="text"
          value={formData.name}
          onChange={(value) => updateField("name", value)}
          placeholder="Enter your name"
          required
        />
        
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => updateField("email", value)}
          placeholder="Enter your email"
          required
        />
        
        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => updateField("password", value)}
          placeholder="Enter your password (min 6 characters)"
          required
          minLength={6}
        />

        <Button type="submit" className="w-full" size="lg">
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-amber-700">
          Already have an account?{" "}
          <button
            onClick={onToggleMode}
            className="text-amber-600 hover:text-amber-800 font-medium underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </Card>
  );
}
