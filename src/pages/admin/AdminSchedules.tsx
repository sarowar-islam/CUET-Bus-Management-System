import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Plus, Pencil, Trash2, Search, Clock, Bus, Route } from 'lucide-react';
import { schedules as initialSchedules, buses, routes, drivers } from '@/data/dummyData';
import { Schedule, UserRole } from '@/data/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const AdminSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    driverId: '',
    departureTime: '',
    direction: 'from_cuet' as 'from_cuet' | 'to_cuet',
    category: [] as UserRole[],
  });
  const { toast } = useToast();

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const filteredSchedules = schedules.filter(schedule => {
    const bus = buses.find(b => b.id === schedule.busId);
    const route = routes.find(r => r.id === schedule.routeId);
    return (
      bus?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.departureTime.includes(searchQuery)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.category.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one category.', variant: 'destructive' });
      return;
    }
    
    if (editingSchedule) {
      setSchedules(schedules.map(s => 
        s.id === editingSchedule.id 
          ? { ...s, ...formData }
          : s
      ));
      toast({ title: 'Success', description: 'Schedule updated successfully.' });
    } else {
      const newSchedule: Schedule = {
        id: `sch${Date.now()}`,
        ...formData,
      };
      setSchedules([...schedules, newSchedule]);
      toast({ title: 'Success', description: 'New schedule added successfully.' });
    }
    
    setIsDialogOpen(false);
    setEditingSchedule(null);
    setFormData({
      busId: '',
      routeId: '',
      driverId: '',
      departureTime: '',
      direction: 'from_cuet',
      category: [],
    });
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      busId: schedule.busId,
      routeId: schedule.routeId,
      driverId: schedule.driverId,
      departureTime: schedule.departureTime,
      direction: schedule.direction,
      category: schedule.category,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (scheduleId: string) => {
    setSchedules(schedules.filter(s => s.id !== scheduleId));
    toast({ title: 'Deleted', description: 'Schedule removed successfully.' });
  };

  const handleOpenDialog = () => {
    setEditingSchedule(null);
    setFormData({
      busId: '',
      routeId: '',
      driverId: '',
      departureTime: '',
      direction: 'from_cuet',
      category: [],
    });
    setIsDialogOpen(true);
  };

  const toggleCategory = (category: UserRole) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'student': return 'bg-student/10 text-student border-student/20';
      case 'teacher': return 'bg-teacher/10 text-teacher border-teacher/20';
      case 'staff': return 'bg-staff/10 text-staff border-staff/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Schedule Management</h1>
            <p className="text-muted-foreground">Manage bus schedules and assignments</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
                <DialogDescription>
                  {editingSchedule ? 'Update the schedule details below.' : 'Create a new bus schedule.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bus</Label>
                    <Select value={formData.busId} onValueChange={(v) => setFormData({ ...formData, busId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bus" />
                      </SelectTrigger>
                      <SelectContent>
                        {buses.map(bus => (
                          <SelectItem key={bus.id} value={bus.id}>{bus.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Route</Label>
                    <Select value={formData.routeId} onValueChange={(v) => setFormData({ ...formData, routeId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        {routes.map(route => (
                          <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Driver</Label>
                    <Select value={formData.driverId} onValueChange={(v) => setFormData({ ...formData, driverId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map(driver => (
                          <SelectItem key={driver.id} value={driver.id}>{driver.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Departure Time</Label>
                    <Input
                      type="time"
                      value={formData.departureTime}
                      onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Direction</Label>
                  <Select 
                    value={formData.direction} 
                    onValueChange={(v: 'from_cuet' | 'to_cuet') => setFormData({ ...formData, direction: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="from_cuet">From CUET</SelectItem>
                      <SelectItem value="to_cuet">To CUET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex gap-4">
                    {(['student', 'teacher', 'staff'] as UserRole[]).map(cat => (
                      <div key={cat} className="flex items-center gap-2">
                        <Checkbox
                          id={cat}
                          checked={formData.category.includes(cat)}
                          onCheckedChange={() => toggleCategory(cat)}
                        />
                        <label htmlFor={cat} className="text-sm capitalize cursor-pointer">
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingSchedule ? 'Update' : 'Add'} Schedule
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-0 shadow-soft">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                All Schedules ({filteredSchedules.length})
              </CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search schedules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Bus</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => {
                    const bus = buses.find(b => b.id === schedule.busId);
                    const route = routes.find(r => r.id === schedule.routeId);
                    const driver = drivers.find(d => d.id === schedule.driverId);
                    
                    return (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary font-medium w-fit">
                            <Clock className="w-3.5 h-3.5" />
                            {formatTime(schedule.departureTime)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Bus className="w-4 h-4 text-muted-foreground" />
                            {bus?.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: route?.color }}
                            />
                            {route?.name}
                          </div>
                        </TableCell>
                        <TableCell>{driver?.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {schedule.direction === 'from_cuet' ? 'From CUET' : 'To CUET'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {schedule.category.map((cat) => (
                              <Badge 
                                key={cat} 
                                variant="outline"
                                className={cn("capitalize text-xs", getCategoryColor(cat))}
                              >
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEdit(schedule)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(schedule.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSchedules;
