export type ServiceStatus = "Operational" | "Degraded Performance" | "Partial Outage" | "Major Outage";

export interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  updatedAt: Date;
}

export interface Incident {
  id: string;
  service: Service;
  title: string;
  description: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'critical' | 'major' | 'minor';
  createdAt: Date;
  updatedAt: Date;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  comment: string;
  status: Incident['status'];
  createdAt: Date;
}