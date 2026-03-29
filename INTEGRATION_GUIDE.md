# Frontend Integration Guide

## Overview
The frontend uses a repository pattern for API interactions, providing a clean abstraction layer between components and the backend API.

## Environment Setup

### 1. Environment Variables
Create a `.env.local` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:8080/api
```

For production:
```env
VITE_API_URL=https://api.your-domain.com/api
```

### 2. API Configuration
The API client is configured in `src/services/api.ts` and automatically:
- Adds JWT token to all requests
- Handles token refresh on 401 responses
- Manages CORS headers
- Implements proper error handling

## Repository Usage

### Import Repositories
```typescript
import {
  busRepository,
  driverRepository,
  routeRepository,
  scheduleRepository,
  ambulanceRepository,
  ambulanceRequestRepository,
  busRequestRepository,
  userRepository
} from '@/services/repositories';
```

## Bus Repository Examples

### Get All Buses
```typescript
const buses = await busRepository.getAll();
```

### Create a Bus
```typescript
const newBus = await busRepository.create({
  name: 'Bus #1',
  capacity: 50,
  plateNumber: 'ABC-123'
});
```

### Update a Bus
```typescript
const updated = await busRepository.update(busId, {
  capacity: 60
});
```

### Search Buses
```typescript
const results = await busRepository.search('Bus #1');
```

### Delete a Bus
```typescript
await busRepository.delete(busId);
```

## Driver Repository Examples

### Get All Drivers
```typescript
const drivers = await driverRepository.getAll();
```

### Create a Driver
```typescript
const newDriver = await driverRepository.create({
  name: 'John Doe',
  phone: '+1234567890',
  photo: 'https://example.com/photo.jpg'
});
```

### Update a Driver
```typescript
const updated = await driverRepository.update(driverId, {
  phone: '+9876543210'
});
```

## Route Repository Examples

### Get All Routes
```typescript
const routes = await routeRepository.getAll();
```

### Create a Route with Stops
```typescript
const newRoute = await routeRepository.create({
  name: 'Route Down Town',
  color: '#FF0000',
  stops: [
    { id: 'stop1', name: 'Stop 1', coordinates: [0, 0] },
    { id: 'stop2', name: 'Stop 2', coordinates: [1, 1] }
  ]
});
```

## Schedule Repository Examples

### Get All Schedules
```typescript
const schedules = await scheduleRepository.getAll();
```

### Create a Schedule
```typescript
const newSchedule = await scheduleRepository.create({
  busId: 'bus123',
  routeId: 'route123',
  driverId: 'driver123',
  departureTime: '08:00:00',
  direction: 'FROM_CUET',
  category: ['STUDENT', 'STAFF']
});
```

### Get Schedules by Bus
```typescript
const busSchedules = await scheduleRepository.getByBusId(busId);
```

### Get Schedules by Route
```typescript
const routeSchedules = await scheduleRepository.getByRouteId(routeId);
```

### Get Schedules by Driver
```typescript
const driverSchedules = await scheduleRepository.getByDriverId(driverId);
```

## Ambulance Service Examples

### Get All Ambulances
```typescript
const ambulances = await ambulanceRepository.getAll();
```

### Create an Ambulance
```typescript
const newAmbulance = await ambulanceRepository.create({
  vehicleNumber: 'AMB-001',
  driverName: 'Driver Name',
  driverPhone: '+1234567890',
  status: 'AVAILABLE'
});
```

### Update Ambulance Location (GPS Tracking)
```typescript
const updated = await ambulanceRepository.updateLocation(
  ambulanceId,
  40.7128,  // latitude
  -74.0060  // longitude
);
```

## Ambulance Request Examples

### Create an Ambulance Request
```typescript
const request = await ambulanceRequestRepository.create({
  pickupLocation: 'Hospital',
  pickupLatitude: 40.7128,
  pickupLongitude: -74.0060,
  emergencyType: 'MEDICAL',
  description: 'Patient needs emergency transport'
});
```

### Assign Ambulance to Request
```typescript
const updated = await ambulanceRequestRepository.assignAmbulance(
  requestId,
  ambulanceId
);
```

### Update Request Status
```typescript
const updated = await ambulanceRequestRepository.updateStatus(
  requestId,
  'EN_ROUTE'
);
```

### Get My Requests (Current User)
```typescript
const myRequests = await ambulanceRequestRepository.getByRequesterId(currentUserId);
```

### Get Pending Requests (Admin)
```typescript
const pendingRequests = await ambulanceRequestRepository.getByStatus('PENDING');
```

## Bus Request Examples

### Create a Bus Request
```typescript
const request = await busRequestRepository.create({
  purpose: 'Faculty Outing',
  reason: 'Department team building',
  transportType: 'bus',
  duration: '1 day',
  date: new Date('2024-04-15'),
  startTime: '09:00:00',
  endTime: '17:00:00',
  pickupLocation: 'Main Campus',
  destination: 'Beach Resort',
  expectedPassengers: 30
});
```

### Approve Bus Request (Admin)
```typescript
const approved = await busRequestRepository.approve(
  requestId,
  busId,
  driverId
);
```

### Reject Bus Request (Admin)
```typescript
const rejected = await busRequestRepository.reject(
  requestId,
  'Not enough capacity available'
);
```

### Get My Requests (Current User)
```typescript
const myRequests = await busRequestRepository.getByRequesterId(currentUserId);
```

### Get Pending Requests (Admin)
```typescript
const pendingRequests = await busRequestRepository.getByStatus('PENDING');
```

## User Repository Examples

### Get Current User
```typescript
const user = await userRepository.getById(currentUserId);
```

### Get User by Username
```typescript
const user = await userRepository.getByUsername('john_doe');
```

### Update User Profile
```typescript
const updated = await userRepository.update(userId, {
  fullName: 'Updated Name',
  email: 'newemail@example.com'
});
```

## Using Repositories in Components

### Example: Bus Management Component
```typescript
import { busRepository } from '@/services/repositories';
import { useState, useEffect } from 'react';
import { Bus } from '@/data/types';

