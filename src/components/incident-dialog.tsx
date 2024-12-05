import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Incident } from '@/types';
import useIncidents from './api/incidents';
import useServices from './api/services';

interface IncidentDialogProps {
  serviceId?: string;
  incident?: Incident;
  onClose: () => void;
}

export function IncidentDialog({ serviceId, incident, onClose }: IncidentDialogProps) {
  const {services = []} = useServices();
  const createIncident = useIncidents().createIncident; 
  const updateIncident = useIncidents().updateIncident;
  
  const [title, setTitle] = useState(incident?.title ?? '');
  const [description, setDescription] = useState(incident?.description ?? '');
  const [status, setStatus] = useState(incident?.status ?? 'investigating');
  const [severity, setSeverity] = useState(incident?.severity ?? 'minor');
  const [selectedServiceId, setSelectedServiceId] = useState(serviceId ?? incident?.service.id ?? '');
  const [selectedServiceName, setSelectedServiceName] = useState(incident?.service.name ?? '');

  console.log("Dsdsdsd", selectedServiceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (incident) {
      updateIncident({
        ...incident,
        description,
        status
      });
    } else {
      createIncident({
        title,
        description,
        status,
        severity
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{incident ? 'Update Incident' : 'Report New Incident'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!incident && (
            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select
                value={selectedServiceName}
                onValueChange={(val) => {
                  setSelectedServiceName(val);
                  const service = services?.find(s => s.name === val);
                  if (service) {
                    setSelectedServiceId(service.id);
                  }
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services?.map((service) => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter incident title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter incident description"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val as Incident['status'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="identified">Identified</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select value={severity} onValueChange={(val) => setSeverity(val as Incident['severity'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {incident ? 'Update Incident' : 'Create Incident'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}