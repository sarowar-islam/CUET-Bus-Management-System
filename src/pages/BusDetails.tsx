import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import UserLayout from '@/components/layout/UserLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bus, Clock, MapPin, Phone, User, AlertCircle } from 'lucide-react';
import { schedules, buses, routes, drivers } from '@/data/dummyData';
import { cn } from '@/lib/utils';

const BusDetails = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapboxToken = 'pk.eyJ1Ijoic2Fyb3dhcmlzbGFtIiwiYSI6ImNtazJsMnV6bDA5cGQzZHM4c2lza3Rta3kifQ.qoRQGOz5UK3XTG5BaCXd2Q';
  const [mapError, setMapError] = useState(false);

  const schedule = schedules.find(s => s.id === scheduleId);
  const bus = buses.find(b => b.id === schedule?.busId);
  const route = routes.find(r => r.id === schedule?.routeId);
  const driver = drivers.find(d => d.id === schedule?.driverId);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'student': return 'bg-student/10 text-student border-student/20';
      case 'teacher': return 'bg-teacher/10 text-teacher border-teacher/20';
      case 'staff': return 'bg-staff/10 text-staff border-staff/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !route || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: route.stops[0].coordinates,
        zoom: 11,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        if (!map.current || !route) return;

        // Add route line
        const coordinates = route.stops.map(stop => stop.coordinates);
        
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates,
            },
          },
        });

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': route.color,
            'line-width': 5,
            'line-opacity': 0.8,
          },
        });

        // Add markers for each stop
        route.stops.forEach((stop, index) => {
          const isFirst = index === 0;
          const isLast = index === route.stops.length - 1;

          const el = document.createElement('div');
          el.className = 'flex items-center justify-center';
          el.innerHTML = `
            <div class="relative">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg" 
                   style="background-color: ${isFirst || isLast ? route.color : '#64748b'}">
                ${index + 1}
              </div>
              ${isFirst || isLast ? `
                <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded shadow text-xs font-medium">
                  ${stop.name}
                </div>
              ` : ''}
            </div>
          `;

          new mapboxgl.Marker(el)
            .setLngLat(stop.coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<strong>${stop.name}</strong><br/>Stop ${index + 1}`)
            )
            .addTo(map.current!);
        });

        // Fit map to show all stops
        const bounds = new mapboxgl.LngLatBounds();
        coordinates.forEach(coord => bounds.extend(coord as [number, number]));
        map.current.fitBounds(bounds, { padding: 60 });
      });

      map.current.on('error', () => {
        setMapError(true);
      });
    } catch {
      setMapError(true);
    }

    return () => {
      map.current?.remove();
    };
  }, [route, mapboxToken]);

  if (!schedule || !bus || !route || !driver) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Schedule Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested bus schedule could not be found.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{bus.name}</h1>
            <p className="text-muted-foreground">{route.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bus Info */}
          <div className="space-y-6">
            {/* Schedule Card */}
            <Card className="border-0 shadow-soft overflow-hidden">
              <div className="h-2" style={{ backgroundColor: route.color }} />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bus className="w-5 h-5 text-primary" />
                  Bus Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Bus Name</span>
                  <span className="font-semibold">{bus.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Plate Number</span>
                  <span className="font-semibold">{bus.plateNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-semibold">{bus.capacity} seats</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Departure</span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                    <Clock className="w-4 h-4" />
                    {formatTime(schedule.departureTime)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Direction</span>
                  <Badge variant="outline">
                    {schedule.direction === 'from_cuet' ? 'From CUET' : 'To CUET'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <div className="flex gap-1.5">
                    {schedule.category.map((cat) => (
                      <Badge 
                        key={cat} 
                        variant="outline"
                        className={cn("capitalize text-xs", getCategoryColor(cat))}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Card */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Driver Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{driver.name}</p>
                    <a 
                      href={`tel:${driver.phone}`}
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      {driver.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Route Stops */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Route Stops
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {route.stops.map((stop, index) => (
                    <div key={stop.id} className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ 
                          backgroundColor: index === 0 || index === route.stops.length - 1 
                            ? route.color 
                            : '#94a3b8' 
                        }}
                      >
                        {index + 1}
                      </div>
                      <span className={cn(
                        "font-medium",
                        (index === 0 || index === route.stops.length - 1) && "text-foreground font-semibold"
                      )}>
                        {stop.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-soft h-full min-h-[500px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Route Map
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-5rem)]">
                {mapError ? (
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Map Error</h3>
                    <p className="text-sm text-muted-foreground">
                      Unable to load the map. Please try again later.
                    </p>
                  </div>
                ) : (
                  <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default BusDetails;
