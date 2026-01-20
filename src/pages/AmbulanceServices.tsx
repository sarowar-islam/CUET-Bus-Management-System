import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
import { AmbulanceRequest, Ambulance } from '@/data/types';
import { Ambulance as AmbulanceIcon, Phone, MapPin, Clock, AlertTriangle, CheckCircle2, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

const AmbulanceServices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapboxToken = 'pk.eyJ1Ijoic2Fyb3dhcmlzbGFtIiwiYSI6ImNtazJsMnV6bDA5cGQzZHM4c2lza3Rta3kifQ.qoRQGOz5UK3XTG2BaCXd2Q';
  
  const [requests, setRequests] = useState<AmbulanceRequest[]>(
    initialRequests.filter(r => r.requesterId === user?.id)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [formData, setFormData] = useState({
    pickupLocation: '',
    emergencyType: 'medical' as 'medical' | 'accident' | 'other',
    description: '',
    phone: '',
  });

  const availableAmbulances = ambulances.filter(a => a.status === 'available');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [91.9714, 22.4617], // CUET coordinates
        zoom: 12,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add ambulance markers
      ambulances.forEach((ambulance) => {
        if (ambulance.currentLocation) {
          const el = document.createElement('div');
          el.className = 'ambulance-marker';
          el.innerHTML = `
            <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
              ambulance.status === 'available' 
                ? 'bg-green-500' 
                : ambulance.status === 'on_duty' 
                  ? 'bg-yellow-500' 
                  : 'bg-gray-500'
            }">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 10H6"/>
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"/>
                <path d="M8 8v4"/>
                <circle cx="17" cy="18" r="2"/>
                <circle cx="7" cy="18" r="2"/>
              </svg>
            </div>
          `;

          new mapboxgl.Marker(el)
            .setLngLat([ambulance.currentLocation.longitude, ambulance.currentLocation.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-2">
                    <p class="font-bold">${ambulance.vehicleNumber}</p>
                    <p class="text-sm">Driver: ${ambulance.driverName}</p>
                    <p class="text-sm">Status: ${ambulance.status}</p>
                  </div>
                `)
            )
            .addTo(map.current!);
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, []);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <AmbulanceIcon className="w-8 h-8 text-red-500" />
              Ambulance Services
            </h1>
            <p className="text-muted-foreground mt-1">
              Request emergency medical assistance anytime
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-red-600 hover:bg-red-700">
                <AlertTriangle className="w-4 h-4" />
                Request Ambulance
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

        {/* Quick Call Section */}
        <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Emergency Hotline (24/7)</p>
                  <p className="text-xl font-bold text-red-600">01700-CUET-99</p>
                </div>
              </div>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100" asChild>
                <a href="tel:+8801700000099">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Available Ambulances */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-green-500" />
              Live Ambulance Locations
            </CardTitle>
            <CardDescription>
              {availableAmbulances.length} ambulance(s) available for dispatch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] rounded-lg overflow-hidden border border-border" ref={mapContainer} />
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ambulances.map((ambulance) => (
                <div
                  key={ambulance.id}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md",
                    ambulance.status === 'available' 
                      ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' 
                      : 'border-border bg-muted/50'
                  )}
                  onClick={() => setSelectedAmbulance(ambulance)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AmbulanceIcon className={cn(
                        "w-5 h-5",
                        ambulance.status === 'available' ? 'text-green-600' : 'text-muted-foreground'
                      )} />
                      <span className="font-medium text-sm">{ambulance.vehicleNumber}</span>
                    </div>
                    <Badge variant={ambulance.status === 'available' ? 'default' : 'secondary'} className="text-xs">
                      {ambulance.status === 'available' ? 'Available' : ambulance.status === 'on_duty' ? 'On Duty' : 'Maintenance'}
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>Driver: {ambulance.driverName}</p>
                    <p>Phone: {ambulance.driverPhone}</p>
                  </div>
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
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No ambulance requests yet.</p>
                <p className="text-sm">We hope you stay safe and healthy!</p>
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
