import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserLayout from '@/components/layout/UserLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import StatCard from '@/components/dashboard/StatCard';
import BusList from '@/components/dashboard/BusList';
import { Bus, Route, Clock, Users, Ambulance, FileText, ArrowRight, ArrowLeft, Calendar, UserCheck } from 'lucide-react';
import { getSchedulesForRole, buses, routes, schedules, drivers, ambulances, busRequests } from '@/data/dummyData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/data/types';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'overview' | 'buses' | 'ambulance'>('overview');
  
  const isAdmin = user?.role === 'admin';
  const isTeacherOrStaff = user?.role === 'teacher' || user?.role === 'staff';
  const userRole = (user?.role === 'admin' ? 'student' : user?.role) as 'student' | 'teacher' | 'staff';
  
  const userSchedules = isAdmin 
    ? schedules.map(s => {
        const bus = buses.find(b => b.id === s.busId)!;
        const route = routes.find(r => r.id === s.routeId)!;
        const driver = { id: s.driverId, name: 'Driver', phone: '01700000000' };
        return { ...s, bus, route, driver };
      })
    : getSchedulesForRole(userRole);
  
  const fromCuetSchedules = userSchedules.filter(s => s.direction === 'from_cuet');
  const toCuetSchedules = userSchedules.filter(s => s.direction === 'to_cuet');

  // Get unique counts
  const uniqueBusCount = new Set(userSchedules.map(s => s.busId)).size;
  const uniqueRouteCount = new Set(userSchedules.map(s => s.routeId)).size;

  // Get next departure
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const nextDeparture = userSchedules
    .filter(s => s.departureTime > currentTime)
    .sort((a, b) => a.departureTime.localeCompare(b.departureTime))[0];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Choose layout based on user role
  const Layout = isAdmin ? AdminLayout : UserLayout;

  // Overview Section for Users (non-admin)
  const OverviewSection = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          What would you like to explore today?
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bus Section Card */}
        <Card 
          className="group cursor-pointer border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1"
          onClick={() => setActiveSection('buses')}
        >
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Bus className="w-8 h-8 text-white" />
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Bus Schedules</h3>
            <p className="text-muted-foreground mb-4">
              View all available bus schedules, routes, and timings for today.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                <Bus className="w-4 h-4" />
                {uniqueBusCount} Buses
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent font-medium">
                <Route className="w-4 h-4" />
                {uniqueRouteCount} Routes
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ambulance Section Card */}
        <Card 
          className="group cursor-pointer border-red-500/20 bg-gradient-to-br from-red-500/5 via-transparent to-orange-500/5 overflow-hidden hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-1"
          onClick={() => setActiveSection('ambulance')}
        >
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Ambulance className="w-8 h-8 text-white" />
              </div>
              <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Ambulance Services</h3>
            <p className="text-muted-foreground mb-4">
              24/7 emergency medical assistance. Request an ambulance and track live location.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 font-medium">
                <Clock className="w-4 h-4" />
                24/7 Available
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bus Request Card (Only for teachers and staff) */}
      {isTeacherOrStaff && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Need a Bus for an Event?</h3>
                  <p className="text-sm text-muted-foreground">
                    Submit a transport request and admin will approve it.
                  </p>
                </div>
              </div>
              <Button asChild>
                <Link to="/request-bus">
                  Submit Request
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Bus Details Section
  const BusSection = () => (
    <div className="space-y-6">
      {/* Back Button and Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setActiveSection('overview')}
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Bus Schedules
          </h1>
          <p className="text-muted-foreground">
            View all available bus schedules for today
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Buses"
          value={uniqueBusCount}
          icon={<Bus className="w-6 h-6" />}
          description="Available today"
        />
        <StatCard
          title="Active Routes"
          value={uniqueRouteCount}
          icon={<Route className="w-6 h-6" />}
          description="Different routes"
        />
        <StatCard
          title="Next Departure"
          value={nextDeparture ? formatTime(nextDeparture.departureTime) : 'N/A'}
          icon={<Clock className="w-6 h-6" />}
          description={nextDeparture ? nextDeparture.bus.name : 'No more today'}
        />
        <StatCard
          title="Total Schedules"
          value={userSchedules.length}
          icon={<Users className="w-6 h-6" />}
          description="Daily trips"
        />
      </div>

      {/* Bus Schedules */}
      <Tabs defaultValue="from_cuet" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="from_cuet" className="gap-2">
            <span className="hidden sm:inline">From</span> CUET
            <span className="text-xs opacity-70">({fromCuetSchedules.length})</span>
          </TabsTrigger>
          <TabsTrigger value="to_cuet" className="gap-2">
            <span className="hidden sm:inline">To</span> CUET
            <span className="text-xs opacity-70">({toCuetSchedules.length})</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="from_cuet" className="mt-0">
          <BusList 
            schedules={userSchedules} 
            title="Departures from CUET" 
            direction="from_cuet" 
          />
        </TabsContent>
        
        <TabsContent value="to_cuet" className="mt-0">
          <BusList 
            schedules={userSchedules} 
            title="Arrivals to CUET" 
            direction="to_cuet" 
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  // Ambulance Section - Redirect to ambulance page
  const AmbulanceSection = () => {
    // Redirect to ambulance page
    window.location.href = '/ambulance';
    return null;
  };

  // Admin Dashboard with overview cards
  const AdminDashboard = () => {
    const navigate = useNavigate();
    
    const adminSections = [
      {
        title: 'Buses',
        description: 'Manage all buses in the fleet',
        value: buses.length,
        label: 'Total Buses',
        icon: Bus,
        path: '/admin/buses',
        color: 'from-primary to-accent',
        bgColor: 'from-primary/10 to-accent/10',
      },
      {
        title: 'Bus Routes',
        description: 'Configure and manage bus routes',
        value: routes.length,
        label: 'Active Routes',
        icon: Route,
        path: '/admin/routes',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'from-green-500/10 to-emerald-500/10',
      },
      {
        title: 'Bus Schedules',
        description: 'View and edit bus schedules',
        value: schedules.length,
        label: 'Total Schedules',
        icon: Calendar,
        path: '/admin/schedules',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'from-blue-500/10 to-cyan-500/10',
      },
      {
        title: 'Bus Drivers',
        description: 'Manage driver information',
        value: drivers.length,
        label: 'Registered Drivers',
        icon: UserCheck,
        path: '/admin/drivers',
        color: 'from-orange-500 to-amber-500',
        bgColor: 'from-orange-500/10 to-amber-500/10',
      },
      {
        title: 'Ambulances',
        description: 'Monitor ambulance fleet',
        value: ambulances.length,
        label: 'Total Ambulances',
        icon: Ambulance,
        path: '/admin/ambulances',
        color: 'from-red-500 to-rose-500',
        bgColor: 'from-red-500/10 to-rose-500/10',
      },
      {
        title: 'Transport Requests',
        description: 'Review and approve requests',
        value: busRequests.filter(r => r.status === 'pending').length,
        label: 'Pending Requests',
        icon: FileText,
        path: '/admin/bus-requests',
        color: 'from-violet-500 to-purple-500',
        bgColor: 'from-violet-500/10 to-purple-500/10',
      },
    ];

    return (
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of the transport system
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Buses"
            value={buses.length}
            icon={<Bus className="w-6 h-6" />}
            description="In the fleet"
          />
          <StatCard
            title="Active Routes"
            value={routes.length}
            icon={<Route className="w-6 h-6" />}
            description="Configured routes"
          />
          <StatCard
            title="Today's Schedules"
            value={schedules.length}
            icon={<Calendar className="w-6 h-6" />}
            description="Daily trips"
          />
          <StatCard
            title="Pending Requests"
            value={busRequests.filter(r => r.status === 'pending').length}
            icon={<FileText className="w-6 h-6" />}
            description="Awaiting approval"
          />
        </div>

        {/* Section Cards */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Manage Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminSections.map((section) => (
              <Card 
                key={section.path}
                className={`group cursor-pointer border-border bg-gradient-to-br ${section.bgColor} overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                onClick={() => navigate(section.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{section.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-foreground">{section.value}</span>
                    <span className="text-sm text-muted-foreground">{section.label}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <>
            {activeSection === 'overview' && <OverviewSection />}
            {activeSection === 'buses' && <BusSection />}
            {activeSection === 'ambulance' && <AmbulanceSection />}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
