import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
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
import { Users, Plus, Pencil, Trash2, Search, Phone, User } from 'lucide-react';
import { drivers as initialDrivers } from '@/data/dummyData';
import { Driver } from '@/data/types';
import { useToast } from '@/hooks/use-toast';

const AdminDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const { toast } = useToast();

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.phone.includes(searchQuery)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDriver) {
      setDrivers(drivers.map(d => 
        d.id === editingDriver.id 
          ? { ...d, name: formData.name, phone: formData.phone }
          : d
      ));
      toast({ title: 'Success', description: 'Driver updated successfully.' });
    } else {
      const newDriver: Driver = {
        id: `d${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
      };
      setDrivers([...drivers, newDriver]);
      toast({ title: 'Success', description: 'New driver added successfully.' });
    }
    
    setIsDialogOpen(false);
    setEditingDriver(null);
    setFormData({ name: '', phone: '' });
  };

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (driverId: string) => {
    setDrivers(drivers.filter(d => d.id !== driverId));
    toast({ title: 'Deleted', description: 'Driver removed successfully.' });
  };

  const handleOpenDialog = () => {
    setEditingDriver(null);
    setFormData({ name: '', phone: '' });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Driver Management</h1>
            <p className="text-muted-foreground">Manage your bus drivers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
                <DialogDescription>
                  {editingDriver ? 'Update the driver details below.' : 'Enter the details for the new driver.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Driver Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Mohammad Ali"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="e.g., 01711-123456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingDriver ? 'Update' : 'Add'} Driver
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
                <Users className="w-5 h-5 text-primary" />
                All Drivers ({filteredDrivers.length})
              </CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search drivers..."
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
                    <TableHead>Driver</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.map((driver) => (
                    <TableRow key={driver.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{driver.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <a 
                          href={`tel:${driver.phone}`}
                          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {driver.phone}
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(driver)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(driver.id)}
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
    </AdminLayout>
  );
};

export default AdminDrivers;
