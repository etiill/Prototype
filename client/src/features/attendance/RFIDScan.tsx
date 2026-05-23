import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Radio, CheckCircle2, UserCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ScanRecord {
  id: string;
  studentName: string;
  rfidTag: string;
  time: string;
  status: 'success' | 'warning';
}

export function RFIDScan() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([
    {
      id: '1',
      studentName: 'Emma Johnson',
      rfidTag: 'RFID-001234',
      time: '8:15 AM',
      status: 'success'
    },
    {
      id: '2',
      studentName: 'Liam Chen',
      rfidTag: 'RFID-001235',
      time: '8:22 AM',
      status: 'success'
    }
  ]);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate RFID scan
    setTimeout(() => {
      const mockStudents = ['Olivia Martinez', 'Noah Williams', 'Sophia Brown', 'Lucas Davis'];
      const randomStudent = mockStudents[Math.floor(Math.random() * mockStudents.length)];
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      
      const newScan: ScanRecord = {
        id: Date.now().toString(),
        studentName: randomStudent,
        rfidTag: `RFID-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
        time: timeString,
        status: 'success'
      };

      setScanHistory([newScan, ...scanHistory]);
      setIsScanning(false);
      toast.success(`${randomStudent} checked in successfully!`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Radio className="w-7 h-7 text-green-600" />
          RFID Arrival Scan
        </h2>
        <p className="text-gray-600 mt-1">Step 3: Students tap their RFID card upon arrival</p>
      </div>

      {/* Scan Station */}
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-green-600" />
            RFID Scan Station
          </CardTitle>
          <CardDescription>Tap RFID card to check in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-8">
            {isScanning ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-green-500 animate-pulse flex items-center justify-center">
                    <Radio className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping"></div>
                </div>
                <p className="text-lg font-semibold text-green-700">Scanning...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-300">
                  <Radio className="w-16 h-16 text-green-600" />
                </div>
                <Button
                  size="lg"
                  onClick={handleScan}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Radio className="w-5 h-5 mr-2" />
                  Simulate RFID Scan
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-gray-600">Today's Check-ins</p>
              <p className="text-3xl font-bold text-green-600">{scanHistory.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Current Time</p>
              <p className="text-3xl font-bold text-blue-600">
                {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Check-ins
          </CardTitle>
          <CardDescription>Students who have arrived today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {scanHistory.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <UserCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{record.studentName}</p>
                    <p className="text-sm text-gray-600">{record.rfidTag}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold">{record.time}</p>
                    <p className="text-xs text-gray-600">Today</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              </div>
            ))}
          </div>

          {scanHistory.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Radio className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No check-ins yet today</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
