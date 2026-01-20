import React, { useState } from 'react';
import UserLayout from '@/components/layout/UserLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { busRequests as initialRequests, buses } from '@/data/dummyData';
import { BusRequest } from '@/data/types';
import { Bus, Calendar, Clock, MapPin, Users, Plus, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const RequestBus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [requests, setRequests] = useState<BusRequest[]>(
    initialRequests.filter(r => r.requesterId === user?.id)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    purpose: '',
    date: '',
    startTime: '',
    endTime: '',
    pickupLocation: '',
    destination: '',
    expectedPassengers: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: BusRequest = {
      id: `breq${Date.now()}`,
      requesterId: user?.id || '',
      requesterName: user?.fullName || '',
      requesterRole: user?.role as 'teacher' | 'staff',
      purpose: formData.purpose,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      pickupLocation: formData.pickupLocation,
      destination: formData.destination,
      expectedPassengers: parseInt(formData.expectedPassengers),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setRequests([newRequest, ...requests]);
    setIsDialogOpen(false);
    setFormData({
      purpose: '',
      date: '',
      startTime: '',
      endTime: '',
      pickupLocation: '',
      destination: '',
      expectedPassengers: '',
    });
    
    toast({
      title: 'Request Submitted!',
      description: 'Your bus request has been sent to the admin for approval.',
    });
  };

  const getStatusBadge = (status: BusRequest['status']) => {
    const config = {
      pending: { 
        icon: AlertCircle, 
        className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        label: 'Pending Approval'
      },
      approved: { 
        icon: CheckCircle2, 
        className: 'bg-green-500/10 text-green-600 border-green-500/20',
        label: 'Approved'
      },
      rejected: { 
        icon: XCircle, 
        className: 'bg-red-500/10 text-red-600 border-red-500/20',
        label: 'Rejected'
      },
      completed: { 
        icon: CheckCircle2, 
        className: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
        label: 'Completed'
      },
    };

    const { icon: Icon, className, label } = config[status];
    
    return (
      <Badge variant="outline" className={cn("flex items-center gap-1", className)}>
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <UserLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <Bus className="w-8 h-8 text-primary" />
              Request a Bus
            </h1>
            <p className="text-muted-foreground mt-1">
              Reserve a bus for official tours, events, or special trips
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Bus className="w-5 h-5" />
                  Request a Bus
                </DialogTitle>
                <DialogDescription>
                  Fill out the details for your bus reservation. Admin will review and respond to your request.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose / Event Name *</Label>
                  <Input
                    id="purpose"
                    placeholder="e.g., Department Picnic, Educational Tour"
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      min={minDate}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedPassengers">Expected Passengers *</Label>
                    <Input
                      id="expectedPassengers"
                      type="number"
                      min="1"
                      max="200"
                      placeholder="e.g., 45"
                      value={formData.expectedPassengers}
                      onChange={(e) => setFormData({ ...formData, expectedPassengers: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time (Approx.) *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupLocation">Pickup Location *</Label>
                  <Input
                    id="pickupLocation"
                    placeholder="e.g., CUET Main Gate"
                    value={formData.pickupLocation}
                    onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination *</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Cox's Bazar, Foy's Lake"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Request
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">How it works</p>
                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                  <li>• Submit your request at least 3 days in advance</li>
                  <li>• Admin will review and assign an available bus</li>
                  <li>• You'll receive notification once approved</li>
                  <li>• Contact transport office for urgent requests</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Your Requests
            </CardTitle>
            <CardDescription>
              Track the status of your bus reservation requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bus className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No requests yet</p>
                <p className="text-sm">Click "New Request" to reserve a bus for your event</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => {
                  const assignedBus = request.assignedBusId 
                    ? buses.find(b => b.id === request.assignedBusId) 
                    : null;
                  
                  return (
                    <div
                      key={request.id}
                      className="p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h3 className="font-semibold text-lg">{request.purpose}</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(request.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{formatTime(request.startTime)} - {formatTime(request.endTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{request.expectedPassengers} passengers</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{request.destination}</span>
                        </div>
                      </div>

                      {(assignedBus || request.adminNotes) && (
                        <div className="mt-3 pt-3 border-t border-border space-y-2">
                          {assignedBus && (
                            <div className="flex items-center gap-2 text-sm">
                              <Bus className="w-4 h-4 text-primary" />
                              <span className="text-foreground">
                                Assigned: <span className="font-medium">{assignedBus.name}</span> ({assignedBus.plateNumber})
                              </span>
                            </div>
                          )}
                          {request.adminNotes && (
                            <p className="text-sm text-muted-foreground italic">
                              Admin Note: {request.adminNotes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default RequestBus;
