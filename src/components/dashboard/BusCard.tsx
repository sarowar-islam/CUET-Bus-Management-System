import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bus, Clock, MapPin, Users } from 'lucide-react';
import { ScheduleWithDetails } from '@/data/types';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface BusCardProps {
  schedule: ScheduleWithDetails;
}

const BusCard: React.FC<BusCardProps> = ({ schedule }) => {
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

  const startStop = schedule.route.stops[0].name;
  const endStop = schedule.route.stops[schedule.route.stops.length - 1].name;

  return (
    <Link to={`/bus/${schedule.id}`}>
      <Card className="border-0 shadow-soft hover:shadow-card transition-all hover:-translate-y-1 cursor-pointer group overflow-hidden">
        <CardContent className="p-0">
          {/* Color bar */}
          <div 
            className="h-1.5 w-full" 
            style={{ backgroundColor: schedule.route.color }}
          />
          
          <div className="p-4 md:p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${schedule.route.color}15` }}
                >
                  <Bus className="w-6 h-6" style={{ color: schedule.route.color }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {schedule.bus.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{schedule.route.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-semibold text-sm">{formatTime(schedule.departureTime)}</span>
              </div>
            </div>

            {/* Route Info */}
            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-muted/50">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex items-center gap-2 text-sm overflow-hidden">
                <span className="font-medium text-foreground truncate">{startStop}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium text-foreground truncate">{endStop}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">{schedule.bus.capacity} seats</span>
              </div>
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
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BusCard;
