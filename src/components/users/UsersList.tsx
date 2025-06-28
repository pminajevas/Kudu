import Button from "../ui/Button";
import Card from "../ui/Card";

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface UsersListProps {
  users: User[];
  onRefresh: () => void;
  isLoggedIn: boolean;
}

export default function UsersList({ users, onRefresh, isLoggedIn }: UsersListProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-amber-800">Users</h2>
        <Button onClick={onRefresh} disabled={!isLoggedIn} variant={isLoggedIn ? "primary" : "secondary"}>
          {isLoggedIn ? "Refresh Users" : "Login to View Users"}
        </Button>
      </div>

      {users.length > 0 ? (
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="p-3 bg-amber-50 rounded border border-amber-100">
              <div className="font-medium text-amber-900">{user.name}</div>
              <div className="text-xs text-amber-600">ID: {user.id}</div>
              <div className="text-xs text-amber-600">Created: {new Date(user.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-amber-700">{isLoggedIn ? "No users found. Register more users or click refresh!" : "Please log in to view users."}</p>
      )}
    </Card>
  );
}
