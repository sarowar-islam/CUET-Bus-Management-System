# CUET Bus Management System - Next Steps

## ✅ Completed Changes

### 1. Admin Panel - Sidebar Navigation

- Created new `AdminLayout.tsx` component with left sidebar navigation
- All admin pages now use the sidebar layout
- Sidebar is collapsible on desktop, drawer on mobile
- Includes: Dashboard, Buses, Routes, Schedules, Drivers, Ambulances, Bus Requests

### 2. Ambulance Services

- Created `AmbulanceServices.tsx` page for all users
- Users can request ambulances for emergencies
- Shows live map with ambulance locations
- Request history tracking
- Emergency hotline display

### 3. Bus Request for Teachers/Staff

- Created `RequestBus.tsx` page for teachers and staff
- Teachers/staff can submit bus reservation requests
- Form includes: purpose, date, time, passengers, destination
- Request status tracking (pending, approved, rejected, completed)

### 4. Admin Management Pages

- Created `AdminAmbulances.tsx` for managing ambulance fleet
- Created `AdminBusRequests.tsx` for reviewing bus requests
- Admin can assign ambulances to emergency requests
- Admin can approve/reject bus requests with bus & driver assignment

### 5. Updated Navigation

- Regular users now see: Dashboard, Ambulance
- Teachers/Staff see: Dashboard, Ambulance, Request Bus
- Admin panel has dedicated sidebar

### 6. Updated Dashboard

- Added quick access cards for Ambulance and Bus Request services
- Service cards shown based on user role

---

## 📋 TO-DO: Next Steps for Full Implementation

### Phase 1: Driver Mobile App (High Priority)

#### 1.1 Create Driver App (React Native or Flutter)

```
Features needed:
- Driver authentication
- GPS tracking with background location
- Start/Stop trip functionality
- Connection status indicator
- Route display
```

#### 1.2 Implement WebSocket Server

```javascript
// You need to create a backend server that:
// - Receives GPS data from driver apps
// - Broadcasts location updates to connected clients
// - Stores location history

// Technology suggestions:
// - Node.js with Socket.IO
// - NestJS with WebSockets
// - Firebase Realtime Database
```

#### 1.3 Update Bus Details Page

- Add real-time bus tracking on map
- Show estimated arrival time
- Display driver's current speed/direction

---

### Phase 2: Backend Development (Required)

#### 2.1 Setup Backend Server

```
Recommended Stack:
- Node.js + Express or NestJS
- Database: PostgreSQL or MongoDB
- Authentication: JWT
- Real-time: Socket.IO or Firebase
```

#### 2.2 API Endpoints Needed

```
Authentication:
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh-token

Users:
GET /api/users/profile
PUT /api/users/profile

Buses:
GET /api/buses
POST /api/buses
PUT /api/buses/:id
DELETE /api/buses/:id

Routes:
GET /api/routes
POST /api/routes
PUT /api/routes/:id
DELETE /api/routes/:id

Schedules:
GET /api/schedules
POST /api/schedules
PUT /api/schedules/:id
DELETE /api/schedules/:id

Drivers:
GET /api/drivers
POST /api/drivers
PUT /api/drivers/:id
DELETE /api/drivers/:id

Ambulances:
GET /api/ambulances
POST /api/ambulances
PUT /api/ambulances/:id
DELETE /api/ambulances/:id
POST /api/ambulances/request
GET /api/ambulances/requests

Bus Requests:
GET /api/bus-requests
POST /api/bus-requests
PUT /api/bus-requests/:id
PUT /api/bus-requests/:id/approve
PUT /api/bus-requests/:id/reject

Live Tracking:
WebSocket: /ws/tracking
WebSocket: /ws/ambulance
```

---

### Phase 3: Live Location Implementation

#### 3.1 Driver App Location Service

```javascript
// Example implementation for driver app:

// Use Expo Location (React Native)
import * as Location from "expo-location";

const startTracking = async () => {
  await Location.startLocationUpdatesAsync("background-location", {
    accuracy: Location.Accuracy.High,
    timeInterval: 5000, // every 5 seconds
    distanceInterval: 10, // every 10 meters
    foregroundService: {
      notificationTitle: "CUET Bus Tracking",
      notificationBody: "Sharing live location",
    },
  });
};

// Send to server
socket.emit("location-update", {
  driverId: "driver-id",
  scheduleId: "schedule-id",
  latitude: location.coords.latitude,
  longitude: location.coords.longitude,
  speed: location.coords.speed,
  heading: location.coords.heading,
  timestamp: new Date(),
});
```

