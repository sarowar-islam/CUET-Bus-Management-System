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
