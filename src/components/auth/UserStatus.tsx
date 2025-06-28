import Button from "../ui/Button";
import Alert from "../ui/Alert";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserStatusProps {
  user: User;
  onLogout: () => void;
}

export default function UserStatus({ user, onLogout }: UserStatusProps) {
  return (
    <Alert variant="success" className="mb-6">
      <div className="flex justify-between items-center">
        <span>
          Logged in as: <strong>{user.name}</strong> ({user.email})
        </span>
        <Button onClick={onLogout} variant="danger" size="sm">
          Logout
        </Button>
      </div>
    </Alert>
  );
}
