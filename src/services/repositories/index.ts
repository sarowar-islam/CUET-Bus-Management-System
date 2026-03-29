import api from '../api';
import { Bus, Driver, Stop, Route, Schedule, Ambulance, AmbulanceRequest, BusRequest } from '@/data/types';

// Bus Repository
export const busRepository = {
  getAll: async (): Promise<Bus[]> => {
    const response = await api.get('/buses');
    return response.data;
  },
  
  getById: async (id: string): Promise<Bus> => {
    const response = await api.get(`/buses/${id}`);
    return response.data;
  },
  
  create: async (bus: Omit<Bus, 'id'>): Promise<Bus> => {
    const response = await api.post('/buses', bus);
    return response.data;
  },
  
  update: async (id: string, bus: Partial<Bus>): Promise<Bus> => {
    const response = await api.put(`/buses/${id}`, bus);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/buses/${id}`);
  },
  
  search: async (name: string): Promise<Bus[]> => {
    const response = await api.get('/buses/search', { params: { name } });
    return response.data;
  },
};

// Driver Repository
export const driverRepository = {
  getAll: async (): Promise<Driver[]> => {
    const response = await api.get('/drivers');
    return response.data;
  },
  
  getById: async (id: string): Promise<Driver> => {
    const response = await api.get(`/drivers/${id}`);
    return response.data;
  },
  
  create: async (driver: Omit<Driver, 'id'>): Promise<Driver> => {
    const response = await api.post('/drivers', driver);
    return response.data;
  },
  
  update: async (id: string, driver: Partial<Driver>): Promise<Driver> => {
    const response = await api.put(`/drivers/${id}`, driver);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/drivers/${id}`);
  },
  
  search: async (name: string): Promise<Driver[]> => {
    const response = await api.get('/drivers/search', { params: { name } });
    return response.data;
  },
};

// Stop Repository
export const stopRepository = {
  getAll: async (): Promise<Stop[]> => {
    const response = await api.get('/stops');
    return response.data;
  },
  
  getById: async (id: string): Promise<Stop> => {
    const response = await api.get(`/stops/${id}`);
    return response.data;
  },
  
  create: async (stop: Omit<Stop, 'id'>): Promise<Stop> => {
    const response = await api.post('/stops', stop);
    return response.data;
  },
  
  update: async (id: string, stop: Partial<Stop>): Promise<Stop> => {
    const response = await api.put(`/stops/${id}`, stop);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/stops/${id}`);
  },
  
  search: async (name: string): Promise<Stop[]> => {
    const response = await api.get('/stops/search', { params: { name } });
    return response.data;
  },
};

// Route Repository
export const routeRepository = {
  getAll: async (): Promise<Route[]> => {
    const response = await api.get('/routes');
    return response.data;
  },
  
  getById: async (id: string): Promise<Route> => {
    const response = await api.get(`/routes/${id}`);
    return response.data;
  },
  
  create: async (route: Omit<Route, 'id'>): Promise<Route> => {
    const response = await api.post('/routes', route);
    return response.data;
  },
  
  update: async (id: string, route: Partial<Route>): Promise<Route> => {
    const response = await api.put(`/routes/${id}`, route);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/routes/${id}`);
  },
  
  search: async (name: string): Promise<Route[]> => {
    const response = await api.get('/routes/search', { params: { name } });
    return response.data;
  },
};

