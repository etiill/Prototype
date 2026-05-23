import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ClipboardCheck, Users, UserCheck, UserX, Clock } from 'lucide-react';
import { Progress } from '../../components/ui/progress';

interface AttendanceRecord {
  id: string;
  name: string;
  grade: string;
  status: 'present' | 'absent' | 'late';
  checkInTime?: string;
}

export function AttendanceMonitoring() {
  const attendanceData: AttendanceRecord[] = [
    { id: '1', name: 'Emma Johnson', grade: 'K-1', status: 'present', checkInTime: '8:15 AM' },
    { id: '2', name: 'Liam Chen', grade: 'K-2', status: 'present', checkInTime: '8:22 AM' },
    { id: '3', name: 'Olivia Martinez', grade: 'K-1', status: 'present', checkInTime: '8:05 AM' },
    { id: '4', name: 'Noah Williams', grade: 'K-2', status: 'late', checkInTime: '9:15 AM' },
    { id: '5', name: 'Sophia Brown', grade: 'K-1', status: 'absent' },
    { id: '6', name: 'Lucas Davis', grade: 'K-2', status: 'present', checkInTime: '8:30 AM' },
  ];

  const totalStudents = attendanceData.length;
  const presentCount = attendanceData.filter(s => s.status === 'present').length;
  const lateCount = attendanceData.filter(s => s.status === 'late').length;
  const absentCount = attendanceData.filter(s => s.status === 'absent').length;
  const attendanceRate = Math.round(((presentCount + lateCount) / totalStudents) * 100);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-green-500">Present</Badge>;
      case 'late':
        return <Badge className="bg-yellow-500">Late</Badge>;
      case 'absent':
        return <Badge className="bg-red-500">Absent</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <UserCheck className="w-5 h-5 text-green-600" />;
      case 'late':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'absent':
        return <UserX className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <ClipboardCheck className="w-7 h-7 text-pink-600" />
          Live Attendance Monitoring
        </h2>
        <p className="text-gray-600 mt-1">Step 4: View real-time attendance status</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-3xl font-bold">{totalStudents}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-3xl font-bold text-green-600">{presentCount}</p>
              </div>
              <UserCheck className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Late</p>
                <p className="text-3xl font-bold text-yellow-600">{lateCount}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-3xl font-bold text-red-600">{absentCount}</p>
              </div>
              <UserX className="w-10 h-10 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Rate */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50">
        <CardHeader>
          <CardTitle>Today's Attendance Rate</CardTitle>
          <CardDescription>Real-time attendance percentage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-pink-600">{attendanceRate}%</span>
            <span className="text-sm text-gray-600">
              {presentCount + lateCount} of {totalStudents} students
            </span>
          </div>
          <Progress value={attendanceRate} className="h-3" />
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Attendance List</CardTitle>
          <CardDescription>Real-time status of all students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {attendanceData.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    student.status === 'present' ? 'bg-green-100' :
                    student.status === 'late' ? 'bg-yellow-100' : 'bg-red-100'
                  }`}>
                    {getStatusIcon(student.status)}
                  </div>
                  <div>
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm text-gray-600">Grade: {student.grade}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {student.checkInTime && (
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold">{student.checkInTime}</p>
                      <p className="text-xs text-gray-500">Check-in time</p>
                    </div>
                  )}
                  {getStatusBadge(student.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
