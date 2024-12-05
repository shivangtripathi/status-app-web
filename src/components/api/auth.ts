import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../../lib/constants';
import { useToast } from '@/hooks/use-toast';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export function useLogin() {
  const { toast } = useToast();
  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data: LoginResponse = await response.json();
      return data;
    },
    onError: () => {
      toast({
        title: 'Login failed',
        description: 'There was an error logging you in',
        duration: 3000,
        variant: 'destructive',
      });
    },
  });

  return {
    login,
    isPending,
  };
}
