import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { FileText, Download, Calendar, TrendingUp, Users, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ReportsHistoryProps {
  role: 'admin' | 'teacher' | 'parent';
  userId: string;
}

export function ReportsHistory({ role, userId }: ReportsHistoryProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Attendance data for charts
  const attendanceData = [
    { day: 'Mon', present: 24, absent: 2, late: 1 },
    { day: 'Tue', present: 25, absent: 1, late: 1 },
    { day: 'Wed', present: 23, absent: 3, late: 1 },
    { day: 'Thu', present: 26, absent: 1, late: 0 },
    { day: 'Fri', present: 25, absent: 2, late: 0 },
  ];

  const pickupData = [
    { time: '2:00 PM', pickups: 3 },
    { time: '2:30 PM', pickups: 5 },
    { time: '3:00 PM', pickups: 8 },
    { time: '3:30 PM', pickups: 6 },
    { time: '4:00 PM', pickups: 4 },
    { time: '4:30 PM', pickups: 1 },
  ];

  const reportTemplates = [
    { id: '1', name: 'Daily Attendance Report', type: 'attendance', icon: Users },
    { id: '2', name: 'Weekly Activity Summary', type: 'activity', icon: TrendingUp },
    { id: '3', name: 'Pickup History Log', type: 'pickup', icon: Clock },
    { id: '4', name: 'Safety Alerts Summary', type: 'safety', icon: FileText },
  ];

  const generateReport = (reportName: string) => {
    // Simulate report generation
    const blob = new Blob([`${reportName} - Generated on ${new Date().toLocaleDateString()}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FileText className="w-7 h-7 text-orange-600" />
          Reports & History
        </h2>
        <p className="text-gray-600 mt-1">Step 9: Generate logs and view historical reports</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Avg. Attendance</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Activities Logged</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Pickups</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Reports Generated</p>
                  <p className="text-2xl font-bold">23</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
              <CardDescription>Latest events and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '10 minutes ago', event: 'Emma Johnson checked in', type: 'check-in' },
                  { time: '25 minutes ago', event: 'Weekly attendance report generated', type: 'report' },
                  { time: '1 hour ago', event: 'Parent approval received for Liam Chen pickup', type: 'approval' },
                  { time: '2 hours ago', event: 'Safety alert resolved for Noah Williams', type: 'alert' },
                  { time: '3 hours ago', event: 'Activity log updated for 5 students', type: 'activity' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item.type === 'check-in' ? 'bg-green-500' :
                        item.type === 'report' ? 'bg-blue-500' :
                        item.type === 'approval' ? 'bg-purple-500' :
                        item.type === 'alert' ? 'bg-red-500' : 'bg-orange-500'
                      }`}></div>
                      <p className="text-sm">{item.event}</p>
                    </div>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Period Selector */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
            <div className="flex gap-2">
              <Button
                variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('week')}
              >
                Week
              </Button>
              <Button
                variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('month')}
              >
                Month
              </Button>
              <Button
                variant={selectedPeriod === 'year' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('year')}
              >
                Year
              </Button>
            </div>
          </div>

          {/* Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Attendance Trends</CardTitle>
              <CardDescription>Student attendance over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#10b981" name="Present" />
                  <Bar dataKey="late" fill="#f59e0b" name="Late" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pickup Time Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Pickup Time Distribution</CardTitle>
              <CardDescription>When parents typically pick up their children</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pickupData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pickups" stroke="#8b5cf6" strokeWidth={2} name="Number of Pickups" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom Reports</CardTitle>
              <CardDescription>Select a report template to generate and download</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <div key={template.id} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{template.name}</h4>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {template.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => generateReport(template.name)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Generate & Download
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Report History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recently Generated Reports
              </CardTitle>
              <CardDescription>Your report generation history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: 'Weekly Attendance Report', date: 'Jan 10, 2026', size: '245 KB' },
                  { name: 'Monthly Activity Summary', date: 'Jan 5, 2026', size: '512 KB' },
                  { name: 'Pickup History Log', date: 'Jan 3, 2026', size: '189 KB' },
                  { name: 'Safety Alerts Summary', date: 'Dec 28, 2025', size: '156 KB' },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-sm">{report.name}</p>
                        <p className="text-xs text-gray-600">{report.date} • {report.size}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
