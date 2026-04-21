import api from '../api';
import { Ambulance, AmbulanceRequest, Bus, BusRequest, Driver, Route, Schedule, Stop, UserRole } from '@/data/types';

const asStringId = (value: unknown): string => String(value ?? '');

const toBus = (raw: any): Bus => ({
  id: asStringId(raw.id),
  name: raw.name,
  capacity: Number(raw.capacity),
  plateNumber: raw.plateNumber,
});

const toDriver = (raw: any): Driver => ({
  id: asStringId(raw.id),
  name: raw.name,
  phone: raw.phone,
  photo: raw.photo,
});

const toStop = (raw: any): Stop => ({
  id: asStringId(raw.id),
  name: raw.name,
  coordinates: [Number(raw.longitude), Number(raw.latitude)],
});

const toRoute = (raw: any): Route => ({
  id: asStringId(raw.id),
  name: raw.name,
  color: raw.color,
  stops: Array.isArray(raw.stops) ? raw.stops.map(toStop) : [],
});

const toSchedule = (raw: any): Schedule => ({
  id: asStringId(raw.id),
  busId: asStringId(raw.busId),
  routeId: asStringId(raw.routeId),
  driverId: asStringId(raw.driverId),
  departureTime: raw.departureTime,
  direction: raw.direction,
  category: (raw.category || []) as UserRole[],
});

const toAmbulance = (raw: any): Ambulance => ({
  id: asStringId(raw.id),
  vehicleNumber: raw.vehicleNumber,
  driverName: raw.driverName,
  driverPhone: raw.driverPhone,
  status: raw.status,
  currentLocation: raw.currentLocation
    ? {
        latitude: Number(raw.currentLocation.latitude),
        longitude: Number(raw.currentLocation.longitude),
        timestamp: new Date(raw.currentLocation.timestamp),
        heading: raw.currentLocation.heading == null ? undefined : Number(raw.currentLocation.heading),
        speed: raw.currentLocation.speed == null ? undefined : Number(raw.currentLocation.speed),
      }
    : undefined,
});

const toAmbulanceRequest = (raw: any): AmbulanceRequest => ({
  id: asStringId(raw.id),
  requesterId: asStringId(raw.requesterId),
  requesterName: raw.requesterName,
  requesterPhone: raw.requesterPhone,
  requesterRole: raw.requesterRole,
  pickupLocation: raw.pickupLocation,
  pickupCoordinates:
    raw.pickupLongitude != null && raw.pickupLatitude != null
      ? [Number(raw.pickupLongitude), Number(raw.pickupLatitude)]
      : undefined,
  emergencyType: raw.emergencyType,
  description: raw.description || '',
  status: raw.status,
  ambulanceId: raw.ambulanceId != null ? asStringId(raw.ambulanceId) : undefined,
  createdAt: new Date(raw.createdAt),
  updatedAt: new Date(raw.updatedAt),
});

const toBusRequest = (raw: any): BusRequest => ({
  id: asStringId(raw.id),
  requesterId: asStringId(raw.requesterId),
  requesterName: raw.requesterName,
  requesterRole: raw.requesterRole,
  requesterPhone: raw.requesterPhone || undefined,
  requesterPosition: raw.requesterPosition || undefined,
  requesterDepartment: raw.requesterDepartment || undefined,
  purpose: raw.purpose,
  reason: raw.reason || undefined,
  transportType: raw.transportType || undefined,
  duration: raw.duration || undefined,
  date: raw.date,
  startTime: raw.startTime,
  endTime: raw.endTime,
  pickupLocation: raw.pickupLocation,
  destination: raw.destination,
  expectedPassengers: Number(raw.expectedPassengers),
  status: raw.status,
  assignedBusId: raw.assignedBusId != null ? asStringId(raw.assignedBusId) : undefined,
  assignedDriverId: raw.assignedDriverId != null ? asStringId(raw.assignedDriverId) : undefined,
  adminNotes: raw.adminNotes || undefined,
  createdAt: new Date(raw.createdAt),
  updatedAt: new Date(raw.updatedAt),
});

