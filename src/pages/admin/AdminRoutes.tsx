import React, { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Route, Plus, Pencil, Trash2, Search, MapPin } from 'lucide-react';
import { routes as initialRoutes, stops } from '@/data/dummyData';
import { Route as RouteType } from '@/data/types';
import { useToast } from '@/hooks/use-toast';

const AdminRoutes = () => {
  const [routes, setRoutes] = useState<RouteType[]>(initialRoutes);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<RouteType | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    selectedStops: [] as string[],
  });
  const { toast } = useToast();

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedStopObjects = formData.selectedStops.map(
      stopId => stops.find(s => s.id === stopId)!
    );
    
    if (editingRoute) {
      setRoutes(routes.map(r => 
        r.id === editingRoute.id 
          ? { ...r, name: formData.name, color: formData.color, stops: selectedStopObjects }
          : r
      ));
      toast({ title: 'Success', description: 'Route updated successfully.' });
    } else {
      const newRoute: RouteType = {
        id: `r${Date.now()}`,
        name: formData.name,
        color: formData.color,
        stops: selectedStopObjects,
      };
      setRoutes([...routes, newRoute]);
      toast({ title: 'Success', description: 'New route added successfully.' });
    }
    
    setIsDialogOpen(false);
    setEditingRoute(null);
    setFormData({ name: '', color: '#3B82F6', selectedStops: [] });
  };

  const handleEdit = (route: RouteType) => {
    setEditingRoute(route);
    setFormData({
      name: route.name,
      color: route.color,
      selectedStops: route.stops.map(s => s.id),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (routeId: string) => {
    setRoutes(routes.filter(r => r.id !== routeId));
    toast({ title: 'Deleted', description: 'Route removed successfully.' });
  };

  const handleOpenDialog = () => {
    setEditingRoute(null);
    setFormData({ name: '', color: '#3B82F6', selectedStops: [] });
    setIsDialogOpen(true);
  };

  const toggleStop = (stopId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedStops: prev.selectedStops.includes(stopId)
        ? prev.selectedStops.filter(id => id !== stopId)
        : [...prev.selectedStops, stopId]
    }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Route Management</h1>
            <p className="text-muted-foreground">Manage bus routes and stops</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Route
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingRoute ? 'Edit Route' : 'Add New Route'}</DialogTitle>
                <DialogDescription>
                  {editingRoute ? 'Update the route details below.' : 'Enter the details for the new route.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Route Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Main Route"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Route Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Select Stops (in order)</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                    {stops.map((stop) => (
                      <button
                        key={stop.id}
                        type="button"
                        onClick={() => toggleStop(stop.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors ${
                          formData.selectedStops.includes(stop.id)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{stop.name}</span>
                        {formData.selectedStops.includes(stop.id) && (
                          <span className="ml-auto text-xs">
                            {formData.selectedStops.indexOf(stop.id) + 1}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={formData.selectedStops.length < 2}>
                    {editingRoute ? 'Update' : 'Add'} Route
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
                <Route className="w-5 h-5 text-primary" />
                All Routes ({filteredRoutes.length})
              </CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search routes..."
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
                    <TableHead>Route</TableHead>
                    <TableHead>Stops</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: route.color }}
                          />
                          <span className="font-medium">{route.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{route.stops.length} stops</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm text-muted-foreground truncate">
                          {route.stops.map(s => s.name).join(' → ')}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(route)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete(route.id)}
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

export default AdminRoutes;
