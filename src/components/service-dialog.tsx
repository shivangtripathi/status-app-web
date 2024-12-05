import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Service, ServiceStatus } from '@/types';
import { useStore } from '@/lib/store';
import useServices from './api/services';

interface ServiceDialogProps {
  service?: Service;
  onClose: () => void;
}

export function ServiceDialog({ service, onClose }: ServiceDialogProps) {
  const addService = useStore((state) => state.addService);
  // const updateService = useStore((state) => state.updateService);
  const createService = useServices().createService;
  const updateService = useServices().updateService;
  
  const [name, setName] = useState(service?.name ?? '');
  const [description, setDescription] = useState(service?.description ?? '');
  const [status, setStatus] = useState<ServiceStatus>(service?.status ?? 'Operational');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (service) {
      updateService({ ...service, name, description, status });
    } else {
      createService({ name, description, status });
      addService({ name, description, status });
    }
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              disabled={!!service}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter service name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter service description"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ServiceStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Operational">Operational</SelectItem>
                <SelectItem value="Partial Outage">Partial Outage</SelectItem>
                <SelectItem value="Degraded Performance">Degraded Performance</SelectItem>
                <SelectItem value="Major Outage">Major Outage</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {service ? 'Update Service' : 'Add Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}