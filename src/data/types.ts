export type UserRole = 'student' | 'teacher' | 'staff' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  password: string;
}

export interface Stop {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
}

export interface Route {
  id: string;
  name: string;
  stops: Stop[];
  color: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  photo?: string;
}

export interface Bus {
  id: string;
  name: string;
  capacity: number;
  plateNumber: string;
}

export interface Schedule {
  id: string;
  busId: string;
  routeId: string;
  driverId: string;
  departureTime: string;
  direction: 'from_cuet' | 'to_cuet';
  category: UserRole[];
}

export interface ScheduleWithDetails extends Schedule {
  bus: Bus;
  route: Route;
  driver: Driver;
}

// Live Location Types
export interface LiveLocation {
  latitude: number;
  longitude: number;
  timestamp: Date;
  heading?: number;
  speed?: number;
}

// Ambulance Types
export interface Ambulance {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  status: 'available' | 'on_duty' | 'maintenance';
  currentLocation?: LiveLocation;
}

export interface AmbulanceRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  requesterRole: UserRole;
  pickupLocation: string;
  pickupCoordinates?: [number, number];
  emergencyType: 'medical' | 'accident' | 'other';
  description: string;
  status: 'pending' | 'assigned' | 'en_route' | 'arrived' | 'completed' | 'cancelled';
  ambulanceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Bus Request Types (for teachers/staff)
export interface BusRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterRole: 'teacher' | 'staff';
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  pickupLocation: string;
  destination: string;
  expectedPassengers: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  assignedBusId?: string;
  assignedDriverId?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
