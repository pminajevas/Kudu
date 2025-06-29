import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import FacebookLogin from "./FacebookLogin";
import GoogleLogin from "./GoogleLogin";

interface AuthContainerProps {
  onLogin: (data: { email: string; password: string }) => void;
  onRegister: (data: { name: string; email: string; password: string }) => void;
}

export default function AuthContainer({ onLogin, onRegister }: AuthContainerProps) {
  const [showRegister, setShowRegister] = useState(false);

  const toggleMode = () => setShowRegister(!showRegister);

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[var(--primary)] mb-2">Kudu</h1>
        <p className="text-[var(--secondary)]">Welcome back</p>
      </div>

      {/* Social Login Options */}
      <div className="space-y-3 mb-6">
        <GoogleLogin />
        <FacebookLogin />
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--primary)]/20" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gradient-to-br from-[var(--background)] to-[var(--background-secondary)] text-[var(--secondary)]">Or continue with email</span>
        </div>
      </div>

      {/* Email/Password Forms */}
      {showRegister ? <RegisterForm onSubmit={onRegister} onToggleMode={toggleMode} /> : <LoginForm onSubmit={onLogin} onToggleMode={toggleMode} />}
    </div>
  );
}
