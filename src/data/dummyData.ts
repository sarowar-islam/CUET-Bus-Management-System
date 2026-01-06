import { User, Route, Stop, Driver, Bus, Schedule } from './types';

// Dummy Users
export const users: User[] = [
  { id: '1', username: 'student1', email: 'student1@cuet.ac.bd', fullName: 'Rahim Ahmed', role: 'student', password: 'student123' },
  { id: '2', username: 'teacher1', email: 'teacher1@cuet.ac.bd', fullName: 'Dr. Karim Rahman', role: 'teacher', password: 'teacher123' },
  { id: '3', username: 'staff1', email: 'staff1@cuet.ac.bd', fullName: 'Abdul Hasan', role: 'staff', password: 'staff123' },
  { id: '4', username: 'admin', email: 'admin@cuet.ac.bd', fullName: 'System Admin', role: 'admin', password: 'admin123' },
];

// Stops with real Chittagong coordinates
export const stops: Stop[] = [
  { id: 's1', name: 'CUET', coordinates: [91.9714, 22.4617] },
  { id: 's2', name: 'Rastar Matha', coordinates: [91.8334, 22.3702] },
  { id: 's3', name: 'Bahaddarhat', coordinates: [91.8200, 22.3530] },
  { id: 's4', name: 'Muradpur', coordinates: [91.8150, 22.3600] },
  { id: 's5', name: '2 No Gate', coordinates: [91.8100, 22.3550] },
  { id: 's6', name: 'GEC', coordinates: [91.8180, 22.3590] },
  { id: 's7', name: 'Lalkhan Bazar', coordinates: [91.8320, 22.3480] },
  { id: 's8', name: 'New Market', coordinates: [91.8350, 22.3420] },
  { id: 's9', name: 'KUESH', coordinates: [91.8000, 22.3700] },
  { id: 's10', name: 'Oxygen', coordinates: [91.8100, 22.3650] },
];

// Routes
export const routes: Route[] = [
  {
    id: 'r1',
    name: 'Main Route (Full)',
    stops: [stops[0], stops[1], stops[2], stops[3], stops[4], stops[5], stops[6], stops[7]],
    color: '#3B82F6',
  },
  {
    id: 'r2',
    name: 'Express Route',
    stops: [stops[0], stops[1], stops[2], stops[5], stops[6], stops[7]],
    color: '#22C55E',
  },
  {
    id: 'r3',
    name: 'Short Route',
    stops: [stops[0], stops[1], stops[2], stops[6], stops[7]],
    color: '#F59E0B',
  },
  {
    id: 'r4',
    name: 'Oxygen Route',
    stops: [stops[0], stops[8], stops[9], stops[5], stops[6], stops[7]],
    color: '#8B5CF6',
  },
];

// Drivers
export const drivers: Driver[] = [
  { id: 'd1', name: 'Mohammad Ali', phone: '01711-123456' },
  { id: 'd2', name: 'Jamal Uddin', phone: '01811-234567' },
  { id: 'd3', name: 'Rafiq Islam', phone: '01911-345678' },
  { id: 'd4', name: 'Kamal Hossain', phone: '01611-456789' },
  { id: 'd5', name: 'Shafiq Ahmed', phone: '01511-567890' },
  { id: 'd6', name: 'Noor Mohammad', phone: '01411-678901' },
  { id: 'd7', name: 'Habib Rahman', phone: '01311-789012' },
  { id: 'd8', name: 'Fazlul Haque', phone: '01711-890123' },
];

// Buses (Bangladeshi River Names)
export const buses: Bus[] = [
  { id: 'b1', name: 'Padma', capacity: 52, plateNumber: 'চট্ট-ম-১১-১২৩৪' },
  { id: 'b2', name: 'Meghna', capacity: 52, plateNumber: 'চট্ট-ম-১১-২৩৪৫' },
  { id: 'b3', name: 'Jamuna', capacity: 52, plateNumber: 'চট্ট-ম-১১-৩৪৫৬' },
  { id: 'b4', name: 'Surma', capacity: 48, plateNumber: 'চট্ট-ম-১১-৪৫৬৭' },
  { id: 'b5', name: 'Karnaphuli', capacity: 48, plateNumber: 'চট্ট-ম-১১-৫৬৭৮' },
  { id: 'b6', name: 'Brahmaputra', capacity: 52, plateNumber: 'চট্ট-ম-১১-৬৭৮৯' },
  { id: 'b7', name: 'Teesta', capacity: 48, plateNumber: 'চট্ট-ম-১১-৭৮৯০' },
  { id: 'b8', name: 'Matamuhuri', capacity: 44, plateNumber: 'চট্ট-ম-১১-৮৯০১' },
  { id: 'b9', name: 'Sangu', capacity: 44, plateNumber: 'চট্ট-ম-১১-৯০১২' },
  { id: 'b10', name: 'Halda', capacity: 44, plateNumber: 'চট্ট-ম-১১-০১২৩' },
  { id: 'b11', name: 'Kushiyara', capacity: 52, plateNumber: 'চট্ট-ম-১২-১২৩৪' },
  { id: 'b12', name: 'Rupsha', capacity: 48, plateNumber: 'চট্ট-ম-১২-২৩৪৫' },
  { id: 'b13', name: 'Shitalakshya', capacity: 52, plateNumber: 'চট্ট-ম-১২-৩৪৫৬' },
  { id: 'b14', name: 'Buriganga', capacity: 48, plateNumber: 'চট্ট-ম-১২-৪৫৬৭' },
  { id: 'b15', name: 'Dhaleshwari', capacity: 44, plateNumber: 'চট্ট-ম-১২-৫৬৭৮' },
  { id: 'b16', name: 'Gorai', capacity: 44, plateNumber: 'চট্ট-ম-১২-৬৭৮৯' },
];

