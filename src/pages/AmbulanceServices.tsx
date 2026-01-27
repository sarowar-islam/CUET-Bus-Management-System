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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ambulances, ambulanceRequests as initialRequests } from '@/data/dummyData';
import { AmbulanceRequest } from '@/data/types';
import { Ambulance as AmbulanceIcon, Phone, MapPin, Clock, AlertTriangle, CheckCircle2, User, PhoneCall, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const AmbulanceServices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [requests, setRequests] = useState<AmbulanceRequest[]>(
    initialRequests.filter(r => r.requesterId === user?.id)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    emergencyType: 'medical' as 'medical' | 'accident' | 'other',
    description: '',
    phone: '',
  });

  const availableAmbulances = ambulances.filter(a => a.status === 'available');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (availableAmbulances.length === 0) {
      toast({
        title: 'No Ambulance Available',
        description: 'All ambulances are currently busy. Please try again later or call emergency services directly.',
        variant: 'destructive',
      });
      return;
    }

    const newRequest: AmbulanceRequest = {
      id: `areq${Date.now()}`,
      requesterId: user?.id || '',
      requesterName: user?.fullName || '',
      requesterPhone: formData.phone,
      requesterRole: user?.role || 'student',
      pickupLocation: formData.pickupLocation,
      emergencyType: formData.emergencyType,
      description: formData.description,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setRequests([newRequest, ...requests]);
    setIsDialogOpen(false);
    setFormData({ pickupLocation: '', emergencyType: 'medical', description: '', phone: '' });
    
    toast({
      title: 'Emergency Request Sent!',
      description: 'An ambulance has been dispatched to your location. Please stay calm.',
    });

    // Simulate ambulance assignment after 2 seconds
    setTimeout(() => {
      setRequests(prev => prev.map(r => 
        r.id === newRequest.id 
          ? { ...r, status: 'assigned', ambulanceId: availableAmbulances[0]?.id, updatedAt: new Date() }
          : r
      ));
    }, 2000);
  };

  const getStatusBadge = (status: AmbulanceRequest['status']) => {
    const styles = {
      pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      assigned: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      en_route: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      arrived: 'bg-green-500/10 text-green-600 border-green-500/20',
      completed: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
      cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
    };
    
    const labels = {
      pending: 'Pending',
      assigned: 'Assigned',
      en_route: 'On the Way',
      arrived: 'Arrived',
      completed: 'Completed',
      cancelled: 'Cancelled',
    };

    return (
      <Badge variant="outline" className={cn("capitalize", styles[status])}>
        {labels[status]}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <UserLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            asChild
            className="rounded-full"
          >
            <Link to="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <AmbulanceIcon className="w-8 h-8 text-red-500" />
              Ambulance Services
            </h1>
            <p className="text-muted-foreground mt-1">
              24/7 Emergency medical assistance
            </p>
          </div>
        </div>

        {/* Emergency Call Button - Prominent */}
        <Card className="border-red-400 dark:border-red-800 bg-gradient-to-r from-red-600 to-red-500 text-white overflow-hidden shadow-xl shadow-red-500/20">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center md:text-left">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <PhoneCall className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-red-100 text-sm font-medium">Emergency Hotline (24/7)</p>
                  <p className="text-3xl md:text-4xl font-bold">01700-CUET-99</p>
                  <p className="text-red-100 text-sm mt-1">Call for immediate assistance</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Button 
                  size="lg"
                  className="bg-white text-red-600 hover:bg-red-50 font-semibold shadow-lg flex-1 md:flex-none"
                  asChild
                >
                  <a href="tel:+8801700000099">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </a>
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg"
                      className="bg-white/20 text-white border-2 border-white/60 hover:bg-white/30 font-semibold backdrop-blur-sm flex-1 md:flex-none"
                    >
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Request Online
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Emergency Ambulance Request
                      </DialogTitle>
                      <DialogDescription>
                        Please provide details about the emergency. Help will be dispatched immediately.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Contact Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="01XXX-XXXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pickupLocation">Pickup Location *</Label>
                        <Input
                          id="pickupLocation"
                          placeholder="e.g., Shaheed Abdur Rab Hall, Room 301"
                          value={formData.pickupLocation}
                          onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyType">Emergency Type *</Label>
                        <Select
                          value={formData.emergencyType}
                          onValueChange={(value: 'medical' | 'accident' | 'other') => 
                            setFormData({ ...formData, emergencyType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select emergency type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medical">Medical Emergency</SelectItem>
                            <SelectItem value="accident">Accident</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Briefly describe the emergency..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-red-600 hover:bg-red-700">
                          Send Emergency Request
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Ambulances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AmbulanceIcon className="w-5 h-5 text-green-500" />
              Available Ambulances
            </CardTitle>
            <CardDescription>
              {availableAmbulances.length} of {ambulances.length} ambulance(s) available for dispatch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ambulances.map((ambulance) => (
                <div
                  key={ambulance.id}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all",
                    ambulance.status === 'available' 
                      ? 'border-green-300 bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/20 dark:border-green-800' 
                      : ambulance.status === 'on_duty'
                        ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-transparent dark:from-yellow-900/20 dark:border-yellow-800'
                        : 'border-border bg-muted/30'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        ambulance.status === 'available' 
                          ? 'bg-green-100 dark:bg-green-900/50' 
                          : ambulance.status === 'on_duty'
                            ? 'bg-yellow-100 dark:bg-yellow-900/50'
                            : 'bg-muted'
                      )}>
                        <AmbulanceIcon className={cn(
                          "w-5 h-5",
                          ambulance.status === 'available' 
                            ? 'text-green-600' 
                            : ambulance.status === 'on_duty'
                              ? 'text-yellow-600'
                              : 'text-muted-foreground'
                        )} />
                      </div>
                      <span className="font-semibold text-foreground">{ambulance.vehicleNumber}</span>
                    </div>
                    <Badge 
                      variant={ambulance.status === 'available' ? 'default' : 'secondary'} 
                      className={cn(
                        "text-xs",
                        ambulance.status === 'available' && 'bg-green-500 hover:bg-green-600',
                        ambulance.status === 'on_duty' && 'bg-yellow-500 text-yellow-900 hover:bg-yellow-600'
                      )}
                    >
                      {ambulance.status === 'available' ? 'Available' : ambulance.status === 'on_duty' ? 'On Duty' : 'Maintenance'}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>{ambulance.driverName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{ambulance.driverPhone}</span>
                    </div>
                  </div>
                  {ambulance.status === 'available' && (
                    <Button 
                      size="sm" 
                      className="w-full mt-3 bg-green-600 hover:bg-green-700"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Request This Ambulance
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Request History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Your Request History
            </CardTitle>
            <CardDescription>
              Track your ambulance requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No ambulance requests yet.</p>
                <p className="text-sm mt-1">We hope you stay safe and healthy!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 rounded-lg border border-border bg-card hover:shadow-sm transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {request.emergencyType}
                        </Badge>
                        {getStatusBadge(request.status)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(request.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span>{request.pickupLocation}</span>
                    </div>
                    {request.description && (
                      <p className="text-sm text-muted-foreground mt-2">{request.description}</p>
                    )}
                    {request.ambulanceId && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Assigned: {ambulances.find(a => a.id === request.ambulanceId)?.vehicleNumber}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default AmbulanceServices;
