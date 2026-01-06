import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Bus, Plus, Pencil, Trash2, Search } from 'lucide-react';
import { buses as initialBuses } from '@/data/dummyData';
import { Bus as BusType } from '@/data/types';
import { useToast } from '@/hooks/use-toast';

const AdminBuses = () => {
  const [buses, setBuses] = useState<BusType[]>(initialBuses);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<BusType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    plateNumber: '',
  });
  const { toast } = useToast();

  const filteredBuses = buses.filter(bus =>
    bus.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBus) {
      // Update existing bus
      setBuses(buses.map(b => 
        b.id === editingBus.id 
          ? { ...b, name: formData.name, capacity: parseInt(formData.capacity), plateNumber: formData.plateNumber }
          : b
      ));
      toast({ title: 'Success', description: 'Bus updated successfully.' });
    } else {
      // Add new bus
      const newBus: BusType = {
        id: `b${Date.now()}`,
        name: formData.name,
        capacity: parseInt(formData.capacity),
        plateNumber: formData.plateNumber,
      };
      setBuses([...buses, newBus]);
      toast({ title: 'Success', description: 'New bus added successfully.' });
    }
    
    setIsDialogOpen(false);
    setEditingBus(null);
    setFormData({ name: '', capacity: '', plateNumber: '' });
  };

  const handleEdit = (bus: BusType) => {
    setEditingBus(bus);
    setFormData({
      name: bus.name,
      capacity: bus.capacity.toString(),
      plateNumber: bus.plateNumber,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (busId: string) => {
    setBuses(buses.filter(b => b.id !== busId));
    toast({ title: 'Deleted', description: 'Bus removed successfully.' });
  };

  const handleOpenDialog = () => {
    setEditingBus(null);
    setFormData({ name: '', capacity: '', plateNumber: '' });
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Bus Management</h1>
            <p className="text-muted-foreground">Manage your bus fleet</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Bus
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingBus ? 'Edit Bus' : 'Add New Bus'}</DialogTitle>
                <DialogDescription>
                  {editingBus ? 'Update the bus details below.' : 'Enter the details for the new bus.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Bus Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Padma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="e.g., 52"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plateNumber">Plate Number</Label>
                  <Input
                    id="plateNumber"
                    placeholder="e.g., চট্ট-ম-১১-১২৩৪"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingBus ? 'Update' : 'Add'} Bus
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
                <Bus className="w-5 h-5 text-primary" />
                All Buses ({filteredBuses.length})
              </CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search buses..."
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
                    <TableHead>Name</TableHead>
                    <TableHead>Plate Number</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBuses.map((bus) => (
                    <TableRow key={bus.id}>
                      <TableCell className="font-medium">{bus.name}</TableCell>
                      <TableCell>{bus.plateNumber}</TableCell>
                      <TableCell>{bus.capacity} seats</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(bus)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(bus.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>
    </DashboardLayout>
  );
};

export default AdminBuses;
