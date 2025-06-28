import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Card from "../ui/Card";

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  onToggleMode: () => void;
}

export default function LoginForm({ onSubmit, onToggleMode }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Email" type="email" value={formData.email} onChange={(value) => setFormData({ ...formData, email: value })} placeholder="Enter your email" required />

        <Input label="Password" type="password" value={formData.password} onChange={(value) => setFormData({ ...formData, password: value })} placeholder="Enter your password" required />

        <Button type="submit" className="w-full" size="lg">
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-amber-700">
          Don't have an account?{" "}
          <button onClick={onToggleMode} className="text-amber-600 hover:text-amber-800 font-medium underline">
            Create one
          </button>
        </p>
      </div>
    </Card>
  );
}
