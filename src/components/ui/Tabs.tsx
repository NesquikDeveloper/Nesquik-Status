import { useState, createContext, useContext, ReactNode } from 'react';

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

export interface TabsProps {
  defaultValue: string;
  children: ReactNode;
}

export const Tabs = ({ defaultValue, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export const TabsList = ({ children, className = '' }: TabsListProps) => {
  return (
    <div className={`flex gap-1 border-b border-border-dark ${className}`}>
      {children}
    </div>
  );
};

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
}

export const TabsTrigger = ({ value, children }: TabsTriggerProps) => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabsTrigger deve ser usado dentro de um componente Tabs');
  }

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      className={`px-4 py-2 relative transition-all ${
        isActive
          ? 'text-neon-blue font-medium'
          : 'text-text-secondary hover:text-text-primary'
      }`}
      onClick={() => setActiveTab(value)}
    >
      {children}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue"></div>
      )}
    </button>
  );
};

export interface TabsContentProps {
  value: string;
  children: ReactNode;
}

export const TabsContent = ({ value, children }: TabsContentProps) => {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabsContent deve ser usado dentro de um componente Tabs');
  }

  const { activeTab } = context;

  if (activeTab !== value) {
    return null;
  }

  return <div>{children}</div>;
};
