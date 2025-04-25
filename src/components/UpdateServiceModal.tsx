import { useState } from 'react';
import { X } from 'lucide-react';
import { Service, useServicesStore } from '../stores/servicesStore';
import { useMessageTemplatesStore } from '../stores/messageTemplatesStore';
import { toast } from 'react-toastify';

interface UpdateServiceModalProps {
  service: Service;
  onClose: () => void;
}

const UpdateServiceModal = ({ service, onClose }: UpdateServiceModalProps) => {
  const { updateService, addUpdate } = useServicesStore();
  const { getTemplatesByCategory } = useMessageTemplatesStore();
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('maintenance');
  
  const templates = getTemplatesByCategory(service.id);
  
  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setMessage(template.content);
      toast.info('Template aplicado');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Por favor, digite uma mensagem');
      return;
    }
    
    // Adicionar update com a mensagem
    addUpdate({
      serviceId: service.id,
      message,
      author: 'HypeMC',
      authorImage: 'https://ui-avatars.com/api/?name=HypeMC&background=0D8ABC&color=fff',
      category
    });
    
    toast.success('Atualização publicada com sucesso');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-card-dark border border-border-dark rounded-lg shadow-lg w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-border-dark">
          <h2 className="text-lg font-medium">Atualizar {service.name}</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-text-secondary hover:text-white hover:bg-panel-dark transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Categoria
            </label>
            <select 
              className="input-dark w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="maintenance">Manutenção</option>
              <option value="outage">Interrupção</option>
              <option value="recovery">Recuperação</option>
              <option value="security">Segurança</option>
              <option value="feature">Nova Funcionalidade</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Mensagem
            </label>
            <textarea 
              className="input-dark w-full min-h-[120px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite a mensagem de atualização..."
            />
          </div>
          
          {templates.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Templates de Mensagens
              </label>
              <div className="grid grid-cols-2 gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => applyTemplate(template.id)}
                    className="text-left p-2 text-sm border border-border-dark rounded-md hover:border-neon-blue hover:bg-panel-dark transition-all overflow-hidden"
                  >
                    <p className="font-medium truncate">{template.title}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-dark rounded-md hover:bg-panel-dark transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="neon-btn-blue px-4 py-2"
            >
              Publicar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateServiceModal;