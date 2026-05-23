import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Shield, UserCog, Database, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import AxiosInstance from '../api/AxiosInstance';


type UserRole = 'system_admin' | 'teacher' | 'parent';

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
    { id: 'parent' as const, title: 'Parent/Guardian', icon: Users, color: 'bg-purple-500', description: 'View child & approve pickup' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <Card className="w-full max-w-5xl bg-white/95 backdrop-blur-sm border-white/20 shadow-2xl relative z-10 overflow-hidden rounded-2xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        
        <CardHeader className="text-center pb-8 pt-10">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl shadow-inner">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
            RFID Monitoring System
          </CardTitle>
          <CardDescription className="text-lg font-medium text-slate-500">
            FCU Kindergarten • Security & Attendance
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-12 px-8">
          {!selectedRole ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800">Identify Your Access Level</h3>
                <p className="text-slate-500 mt-1">Please select your primary role to continue</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className="group p-8 cursor-pointer border-2 border-slate-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-xl transition-all duration-300 text-center space-y-4 w-full sm:w-64 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                      
                      <div className={`${role.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-lg text-slate-800">{role.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{role.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto animate-in fade-in zoom-in-95 duration-300">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-sm font-bold text-slate-600 mb-4">
                    <div className={`w-2 h-2 rounded-full ${roles.find(r => r.id === selectedRole)?.color.split(' ')[0]}`} />
                    AUTHENTICATING AS {roles.find(r => r.id === selectedRole)?.title.toUpperCase()}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">
                    Welcome Back
                  </h3>
                  <p className="text-slate-500 mt-1">Enter your credentials to access the secure portal</p>
                </div>
                
                <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-bold text-slate-700 ml-1">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="e.g. jdoe123"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      required
                      className="bg-white border-slate-200 h-12 rounded-xl focus-visible:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-bold text-slate-700 ml-1">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required
                        className="bg-white border-slate-200 h-12 rounded-xl pr-12 focus-visible:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setSelectedRole(null)}
                    className="flex-1 h-12 rounded-xl font-bold hover:bg-slate-100 text-slate-600 order-2 sm:order-1"
                    disabled={isLoading}
                  >
                    Change Role
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 order-1 sm:order-2" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Sign In Securely'
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-8">
                  <Shield className="w-3 h-3" />
                  End-to-End Encrypted Session
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="fixed bottom-6 text-slate-400 text-sm font-medium">
        © 2026 FCU Kindergarten • All Rights Reserved
      </div>
    </div>
  );
}
