import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ServiceStatus = 'online' | 'offline' | 'warning';

export interface Service {
  id: string;
  name: string;
  status: ServiceStatus;
  description: string;
  uptime: number;
  lastUpdated: string;
  history: Array<{
    timestamp: string;
    status: ServiceStatus;
    uptime: number;
  }>;
}

export interface Update {
  id: number;
  serviceId: string;
  message: string;
  author: string;
  authorImage?: string;
  timestamp: string;
  category: string;
}

interface ServicesState {
  services: Service[];
  updates: Update[];
  updateCounter: number;
  getService: (id: string) => Service | undefined;
  updateService: (id: string, data: Partial<Service>) => void;
  getUpdates: (serviceId?: string) => Update[];
  addUpdate: (update: Omit<Update, 'id' | 'timestamp'>) => void;
  deleteUpdate: (id: number) => void;
  toggleServiceStatus: (id: string) => void;
}

// Dados iniciais para os serviços
const initialServices: Service[] = [
  {
    id: 'api-gateway',
    name: 'API Gateway',
    status: 'online',
    description: 'Serviço responsável pelo roteamento de APIs',
    uptime: 100,
    lastUpdated: new Date().toISOString(),
    history: Array(24).fill(null).map((_, i) => ({
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      status: 'online',
      uptime: 100
    }))
  },
  {
    id: 'server-manager',
    name: 'Server Manager',
    status: 'online',
    description: 'Gerenciamento de servidores e recursos',
    uptime: 100,
    lastUpdated: new Date().toISOString(),
    history: Array(24).fill(null).map((_, i) => ({
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      status: 'online',
      uptime: 100
    }))
  },
  {
    id: 'web-general',
    name: 'Web General',
    status: 'online',
    description: 'Serviços web gerais e frontend',
    uptime: 98.5,
    lastUpdated: new Date().toISOString(),
    history: Array(24).fill(null).map((_, i) => ({
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      status: i < 2 ? 'warning' : 'online',
      uptime: i < 2 ? 98.5 : 100
    }))
  },
  {
    id: 'authenticator',
    name: 'Authenticator',
    status: 'online',
    description: 'Serviço de autenticação e autorização',
    uptime: 100,
    lastUpdated: new Date().toISOString(),
    history: Array(24).fill(null).map((_, i) => ({
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
      status: 'online',
      uptime: 100
    }))
  }
];

// Atualizações iniciais
const initialUpdates: Update[] = [
  {
    id: 1,
    serviceId: 'web-general',
    message: 'Manutenção programada concluída com sucesso. Todos os sistemas operacionais.',
    author: 'HypeMC',
    authorImage: 'https://ui-avatars.com/api/?name=HypeMC&background=0D8ABC&color=fff',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    category: 'maintenance'
  },
  {
    id: 2,
    serviceId: 'api-gateway',
    message: 'Atualização de segurança implementada. Nenhum impacto esperado.',
    author: 'HypeMC',
    authorImage: 'https://ui-avatars.com/api/?name=HypeMC&background=0D8ABC&color=fff',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    category: 'security'
  },
  {
    id: 3,
    serviceId: 'authenticator',
    message: 'Nova funcionalidade de login adicionada. Monitore por possíveis impactos.',
    author: 'HypeMC',
    authorImage: 'https://ui-avatars.com/api/?name=HypeMC&background=0D8ABC&color=fff',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    category: 'feature'
  }
];

export const useServicesStore = create<ServicesState>()(
  persist(
    (set, get) => ({
      services: initialServices,
      updates: initialUpdates,
      updateCounter: initialUpdates.length,
      
      getService: (id: string) => {
        return get().services.find(service => service.id === id);
      },
      
      updateService: (id: string, data: Partial<Service>) => {
        set(state => ({
          services: state.services.map(service => 
            service.id === id 
              ? { 
                  ...service, 
                  ...data,
                  lastUpdated: new Date().toISOString(),
                  history: [
                    {
                      timestamp: new Date().toISOString(),
                      status: data.status || service.status,
                      uptime: data.uptime || service.uptime
                    },
                    ...service.history.slice(0, 23)
                  ]
                } 
              : service
          )
        }));
      },
      
      getUpdates: (serviceId?: string) => {
        if (serviceId) {
          return get().updates
            .filter(update => update.serviceId === serviceId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        return get().updates
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      },
      
      addUpdate: (update) => {
        const counter = get().updateCounter + 1;
        set(state => ({
          updates: [
            {
              ...update,
              id: counter,
              timestamp: new Date().toISOString()
            },
            ...state.updates
          ],
          updateCounter: counter
        }));
      },
      
      deleteUpdate: (id: number) => {
        set(state => ({
          updates: state.updates.filter(update => update.id !== id)
        }));
      },
      
      toggleServiceStatus: (id: string) => {
        const service = get().getService(id);
        if (service) {
          const newStatus: ServiceStatus = service.status === 'online' ? 'offline' : 'online';
          const newUptime = newStatus === 'online' ? 100 : 0;
          
          get().updateService(id, { 
            status: newStatus,
            uptime: newUptime
          });
          
          // Adicionar atualização automática sobre a mudança de status
          get().addUpdate({
            serviceId: id,
            message: newStatus === 'online' 
              ? `O serviço ${service.name} está operacional novamente.` 
              : `O serviço ${service.name} está atualmente indisponível.`,
            author: 'Sistema',
            category: newStatus === 'online' ? 'recovery' : 'outage'
          });
        }
      }
    }),
    {
      name: 'services-storage',
      partialize: (state) => ({ 
        services: state.services,
        updates: state.updates,
        updateCounter: state.updateCounter
      }),
    }
  )
);