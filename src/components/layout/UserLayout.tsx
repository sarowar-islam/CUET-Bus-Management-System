import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Bus, 
  Settings, 
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  Ambulance,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isTeacherOrStaff = user?.role === 'teacher' || user?.role === 'staff';

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const sidebarItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/ambulance', label: 'Ambulance', icon: Ambulance },
    ...(isTeacherOrStaff ? [
      { path: '/request-bus', label: 'Request Bus', icon: FileText },
    ] : []),
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-student/10 text-student';
      case 'teacher': return 'bg-teacher/10 text-teacher';
      case 'staff': return 'bg-staff/10 text-staff';
      case 'admin': return 'bg-admin/10 text-admin';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border lg:hidden">
        <div className="flex items-center justify-between h-16 px-4">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Bus className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground leading-tight">CUET Buses</h1>
              <p className="text-xs text-muted-foreground leading-tight">Management System</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border overflow-y-auto">
            {/* User Info */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{user?.fullName}</p>
                  <span className={cn(
                    "inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                    getRoleBadgeColor(user?.role || '')
                  )}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>
            
            <nav className="p-4 space-y-2">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <div className="border-t border-border my-4" />
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  location.pathname === '/settings'
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-destructive hover:bg-destructive/10 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 bottom-0 z-40 bg-card border-r border-border hidden lg:flex flex-col transition-all duration-300",
        isSidebarCollapsed ? "w-20" : "w-64"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md flex-shrink-0">
              <Bus className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h1 className="font-bold text-lg text-foreground leading-tight">CUET Buses</h1>
                <p className="text-xs text-muted-foreground leading-tight">Management System</p>
              </div>
            )}
          </Link>
        </div>

        {/* User Info */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="font-medium text-foreground truncate">{user?.fullName}</p>
                <span className={cn(
                  "inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                  getRoleBadgeColor(user?.role || '')
                )}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={isSidebarCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                  isSidebarCollapsed && "justify-center px-3",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            to="/settings"
            title={isSidebarCollapsed ? "Settings" : undefined}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
              isSidebarCollapsed && "justify-center px-3",
              location.pathname === '/settings'
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span className="font-medium">Settings</span>}
          </Link>
          <button
            onClick={handleLogout}
            title={isSidebarCollapsed ? "Sign Out" : undefined}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-destructive hover:bg-destructive/10 transition-all",
              isSidebarCollapsed && "justify-center px-3"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span className="font-medium">Sign Out</span>}
          </button>

          {/* Theme & Collapse Toggle */}
          <div className={cn(
            "flex gap-2",
            isSidebarCollapsed ? "flex-col" : "flex-row"
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={cn("flex-1", isSidebarCollapsed && "px-3")}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              {!isSidebarCollapsed && <span className="ml-2">{theme === 'dark' ? 'Light' : 'Dark'}</span>}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={cn(isSidebarCollapsed && "px-3")}
              title={isSidebarCollapsed ? 'Expand' : 'Collapse'}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        "lg:ml-64",
        isSidebarCollapsed && "lg:ml-20"
      )}>
        {/* Page Content */}
        <main className="pt-16 lg:pt-0">
          <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
