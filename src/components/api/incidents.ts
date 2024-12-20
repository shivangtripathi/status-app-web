import { useMutation, useQuery } from '@tanstack/react-query';
import { Incident } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/constants';

const useIncidents = () => {
  const { toast } = useToast();
  const { data: incidents, isLoading, refetch } = useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/public/incidents`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const { data } = await response.json();
      return data;
    },
  });

  const createIncidentMutation = useMutation({
    mutationFn: async (newIncident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'updates' | 'service'>) => {
      const response = await fetch(`${API_URL}/admin/incidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newIncident),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'Incident created successfully',
        description: 'Your incident has been created successfully',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Incident creation failed',
        description: 'There was an error creating your incident',
        duration: 3000,
        variant: 'destructive',
      });
    },
  });

  const updateIncidentMutation = useMutation({
    mutationFn: async (updatedIncident: { description: string, status: Incident['status'], id: string }) => {
      const response = await fetch(`${API_URL}/admin/incidents/${updatedIncident.id}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedIncident),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'Incident updated successfully',
        description: 'Your incident has been updated successfully',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Incident update failed',
        description: 'There was an error updating your incident',
        duration: 3000,
        variant: 'destructive',
      });
    },
  });

  const deleteIncidentMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${API_URL}/admin/incidents/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'Incident deleted successfully',
        description: 'Your incident has been deleted successfully',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Incident deletion failed',
        description: 'There was an error deleting your incident',
        duration: 3000,
        variant: 'destructive',
      });
    },
  });

  return {
    incidents,
    isLoading,
    refetch,
    createIncident: createIncidentMutation.mutate,
    isCreating: createIncidentMutation.isPending,
    createError: createIncidentMutation.error,
    updateIncident: updateIncidentMutation.mutate,
    isUpdating: updateIncidentMutation.isPending,
    updateError: updateIncidentMutation.error,
    deleteIncident: deleteIncidentMutation.mutate,
    isDeleting: deleteIncidentMutation.isPending,
    deleteError: deleteIncidentMutation.error,
  };
};

export default useIncidents;
