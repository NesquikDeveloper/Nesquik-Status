import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useServicesStore } from '../stores/servicesStore';
import ServiceStatusCard from '../components/ServiceStatusCard';
import { Info } from 'lucide-react';

const StatusPage = () => {
  const { services } = useServicesStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Atualiza o horário atual a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy, HH:mm:ss", { locale: ptBR });
  };
  
  // Verifica se todos os serviços estão online
  const allServicesOperational = services.every(service => service.status === 'online');
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Status dos Serviços</h1>
        <p className="text-text-secondary">
          Última atualização: {formatDate(currentTime)}
        </p>
      </div>
      
      <div className={`mb-8 p-4 rounded-lg border ${
        allServicesOperational 
          ? 'bg-neon-green/5 border-neon-green/20' 
          : 'bg-neon-red/5 border-neon-red/20'
      }`}>
        <div className="flex items-start gap-3">
          <Info className={`h-5 w-5 mt-0.5 ${
            allServicesOperational ? 'text-neon-green' : 'text-neon-red'
          }`} />
          <div>
            <h3 className={`font-medium ${
              allServicesOperational ? 'text-neon-green' : 'text-neon-red'
            }`}>
              {allServicesOperational 
                ? 'Todos os sistemas estão operacionais' 
                : 'Alguns sistemas estão com problemas'
              }
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              {allServicesOperational 
                ? 'Os serviços estão funcionando normalmente.' 
                : 'Nossa equipe está trabalhando para resolver o problema o mais rápido possível.'
              }
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceStatusCard key={service.id} service={service} />
        ))}
      </div>
      
      <div className="mt-12 bg-card-dark rounded-lg p-4 border border-border-dark">
        <h2 className="font-medium mb-4">Legenda de Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center">
            <span className="status-online"></span>
            <span>Operacional</span>
          </div>
          <div className="flex items-center">
            <span className="status-warning"></span>
            <span>Instável</span>
          </div>
          <div className="flex items-center">
            <span className="status-offline"></span>
            <span>Indisponível</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;