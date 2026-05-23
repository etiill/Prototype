import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Shield, UserCog } from 'lucide-react';

interface LoginPageProps {
  onLogin: (role: 'admin' | 'teacher' | 'parent', userId?: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'teacher' | 'parent' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      onLogin(selectedRole, username);
    }
  };

  const roles = [
    { id: 'admin' as const, title: 'Administrator', icon: Shield, color: 'bg-blue-500', description: 'Full system access' },
    { id: 'teacher' as const, title: 'Teacher', icon: UserCog, color: 'bg-green-500', description: 'Manage attendance & activities' },
    { id: 'parent' as const, title: 'Parent/Guardian', icon: Users, color: 'bg-purple-500', description: 'View child & approve pickup' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">RFID-Enabled Monitoring System</CardTitle>
          <CardDescription className="text-lg">FCU Kindergarten - System Flow</CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedRole ? (
            <div className="space-y-6">
              <h3 className="text-center font-semibold text-lg">Select Your Role</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
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
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedRole(null)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Login
                </Button>
              </div>

              <p className="text-sm text-center text-gray-500">
                Demo: Use any credentials to login
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