export const BusManager = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      setLoading(true);
      const data = await busRepository.getAll();
      setBuses(data);
    } catch (error) {
      console.error('Failed to load buses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBus = async (newBus: Omit<Bus, 'id'>) => {
    try {
      const created = await busRepository.create(newBus);
      setBuses([...buses, created]);
    } catch (error) {
      console.error('Failed to create bus:', error);
    }
  };

  const handleDeleteBus = async (id: string) => {
    try {
      await busRepository.delete(id);
      setBuses(buses.filter(b => b.id !== id));
    } catch (error) {
      console.error('Failed to delete bus:', error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {buses.map(bus => (
            <div key={bus.id}>
              <h3>{bus.name}</h3>
              <p>Plate: {bus.plateNumber}</p>
              <p>Capacity: {bus.capacity}</p>
              <button onClick={() => handleDeleteBus(bus.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

## Error Handling

### Example: Error Handling in Components
```typescript
const handleRequest = async () => {
  try {
    const data = await busRepository.getAll();
    // Process data
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = '/signin';
    } else if (error.response?.status === 404) {
      // Handle not found
      console.error('Resource not found');
    } else {
      // Handle other errors
      console.error('Error:', error.message);
    }
  }
};
```

## Authentication Flow

1. **Sign In**:
   ```typescript
   import { authService } from '@/services/auth';
   
   const response = await authService.login({
     username: 'john_doe',
     password: 'password123'
   });
   
   if (response.success) {
     localStorage.setItem('cuet_bus_token', response.data.token);
     localStorage.setItem('cuet_bus_user', JSON.stringify(response.data.user));
   }
   ```

2. **Sign Up**:
   ```typescript
   const response = await authService.signup({
     fullName: 'John Doe',
     username: 'john_doe',
     email: 'john@example.com',
     password: 'password123'
   });
   ```

3. **Token Management**: The API client automatically includes the token in all requests and handles token expiration.

## Best Practices

1. **Always use repositories** instead of making direct API calls
2. **Handle errors appropriately** in try-catch blocks
3. **Show loading states** while fetching data
4. **Validate user input** before sending to API
5. **Use TypeScript** for type safety with the provided type definitions
6. **Cache data** in state management for better performance
7. **Implement pagination** for large datasets
8. **Use debouncing** for search operations

## Testing

### Mock Repository for Testing
```typescript
export const mockBusRepository = {
  getAll: jest.fn().mockResolvedValue([
    { id: '1', name: 'Bus 1', capacity: 50, plateNumber: 'ABC-123' }
  ]),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  search: jest.fn()
};
```

## Troubleshooting

### Issue: 401 Unauthorized
- **Cause**: Token expired or not provided
- **Solution**: Clear local storage and login again

### Issue: CORS Error
- **Cause**: Frontend and backend on different origins
- **Solution**: Ensure VITE_API_URL is set correctly and backend CORS is configured

### Issue: API Timeouts
- **Cause**: Slow network or unresponsive backend
- **Solution**: Check backend logs and network connectivity

For more details, see the [Backend API Documentation](../backend/API_DOCUMENTATION.md).
