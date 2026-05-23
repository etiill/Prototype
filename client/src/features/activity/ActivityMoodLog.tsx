import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Smile, Frown, Meh, ThumbsUp, Activity, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface MoodLog {
  id: string;
  studentName: string;
  mood: 'happy' | 'neutral' | 'sad';
  activities: string[];
  notes: string;
  time: string;
}

export function ActivityMoodLog() {
  const [logs, setLogs] = useState<MoodLog[]>([
    {
      id: '1',
      studentName: 'Emma Johnson',
      mood: 'happy',
      activities: ['Art & Crafts', 'Story Time', 'Outdoor Play'],
      notes: 'Very engaged during art class. Created a beautiful painting.',
      time: '2:30 PM'
    },
    {
      id: '2',
      studentName: 'Liam Chen',
      mood: 'happy',
      activities: ['Math Games', 'Music', 'Snack Time'],
      notes: 'Participated actively in all activities.',
      time: '2:15 PM'
    },
    {
      id: '3',
      studentName: 'Olivia Martinez',
      mood: 'neutral',
      activities: ['Reading', 'Group Play'],
      notes: 'Seemed a bit tired after lunch. Rested during quiet time.',
      time: '1:45 PM'
    }
  ]);

  const [isAddingLog, setIsAddingLog] = useState(false);
  const [newLog, setNewLog] = useState({
    studentName: '',
    mood: 'happy' as 'happy' | 'neutral' | 'sad',
    activities: [] as string[],
    notes: ''
  });

  const availableActivities = [
    'Art & Crafts',
    'Story Time',
    'Outdoor Play',
    'Math Games',
    'Music',
    'Snack Time',
    'Reading',
    'Group Play',
    'Nap Time',
    'Science Activities'
  ];

  const students = ['Emma Johnson', 'Liam Chen', 'Olivia Martinez', 'Noah Williams', 'Sophia Brown', 'Lucas Davis'];

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy':
        return <Smile className="w-6 h-6 text-green-500" />;
      case 'neutral':
        return <Meh className="w-6 h-6 text-yellow-500" />;
      case 'sad':
        return <Frown className="w-6 h-6 text-red-500" />;
      default:
        return null;
    }
  };

  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case 'happy':
        return <Badge className="bg-green-500">Happy</Badge>;
      case 'neutral':
        return <Badge className="bg-yellow-500">Neutral</Badge>;
      case 'sad':
        return <Badge className="bg-red-500">Needs Attention</Badge>;
      default:
        return null;
    }
  };

  const toggleActivity = (activity: string) => {
    if (newLog.activities.includes(activity)) {
      setNewLog({
        ...newLog,
        activities: newLog.activities.filter(a => a !== activity)
      });
    } else {
      setNewLog({
        ...newLog,
        activities: [...newLog.activities, activity]
      });
    }
  };

  const handleAddLog = () => {
    if (!newLog.studentName) {
      toast.error('Please select a student');
      return;
    }

    const log: MoodLog = {
      id: Date.now().toString(),
      studentName: newLog.studentName,
      mood: newLog.mood,
      activities: newLog.activities,
      notes: newLog.notes,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setLogs([log, ...logs]);
    setNewLog({
      studentName: '',
      mood: 'happy',
      activities: [],
      notes: ''
    });
    setIsAddingLog(false);
    toast.success('Activity and mood logged successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Smile className="w-7 h-7 text-blue-600" />
            Daily Activity & Mood Log
          </h2>
          <p className="text-gray-600 mt-1">Step 5: Log student activities and emotional state</p>
        </div>
        <Dialog open={isAddingLog} onOpenChange={setIsAddingLog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Log Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log Activity & Mood</DialogTitle>
              <DialogDescription>Record student activities and emotional state</DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Select Student</Label>
                <div className="grid grid-cols-2 gap-2">
                  {students.map((student) => (
                    <button
                      key={student}
                      onClick={() => setNewLog({ ...newLog, studentName: student })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        newLog.studentName === student
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {student}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mood</Label>
                <div className="flex gap-4">
                  {[
                    { value: 'happy', icon: Smile, label: 'Happy', color: 'text-green-500' },
                    { value: 'neutral', icon: Meh, label: 'Neutral', color: 'text-yellow-500' },
                    { value: 'sad', icon: Frown, label: 'Sad', color: 'text-red-500' }
                  ].map((mood) => {
                    const MoodIcon = mood.icon;
                    return (
                      <button
                        key={mood.value}
                        onClick={() => setNewLog({ ...newLog, mood: mood.value as any })}
                        className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                          newLog.mood === mood.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <MoodIcon className={`w-8 h-8 mx-auto mb-2 ${mood.color}`} />
                        <p className="text-sm font-semibold">{mood.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Activities (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableActivities.map((activity) => (
                    <button
                      key={activity}
                      onClick={() => toggleActivity(activity)}
                      className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                        newLog.activities.includes(activity)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={newLog.notes}
                  onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                  placeholder="Add any additional observations or notes..."
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsAddingLog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddLog} className="flex-1">
                  Save Log Entry
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    {getMoodIcon(log.mood)}
                  </div>
                  <div>
                    <CardTitle>{log.studentName}</CardTitle>
                    <CardDescription>{log.time} - Today</CardDescription>
                  </div>
                </div>
                {getMoodBadge(log.mood)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Activities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {log.activities.map((activity, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {activity}
                    </Badge>
                  ))}
                </div>
              </div>
              {log.notes && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{log.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {logs.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Smile className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No activity logs yet</p>
            <p className="text-sm text-gray-500 mt-2">Click "Add Log Entry" to start logging</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
