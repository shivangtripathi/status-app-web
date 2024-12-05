import { create } from 'zustand';
import { Service, Incident, IncidentUpdate } from '@/types';

interface StoreState {
  services: Service[];
  incidents: Incident[];
  addService: (service: Omit<Service, 'id' | 'updatedAt'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addIncident: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'updates'>) => void;
  updateIncident: (id: string, incident: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
  addIncidentUpdate: (incidentId: string, update: Omit<IncidentUpdate, 'id' | 'createdAt'>) => void;
}

export const useStore = create<StoreState>((set) => ({
  services: [],
  incidents: [],
  
  addService: (service) =>
    set((state) => ({
      services: [
        ...state.services,
        {
          ...service,
          id: crypto.randomUUID(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateService: (id, service) =>
    set((state) => ({
      services: state.services.map((s) =>
        s.id === id ? { ...s, ...service, updatedAt: new Date() } : s
      ),
    })),

  deleteService: (id) =>
    set((state) => ({
      services: state.services.filter((s) => s.id !== id),
      incidents: state.incidents.filter((i) => i.service.id !== id),
    })),

  addIncident: (incident) =>
    set((state) => ({
      incidents: [
        ...state.incidents,
        {
          ...incident,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          updates: [],
        },
      ],
    })),

  updateIncident: (id, incident) =>
    set((state) => ({
      incidents: state.incidents.map((i) =>
        i.id === id ? { ...i, ...incident, updatedAt: new Date() } : i
      ),
    })),

  deleteIncident: (id) =>
    set((state) => ({
      incidents: state.incidents.filter((i) => i.id !== id),
    })),

  addIncidentUpdate: (incidentId, update) =>
    set((state) => ({
      ...state,
      incidents: state.incidents.map((i) =>
        i.id === incidentId
          ? {
            ...i,
            updates: [
              ...i.updates,
              {
                id: crypto.randomUUID(),
                createdAt: new Date(),
                comment: update.comment,
                status: update.status
              },
            ],
            status: update.status,
            updatedAt: new Date(),
          }
          : i
      ),
    })),
}));