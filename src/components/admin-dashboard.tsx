import { useState } from 'react';
import { ServiceCard } from '@/components/service-card';
import { ServiceDialog } from '@/components/service-dialog';
import { IncidentCard } from '@/components/incident-card';
import { IncidentDialog } from '@/components/incident-dialog';
import { IncidentUpdateDialog } from '@/components/incident-update-dialog';
import { Button } from '@/components/ui/button';
import { Service, Incident } from '@/types';
import { Activity, PlusCircle, LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import useServices from './api/services';
import useIncidents from './api/incidents';

export function AdminDashboard() {
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const { services = [] } = useServices();
  const { incidents = [] } = useIncidents();
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [isAddingService, setIsAddingService] = useState(false);
  const [isAddingIncident, setIsAddingIncident] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | undefined>();
  const [updatingIncident, setUpdatingIncident] = useState<Incident | undefined>();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background w-full">
      <header className="border-b self-center w-full">
        <div className="flex py-4">
          <div className="flex items-center flex-row justify-center w-full">
            <Button disabled className='ml-auto invisible mr-20' onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6" />
              <h1 className="text-4xl font-bold">Service Status</h1>
              
            </div>
            <Button variant="outline" className='ml-auto mr-20' onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
            </div>
        </div>
      </header>

      <main className="px-4 py-8 mx-20">
        <Tabs defaultValue="services" className="self-center mx-10 flex-col justify-center flex">
          <TabsList className="my-4">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services">
            <div className="space-y-6">
            {services.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full gap-4 p-8 border-2 border-dashed rounded-lg">
                  <div className="text-muted-foreground text-center">
                    <h3 className="text-lg font-medium">No services added yet</h3>
                    <p>Get started by adding your first service</p>
                  </div>
                  <Button onClick={() => setIsAddingService(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                </div>
              ) : (
                  <Button onClick={() => setIsAddingService(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                  Add Service
                  </Button>
              )}
              {services.map((service) => (
                <>
                  <ServiceCard
                    key={service.id}
                  service={service}
                  onEdit={() => setEditingService(service)}
                  />
                </>
              ))}

            </div>
          </TabsContent>

          <TabsContent value="incidents">
            <div className="space-y-6">
            {incidents.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full gap-4 p-8 border-2 border-dashed rounded-lg">
                  <div className="text-muted-foreground text-center">
                    <h3 className="text-lg font-medium">No incidents added yet</h3>
                    <p>Get started by creating your first incident</p>
                  </div>
                  <Button onClick={() => setIsAddingIncident(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Incident
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsAddingIncident(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                    Create Incident
                  </Button>
              )}
              {incidents.map((incident) => (
                <>
                <IncidentCard
                  key={incident.id}
                  service={incident.service}
                  incident={incident}
                  onUpdate={() => setUpdatingIncident(incident)}
                />
                </>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {(isAddingService || editingService) && (
          <ServiceDialog
            service={editingService}
            onClose={() => {
              setIsAddingService(false);
              setEditingService(undefined);
            }}
          />
        )}

        {isAddingIncident && (
          <IncidentDialog
            serviceId={selectedIncident?.service.id}
            onClose={() => {
              setIsAddingIncident(false);
              setSelectedIncident(undefined);
            }}
          />
        )}

        {updatingIncident && (
          <IncidentUpdateDialog
            incident={updatingIncident}
            onClose={() => setUpdatingIncident(undefined)}
          />
        )}
      </main>
    </div>
  );
}