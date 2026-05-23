import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { AlertTriangle, Mail, Bell, Shield, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Alert {
  id: string;
  type: 'unauthorized-pickup' | 'late-arrival' | 'unusual-activity' | 'missing-student' | 'medical';
  severity: 'high' | 'medium' | 'low';
  studentName: string;
  message: string;
  time: string;
  status: 'active' | 'resolved';
  actions: string[];
}

export function SafetyAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'unauthorized-pickup',
      severity: 'high',
      studentName: 'Emma Johnson',
      message: 'Unauthorized person attempted pickup. Individual not on approved guardian list.',
      time: '3:45 PM',
      status: 'active',
      actions: ['Notified parents', 'Security alerted']
    },
    {
      id: '2',
      type: 'late-arrival',
      severity: 'medium',
      studentName: 'Noah Williams',
      message: 'Student arrived significantly late (60+ minutes). No prior notification received.',
      time: '9:15 AM',
      status: 'resolved',
      actions: ['Parent contacted', 'Attendance updated']
    },
    {
      id: '3',
      type: 'unusual-activity',
      severity: 'low',
      studentName: 'Sophia Brown',
      message: 'Student appeared unusually tired and withdrawn during activities.',
      time: '2:30 PM',
      status: 'resolved',
      actions: ['Teacher observation', 'Parent notified']
    }
  ]);

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [responseNote, setResponseNote] = useState('');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-500">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-blue-500">Low Priority</Badge>;
      default:
        return null;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'unauthorized-pickup':
        return <Shield className="w-5 h-5" />;
      case 'late-arrival':
        return <Clock className="w-5 h-5" />;
      case 'medical':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getAlertTitle = (type: string) => {
    switch (type) {
      case 'unauthorized-pickup':
        return 'Unauthorized Pickup Attempt';
      case 'late-arrival':
        return 'Late Arrival';
      case 'unusual-activity':
        return 'Unusual Behavior Noted';
      case 'missing-student':
        return 'Missing Student';
      case 'medical':
        return 'Medical Alert';
      default:
        return 'Safety Alert';
    }
  };

  const handleResolveAlert = (alert: Alert) => {
    setAlerts(alerts.map(a =>
      a.id === alert.id ? { ...a, status: 'resolved' as const } : a
    ));
    setSelectedAlert(null);
    setResponseNote('');
    toast.success('Alert marked as resolved');
  };

  const handleSendNotification = (alert: Alert) => {
    toast.success(`Emergency notification sent to parents of ${alert.studentName}`);
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-red-600" />
          Safety Alerts & Exceptions
        </h2>
        <p className="text-gray-600 mt-1">Step 8: Monitor and respond to safety alerts</p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700">Active Alerts</p>
                <p className="text-3xl font-bold text-red-600">{activeAlerts.length}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Resolved Today</p>
                <p className="text-3xl font-bold text-green-600">{resolvedAlerts.length}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Total Alerts</p>
                <p className="text-3xl font-bold text-blue-600">{alerts.length}</p>
              </div>
              <Bell className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card className="border-2 border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="w-5 h-5" />
              Active Alerts - Immediate Attention Required
            </CardTitle>
            <CardDescription>These alerts need to be reviewed and resolved</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-2 rounded-lg ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-full">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{getAlertTitle(alert.type)}</h3>
                        <p className="text-sm opacity-75">Student: {alert.studentName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{alert.time}</span>
                      {getSeverityBadge(alert.severity)}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg mb-3">
                    <p className="text-sm">{alert.message}</p>
                  </div>

                  {alert.actions.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold mb-2">Actions Taken:</p>
                      <div className="flex flex-wrap gap-2">
                        {alert.actions.map((action, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            ✓ {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSendNotification(alert)}
                      className="flex-1"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Notify Parents
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          onClick={() => setSelectedAlert(alert)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Resolve Alert
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Resolve Alert</DialogTitle>
                          <DialogDescription>
                            Add resolution notes for {alert.studentName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-semibold mb-1">{getAlertTitle(alert.type)}</p>
                            <p className="text-sm text-gray-600">{alert.message}</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="resolution">Resolution Notes</Label>
                            <Textarea
                              id="resolution"
                              placeholder="Describe how this alert was resolved..."
                              value={responseNote}
                              onChange={(e) => setResponseNote(e.target.value)}
                              rows={4}
                            />
                          </div>

                          <div className="flex gap-3">
                            <Button variant="outline" className="flex-1">
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleResolveAlert(alert)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              Mark as Resolved
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resolved Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Resolved Alerts
          </CardTitle>
          <CardDescription>Previously resolved safety alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {resolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold">{getAlertTitle(alert.type)}</p>
                    <p className="text-sm text-gray-600">Student: {alert.studentName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{alert.time}</p>
                  <Badge className="bg-green-500 mt-1">Resolved</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {activeAlerts.length === 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6 text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-900 mb-2">All Clear!</h3>
            <p className="text-green-700">No active safety alerts at this time</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
