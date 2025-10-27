import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account',
    });
    navigate('/');
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          Eventr
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
                Dashboard
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button asChild variant="default">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}