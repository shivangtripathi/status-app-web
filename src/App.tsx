import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/components/login-page';
import { PublicStatus } from '@/components/public-status';
import { ProtectedRoute } from '@/components/protected-route';
import { AdminDashboard } from '@/components/admin-dashboard';
import { Toaster } from '@/components/ui/toaster';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

// Create a single QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Create WebSocket connection
    const socket = io('http://localhost:5001');

    socket.on('connect', () => {
      console.log('WebSocket Connected');
    });

    socket.on('message', (event) => {
      console.log('WebSocket Message:', event);
      const data = JSON.parse(event.data);

      // Handle different types of updates
      switch (data.type) {
        case 'incidentUpdate':
          // Invalidate incidents query to trigger a refetch
          queryClient.invalidateQueries({ queryKey: ['incidents'] });
          break;
        case 'serviceUpdate':
          // Invalidate services query to trigger a refetch
          queryClient.invalidateQueries({ queryKey: ['services'] });
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    });

    socket.on('error', (error) => {
      console.error('WebSocket Error:', error);
    });

    socket.on('close', () => {
      console.log('WebSocket Disconnected');
    });

    // Cleanup function to close the socket when component unmounts
    return () => {
      socket.close();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<PublicStatus />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;