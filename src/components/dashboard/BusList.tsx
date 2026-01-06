import React from 'react';
import { ScheduleWithDetails } from '@/data/types';
import BusCard from './BusCard';

interface BusListProps {
  schedules: ScheduleWithDetails[];
  title: string;
  direction: 'from_cuet' | 'to_cuet';
}

const BusList: React.FC<BusListProps> = ({ schedules, title, direction }) => {
  // Group schedules by time
  const groupedByTime: Record<string, ScheduleWithDetails[]> = {};
  
  schedules
    .filter(s => s.direction === direction)
    .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
    .forEach(schedule => {
      if (!groupedByTime[schedule.departureTime]) {
        groupedByTime[schedule.departureTime] = [];
      }
      groupedByTime[schedule.departureTime].push(schedule);
    });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (Object.keys(groupedByTime).length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No buses scheduled for this direction.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        {direction === 'from_cuet' ? '🔹' : '🔸'} {title}
      </h2>
      
      {Object.entries(groupedByTime).map(([time, timeSchedules]) => (
        <div key={time} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
              {formatTime(time)}
            </div>
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">
              {timeSchedules.length} {timeSchedules.length === 1 ? 'bus' : 'buses'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {timeSchedules.map((schedule) => (
              <BusCard key={schedule.id} schedule={schedule} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BusList;