// Schedule Repository
export const scheduleRepository = {
  getAll: async (): Promise<Schedule[]> => {
    const response = await api.get('/schedules');
    return response.data;
  },
  
  getById: async (id: string): Promise<Schedule> => {
    const response = await api.get(`/schedules/${id}`);
    return response.data;
  },
  
  create: async (schedule: Omit<Schedule, 'id'>): Promise<Schedule> => {
    const response = await api.post('/schedules', schedule);
    return response.data;
  },
  
  update: async (id: string, schedule: Partial<Schedule>): Promise<Schedule> => {
    const response = await api.put(`/schedules/${id}`, schedule);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/schedules/${id}`);
  },
  
  getByBusId: async (busId: string): Promise<Schedule[]> => {
    const response = await api.get(`/schedules/by-bus/${busId}`);
    return response.data;
  },
  
  getByRouteId: async (routeId: string): Promise<Schedule[]> => {
    const response = await api.get(`/schedules/by-route/${routeId}`);
    return response.data;
  },
  
  getByDriverId: async (driverId: string): Promise<Schedule[]> => {
    const response = await api.get(`/schedules/by-driver/${driverId}`);
    return response.data;
  },
};

// Ambulance Repository
export const ambulanceRepository = {
  getAll: async (): Promise<Ambulance[]> => {
    const response = await api.get('/ambulances');
    return response.data;
  },
  
  getById: async (id: string): Promise<Ambulance> => {
    const response = await api.get(`/ambulances/${id}`);
    return response.data;
  },
  
  create: async (ambulance: Omit<Ambulance, 'id'>): Promise<Ambulance> => {
    const response = await api.post('/ambulances', ambulance);
    return response.data;
  },
  
  update: async (id: string, ambulance: Partial<Ambulance>): Promise<Ambulance> => {
    const response = await api.put(`/ambulances/${id}`, ambulance);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/ambulances/${id}`);
  },
  
  updateLocation: async (id: string, latitude: number, longitude: number): Promise<Ambulance> => {
    const response = await api.put(`/ambulances/${id}/location`, {}, {
      params: { latitude, longitude }
    });
    return response.data;
  },
};

// Ambulance Request Repository
export const ambulanceRequestRepository = {
  getAll: async (): Promise<AmbulanceRequest[]> => {
    const response = await api.get('/ambulance-requests');
    return response.data;
  },
  
  getById: async (id: string): Promise<AmbulanceRequest> => {
    const response = await api.get(`/ambulance-requests/${id}`);
    return response.data;
  },
  
  create: async (request: Omit<AmbulanceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<AmbulanceRequest> => {
    const response = await api.post('/ambulance-requests', request);
    return response.data;
  },
  
  getByRequesterId: async (requesterId: string): Promise<AmbulanceRequest[]> => {
    const response = await api.get(`/ambulance-requests/by-requester/${requesterId}`);
    return response.data;
  },
  
  getByStatus: async (status: string): Promise<AmbulanceRequest[]> => {
    const response = await api.get(`/ambulance-requests/by-status/${status}`);
    return response.data;
  },
  
  assignAmbulance: async (requestId: string, ambulanceId: string): Promise<AmbulanceRequest> => {
    const response = await api.put(`/ambulance-requests/${requestId}/assign/${ambulanceId}`);
    return response.data;
  },
  
  updateStatus: async (requestId: string, status: string): Promise<AmbulanceRequest> => {
    const response = await api.put(`/ambulance-requests/${requestId}/status/${status}`);
    return response.data;
  },
};

// Bus Request Repository
export const busRequestRepository = {
  getAll: async (): Promise<BusRequest[]> => {
    const response = await api.get('/bus-requests');
    return response.data;
  },
  
  getById: async (id: string): Promise<BusRequest> => {
    const response = await api.get(`/bus-requests/${id}`);
    return response.data;
  },
  
  create: async (request: Omit<BusRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<BusRequest> => {
    const response = await api.post('/bus-requests', request);
    return response.data;
  },
  
  getByRequesterId: async (requesterId: string): Promise<BusRequest[]> => {
    const response = await api.get(`/bus-requests/by-requester/${requesterId}`);
    return response.data;
  },
  
  getByStatus: async (status: string): Promise<BusRequest[]> => {
    const response = await api.get(`/bus-requests/by-status/${status}`);
    return response.data;
  },
  
  approve: async (requestId: string, busId: string, driverId: string): Promise<BusRequest> => {
    const response = await api.put(`/bus-requests/${requestId}/approve`, {}, {
      params: { busId, driverId }
    });
    return response.data;
  },
  
  reject: async (requestId: string, adminNotes?: string): Promise<BusRequest> => {
    const response = await api.put(`/bus-requests/${requestId}/reject`, {}, {
      params: { adminNotes }
    });
    return response.data;
  },
  
  updateStatus: async (requestId: string, status: string): Promise<BusRequest> => {
    const response = await api.put(`/bus-requests/${requestId}/status/${status}`);
    return response.data;
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