// Bus Repository
export const busRepository = {
  getAll: async (): Promise<Bus[]> => {
    const response = await api.get('/buses');
    return response.data.map(toBus);
  },

  getById: async (id: string): Promise<Bus> => {
    const response = await api.get(`/buses/${id}`);
    return toBus(response.data);
  },

  create: async (bus: Omit<Bus, 'id'>): Promise<Bus> => {
    const response = await api.post('/buses', bus);
    return toBus(response.data);
  },

  update: async (id: string, bus: Partial<Bus>): Promise<Bus> => {
    const response = await api.put(`/buses/${id}`, bus);
    return toBus(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/buses/${id}`);
  },

  search: async (name: string): Promise<Bus[]> => {
    const response = await api.get('/buses/search', { params: { name } });
    return response.data.map(toBus);
  },
};

// Driver Repository
export const driverRepository = {
  getAll: async (): Promise<Driver[]> => {
    const response = await api.get('/drivers');
    return response.data.map(toDriver);
  },

  getById: async (id: string): Promise<Driver> => {
    const response = await api.get(`/drivers/${id}`);
    return toDriver(response.data);
  },

  create: async (driver: Omit<Driver, 'id'>): Promise<Driver> => {
    const response = await api.post('/drivers', driver);
    return toDriver(response.data);
  },

  update: async (id: string, driver: Partial<Driver>): Promise<Driver> => {
    const response = await api.put(`/drivers/${id}`, driver);
    return toDriver(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/drivers/${id}`);
  },

  search: async (name: string): Promise<Driver[]> => {
    const response = await api.get('/drivers/search', { params: { name } });
    return response.data.map(toDriver);
  },
};

// Stop Repository
export const stopRepository = {
  getAll: async (): Promise<Stop[]> => {
    const response = await api.get('/stops');
    return response.data.map(toStop);
  },

  getById: async (id: string): Promise<Stop> => {
    const response = await api.get(`/stops/${id}`);
    return toStop(response.data);
  },

  create: async (stop: Omit<Stop, 'id'>): Promise<Stop> => {
    const response = await api.post('/stops', {
      name: stop.name,
      latitude: stop.coordinates[1],
      longitude: stop.coordinates[0],
    });
    return toStop(response.data);
  },

  update: async (id: string, stop: Partial<Stop>): Promise<Stop> => {
    const response = await api.put(`/stops/${id}`, {
      name: stop.name,
      latitude: stop.coordinates ? stop.coordinates[1] : undefined,
      longitude: stop.coordinates ? stop.coordinates[0] : undefined,
    });
    return toStop(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/stops/${id}`);
  },

  search: async (name: string): Promise<Stop[]> => {
    const response = await api.get('/stops/search', { params: { name } });
    return response.data.map(toStop);
  },
};

// Route Repository
export const routeRepository = {
  getAll: async (): Promise<Route[]> => {
    const response = await api.get('/routes');
    return response.data.map(toRoute);
  },

  getById: async (id: string): Promise<Route> => {
    const response = await api.get(`/routes/${id}`);
    return toRoute(response.data);
  },

  create: async (route: Omit<Route, 'id'>): Promise<Route> => {
    const response = await api.post('/routes', {
      name: route.name,
      color: route.color,
      stopIds: route.stops.map((stop) => Number(stop.id)),
    });
    return toRoute(response.data);
  },

  update: async (id: string, route: Partial<Route>): Promise<Route> => {
    const response = await api.put(`/routes/${id}`, {
      name: route.name,
      color: route.color,
      stopIds: (route.stops || []).map((stop) => Number(stop.id)),
    });
    return toRoute(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/routes/${id}`);
  },

  search: async (name: string): Promise<Route[]> => {
    const response = await api.get('/routes/search', { params: { name } });
    return response.data.map(toRoute);
  },
};

