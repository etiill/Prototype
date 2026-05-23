import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Clock, Calendar, Plus, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TimeAuthorization {
  id: string;
  studentName: string;
  guardianName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'expired' | 'upcoming';
  notes?: string;
}

export function TimeBasedAuthorization({ userId }: { userId: string }) {
  const [authorizations, setAuthorizations] = useState<TimeAuthorization[]>([
    {
      id: '1',
      studentName: 'Emma Johnson',
      guardianName: 'Michael Johnson',
      date: 'Jan 12, 2026',
      startTime: '3:00 PM',
      endTime: '5:00 PM',
      status: 'active',
      notes: 'Father will pick up today only'
    },
    {
      id: '2',
      studentName: 'Emma Johnson',
      guardianName: 'Grandmother (Mary Johnson)',
      date: 'Jan 13, 2026',
      startTime: '2:00 PM',
      endTime: '4:00 PM',
      status: 'upcoming',
      notes: 'Doctor appointment - early pickup'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newAuth, setNewAuth] = useState({
    guardianName: '',
    date: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  const students = ['Emma Johnson', 'Liam Chen'];

  const handleCreateAuthorization = () => {
    if (!newAuth.guardianName || !newAuth.date || !newAuth.startTime || !newAuth.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    const authorization: TimeAuthorization = {
      id: Date.now().toString(),
      studentName: 'Emma Johnson', // In a real app, this would be selectable
      guardianName: newAuth.guardianName,
      date: newAuth.date,
      startTime: newAuth.startTime,
      endTime: newAuth.endTime,
      status: 'upcoming',
      notes: newAuth.notes
    };

    setAuthorizations([...authorizations, authorization]);
    setNewAuth({
      guardianName: '',
      date: '',
      startTime: '',
      endTime: '',
      notes: ''
    });
    setIsCreating(false);
    toast.success('Time-bound authorization created successfully!');
  };

  const handleDeleteAuthorization = (id: string) => {
    setAuthorizations(authorizations.filter(a => a.id !== id));
    toast.success('Authorization removed');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active Now</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-500">Upcoming</Badge>;
      case 'expired':
        return <Badge className="bg-gray-500">Expired</Badge>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-green-300 bg-green-50';
      case 'upcoming':
        return 'border-blue-300 bg-blue-50';
      case 'expired':
        return 'border-gray-300 bg-gray-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  const activeAuths = authorizations.filter(a => a.status === 'active');
  const upcomingAuths = authorizations.filter(a => a.status === 'upcoming');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Clock className="w-7 h-7 text-purple-600" />
            Time-Bound Pick-Up Authorization
          </h2>
          <p className="text-gray-600 mt-1">Step 10: Set expiry for pickup permissions</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Authorization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Time-Bound Authorization</DialogTitle>
              <DialogDescription>
                Set a temporary pickup window for a guardian
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-purple-900">
                  <p className="font-semibold mb-1">Time-Bound Authorization</p>
                  <p>This creates a temporary pickup permission that automatically expires after the specified time period.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="guardian">Guardian Name *</Label>
                  <Input
                    id="guardian"
                    placeholder="e.g., Grandmother, Uncle, etc."
                    value={newAuth.guardianName}
                    onChange={(e) => setNewAuth({ ...newAuth, guardianName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAuth.date}
                    onChange={(e) => setNewAuth({ ...newAuth, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Valid For</Label>
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      value={newAuth.startTime}
                      onChange={(e) => setNewAuth({ ...newAuth, startTime: e.target.value })}
                      placeholder="Start"
                    />
                    <span className="flex items-center">to</span>
                    <Input
                      type="time"
                      value={newAuth.endTime}
                      onChange={(e) => setNewAuth({ ...newAuth, endTime: e.target.value })}
                      placeholder="End"
                    />
                  </div>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="e.g., Doctor appointment, emergency pickup, etc."
                    value={newAuth.notes}
                    onChange={(e) => setNewAuth({ ...newAuth, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsCreating(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAuthorization}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  Create Authorization
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Authorizations */}
      {activeAuths.length > 0 && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Clock className="w-5 h-5 animate-pulse" />
              Active Authorizations - Valid Now
            </CardTitle>
            <CardDescription>These pickup authorizations are currently active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeAuths.map((auth) => (
                <div key={auth.id} className="p-4 bg-white border-2 border-green-300 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{auth.guardianName}</h3>
                      <p className="text-sm text-gray-600">Picking up: {auth.studentName}</p>
                    </div>
                    {getStatusBadge(auth.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{auth.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{auth.startTime} - {auth.endTime}</span>
                    </div>
                  </div>

                  {auth.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg mb-3">
                      <p className="text-sm text-gray-700">{auth.notes}</p>
                    </div>
                  )}

                  <div className="pt-3 border-t flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-700">✓ Authorized until {auth.endTime}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteAuthorization(auth.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Authorizations */}
      {upcomingAuths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Upcoming Authorizations
            </CardTitle>
            <CardDescription>Scheduled future pickup permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAuths.map((auth) => (
                <div key={auth.id} className={`p-4 border-2 rounded-lg ${getStatusColor(auth.status)}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{auth.guardianName}</h3>
                      <p className="text-sm text-gray-600">Picking up: {auth.studentName}</p>
                    </div>
                    {getStatusBadge(auth.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{auth.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{auth.startTime} - {auth.endTime}</span>
                    </div>
                  </div>

                  {auth.notes && (
                    <div className="p-3 bg-white rounded-lg mb-3">
                      <p className="text-sm text-gray-700">{auth.notes}</p>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteAuthorization(auth.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cancel Authorization
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle>How Time-Bound Authorization Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                <span className="text-purple-700 font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Set Time Window</p>
                <p className="text-xs text-gray-600">Specify the date and time range when pickup is allowed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                <span className="text-purple-700 font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Auto-Activation</p>
                <p className="text-xs text-gray-600">Authorization automatically becomes active during the time window</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                <span className="text-purple-700 font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Auto-Expiry</p>
                <p className="text-xs text-gray-600">Permission expires automatically after the end time</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {authorizations.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No time-bound authorizations set</p>
            <p className="text-sm text-gray-500 mt-2">Create one to allow temporary pickup permissions</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
