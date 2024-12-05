import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from './status-badge';
import { Activity, CheckCircle, LogIn, LogOut, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import useServices from '@/components/api/services';
import useIncidents from './api/incidents';
import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge';
import { IncidentTimeline } from './incident-timeline';
import { Button } from './ui/button';

export function PublicStatus() {
  const { services = [] } = useServices();
  const { incidents = [] } = useIncidents();
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');
  const recentIncidents = [...incidents].slice(0, 5);

  const navigate = useNavigate();

  const allOperational = services.every((s) => s.status === 'Operational');

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center flex flex-col justify-center">
          <div className="flex items-center flex-row justify-center w-full">
            <Button variant="outline" className='ml-auto invisible' onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>   
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6" />
              <h1 className="text-4xl font-bold">Service Status</h1>
            </div>
            <Button variant="outline" className='ml-auto' onClick={handleLogout}>
                <LogIn className="mr-2 h-4 w-4" />
                Sign in
            </Button> 
          </div>

          {services.length > 0 && (
            <div className={`mt-12 p-4 rounded-lg border-2 flex items-center gap-2 ${
              allOperational 
                ? 'border-green-600 bg-green-50'
                : 'border-red-800 bg-red-50'
            }`}>
              {allOperational 
                ? <CheckCircle className="h-6 w-6 text-green-600" />
                : <XCircle className="h-6 w-6 text-red-600" />
              }
              <p className="text-xl text-muted-foreground">
                {allOperational
                  ? <span className="text-green-600 font-bold">All systems operational</span>
                  : <span className="text-red-600 font-bold">Some systems are experiencing issues</span>}
              </p>
            </div>
          )}
        </header>

        <div className="space-y-8">
          {/* Services Status */}
          <Card className="border-none">
            <CardHeader>
              <CardTitle className="text-xl no-underline text-left tracking-normal">All Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {services.length === 0 ? (
                  <div className="flex flex-col items-center justify-center w-full gap-4 p-8 border-2 border-dashed rounded-lg">
                    <div className="text-muted-foreground text-center">
                      <h3 className="text-lg font-medium">No services available</h3>
                      <p>There are currently no services to display</p>
                    </div>
                  </div>
                ) : (
                  services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between py-0"
                    >
                      <div className={`flex items-center w-full justify-between p-4 border-b shadow-sm ${
                        service.status === 'Operational' ? 'bg-green-50' :
                        service.status === 'Degraded Performance' ? 'bg-yellow-50' :
                        service.status === 'Partial Outage' ? 'bg-red-50' :
                        service.status === 'Major Outage' ? 'bg-red-50' : 'bg-gray-50'
                      }`}>
                        <div>
                          <h3 className="font-medium">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                        <StatusBadge status={service.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Incidents */}
          {activeIncidents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeIncidents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full gap-4 p-8 border-2 border-dashed rounded-lg">
                      <div className="text-muted-foreground text-center">
                        <h3 className="text-lg font-medium">No active incidents</h3>
                        <p>All systems are operating normally</p>
                      </div>
                    </div>
                  ) : (
                    activeIncidents.map((incident) => {
                      const service = services.find(
                        (s) => s.id === incident.service.id
                      );
                      return (
                        <div key={incident.id} className="space-y-4 pb-4 mb-4 border-b">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{incident.title}</h3>
                                <Badge variant="outline">{service?.name}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {formatDistanceToNow(incident.createdAt, {
                                  addSuffix: true,
                                })}
                              </p>
                            </div>
                            <StatusBadge status={incident.status} />
                          </div>
                          <p className="text-sm">{incident.description}</p>
                          
                          <div className="border-l-2 border-gray-200 ml-4 pl-4 space-y-4">
                            <IncidentTimeline incident={incident} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Incidents */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIncidents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center w-full gap-4 p-8 border-2 border-dashed rounded-lg">
                    <div className="text-muted-foreground text-center">
                      <h3 className="text-lg font-medium">No recent incidents</h3>
                      <p>No incidents have been reported recently</p>
                    </div>
                  </div>
                ) : (
                  recentIncidents.map((incident) => {
                    const service = services.find(
                      (s) => s.id === incident.service.id
                    );
                    return (
                      <div key={incident.id} className="space-y-2 pb-4 mb-4 border-b">
                        <div className="flex items-start justify-between">
                          <div>
                          <div className="flex items-center gap-2">
                                <h3 className="font-medium">{incident.title}</h3>
                                <Badge variant="outline">{service?.name}</Badge>
                              </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(incident.createdAt, {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                          <StatusBadge status={incident.status} />
                        </div>
                        <p className="text-sm">{incident.description}</p>
                      
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}