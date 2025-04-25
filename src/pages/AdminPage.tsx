import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { MessageTemplate, useMessageTemplatesStore } from '../stores/messageTemplatesStore';
import { useServicesStore } from '../stores/servicesStore';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminPage = () => {
  const { templates, addTemplate, updateTemplate, deleteTemplate } = useMessageTemplatesStore();
  const { services } = useServicesStore();
  
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<{
    category: string;
    title: string;
    content: string;
  }>({
    category: services[0]?.id || '',
    title: '',
    content: ''
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const resetForm = () => {
    setFormData({
      category: services[0]?.id || '',
      title: '',
      content: ''
    });
    setIsAddingTemplate(false);
    setEditingTemplateId(null);
  };
  
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.title || !formData.content) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    if (editingTemplateId) {
      updateTemplate(editingTemplateId, formData);
      toast.success('Template atualizado com sucesso');
    } else {
      addTemplate(formData);
      toast.success('Template adicionado com sucesso');
    }
    
    resetForm();
  };
  
  const handleEditTemplate = (template: MessageTemplate) => {
    setFormData({
      category: template.category,
      title: template.title,
      content: template.content
    });
    setEditingTemplateId(template.id);
    setIsAddingTemplate(true);
  };
  
  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este template?')) {
      deleteTemplate(id);
      toast.success('Template excluído com sucesso');
    }
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Painel Administrativo</h1>
        <p className="text-text-secondary">
          Gerenciamento de templates e configurações
        </p>
      </div>
      
      <Tabs defaultValue="templates">
        <TabsList className="mb-6">
          <TabsTrigger value="templates">Templates de Mensagens</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates">
          <div className="bg-card-dark border border-border-dark rounded-lg">
            <div className="p-4 border-b border-border-dark flex justify-between items-center">
              <h2 className="font-medium">Templates de Mensagens</h2>
              
              {!isAddingTemplate && (
                <button
                  onClick={() => setIsAddingTemplate(true)}
                  className="neon-btn-green flex items-center gap-1 px-3 py-1.5"
                >
                  <Plus className="h-4 w-4" />
                  <span>Novo Template</span>
                </button>
              )}
            </div>
            
            {isAddingTemplate && (
              <div className="p-4 border-b border-border-dark">
                <h3 className="font-medium mb-4">
                  {editingTemplateId ? 'Editar Template' : 'Novo Template'}
                </h3>
                
                <form onSubmit={handleSaveTemplate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">
                        Categoria
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        className="input-dark w-full"
                      >
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-text-secondary mb-1">
                        Título
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleFormChange}
                        className="input-dark w-full"
                        placeholder="Título do template"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm text-text-secondary mb-1">
                      Conteúdo
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleFormChange}
                      className="input-dark w-full min-h-[120px]"
                      placeholder="Digite o conteúdo da mensagem..."
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-border-dark rounded-md hover:bg-panel-dark transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="neon-btn-blue px-4 py-2"
                    >
                      {editingTemplateId ? 'Atualizar' : 'Salvar'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            <div className="p-4">
              {templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="p-4 border border-border-dark rounded-md hover:border-neon-blue/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{template.title}</h3>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="p-1.5 text-text-secondary hover:text-neon-blue rounded-md hover:bg-panel-dark transition-all"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="p-1.5 text-text-secondary hover:text-neon-red rounded-md hover:bg-panel-dark transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-text-secondary mb-2">
                        Categoria: {template.category}
                      </p>
                      
                      <p className="text-sm border-t border-border-dark pt-2 mt-2 line-clamp-2">
                        {template.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary">
                    Nenhum template de mensagem encontrado
                  </p>
                  <button
                    onClick={() => setIsAddingTemplate(true)}
                    className="neon-btn-blue mt-4 px-4 py-2"
                  >
                    Criar Primeiro Template
                  </button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-card-dark border border-border-dark rounded-lg p-6">
            <div className="mb-6">
              <h2 className="font-medium mb-4">Configurações do Sistema</h2>
              <p className="text-text-secondary">
                Esta seção está em desenvolvimento. Futuras versões permitirão configurar:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-text-secondary">
                <li>Gerenciamento de usuários administrativos</li>
                <li>Configuração de notificações</li>
                <li>Personalização de aparência</li>
                <li>Configuração de integrações externas</li>
              </ul>
            </div>
            
            <div className="p-4 bg-panel-dark rounded-lg border border-neon-purple/30">
              <div className="flex items-start gap-3">
                <div className="bg-neon-purple/10 p-2 rounded-full">
                  <Activity className="h-5 w-5 text-neon-purple" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Versão do Sistema</h3>
                  <p className="text-sm text-text-secondary">
                    Status Dashboard v1.0.0
                  </p>
                  <p className="text-xs text-text-secondary mt-2">
                    © 2025 Hype MC - Todos os direitos reservados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
