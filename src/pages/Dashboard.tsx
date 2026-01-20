import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserLayout from '@/components/layout/UserLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import StatCard from '@/components/dashboard/StatCard';
import BusList from '@/components/dashboard/BusList';
import { Bus, Route, Clock, Users, Ambulance, FileText, ArrowRight } from 'lucide-react';
import { getSchedulesForRole, buses, routes, schedules } from '@/data/dummyData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/data/types';

const Dashboard = () => {
  const { user } = useAuth();
  
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

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? 'Manage your bus fleet and schedules'
              : `Here's your bus schedule for today`
            }
          </p>
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

        {/* Quick Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ambulance Service - Not shown for admins */}
          {!isAdmin && (
            <Card className="border-red-200 dark:border-red-900/50 bg-gradient-to-br from-red-50 to-transparent dark:from-red-900/10 overflow-hidden group hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <Ambulance className="w-5 h-5 text-red-600" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">Ambulance Services</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      24/7 emergency medical assistance. Request an ambulance and track live location.
                    </p>
                    <Button asChild className="bg-red-600 hover:bg-red-700">
                      <Link to="/ambulance">
                        Request Ambulance
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bus Request (Only for teachers and staff) */}
          {isTeacherOrStaff && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden group hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">Request a Bus</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Need a bus for an event or tour? Submit a request and admin will approve it.
                    </p>
                    <Button asChild>
                      <Link to="/request-bus">
                        Submit Request
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* For students, show a simple ambulance info card */}
          {!isTeacherOrStaff && !isAdmin && (
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bus className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Your Bus Schedules</h3>
                    <p className="text-sm text-muted-foreground">
                      {userSchedules.length} schedules available today
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
    </Layout>
  );
};

export default Dashboard;
