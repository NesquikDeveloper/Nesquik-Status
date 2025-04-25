import { Activity } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="relative">
        <Activity className="h-16 w-16 text-neon-blue animate-pulse" />
        <div className="absolute inset-0 blur-lg opacity-50 bg-neon-blue rounded-full"></div>
      </div>
      <p className="mt-4 text-text-secondary animate-pulse">Carregando...</p>
    </div>
  );
};

export default LoadingScreen;