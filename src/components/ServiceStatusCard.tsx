import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Service, ServiceStatus, useServicesStore } from '../stores/servicesStore';
import { useAuthStore } from '../stores/authStore';
import { ArrowUpRight, Settings } from 'lucide-react';
import UpdateServiceModal from './UpdateServiceModal';

interface ServiceStatusCardProps {
  service: Service;
}

const ServiceStatusCard = ({ service }: ServiceStatusCardProps) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { toggleServiceStatus } = useServicesStore();

  const getStatusLabel = (status: ServiceStatus) => {
    switch (status) {
      case 'online':
        return 'Operacional';
      case 'offline':
        return 'Indisponível';
      case 'warning':
        return 'Instável';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusClass = (status: ServiceStatus) => {
    switch (status) {
      case 'online':
        return 'status-online';
      case 'offline':
        return 'status-offline';
      case 'warning':
        return 'status-warning';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy, HH:mm:ss", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <>
      <div className="card overflow-hidden group">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="flex items-center mb-1">
              <span className={getStatusClass(service.status)}></span>
              <h3 className="text-lg font-medium">{service.name}</h3>
            </div>
            <p className="text-text-secondary text-sm">{service.description}</p>
          </div>

          {isAuthenticated && (
            <button 
              className="p-2 rounded-md text-text-secondary opacity-0 group-hover:opacity-100 hover:bg-panel-dark hover:text-neon-blue transition-all"
              onClick={() => setIsUpdateModalOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm">Uptime: {service.uptime.toFixed(2)}%</span>
          <span className="text-xs text-text-secondary">
            {formatDate(service.lastUpdated)}
          </span>
        </div>
        
        <div className="relative h-2 bg-border-dark rounded-full overflow-hidden mb-4">
          <div 
            className="uptime-bar h-full" 
            style={{ width: `${service.uptime}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-text-secondary">
            <span>Status: </span>
            <span className={`
              ${service.status === 'online' ? 'text-neon-green' : ''}
              ${service.status === 'offline' ? 'text-neon-red' : ''}
              ${service.status === 'warning' ? 'text-warning' : ''}
            `}>
              {getStatusLabel(service.status)}
            </span>
          </div>
          
          {isAuthenticated && (
            <button 
              onClick={() => toggleServiceStatus(service.id)}
              className={`text-xs px-3 py-1 rounded-md flex items-center gap-1 transition-all
                ${service.status === 'online' 
                  ? 'neon-btn-red' 
                  : 'neon-btn-green'
                }
              `}
            >
              {service.status === 'online' ? 'Desativar' : 'Ativar'}
              <ArrowUpRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      
      {isUpdateModalOpen && (
        <UpdateServiceModal 
          service={service} 
          onClose={() => setIsUpdateModalOpen(false)} 
        />
      )}
    </>
  );
};

export default ServiceStatusCard;