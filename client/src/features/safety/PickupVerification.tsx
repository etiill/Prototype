import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Guardian {
  id: string;
  name: string;
  relationship: string;
  photo: string;
  authorized: boolean;
  studentName: string;
}

interface VerificationRecord {
  id: string;
  guardianName: string;
  studentName: string;
  status: 'approved' | 'denied';
  time: string;
  reason?: string;
}

export function PickupVerification() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  const [verificationHistory, setVerificationHistory] = useState<VerificationRecord[]>([
    {
      id: '1',
      guardianName: 'Sarah Johnson',
      studentName: 'Emma Johnson',
      status: 'approved',
      time: '3:15 PM'
    },
    {
      id: '2',
      guardianName: 'Wei Chen',
      studentName: 'Liam Chen',
      status: 'approved',
      time: '3:22 PM'
    }
  ]);

  const guardians: Guardian[] = [
    {
      id: 'g1',
      name: 'Sarah Johnson',
      relationship: 'Mother',
      photo: '👩',
      authorized: true,
      studentName: 'Emma Johnson'
    },
    {
      id: 'g2',
      name: 'Michael Johnson',
      relationship: 'Father',
      photo: '👨',
      authorized: true,
      studentName: 'Emma Johnson'
    },
    {
      id: 'g3',
      name: 'Wei Chen',
      relationship: 'Mother',
      photo: '👩',
      authorized: true,
      studentName: 'Liam Chen'
    },
    {
      id: 'g4',
      name: 'John Doe',
      relationship: 'Uncle',
      photo: '👨',
      authorized: false,
      studentName: 'Emma Johnson'
    }
  ];

  const filteredGuardians = guardians.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVerify = (guardian: Guardian, approved: boolean) => {
    const record: VerificationRecord = {
      id: Date.now().toString(),
      guardianName: guardian.name,
      studentName: guardian.studentName,
      status: approved ? 'approved' : 'denied',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      reason: !approved ? 'Not in authorized guardian list' : undefined
    };

    setVerificationHistory([record, ...verificationHistory]);
    setSelectedGuardian(null);
    setSearchQuery('');

    if (approved) {
      toast.success(`✓ ${guardian.name} verified for pickup of ${guardian.studentName}`);
    } else {
      toast.error(`✗ ${guardian.name} denied - Not authorized`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-yellow-600" />
          Guardian Pick-Up Verification
        </h2>
        <p className="text-gray-600 mt-1">Step 6: Verify authorized guardian identity</p>
      </div>

      {/* Verification Interface */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-yellow-600" />
            ID Verification Station
          </CardTitle>
          <CardDescription>Search and verify guardian identity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by guardian or student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {searchQuery && filteredGuardians.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredGuardians.map((guardian) => (
                <div
                  key={guardian.id}
                  onClick={() => setSelectedGuardian(guardian)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedGuardian?.id === guardian.id
                      ? 'border-yellow-500 bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{guardian.photo}</div>
                      <div>
                        <p className="font-semibold">{guardian.name}</p>
                        <p className="text-sm text-gray-600">{guardian.relationship} of {guardian.studentName}</p>
                      </div>
                    </div>
                    {guardian.authorized ? (
                      <Badge className="bg-green-500">Authorized</Badge>
                    ) : (
                      <Badge className="bg-red-500">Not Authorized</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedGuardian && (
            <div className="border-t pt-4 space-y-4">
              <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-6xl">{selectedGuardian.photo}</div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedGuardian.name}</h3>
                    <p className="text-gray-600">{selectedGuardian.relationship}</p>
                    <p className="text-sm text-gray-500">Picking up: {selectedGuardian.studentName}</p>
                  </div>
                </div>

                {selectedGuardian.authorized ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">✓ Authorized Guardian</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">This person is approved to pick up this student</p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-semibold">⚠ Not Authorized</span>
                    </div>
                    <p className="text-sm text-red-600 mt-1">This person is NOT on the authorized guardian list</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedGuardian(null)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  {selectedGuardian.authorized ? (
                    <Button
                      onClick={() => handleVerify(selectedGuardian, true)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve Pickup
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleVerify(selectedGuardian, false)}
                      className="flex-1 bg-red-600 hover:bg-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Deny Pickup
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Verification History */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Pickup Verifications</CardTitle>
          <CardDescription>Recent verification records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {verificationHistory.map((record) => (
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
                    {record.status === 'approved' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{record.guardianName}</p>
                    <p className="text-sm text-gray-600">Student: {record.studentName}</p>
                    {record.reason && (
                      <p className="text-xs text-red-600 mt-1">{record.reason}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{record.time}</p>
                  {record.status === 'approved' ? (
                    <Badge className="bg-green-500 mt-1">Approved</Badge>
                  ) : (
                    <Badge className="bg-red-500 mt-1">Denied</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
