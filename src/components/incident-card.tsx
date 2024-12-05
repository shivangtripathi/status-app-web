import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Incident, Service } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { IncidentTimeline } from './incident-timeline';
import { StatusBadge } from './status-badge';
import { MoreVertical, MessageSquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from './ui/badge';
import useIncidents from './api/incidents';

interface IncidentCardProps {
  incident: Incident;
  onUpdate: () => void;
  service: Service;
}

const severityColors = {
  critical: 'text-red-600',
  major: 'text-orange-600',
  minor: 'text-yellow-600',
};

export function IncidentCard({ incident, onUpdate, service }: IncidentCardProps) {
  const { deleteIncident } = useIncidents();
  const handleDelete = () => {
    deleteIncident(incident.id);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1 flex flex-col items-start">
          <CardTitle className="text-xl no-underline flex items-center gap-2">
            {incident.title}
            <Badge variant="outline">
              {service.name}
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span className={cn('ml-2 text-sm font-normal', severityColors[incident.severity])}>
              ({incident.severity})
            </span> 
            <span>•</span>
            <span className='text-sm font-normal'>{formatDistanceToNow(incident.createdAt, { addSuffix: true })}</span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-white flex items-center justify-center h-8 w-8 border border-gray-200 rounded-md">
              <MoreVertical color="black" className='h-3 w-3' />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onUpdate}>Add update</DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={handleDelete}
            >
              Delete incident
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{incident.description}</p>
        <div className="flex items-center justify-between">
          <StatusBadge status={incident.status} />
          <Button
            variant="outline"
            size="sm"
            onClick={onUpdate}
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            Add update
          </Button>
        </div>
        <IncidentTimeline incident={incident} />
      </CardContent>
    </Card>
  );
}