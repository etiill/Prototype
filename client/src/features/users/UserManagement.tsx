import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2, Loader2, Search, History, Users, Shield } from 'lucide-react';
import { toast } from 'sonner';
import AxiosInstance from '../../api/AxiosInstance';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
}

interface Log {
  id: number;
  user_id: number;
  action: 'login' | 'logout';
  ip_address: string;
  user_agent: string;
  created_at: string;
  user?: User;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [viewMode, setViewMode] = useState<'users' | 'logs'>('users');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    role: 'Teacher'
  });

  useEffect(() => {
    if (viewMode === 'users') {
      fetchUsers();
    } else {
      fetchLogs();
    }
  }, [viewMode]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await AxiosInstance.get('/logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to load logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      full_name: '',
      username: '',
      email: '',
      password: '',
      role: 'Teacher'
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      full_name: user.name,
      username: user.username,
      email: user.email,
      password: '', // Don't show password
      role: user.role.charAt(0).toUpperCase() + user.role.slice(1)
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await AxiosInstance.delete(`/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingUser) {
        // Prepare update data (remove password if empty)
        const updateData = { ...formData };
        if (!updateData.password) delete (updateData as any).password;
        
        await AxiosInstance.put(`/users/${editingUser.id}`, updateData);
        toast.success('User updated successfully');
      } else {
        await AxiosInstance.post('/users', formData);
        toast.success('User created successfully');
      }
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      const message = error.response?.data?.message || 'Failed to save user';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogs = logs.filter(log => 
    log.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'system_admin': return <Badge className="bg-blue-600/10 text-blue-600 border-none px-3 py-1 rounded-lg font-bold">Admin</Badge>;
      case 'teacher': return <Badge className="bg-green-600/10 text-green-600 border-none px-3 py-1 rounded-lg font-bold">Teacher</Badge>;
      case 'parent': return <Badge className="bg-purple-600/10 text-purple-600 border-none px-3 py-1 rounded-lg font-bold">Parent</Badge>;
      default: return <Badge variant="outline" className="rounded-lg">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h2>
          <p className="text-slate-500 font-medium">Configure access control and monitor security logs</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex-shrink-0">
          <button 
            onClick={() => setViewMode('users')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${viewMode === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Users className="w-4 h-4" />
            Active Users
          </button>
          <button 
            onClick={() => setViewMode('logs')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${viewMode === 'logs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <History className="w-4 h-4" />
            Security Logs
          </button>
        </div>
      </div>

      <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
        <CardHeader className="pb-6 pt-8 px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              placeholder={viewMode === 'users' ? "Search by name or email..." : "Search security logs..."}
              className="pl-12 h-12 bg-slate-50 border-none rounded-2xl focus-visible:ring-blue-500 placeholder:text-slate-400 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {viewMode === 'users' && (
            <Button onClick={handleOpenCreate} className="h-12 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 font-bold">
              <Plus className="w-5 h-5 mr-2" />
              Register User
            </Button>
          )}
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-500 font-bold tracking-wide uppercase text-xs">Fetching Secure Data...</p>
            </div>
          ) : viewMode === 'users' ? (
            filteredUsers.length === 0 ? (
              <div className="text-center py-24 text-slate-400 font-medium">No records matching your search.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100">
                      <TableHead className="px-8 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Identified User</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Credential ID</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Email Contact</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Security Role</TableHead>
                      <TableHead className="text-right px-8 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Management</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8 font-black text-slate-900">{user.name}</TableCell>
                        <TableCell className="font-mono text-xs text-slate-500">{user.username}</TableCell>
                        <TableCell className="text-slate-600">{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell className="text-right px-8">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors" onClick={() => handleOpenEdit(user)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors" onClick={() => handleDelete(user.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          ) : (
            filteredLogs.length === 0 ? (
              <div className="text-center py-24 text-slate-400 font-medium">No security events logged.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100">
                      <TableHead className="px-8 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Security Subject</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Access Level</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Activity Event</TableHead>
                      <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">IP Signature</TableHead>
                      <TableHead className="px-8 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <TableCell className="px-8 font-black text-slate-900">{log.user?.name || 'External Access'}</TableCell>
                        <TableCell>{log.user ? getRoleBadge(log.user.role) : '-'}</TableCell>
                        <TableCell>
                          <Badge variant={log.action === 'login' ? 'default' : 'outline'} className={`rounded-lg font-black text-[10px] tracking-widest border-none ${log.action === 'login' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
                            {log.action.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-[10px] text-slate-400">{log.ip_address}</TableCell>
                        <TableCell className="px-8 text-sm font-medium text-slate-500 whitespace-nowrap">{new Date(log.created_at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border-none rounded-[32px] shadow-2xl overflow-hidden p-0">
          <div className="bg-slate-900 p-8 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Shield className="w-24 h-24" />
            </div>
            <DialogTitle className="text-2xl font-black">{editingUser ? 'Profile Update' : 'New Access Registration'}</DialogTitle>
            <DialogDescription className="text-slate-400 font-medium">
              Securely configure user credentials and permissions
            </DialogDescription>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label htmlFor="name" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</Label>
                <Input 
                  id="name" 
                  className="h-12 bg-slate-50 border-none rounded-xl focus:ring-blue-500 font-bold"
                  value={formData.full_name} 
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label htmlFor="username" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username ID</Label>
                <Input 
                  id="username" 
                  className="h-12 bg-slate-50 border-none rounded-xl focus:ring-blue-500 font-bold"
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secure Email</Label>
              <Input 
                id="email" 
                type="email"
                className="h-12 bg-slate-50 border-none rounded-xl focus:ring-blue-500 font-bold"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Access Password {editingUser && '(Optional)'}</Label>
              <Input 
                id="password" 
                type="password"
                className="h-12 bg-slate-50 border-none rounded-xl focus:ring-blue-500 font-bold"
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={!editingUser} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Access Authorization Level</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({...formData, role: value})}
              >
                <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl focus:ring-blue-500 font-bold">
                  <SelectValue placeholder="Select authorization" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="Teacher" className="font-bold py-3">Academic Teacher</SelectItem>
                  <SelectItem value="Parent" className="font-bold py-3">Parent/Guardian</SelectItem>
                  <SelectItem value="System_admin" className="font-bold py-3 text-blue-600">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button type="button" variant="ghost" className="h-12 rounded-xl font-bold flex-1" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex-1 shadow-lg shadow-slate-200" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingUser ? 'Save Updates' : 'Commit Access')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
