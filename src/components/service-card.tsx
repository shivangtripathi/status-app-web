import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { Service } from '@/types';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useServices from './api/services';

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
}

export function ServiceCard({ service, onEdit }: ServiceCardProps) {
  
  const { deleteService } = useServices();

  const handleDelete = () => {
    deleteService(service.id);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl">{service.name}</CardTitle>
          <CardDescription>{service.description}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="bg-white flex items-center justify-center h-8 w-8 border border-gray-200 rounded-md">
              <MoreVertical color="black" size={16} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Edit service</DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={handleDelete}
            >
              Delete service 
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <StatusBadge status={service.status} />
        </div>
      </CardContent>
    </Card>
  );
}