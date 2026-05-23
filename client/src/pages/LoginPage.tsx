import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Shield, UserCog, Database, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import AxiosInstance from '../api/AxiosInstance';


type UserRole = 'system_admin' | 'teacher' | 'parent' | 'db_admin';

interface LoginPageProps {
  onLogin: (role: UserRole, userId?: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      const response = await AxiosInstance.post('/login', {
        username,
        password,
        role: selectedRole,
      });

      const { token, user } = response.data;

      // Store token securely
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_role', selectedRole);

      toast.success('Login successful! Welcome back.');
      onLogin(selectedRole, user?.id || username);
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'system_admin' as const, title: 'Administrator', icon: Shield, color: 'bg-blue-500', description: 'Full system access' },
    { id: 'teacher' as const, title: 'Teacher', icon: UserCog, color: 'bg-green-500', description: 'Manage attendance & activities' },
    { id: 'parent' as const, title: 'Parent/Guardian', icon: Users, color: 'bg-purple-500', description: 'View child & approve pickup' },
    { id: 'db_admin' as const, title: 'Database Admin', icon: Database, color: 'bg-orange-500', description: 'Manage system data & logs' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Card className="w-full max-w-5xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">RFID-Enabled Monitoring System</CardTitle>
          <CardDescription className="text-lg">FCU Kindergarten - System Flow</CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedRole ? (
            <div className="space-y-6">
              <h3 className="text-center font-semibold text-lg">Select Your Role</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className="p-6 cursor-pointer border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-lg transition-all text-center space-y-3"
                    >
                      <div className={`${role.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-semibold">{role.title}</h4>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto">
              <div className="text-center mb-6">
                <h3 className="font-semibold text-lg">
                  Login as {roles.find(r => r.id === selectedRole)?.title}
                </h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedRole(null)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>

              <p className="text-sm text-center text-gray-500">
                Secure access for authorized personnel
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
