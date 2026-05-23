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
  Shield
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

  const getRoleName = () => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'teacher': return 'Teacher';
      default: return 'Parent/Guardian';
    }
  };

  const getMenuItems = () => {
    const allItems = [
      { id: 'users', title: 'User Management', icon: Shield, color: 'bg-blue-100 text-blue-600', roles: ['admin'], step: '1' },
      { id: 'registration', title: 'Student & Guardian Registration', icon: UserPlus, color: 'bg-orange-100 text-orange-600', roles: ['admin', 'teacher'], step: '2' },
      { id: 'rfid-scan', title: 'RFID Arrival Scan', icon: Radio, color: 'bg-green-100 text-green-600', roles: ['admin', 'teacher'], step: '3' },
      { id: 'attendance', title: 'Live Attendance Monitoring', icon: ClipboardCheck, color: 'bg-pink-100 text-pink-600', roles: ['admin', 'teacher'], step: '4' },
      { id: 'activity-mood', title: 'Daily Activity & Mood Log', icon: Smile, color: 'bg-blue-100 text-blue-600', roles: ['admin', 'teacher'], step: '5' },
      { id: 'pickup-verification', title: 'Guardian Pick-Up Verification', icon: ShieldCheck, color: 'bg-yellow-100 text-yellow-600', roles: ['admin', 'teacher'], step: '6' },
      { id: 'parent-approval', title: 'Parent Approval & Release', icon: CheckCircle2, color: 'bg-green-100 text-green-600', roles: ['admin', 'parent'], step: '7' },
      { id: 'alerts', title: 'Safety Alerts & Exceptions', icon: AlertTriangle, color: 'bg-red-100 text-red-600', roles: ['admin', 'teacher'], step: '8' },
      { id: 'reports', title: 'Reports & History', icon: FileText, color: 'bg-orange-100 text-orange-600', roles: ['admin', 'teacher', 'parent'], step: '9' },
      { id: 'time-authorization', title: 'Time-Bound Authorization', icon: Clock, color: 'bg-purple-100 text-purple-600', roles: ['admin', 'parent'], step: '10' },
    ];

    return allItems.filter(item => item.roles.includes(role));
  };

  const renderView = () => {
    switch (currentView) {
      case 'users':
        return <UserManagement />;
      case 'registration':
        return <StudentRegistration />;
      case 'rfid-scan':
        return <RFIDScan />;
      case 'attendance':
        return <AttendanceMonitoring />;
      case 'activity-mood':
        return <ActivityMoodLog />;
      case 'pickup-verification':
        return <PickupVerification />;
      case 'parent-approval':
        return <ParentApproval userId={userId} />;
      case 'alerts':
        return <SafetyAlerts />;
      case 'reports':
        return <ReportsHistory role={role} userId={userId} />;
      case 'time-authorization':
        return <TimeBasedAuthorization userId={userId} />;
      default:
        return <DashboardHome />;
    }
  };

  const DashboardHome = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Welcome, {getRoleName()}</h2>
        <p className="text-gray-600">Select a module below to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {getMenuItems().map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setCurrentView(item.id as ViewType)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`${item.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary">Step {item.step}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                <CardDescription>Click to access this module</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {role === 'parent' && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Quick Access - Your Children
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-semibold">Emma Johnson</p>
                  <p className="text-sm text-gray-600">Status: Present</p>
                </div>
                <Badge className="bg-green-500">In School</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentView !== 'home' && (
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView('home')}
                  size="sm"
                >
                  ← Back
                </Button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">FCU Kindergarten</h1>
                <p className="text-sm text-gray-600">RFID Monitoring System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{userId}</p>
                <p className="text-xs text-gray-600">{getRoleName()}</p>
              </div>
              <Button variant="outline" onClick={onLogout} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
    </div>
  );
}
