import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trash2 } from 'lucide-react';
import { Update, useServicesStore } from '../stores/servicesStore';
import { useAuthStore } from '../stores/authStore';

interface UpdateCardProps {
  update: Update;
}

const UpdateCard = ({ update }: UpdateCardProps) => {
  const { isAuthenticated } = useAuthStore();
  const { deleteUpdate } = useServicesStore();
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'maintenance':
        return 'Manutenção';
      case 'outage':
        return 'Interrupção';
      case 'recovery':
        return 'Recuperação';
      case 'security':
        return 'Segurança';
      case 'feature':
        return 'Nova Funcionalidade';
      default:
        return category;
    }
  };
  
  const getCategoryClass = (category: string) => {
    switch (category) {
      case 'maintenance':
        return 'bg-neon-blue/10 text-neon-blue border-neon-blue';
      case 'outage':
        return 'bg-neon-red/10 text-neon-red border-neon-red';
      case 'recovery':
        return 'bg-neon-green/10 text-neon-green border-neon-green';
      case 'security':
        return 'bg-neon-purple/10 text-neon-purple border-neon-purple';
      case 'feature':
        return 'bg-warning/10 text-warning border-warning';
      default:
        return 'bg-border-dark/10 text-text-secondary border-border-dark';
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta atualização?')) {
      deleteUpdate(update.id);
    }
  };
  
  return (
    <div className="card group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {update.authorImage && (
            <img 
              src={update.authorImage} 
              alt={update.author}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <h3 className="font-medium">{update.author}</h3>
            <p className="text-xs text-text-secondary">
              {formatDate(update.timestamp)}
            </p>
          </div>
        </div>
        
        {isAuthenticated && (
          <button 
            onClick={handleDelete}
            className="p-2 rounded-md text-text-secondary opacity-0 group-hover:opacity-100 hover:bg-panel-dark hover:text-neon-red transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <span className={`inline-block px-2 py-0.5 text-xs rounded border ${getCategoryClass(update.category)}`}>
          {getCategoryLabel(update.category)}
        </span>
        <span className="ml-2 text-sm text-text-secondary">
          {update.serviceId}
        </span>
      </div>
      
      <p className="text-text-primary whitespace-pre-line">
        {update.message}
      </p>
      
      <div className="border-t border-border-dark mt-4 pt-3">
        <div className="text-xs text-text-secondary">
          ID: {update.id}
        </div>
      </div>
    </div>
  );
};

export default UpdateCard;