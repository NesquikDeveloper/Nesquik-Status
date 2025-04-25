import { useState } from 'react';
import { useServicesStore } from '../stores/servicesStore';
import UpdateCard from '../components/UpdateCard';
import { Filter } from 'lucide-react';

const UpdatesPage = () => {
  const { getUpdates, services } = useServicesStore();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Obter todas as atualizações ou filtradas por serviço
  const updates = getUpdates(selectedService || undefined);
  
  // Filtrar por termo de busca
  const filteredUpdates = updates.filter(update => 
    update.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    update.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    update.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Updates do Sistema</h1>
        <p className="text-text-secondary">
          Histórico de atualizações e notificações dos serviços
        </p>
      </div>
      
      <div className="mb-6 bg-card-dark rounded-lg p-4 border border-border-dark">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-text-secondary mb-1">
              Filtrar por serviço
            </label>
            <div className="relative">
              <select
                value={selectedService || ''}
                onChange={(e) => setSelectedService(e.target.value || null)}
                className="input-dark w-full appearance-none pr-8"
              >
                <option value="">Todos os serviços</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <Filter className="h-4 w-4 text-text-secondary" />
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm text-text-secondary mb-1">
              Buscar atualizações
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por mensagem, autor ou categoria"
              className="input-dark w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredUpdates.length > 0 ? (
          filteredUpdates.map((update) => (
            <UpdateCard key={update.id} update={update} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary">Nenhuma atualização encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatesPage;