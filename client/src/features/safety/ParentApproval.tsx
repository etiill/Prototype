import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CheckCircle2, Clock, UserCheck, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface PickupRequest {
  id: string;
  studentName: string;
  requestedBy: string;
  requestedTime: string;
  status: 'pending' | 'approved' | 'denied';
}

export function ParentApproval({ userId }: { userId: string }) {
  const [requests, setRequests] = useState<PickupRequest[]>([
    {
      id: '1',
      studentName: 'Emma Johnson',
      requestedBy: 'School Staff',
      requestedTime: '3:00 PM',
      status: 'pending'
    }
  ]);

  const [approvalHistory, setApprovalHistory] = useState<PickupRequest[]>([
    {
      id: 'h1',
      studentName: 'Emma Johnson',
      requestedBy: 'Michael Johnson',
      requestedTime: 'Yesterday, 3:15 PM',
      status: 'approved'
    }
  ]);

  const handleApprove = (request: PickupRequest) => {
    const updatedRequest = { ...request, status: 'approved' as const };
    setRequests(requests.filter(r => r.id !== request.id));
    setApprovalHistory([updatedRequest, ...approvalHistory]);
    toast.success(`✓ Pickup approved for ${request.studentName}`);
  };

  const handleDeny = (request: PickupRequest) => {
    const updatedRequest = { ...request, status: 'denied' as const };
    setRequests(requests.filter(r => r.id !== request.id));
    setApprovalHistory([updatedRequest, ...approvalHistory]);
    toast.error(`Pickup denied for ${request.studentName}`);
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
          Parent Approval & Release
        </h2>
        <p className="text-gray-600 mt-1">Step 7: Approve or deny pickup requests</p>
      </div>

      {/* Notification Banner */}
      {pendingCount > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-green-600 animate-pulse" />
              <div>
                <p className="font-semibold text-green-900">
                  You have {pendingCount} pending pickup {pendingCount === 1 ? 'request' : 'requests'}
                </p>
                <p className="text-sm text-green-700">Please review and approve or deny below</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending Pickup Requests
          </CardTitle>
          <CardDescription>Review and approve pickup requests for your children</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{request.studentName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Requested by: {request.requestedBy}
                      </p>
                      <p className="text-sm text-gray-600">
                        Time: {request.requestedTime}
                      </p>
                    </div>
                    <Badge className="bg-yellow-500">Pending</Badge>
                  </div>

                  <div className="bg-white p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-700">
                      <strong>Pickup Request:</strong> A guardian is at the school requesting to pick up {request.studentName}. 
                      Please approve or deny this request.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleDeny(request)}
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Deny
                    </Button>
                    <Button
                      onClick={() => handleApprove(request)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve Pickup
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No pending requests</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common pickup approval actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <p className="font-semibold">Pre-approve Today's Pickup</p>
                <p className="text-xs text-gray-600 mt-1">Approve authorized guardians in advance</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <p className="font-semibold">Emergency Contact Pickup</p>
                <p className="text-xs text-gray-600 mt-1">Authorize emergency contact for pickup</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Approval History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Recent Approvals
          </CardTitle>
          <CardDescription>History of your pickup approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {approvalHistory.map((record) => (
              <div
                key={record.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  record.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    record.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <CheckCircle2 className={`w-5 h-5 ${
                      record.status === 'approved' ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-semibold">{record.studentName}</p>
                    <p className="text-sm text-gray-600">Picked up by: {record.requestedBy}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{record.requestedTime}</p>
                  <Badge className={record.status === 'approved' ? 'bg-green-500' : 'bg-red-500'}>
                    {record.status === 'approved' ? 'Approved' : 'Denied'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
