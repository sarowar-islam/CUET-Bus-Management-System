import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Ambulance, AmbulanceRequest } from '@/data/types';
import { 
  Ambulance as AmbulanceIcon, 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  Phone, 
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ambulanceRepository, ambulanceRequestRepository } from '@/services/repositories';

const AdminAmbulances = () => {
  const { toast } = useToast();
  
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [requests, setRequests] = useState<AmbulanceRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState<Ambulance | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    status: 'available' as Ambulance['status'],
  });

  const filteredAmbulances = ambulances.filter(amb =>
    amb.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    amb.driverName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = requests.filter(r => r.status === 'pending' || r.status === 'assigned' || r.status === 'en_route');
  const completedRequests = requests.filter(r => r.status === 'completed' || r.status === 'cancelled');
  const availableAmbulances = ambulances.filter(a => a.status === 'available');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allAmbulances, allRequests] = await Promise.all([
          ambulanceRepository.getAll(),
          ambulanceRequestRepository.getAll(),
        ]);
        setAmbulances(allAmbulances);
        setRequests(allRequests);
      } catch (error: any) {
        toast({
          title: 'Failed to load ambulance data',
          description: error?.response?.data?.message || 'Could not load ambulances and requests.',
          variant: 'destructive',
        });
      }
    };

    loadData();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      if (editingAmbulance) {
        const updated = await ambulanceRepository.update(editingAmbulance.id, formData);
        setAmbulances((prev) => prev.map((a) => (a.id === editingAmbulance.id ? updated : a)));
        toast({ title: 'Success', description: 'Ambulance updated successfully.' });
      } else {
        const created = await ambulanceRepository.create(formData);
        setAmbulances((prev) => [...prev, created]);
        toast({ title: 'Success', description: 'New ambulance added successfully.' });
      }
      setIsDialogOpen(false);
      setEditingAmbulance(null);
      setFormData({ vehicleNumber: '', driverName: '', driverPhone: '', status: 'available' });
    } catch (error: any) {
      toast({
        title: 'Save failed',
        description: error?.response?.data?.message || 'Could not save ambulance details.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (ambulance: Ambulance) => {
    setEditingAmbulance(ambulance);
    setFormData({
      vehicleNumber: ambulance.vehicleNumber,
      driverName: ambulance.driverName,
      driverPhone: ambulance.driverPhone,
      status: ambulance.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    try {
      await ambulanceRepository.delete(id);
      setAmbulances((prev) => prev.filter((a) => a.id !== id));
      toast({ title: 'Deleted', description: 'Ambulance removed successfully.' });
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error?.response?.data?.message || 'Could not delete ambulance.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAssignAmbulance = async (requestId: string, ambulanceId: string) => {
    setIsProcessing(true);
    try {
      const updatedRequest = await ambulanceRequestRepository.assignAmbulance(requestId, ambulanceId);
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updatedRequest : r)));
      const refreshedAmbulances = await ambulanceRepository.getAll();
      setAmbulances(refreshedAmbulances);
      toast({ title: 'Assigned', description: 'Ambulance assigned to request.' });
    } catch (error: any) {
      toast({
        title: 'Assign failed',
        description: error?.response?.data?.message || 'Could not assign ambulance.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    setIsProcessing(true);
    try {
      const updatedRequest = await ambulanceRequestRepository.updateStatus(requestId, 'completed');
      setRequests((prev) => prev.map((r) => (r.id === requestId ? updatedRequest : r)));
      const refreshedAmbulances = await ambulanceRepository.getAll();
      setAmbulances(refreshedAmbulances);
      toast({ title: 'Completed', description: 'Request marked as completed.' });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error?.response?.data?.message || 'Could not update request status.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: Ambulance['status']) => {
    const styles = {
      available: 'bg-green-500/10 text-green-600 border-green-500/20',
      on_duty: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      maintenance: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    };
    return (
      <Badge variant="outline" className={cn("capitalize", styles[status])}>
        {status.replace('_', ' ')}
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
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Ambulance Management</h1>
            <p className="text-muted-foreground">Manage ambulances and emergency requests</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingAmbulance(null);
                setFormData({ vehicleNumber: '', driverName: '', driverPhone: '', status: 'available' });
              }} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Ambulance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingAmbulance ? 'Edit Ambulance' : 'Add New Ambulance'}</DialogTitle>
                <DialogDescription>
                  {editingAmbulance ? 'Update the ambulance details below.' : 'Enter the details for the new ambulance.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input
                    id="vehicleNumber"
                    placeholder="e.g., চট্ট-এম-০১-০০০৪"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverName">Driver Name</Label>
                  <Input
                    id="driverName"
                    placeholder="e.g., Mohammad Ali"
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="driverPhone">Driver Phone</Label>
                  <Input
                    id="driverPhone"
                    placeholder="e.g., 01700-444444"
                    value={formData.driverPhone}
                    onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Ambulance['status']) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="on_duty">On Duty</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isProcessing}>{editingAmbulance ? 'Update' : 'Add'} Ambulance</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="ambulances" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="ambulances">Ambulances</TabsTrigger>
            <TabsTrigger value="active" className="relative">
              Active Requests
              {pendingRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="ambulances">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Ambulance Fleet</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search ambulances..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full sm:w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle No.</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAmbulances.map((ambulance) => (
                        <TableRow key={ambulance.id}>
                          <TableCell className="font-medium">{ambulance.vehicleNumber}</TableCell>
                          <TableCell>{ambulance.driverName}</TableCell>
                          <TableCell>{ambulance.driverPhone}</TableCell>
                          <TableCell>{getStatusBadge(ambulance.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(ambulance)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(ambulance.id)} disabled={isProcessing}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  Active Emergency Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No active emergency requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="p-4 rounded-lg border border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10 dark:border-yellow-900/50">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">{request.emergencyType}</Badge>
                            <Badge variant="outline" className="capitalize">{request.status}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Requester:</span> {request.requesterName} ({request.requesterRole})</p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4" /> {request.requesterPhone}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> {request.pickupLocation}
                          </p>
                          {request.description && <p className="text-muted-foreground">{request.description}</p>}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {request.status === 'pending' && (
                            <Select onValueChange={(value) => handleAssignAmbulance(request.id, value)}>
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Assign ambulance" />
                              </SelectTrigger>
                              <SelectContent>
                                {ambulances.filter(a => a.status === 'available').map((amb) => (
                                  <SelectItem key={amb.id} value={amb.id}>
                                    {amb.vehicleNumber}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {(request.status === 'assigned' || request.status === 'en_route') && (
                            <Button size="sm" onClick={() => handleCompleteRequest(request.id)} disabled={isProcessing}>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Request History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="text-sm">{formatDate(request.createdAt)}</TableCell>
                          <TableCell>{request.requesterName}</TableCell>
                          <TableCell className="capitalize">{request.emergencyType}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{request.pickupLocation}</TableCell>
                          <TableCell>
                            <Badge variant={request.status === 'completed' ? 'default' : 'destructive'}>
                              {request.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAmbulances;