#### 3.2 Frontend Real-time Updates

```typescript
// Add to BusDetails.tsx
useEffect(() => {
  const socket = io("wss://your-server.com");

  socket.on("bus-location", (data) => {
    // Update bus marker on map
    updateBusMarker(data.latitude, data.longitude);
  });

  return () => socket.disconnect();
}, [scheduleId]);
```

---

### Phase 4: Notification System

#### 4.1 Push Notifications

- Setup Firebase Cloud Messaging (FCM)
- Notify when:
  - Ambulance request is submitted/assigned
  - Bus request is approved/rejected
  - Bus is arriving at stop (ETA alerts)

#### 4.2 In-App Notifications

- Create notification center component
- Store notifications in database
- Mark as read functionality

---

### Phase 5: Additional Features

#### 5.1 Enhanced Maps

- [ ] Show all bus routes on main map
- [ ] Calculate ETA based on current location
- [ ] Traffic integration
- [ ] Offline map caching

#### 5.2 Reports & Analytics (Admin)

- [ ] Daily/weekly trip reports
- [ ] Driver performance metrics
- [ ] Fuel consumption tracking
- [ ] Passenger count analytics

#### 5.3 Student Features

- [ ] Save favorite routes
- [ ] Set arrival notifications
- [ ] Rate driver/service
- [ ] Report issues

---

### Phase 6: Deployment

#### 6.1 Frontend Deployment

```bash
# Build the app
bun run build

# Deploy to:
# - Netlify (already configured in netlify.toml)
# - Vercel
# - Firebase Hosting
```

#### 6.2 Backend Deployment

```
Recommended platforms:
- Railway
- Render
- DigitalOcean App Platform
- AWS/Azure/GCP

Environment variables needed:
- DATABASE_URL
- JWT_SECRET
- FIREBASE_CONFIG
- MAPBOX_TOKEN
```

#### 6.3 Mobile App

```
Driver App:
- Build with EAS (Expo)
- Distribute via APK for Android
- App Store for iOS

Optional User App:
- Consider PWA (Progressive Web App)
- Or native mobile app
```

---

## 🔧 Quick Fixes Needed

1. **Mapbox Token**: Replace the hardcoded token with environment variable

   ```typescript
   const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
   ```

2. **Error Handling**: Add proper error boundaries and API error handling

3. **Loading States**: Add skeleton loaders for data fetching

4. **Form Validation**: Add proper validation with Zod or Yup

5. **Unit Tests**: Add tests with Vitest/Jest

---

## 📁 File Structure After Changes

```
src/
├── components/
│   └── layout/
│       ├── AdminLayout.tsx      [NEW]
│       ├── DashboardLayout.tsx
│       └── Navbar.tsx           [UPDATED]
├── data/
│   ├── dummyData.ts             [UPDATED]
│   └── types.ts                 [UPDATED]
├── pages/
│   ├── AmbulanceServices.tsx    [NEW]
│   ├── Dashboard.tsx            [UPDATED]
│   ├── RequestBus.tsx           [NEW]
│   └── admin/
│       ├── AdminAmbulances.tsx  [NEW]
│       ├── AdminBusRequests.tsx [NEW]
│       ├── AdminBuses.tsx       [UPDATED - uses AdminLayout]
│       ├── AdminDrivers.tsx     [UPDATED - uses AdminLayout]
│       ├── AdminRoutes.tsx      [UPDATED - uses AdminLayout]
│       └── AdminSchedules.tsx   [UPDATED - uses AdminLayout]
└── App.tsx                      [UPDATED - new routes]
```

---

## 💡 Tips for Your Teacher

When presenting this project, emphasize:

1. **Scalability**: The architecture supports real-time tracking and can handle multiple concurrent users

2. **Role-based Access**: Different features for students, teachers, staff, and admin

3. **Emergency Services**: Ambulance system shows social responsibility

4. **Modern Tech Stack**: React, TypeScript, Tailwind CSS, Mapbox

5. **Real-time Potential**: WebSocket integration ready for live tracking

---

## 📞 Need Help?

For implementing the backend and driver app, consider:

- Firebase for quick backend setup
- Supabase as Firebase alternative
- Railway for Node.js deployment
- Expo for driver mobile app

Good luck with your project! 🚌
