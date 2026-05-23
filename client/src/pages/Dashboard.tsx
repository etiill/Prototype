import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  LogOut, 
  Users, 
  UserPlus, 
  Radio, 
  ClipboardCheck, 
  Smile, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  Clock,
  Shield,
  Menu,
  X,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Bell
} from 'lucide-react';
import { StudentRegistration } from '../features/registration/StudentRegistration';
import { RFIDScan } from '../features/attendance/RFIDScan';
import { AttendanceMonitoring } from '../features/attendance/AttendanceMonitoring';
import { ActivityMoodLog } from '../features/activity/ActivityMoodLog';
import { PickupVerification } from '../features/safety/PickupVerification';
import { ParentApproval } from '../features/safety/ParentApproval';
import { SafetyAlerts } from '../features/safety/SafetyAlerts';
import { ReportsHistory } from '../features/reports/ReportsHistory';
import { TimeBasedAuthorization } from '../features/auth/TimeBasedAuthorization';
import { UserManagement } from '../features/users/UserManagement';

interface DashboardProps {
  role: 'admin' | 'teacher' | 'parent';
  userId: string;
  onLogout: () => void;
}

type ViewType = 'home' | 'registration' | 'rfid-scan' | 'attendance' | 'activity-mood' | 
  'pickup-verification' | 'parent-approval' | 'alerts' | 'reports' | 'time-authorization' | 'users';

export function Dashboard({ role, userId, onLogout }: DashboardProps) {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getRoleName = () => {
    switch (role) {
      case 'admin': return 'System Administrator';
      case 'teacher': return 'Academic Teacher';
      default: return 'Parent/Guardian';
    }
  };

  const getMenuItems = () => {
    const allItems = [
      { id: 'home', title: 'Dashboard Overview', icon: LayoutDashboard, roles: ['admin', 'teacher', 'parent'] },
      { id: 'users', title: 'User Management', icon: Shield, roles: ['admin'] },
      { id: 'registration', title: 'Student Registration', icon: UserPlus, roles: ['admin', 'teacher'] },
      { id: 'rfid-scan', title: 'RFID Entry Scan', icon: Radio, roles: ['admin', 'teacher'] },
      { id: 'attendance', title: 'Live Attendance', icon: ClipboardCheck, roles: ['admin', 'teacher'] },
      { id: 'activity-mood', title: 'Daily Mood Log', icon: Smile, roles: ['admin', 'teacher'] },
      { id: 'pickup-verification', title: 'Pickup Verification', icon: ShieldCheck, roles: ['admin', 'teacher'] },
      { id: 'parent-approval', title: 'Parent Release', icon: CheckCircle2, roles: ['admin', 'parent'] },
      { id: 'alerts', title: 'Safety Alerts', icon: AlertTriangle, roles: ['admin', 'teacher'] },
      { id: 'reports', title: 'Analytics & Reports', icon: FileText, roles: ['admin', 'teacher', 'parent'] },
      { id: 'time-authorization', title: 'Time Auth', icon: Clock, roles: ['admin', 'parent'] },
    ];

    return allItems.filter(item => item.roles.includes(role));
  };

  const renderView = () => {
    switch (currentView) {
      case 'users': return <UserManagement />;
      case 'registration': return <StudentRegistration />;
      case 'rfid-scan': return <RFIDScan />;
      case 'attendance': return <AttendanceMonitoring />;
      case 'activity-mood': return <ActivityMoodLog />;
      case 'pickup-verification': return <PickupVerification />;
      case 'parent-approval': return <ParentApproval userId={userId} />;
      case 'alerts': return <SafetyAlerts />;
      case 'reports': return <ReportsHistory role={role} userId={userId} />;
      case 'time-authorization': return <TimeBasedAuthorization userId={userId} />;
      default: return <DashboardHome />;
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      <div className="p-6">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-xl text-white tracking-tight">KINDER<span className="text-blue-500">SAFE</span></span>
        </div>
        
        <nav className="space-y-1">
          {getMenuItems().map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as ViewType);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                <span className="font-semibold text-sm">{item.title}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </button>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors group"
        >
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-400" />
          <span className="font-semibold text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );

  const DashboardHome = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-3xl font-black text-slate-900 mb-1">Welcome back, {userId}</h2>
          <p className="text-slate-500 font-medium">You are logged in as <span className="text-blue-600 font-bold">{getRoleName()}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
          <span className="text-sm font-bold text-slate-400">+12 others active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: '124', change: '+4.5%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Live Presence', value: '98', change: '82%', icon: Radio, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Alerts', value: '2', change: 'Priority', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Pending Release', value: '14', change: 'Pick-up', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-none">{stat.change}</Badge>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-slate-900 px-2 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            Recent Activity
          </h3>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 hover:bg-slate-50 transition-colors flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">RFID Scan: Student #0042 arrived</p>
                  <p className="text-sm text-slate-500">Main Entrance • 2 minutes ago</p>
                </div>
                <Badge variant="outline" className="rounded-lg font-bold">Entry</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 px-2 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            System Status
          </h3>
          <Card className="border-none shadow-sm rounded-3xl bg-slate-900 text-white">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-slate-400">
                  <span>Server Load</span>
                  <span>14%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[14%] rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-slate-400">
                  <span>RFID Network</span>
                  <span className="text-green-400">Active</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[92%] rounded-full" />
                </div>
              </div>
              <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border-none h-12 font-bold mt-4">
                System Diagnostics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block w-80 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className="w-80 h-full animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 h-20 flex-shrink-0 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-slate-100 rounded-xl"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6 text-slate-600" />
              </Button>
              <div className="hidden sm:block">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {getMenuItems().find(m => m.id === currentView)?.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-xl">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>
              <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block" />
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-black text-slate-900 leading-none mb-1">{userId}</p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{getRoleName()}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth bg-slate-50/50">
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

