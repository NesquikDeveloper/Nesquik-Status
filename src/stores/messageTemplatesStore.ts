import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MessageTemplate {
  id: string;
  category: string;
  title: string;
  content: string;
}

interface MessageTemplatesState {
  templates: MessageTemplate[];
  addTemplate: (template: Omit<MessageTemplate, 'id'>) => void;
  updateTemplate: (id: string, template: Partial<Omit<MessageTemplate, 'id'>>) => void;
  deleteTemplate: (id: string) => void;
  getTemplatesByCategory: (category: string) => MessageTemplate[];
}

// Templates de mensagens iniciais
const initialTemplates: MessageTemplate[] = [
  {
    id: '1',
    category: 'api-gateway',
    title: 'API Gateway - Manutenção Programada',
    content: 'Informamos que o serviço API Gateway passará por manutenção programada. Aguarde por atualizações.'
  },
  {
    id: '2',
    category: 'api-gateway',
    title: 'API Gateway - Normalização',
    content: 'O serviço API Gateway foi normalizado e está operando normalmente.'
  },
  {
    id: '3',
    category: 'server-manager',
    title: 'Server Manager - Atualização',
    content: 'Estamos realizando uma atualização no Server Manager. O serviço pode apresentar instabilidade durante este período.'
  },
  {
    id: '4',
    category: 'server-manager',
    title: 'Server Manager - Operacional',
    content: 'Atualização do Server Manager concluída com sucesso. Todos os sistemas operacionais.'
  },
  {
    id: '5',
    category: 'web-general',
    title: 'Web General - Indisponibilidade',
    content: 'O serviço Web General está temporariamente indisponível. Nossa equipe está trabalhando para resolver o problema.'
  },
  {
    id: '6',
    category: 'web-general',
    title: 'Web General - Recuperação',
    content: 'O serviço Web General foi restaurado e está funcionando normalmente.'
  },
  {
    id: '7',
    category: 'authenticator',
    title: 'Authenticator - Manutenção',
    content: 'Realizando manutenção no serviço de autenticação. Logins podem ser afetados durante este período.'
  },
  {
    id: '8',
    category: 'authenticator',
    title: 'Authenticator - Estável',
    content: 'Serviço de autenticação normalizado e operando em sua capacidade total.'
  }
];

export const useMessageTemplatesStore = create<MessageTemplatesState>()(
  persist(
    (set, get) => ({
      templates: initialTemplates,
      
      addTemplate: (template) => {
        const id = Date.now().toString();
        set(state => ({
          templates: [...state.templates, { ...template, id }]
        }));
      },
      
      updateTemplate: (id, template) => {
        set(state => ({
          templates: state.templates.map(t => 
            t.id === id ? { ...t, ...template } : t
          )
        }));
      },
      
      deleteTemplate: (id) => {
        set(state => ({
          templates: state.templates.filter(t => t.id !== id)
        }));
      },
      
      getTemplatesByCategory: (category) => {
        return get().templates.filter(t => t.category === category);
      }
    }),
    {
      name: 'message-templates-storage'
    }
  )
);