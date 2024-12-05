import { useMutation, useQuery } from '@tanstack/react-query';
import { Service } from '@/types';
import { useToast } from '@/hooks/use-toast';

const useServices = () => {
  const { toast } = useToast();
  const { data: services, isLoading, refetch } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5001/api/public/services');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const { data } = await response.json();
      return data;
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: async (newService: Omit<Service, 'id' | 'updatedAt' | 'createdAt'>) => {
      const response = await fetch('http://localhost:5001/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzdGF0dXNjaGVjay5jb20iLCJpYXQiOjE3MzMzMjgxOTAsImV4cCI6MTczMzkzMjk5MH0.LtA3Uu8e5ce9vOpHvkpu0ZsOzqHRIH3pIh3gFInbkUM`,
        },
        body: JSON.stringify(newService),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'Service created successfully',
        description: 'Your service has been created successfully',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Service creation failed',
        description: 'There was an error creating your service',
        duration: 3000,
        variant: 'destructive',
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async (updatedService: Service) => {
      const response = await fetch(`http://localhost:5001/api/admin/services/${updatedService.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBzdGF0dXNjaGVjay5jb20iLCJpYXQiOjE3MzMzMjgxOTAsImV4cCI6MTczMzkzMjk5MH0.LtA3Uu8e5ce9vOpHvkpu0ZsOzqHRIH3pIh3gFInbkUM`,
        },
        body: JSON.stringify(updatedService),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'Service updated successfully',
        description: 'Your service has been updated successfully',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Service update failed',
        description: 'There was an error updating your service',
        duration: 3000,
        variant: 'destructive',
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`http://localhost:5001/api/admin/services/${id}`, {
        method: 'DELETE', headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
    },
    onSuccess: () => {
      refetch();
      toast({
        title: 'Service deleted successfully',
        description: 'Your service has been deleted successfully',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Service deletion failed',
        description: 'There was an error deleting your service',
        duration: 3000,
        variant: 'destructive',
      });
    },
  });

  return {
    services,
    isLoading,
    refetch,
    createService: createServiceMutation.mutate,
    isCreating: createServiceMutation.isPending,
    createError: createServiceMutation.error,
    updateService: updateServiceMutation.mutate,
    isUpdating: updateServiceMutation.isPending,
    updateError: updateServiceMutation.error,
    deleteService: deleteServiceMutation.mutate,
    isDeleting: deleteServiceMutation.isPending,
    deleteError: deleteServiceMutation.error,
  };
};

export default useServices;