// Schedule Repository
export const scheduleRepository = {
  getAll: async (): Promise<Schedule[]> => {
    const response = await api.get('/schedules');
    return response.data.map(toSchedule);
  },

  getById: async (id: string): Promise<Schedule> => {
    const response = await api.get(`/schedules/${id}`);
    return toSchedule(response.data);
  },

  create: async (schedule: Omit<Schedule, 'id'>): Promise<Schedule> => {
    const response = await api.post('/schedules', {
      busId: Number(schedule.busId),
      routeId: Number(schedule.routeId),
      driverId: Number(schedule.driverId),
      departureTime: schedule.departureTime,
      direction: schedule.direction,
      category: schedule.category,
    });
    return toSchedule(response.data);
  },

  update: async (id: string, schedule: Partial<Schedule>): Promise<Schedule> => {
    const response = await api.put(`/schedules/${id}`, {
      busId: Number(schedule.busId),
      routeId: Number(schedule.routeId),
      driverId: Number(schedule.driverId),
      departureTime: schedule.departureTime,
      direction: schedule.direction,
      category: schedule.category,
    });
    return toSchedule(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/schedules/${id}`);
  },

  getByBusId: async (busId: string): Promise<Schedule[]> => {
    const response = await api.get(`/schedules/by-bus/${busId}`);
    return response.data.map(toSchedule);
  },

  getByRouteId: async (routeId: string): Promise<Schedule[]> => {
    const response = await api.get(`/schedules/by-route/${routeId}`);
    return response.data.map(toSchedule);
  },

  getByDriverId: async (driverId: string): Promise<Schedule[]> => {
    const response = await api.get(`/schedules/by-driver/${driverId}`);
    return response.data.map(toSchedule);
  },
};

// Ambulance Repository
export const ambulanceRepository = {
  getAll: async (): Promise<Ambulance[]> => {
    const response = await api.get('/ambulances');
    return response.data.map(toAmbulance);
  },

  getById: async (id: string): Promise<Ambulance> => {
    const response = await api.get(`/ambulances/${id}`);
    return toAmbulance(response.data);
  },

  create: async (ambulance: Omit<Ambulance, 'id'>): Promise<Ambulance> => {
    const response = await api.post('/ambulances', {
      vehicleNumber: ambulance.vehicleNumber,
      driverName: ambulance.driverName,
      driverPhone: ambulance.driverPhone,
      status: ambulance.status,
    });
    return toAmbulance(response.data);
  },

  update: async (id: string, ambulance: Partial<Ambulance>): Promise<Ambulance> => {
    const response = await api.put(`/ambulances/${id}`, {
      vehicleNumber: ambulance.vehicleNumber,
      driverName: ambulance.driverName,
      driverPhone: ambulance.driverPhone,
      status: ambulance.status,
    });
    return toAmbulance(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/ambulances/${id}`);
  },

  updateLocation: async (id: string, latitude: number, longitude: number): Promise<Ambulance> => {
    const response = await api.put(`/ambulances/${id}/location`, {}, {
      params: { latitude, longitude },
    });
    return toAmbulance(response.data);
  },
};

