import { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Toaster, toast } from 'sonner';
import AxiosInstance from './api/AxiosInstance';
import { Loader2 } from 'lucide-react';

type UserRole = 'system_admin' | 'teacher' | 'parent' | 'db_admin';

export default function App() {
  const [user, setUser] = useState<{ role: UserRole; userId: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role') as UserRole;
    if (token && role) {
      // In a real app, you'd verify the token with an API call here
      setUser({ role, userId: 'stored-user' });
    }
  }, []);

  const handleLogin = (role: UserRole, userId?: string) => {
    setUser({ role, userId: userId || 'demo-user' });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const toastId = toast.loading('Logging out...');
    
    try {
      // Call the backend to revoke the token
      await AxiosInstance.post('/logout');
      toast.success('Logged out successfully', { id: toastId });
    } catch (error) {
      console.error('Logout error:', error);
      // We continue clearing the local state even if the API call fails
      toast.error('Logout completed with errors', { id: toastId });
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
      setUser(null);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {isLoggingOut && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-lg font-medium text-gray-900">Finalizing session...</p>
        </div>
      )}
      {!user ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard role={user.role === 'system_admin' ? 'admin' : user.role} userId={user.userId} onLogout={handleLogout} />
      )}
      <Toaster position="top-right" />
    </div>
  );
}
