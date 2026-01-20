import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
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
import { busRequests as initialRequests, buses, drivers } from '@/data/dummyData';
import { BusRequest } from '@/data/types';
import { 
  Bus, 
  Search, 
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminBusRequests = () => {
  const { toast } = useToast();
  
  const [requests, setRequests] = useState<BusRequest[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<BusRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [assignData, setAssignData] = useState({
    busId: '',
    driverId: '',
    adminNotes: '',
  });

  const filteredRequests = requests.filter(req =>
    req.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter(r => r.status === 'pending');
  const approvedRequests = filteredRequests.filter(r => r.status === 'approved');
  const completedRequests = filteredRequests.filter(r => r.status === 'completed' || r.status === 'rejected');

  const handleApprove = () => {
    if (!selectedRequest || !assignData.busId || !assignData.driverId) {
      toast({ title: 'Error', description: 'Please assign a bus and driver.', variant: 'destructive' });
      return;
    }

    setRequests(requests.map(r => 
      r.id === selectedRequest.id 
        ? { 
            ...r, 
            status: 'approved', 
            assignedBusId: assignData.busId,
            assignedDriverId: assignData.driverId,
            adminNotes: assignData.adminNotes,
            updatedAt: new Date(),
          }
        : r
    ));
    
    setIsDetailOpen(false);
    setSelectedRequest(null);
    setAssignData({ busId: '', driverId: '', adminNotes: '' });
    toast({ title: 'Approved', description: 'Bus request has been approved.' });
  };

  const handleReject = (requestId: string, notes: string) => {
    setRequests(requests.map(r => 
      r.id === requestId 
        ? { ...r, status: 'rejected', adminNotes: notes || 'Request rejected by admin', updatedAt: new Date() }
        : r
    ));
    setIsDetailOpen(false);
    setSelectedRequest(null);
    toast({ title: 'Rejected', description: 'Bus request has been rejected.' });
  };

  const handleComplete = (requestId: string) => {
    setRequests(requests.map(r => 
      r.id === requestId 
        ? { ...r, status: 'completed', updatedAt: new Date() }
        : r
    ));
    toast({ title: 'Completed', description: 'Trip marked as completed.' });
  };

  const openDetail = (request: BusRequest) => {
    setSelectedRequest(request);
    setAssignData({
      busId: request.assignedBusId || '',
      driverId: request.assignedDriverId || '',
      adminNotes: request.adminNotes || '',
    });
    setIsDetailOpen(true);
  };

  const getStatusBadge = (status: BusRequest['status']) => {
    const config = {
      pending: { 
        icon: AlertCircle, 
        className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        label: 'Pending'
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
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Bus Requests</h1>
            <p className="text-muted-foreground">Manage bus reservation requests from teachers and staff</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedRequests.length}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{requests.length}</p>
                  <p className="text-xs text-muted-foreground">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900/30 flex items-center justify-center">
                  <Bus className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{buses.length}</p>
                  <p className="text-xs text-muted-foreground">Available Buses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingRequests.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  Pending Requests
                </CardTitle>
                <CardDescription>Review and approve bus reservation requests</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No pending requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="p-4 rounded-lg border border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10 dark:border-yellow-900/50">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{request.purpose}</h3>
                            <p className="text-sm text-muted-foreground">
                              By {request.requesterName} ({request.requesterRole})
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(request.status)}
                            <Button size="sm" onClick={() => openDetail(request)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Review
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
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
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Approved Requests
                </CardTitle>
                <CardDescription>Upcoming approved bus reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Assigned Bus</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedRequests.map((request) => {
                        const bus = buses.find(b => b.id === request.assignedBusId);
                        return (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.purpose}</TableCell>
                            <TableCell>{formatDate(request.date)}</TableCell>
                            <TableCell>{request.destination}</TableCell>
                            <TableCell>{bus?.name || '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => openDetail(request)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleComplete(request.id)}>
                                  Mark Complete
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
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Request History</CardTitle>
                <CardDescription>Past completed and rejected requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.purpose}</TableCell>
                          <TableCell>{request.requesterName}</TableCell>
                          <TableCell>{formatDate(request.date)}</TableCell>
                          <TableCell>{request.destination}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Details</DialogTitle>
              <DialogDescription>
                Review and manage this bus reservation request
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{selectedRequest.purpose}</h3>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><span className="text-muted-foreground">Requester:</span> {selectedRequest.requesterName}</p>
                    <p><span className="text-muted-foreground">Role:</span> {selectedRequest.requesterRole}</p>
                    <p><span className="text-muted-foreground">Date:</span> {formatDate(selectedRequest.date)}</p>
                    <p><span className="text-muted-foreground">Time:</span> {formatTime(selectedRequest.startTime)} - {formatTime(selectedRequest.endTime)}</p>
                    <p><span className="text-muted-foreground">Passengers:</span> {selectedRequest.expectedPassengers}</p>
                    <p><span className="text-muted-foreground">From:</span> {selectedRequest.pickupLocation}</p>
                    <p className="col-span-2"><span className="text-muted-foreground">To:</span> {selectedRequest.destination}</p>
                  </div>
                </div>

                {selectedRequest.status === 'pending' && (
                  <>
                    <div className="space-y-2">
                      <Label>Assign Bus *</Label>
                      <Select value={assignData.busId} onValueChange={(v) => setAssignData({ ...assignData, busId: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a bus" />
                        </SelectTrigger>
                        <SelectContent>
                          {buses.filter(b => b.capacity >= selectedRequest.expectedPassengers).map((bus) => (
                            <SelectItem key={bus.id} value={bus.id}>
                              {bus.name} - {bus.plateNumber} (Capacity: {bus.capacity})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Assign Driver *</Label>
                      <Select value={assignData.driverId} onValueChange={(v) => setAssignData({ ...assignData, driverId: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a driver" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.name} - {driver.phone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Admin Notes (Optional)</Label>
                      <Textarea
                        placeholder="Add any notes for the requester..."
                        value={assignData.adminNotes}
                        onChange={(e) => setAssignData({ ...assignData, adminNotes: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <Button variant="destructive" onClick={() => handleReject(selectedRequest.id, assignData.adminNotes)}>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button onClick={handleApprove}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </>
                )}

                {selectedRequest.status === 'approved' && (
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 space-y-2">
                    <p className="font-medium text-green-700 dark:text-green-400">Approved</p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Assigned Bus:</span>{' '}
                      {buses.find(b => b.id === selectedRequest.assignedBusId)?.name}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Assigned Driver:</span>{' '}
                      {drivers.find(d => d.id === selectedRequest.assignedDriverId)?.name}
                    </p>
                    {selectedRequest.adminNotes && (
                      <p className="text-sm italic text-muted-foreground">{selectedRequest.adminNotes}</p>
                    )}
                  </div>
                )}

                {selectedRequest.status === 'rejected' && (
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <p className="font-medium text-red-700 dark:text-red-400">Rejected</p>
                    {selectedRequest.adminNotes && (
                      <p className="text-sm mt-1 text-muted-foreground">{selectedRequest.adminNotes}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBusRequests;