// Ambulance Request Repository
export const ambulanceRequestRepository = {
  getAll: async (): Promise<AmbulanceRequest[]> => {
    const response = await api.get('/ambulance-requests');
    return response.data.map(toAmbulanceRequest);
  },

  getById: async (id: string): Promise<AmbulanceRequest> => {
    const response = await api.get(`/ambulance-requests/${id}`);
    return toAmbulanceRequest(response.data);
  },

  create: async (request: Omit<AmbulanceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<AmbulanceRequest> => {
    const response = await api.post('/ambulance-requests', {
      requesterId: Number(request.requesterId),
      requesterName: request.requesterName,
      requesterPhone: request.requesterPhone,
      requesterRole: request.requesterRole,
      pickupLocation: request.pickupLocation,
      pickupLatitude: request.pickupCoordinates ? request.pickupCoordinates[1] : undefined,
      pickupLongitude: request.pickupCoordinates ? request.pickupCoordinates[0] : undefined,
      emergencyType: request.emergencyType,
      description: request.description,
      status: request.status,
      ambulanceId: request.ambulanceId ? Number(request.ambulanceId) : undefined,
    });
    return toAmbulanceRequest(response.data);
  },

  getByRequesterId: async (requesterId: string): Promise<AmbulanceRequest[]> => {
    const response = await api.get(`/ambulance-requests/by-requester/${requesterId}`);
    return response.data.map(toAmbulanceRequest);
  },

  getByStatus: async (status: string): Promise<AmbulanceRequest[]> => {
    const response = await api.get(`/ambulance-requests/by-status/${status}`);
    return response.data.map(toAmbulanceRequest);
  },

  assignAmbulance: async (requestId: string, ambulanceId: string): Promise<AmbulanceRequest> => {
    const response = await api.put(`/ambulance-requests/${requestId}/assign/${ambulanceId}`);
    return toAmbulanceRequest(response.data);
  },

  updateStatus: async (requestId: string, status: string): Promise<AmbulanceRequest> => {
    const response = await api.put(`/ambulance-requests/${requestId}/status/${status}`);
    return toAmbulanceRequest(response.data);
  },
};

// Bus Request Repository
export const busRequestRepository = {
  getAll: async (): Promise<BusRequest[]> => {
    const response = await api.get('/bus-requests');
    return response.data.map(toBusRequest);
  },

  getById: async (id: string): Promise<BusRequest> => {
    const response = await api.get(`/bus-requests/${id}`);
    return toBusRequest(response.data);
  },

  create: async (request: Omit<BusRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusRequest> => {
    const response = await api.post('/bus-requests', {
      requesterId: Number(request.requesterId),
      requesterName: request.requesterName,
      requesterRole: request.requesterRole,
      requesterPhone: request.requesterPhone,
      requesterPosition: request.requesterPosition,
      requesterDepartment: request.requesterDepartment,
      purpose: request.purpose,
      reason: request.reason,
      transportType: request.transportType,
      duration: request.duration,
      date: request.date,
      startTime: request.startTime,
      endTime: request.endTime,
      pickupLocation: request.pickupLocation,
      destination: request.destination,
      expectedPassengers: request.expectedPassengers,
      status: request.status,
      assignedBusId: request.assignedBusId ? Number(request.assignedBusId) : undefined,
      assignedDriverId: request.assignedDriverId ? Number(request.assignedDriverId) : undefined,
      adminNotes: request.adminNotes,
    });
    return toBusRequest(response.data);
  },

  getByRequesterId: async (requesterId: string): Promise<BusRequest[]> => {
    const response = await api.get(`/bus-requests/by-requester/${requesterId}`);
    return response.data.map(toBusRequest);
  },

  getByStatus: async (status: string): Promise<BusRequest[]> => {
    const response = await api.get(`/bus-requests/by-status/${status}`);
    return response.data.map(toBusRequest);
  },

  approve: async (requestId: string, busId: string, driverId: string): Promise<BusRequest> => {
    const response = await api.put(`/bus-requests/${requestId}/approve`, {}, {
      params: { busId, driverId },
    });
    return toBusRequest(response.data);
  },

  reject: async (requestId: string, adminNotes?: string): Promise<BusRequest> => {
    const response = await api.put(`/bus-requests/${requestId}/reject`, {}, {
      params: { adminNotes },
    });
    return toBusRequest(response.data);
  },

  updateStatus: async (requestId: string, status: string): Promise<BusRequest> => {
    const response = await api.put(`/bus-requests/${requestId}/status/${status}`);
    return toBusRequest(response.data);
  },
};

// User Repository
export const userRepository = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getByUsername: async (username: string) => {
    const response = await api.get(`/users/by-username/${username}`);
    return response.data;
  },

  update: async (id: string, user: any) => {
    const response = await api.put(`/users/${id}`, user);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/users/${id}`);
  },
};
