import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Incident, IncidentUpdate } from '@/types';
import { StatusBadge } from './status-badge';
import { cn } from '@/lib/utils';

interface IncidentTimelineProps {
  incident: Incident;
}

export function IncidentTimeline({ incident }: IncidentTimelineProps) {
  return (
    <ScrollArea className="max-h-[300px] hover:overflow-y-auto pr-4">
      <div className="space-y-4">
        {[...incident.updates].reverse().map((update, index) => (
          <div key={update.id} className="relative pl-6">
            <div
              className={cn(
                'absolute left-0 top-2 h-full w-px bg-border',
                index === incident.updates.length - 1 && 'h-2'
              )}
            />
            <div className="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-primary" />
            <div className="space-y-1">
              <StatusBadge status={update.status} />
              <p className="text-sm">{update.status}</p>
              <div className="text-sm text-muted-foreground">
                {formatDistanceToNow(update.createdAt, { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}