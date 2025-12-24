import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2, CheckSquare } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="min-h-screen flex bg-auth-gradient">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent opacity-95" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="relative z-10 text-center space-y-6 max-w-md">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-primary-foreground/10 rounded-2xl backdrop-blur-sm">
              <CheckSquare className="h-16 w-16" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            TaskFlow
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Gérez vos projets et tâches efficacement. Collaborez avec votre équipe et atteignez vos objectifs.
          </p>
          <div className="flex items-center justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm text-primary-foreground/70">Projets gérés</div>
            </div>
            <div className="w-px h-12 bg-primary-foreground/20" />
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm text-primary-foreground/70">Tâches complétées</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
