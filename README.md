# 🚌 CUET Bus Management System

A modern, full-featured web application for managing bus transportation at Chittagong University of Engineering & Technology (CUET). Built with React, TypeScript, and Tailwind CSS.

## ✨ Features

### For Students, Teachers & Staff
- **📅 Real-time Schedule Viewing** - View bus schedules filtered by your role
- **🗺️ Interactive Route Maps** - Explore routes with Mapbox integration
- **🎨 Beautiful UI** - Modern, responsive design with light/dark mode
- **📱 Mobile-Friendly** - Works seamlessly on all devices
- **🔔 Schedule Notifications** - Never miss your bus

### For Administrators
- **🚍 Bus Management** - Add, edit, and manage the bus fleet
- **🛣️ Route Management** - Create and modify routes with stops
- **📋 Schedule Management** - Create schedules for different user categories
- **👥 Driver Management** - Manage driver information

## 🛠️ Technologies

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui
- **Maps**: Mapbox GL JS
- **Routing**: React Router v6
- **State Management**: React Context API
- **Build Tool**: Vite
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd CUET-Bus-Management-System

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔑 Demo Credentials

Test the application with these demo accounts:

| Role     | Username  | Password    |
|----------|-----------|-------------|
| Student  | student1  | student123  |
| Teacher  | teacher1  | teacher123  |
| Staff    | staff1    | staff123    |
| Admin    | admin     | admin123    |

## 📱 Key Pages

- **Landing Page** - Public-facing homepage with features overview
- **Sign In/Sign Up** - Authentication pages
- **Dashboard** - Main hub showing schedules based on user role
- **Bus Details** - Detailed view with interactive map
- **Settings** - User preferences and theme toggle
- **Admin Panel** - Manage buses, routes, schedules, and drivers (Admin only)

## 🎨 Design System

The application features a comprehensive design system with:

- **Custom Color Palette** - Distinct colors for student, teacher, staff, and admin roles
- **Responsive Grid** - Mobile-first responsive layouts
- **Custom Animations** - Smooth transitions and hover effects
- **Dark Mode** - Full dark mode support
- **Accessibility** - WCAG compliant with keyboard navigation

## 📦 Project Structure

```
src/
├── components/        # Reusable components
│   ├── dashboard/    # Dashboard-specific components
│   ├── layout/       # Layout components (Navbar, DashboardLayout)
│   └── ui/          # shadcn/ui components
├── contexts/         # React Context providers
├── data/            # Mock data and types
├── hooks/           # Custom React hooks
├── pages/           # Page components
│   └── admin/       # Admin-only pages
└── lib/             # Utility functions
```

## 🔐 Authentication

The application uses localStorage for demo authentication. In production, integrate with a proper backend authentication service.

## 🗺️ Mapbox Integration

The app uses Mapbox for interactive route visualization. A public API key is pre-configured for demo purposes.

## 📄 License

This project is created for educational purposes as part of CUET's transportation management system.

## 👥 Contributors

Built with ❤️ for the CUET community
