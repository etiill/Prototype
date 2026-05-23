import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { UserPlus, Users, Trash2, Edit, IdCard } from 'lucide-react';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  rfidTag: string;
  grade: string;
  guardians: Guardian[];
}

interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  authorized: boolean;
}

export function StudentRegistration() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Emma Johnson',
      rfidTag: 'RFID-001234',
      grade: 'K-1',
      guardians: [
        { id: 'g1', name: 'Sarah Johnson', relationship: 'Mother', phone: '555-0101', email: 'sarah@example.com', authorized: true },
        { id: 'g2', name: 'Michael Johnson', relationship: 'Father', phone: '555-0102', email: 'michael@example.com', authorized: true }
      ]
    },
    {
      id: '2',
      name: 'Liam Chen',
      rfidTag: 'RFID-001235',
      grade: 'K-2',
      guardians: [
        { id: 'g3', name: 'Wei Chen', relationship: 'Mother', phone: '555-0201', email: 'wei@example.com', authorized: true }
      ]
    }
  ]);

  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    rfidTag: '',
    grade: '',
    guardianName: '',
    relationship: '',
    phone: '',
    email: ''
  });

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.rfidTag || !newStudent.guardianName) {
      toast.error('Please fill in all required fields');
      return;
    }

    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name,
      rfidTag: newStudent.rfidTag,
      grade: newStudent.grade,
      guardians: [{
        id: `g${Date.now()}`,
        name: newStudent.guardianName,
        relationship: newStudent.relationship,
        phone: newStudent.phone,
        email: newStudent.email,
        authorized: true
      }]
    };

    setStudents([...students, student]);
    setNewStudent({
      name: '',
      rfidTag: '',
      grade: '',
      guardianName: '',
      relationship: '',
      phone: '',
      email: ''
    });
    setIsAddingStudent(false);
    toast.success(`Student ${student.name} registered successfully!`);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast.success('Student removed from system');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <UserPlus className="w-7 h-7 text-orange-600" />
            Student & Guardian Registration
          </h2>
          <p className="text-gray-600 mt-1">Step 2: Register students and authorized guardians</p>
        </div>
        <Dialog open={isAddingStudent} onOpenChange={setIsAddingStudent}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Student</DialogTitle>
              <DialogDescription>Add a new student and their authorized guardian</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Student Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Student Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name *</Label>
                    <Input
                      id="studentName"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rfidTag">RFID Tag ID *</Label>
                    <Input
                      id="rfidTag"
                      value={newStudent.rfidTag}
                      onChange={(e) => setNewStudent({ ...newStudent, rfidTag: e.target.value })}
                      placeholder="RFID-XXXXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade Level</Label>
                    <Input
                      id="grade"
                      value={newStudent.grade}
                      onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                      placeholder="K-1, K-2, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-semibold text-lg">Primary Guardian Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName">Guardian Name *</Label>
                    <Input
                      id="guardianName"
                      value={newStudent.guardianName}
                      onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input
                      id="relationship"
                      value={newStudent.relationship}
                      onChange={(e) => setNewStudent({ ...newStudent, relationship: e.target.value })}
                      placeholder="Mother, Father, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                      placeholder="555-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      placeholder="guardian@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsAddingStudent(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddStudent} className="flex-1">
                  Register Student
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Students List */}
      <div className="grid grid-cols-1 gap-4">
        {students.map((student) => (
          <Card key={student.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>{student.name}</CardTitle>
                    <CardDescription>Grade: {student.grade}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <IdCard className="w-3 h-3" />
                    {student.rfidTag}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700">Authorized Guardians:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {student.guardians.map((guardian) => (
                    <div key={guardian.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm">{guardian.name}</p>
                        <p className="text-xs text-gray-600">{guardian.relationship}</p>
                        <p className="text-xs text-gray-600">{guardian.phone}</p>
                      </div>
                      {guardian.authorized && (
                        <Badge className="bg-green-500">Authorized</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {students.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No students registered yet</p>
            <p className="text-sm text-gray-500 mt-2">Click "Add Student" to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