// Schedules
export const schedules: Schedule[] = [
  // Morning From CUET - 5:30 AM
  { id: 'sch1', busId: 'b1', routeId: 'r1', driverId: 'd1', departureTime: '05:30', direction: 'from_cuet', category: ['student', 'teacher', 'staff'] },
  { id: 'sch2', busId: 'b2', routeId: 'r2', driverId: 'd2', departureTime: '05:30', direction: 'from_cuet', category: ['student'] },
  { id: 'sch3', busId: 'b3', routeId: 'r3', driverId: 'd3', departureTime: '05:30', direction: 'from_cuet', category: ['teacher', 'staff'] },
  
  // Morning To CUET - 7:00 AM
  { id: 'sch4', busId: 'b1', routeId: 'r1', driverId: 'd1', departureTime: '07:00', direction: 'to_cuet', category: ['student', 'teacher', 'staff'] },
  { id: 'sch5', busId: 'b4', routeId: 'r2', driverId: 'd4', departureTime: '07:00', direction: 'to_cuet', category: ['student'] },
  { id: 'sch6', busId: 'b5', routeId: 'r3', driverId: 'd5', departureTime: '07:00', direction: 'to_cuet', category: ['student'] },
  { id: 'sch7', busId: 'b6', routeId: 'r4', driverId: 'd6', departureTime: '07:00', direction: 'to_cuet', category: ['teacher', 'staff'] },
  
  // Afternoon From CUET - 1:00 PM
  { id: 'sch8', busId: 'b7', routeId: 'r1', driverId: 'd7', departureTime: '13:00', direction: 'from_cuet', category: ['student'] },
  { id: 'sch9', busId: 'b8', routeId: 'r2', driverId: 'd8', departureTime: '13:00', direction: 'from_cuet', category: ['teacher', 'staff'] },
  
  // Afternoon From CUET - 2:00 PM
  { id: 'sch10', busId: 'b9', routeId: 'r1', driverId: 'd1', departureTime: '14:00', direction: 'from_cuet', category: ['student'] },
  { id: 'sch11', busId: 'b10', routeId: 'r3', driverId: 'd2', departureTime: '14:00', direction: 'from_cuet', category: ['student'] },
  
  // Evening From CUET - 5:00 PM
  { id: 'sch12', busId: 'b11', routeId: 'r1', driverId: 'd3', departureTime: '17:00', direction: 'from_cuet', category: ['student', 'teacher', 'staff'] },
  { id: 'sch13', busId: 'b12', routeId: 'r2', driverId: 'd4', departureTime: '17:00', direction: 'from_cuet', category: ['student'] },
  { id: 'sch14', busId: 'b13', routeId: 'r4', driverId: 'd5', departureTime: '17:00', direction: 'from_cuet', category: ['teacher', 'staff'] },
  
  // Night To CUET - 9:00 PM
  { id: 'sch15', busId: 'b14', routeId: 'r1', driverId: 'd6', departureTime: '21:00', direction: 'to_cuet', category: ['student', 'teacher', 'staff'] },
  { id: 'sch16', busId: 'b15', routeId: 'r2', driverId: 'd7', departureTime: '21:00', direction: 'to_cuet', category: ['student'] },
];

// Helper function to get schedule with details
export const getScheduleWithDetails = (schedule: Schedule) => {
  const bus = buses.find(b => b.id === schedule.busId);
  const route = routes.find(r => r.id === schedule.routeId);
  const driver = drivers.find(d => d.id === schedule.driverId);
  
  return {
    ...schedule,
    bus: bus!,
    route: route!,
    driver: driver!,
  };
};

// Get schedules for a specific user role
export const getSchedulesForRole = (role: 'student' | 'teacher' | 'staff') => {
  return schedules.filter(s => s.category.includes(role)).map(getScheduleWithDetails);
};

// Get schedules by direction
export const getSchedulesByDirection = (direction: 'from_cuet' | 'to_cuet', role?: 'student' | 'teacher' | 'staff') => {
  let filtered = schedules.filter(s => s.direction === direction);
  if (role) {
    filtered = filtered.filter(s => s.category.includes(role));
  }
  return filtered.map(getScheduleWithDetails);
};

// Group schedules by time
export const groupSchedulesByTime = (scheduleList: Schedule[]) => {
  const grouped: Record<string, Schedule[]> = {};
  scheduleList.forEach(schedule => {
    if (!grouped[schedule.departureTime]) {
      grouped[schedule.departureTime] = [];
    }
    grouped[schedule.departureTime].push(schedule);
  });
  return grouped;
};
