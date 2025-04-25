import { useEffect, useState } from 'react';
import { useServicesStore, Service } from '../stores/servicesStore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Activity, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

// Registrar componentes Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const { services } = useServicesStore();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  
  // Selecionar o primeiro serviço por padrão
  useEffect(() => {
    if (services.length > 0 && !selectedService) {
      setSelectedService(services[0]);
    }
  }, [services, selectedService]);
  
  // Preparar dados do gráfico quando o serviço selecionado mudar
  useEffect(() => {
    if (selectedService) {
      // Inverter a ordem para mostrar os dados mais antigos primeiro
      const historyData = [...selectedService.history].reverse();
      
      const labels = historyData.map((entry, index) => {
        // Mostrar apenas números para simplificar o gráfico
        return `${index + 1}`;
      });
      
      const uptimeData = historyData.map(entry => entry.uptime);
      
      const statusColors = historyData.map(entry => {
        switch (entry.status) {
          case 'online':
            return '#00FF66';
          case 'warning':
            return '#FFAA00';
          case 'offline':
            return '#FF0055';
          default:
            return '#A0A0A0';
        }
      });
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Uptime %',
            data: uptimeData,
            borderColor: '#00AAFF',
            backgroundColor: 'rgba(0, 170, 255, 0.2)',
            tension: 0.3,
            fill: true,
            pointBackgroundColor: statusColors,
            pointBorderColor: statusColors,
            pointRadius: 5,
            pointHoverRadius: 7,
          }
        ]
      });
    }
  }, [selectedService]);
  
  // Calcular estatísticas
  const getServiceStats = () => {
    if (!selectedService) return { online: 0, warning: 0, offline: 0, avgUptime: 0 };
    
    const history = selectedService.history;
    const online = history.filter(entry => entry.status === 'online').length;
    const warning = history.filter(entry => entry.status === 'warning').length;
    const offline = history.filter(entry => entry.status === 'offline').length;
    const avgUptime = history.reduce((sum, entry) => sum + entry.uptime, 0) / history.length;
    
    return { online, warning, offline, avgUptime };
  };
  
  const stats = getServiceStats();
  
  // Opções de configuração do gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#A0A0A0',
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#A0A0A0',
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#181818',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#2A2A2A',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: () => selectedService?.name || '',
          label: (context: any) => {
            const index = context.dataIndex;
            const entry = [...selectedService!.history].reverse()[index];
            const status = entry.status === 'online' ? 'Operacional' : 
                          entry.status === 'warning' ? 'Instável' : 'Indisponível';
            
            return [
              `Status: ${status}`,
              `Uptime: ${entry.uptime.toFixed(2)}%`
            ];
          }
        }
      }
    }
  };
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-text-secondary">
          Monitoramento detalhado dos serviços
        </p>
      </div>
      
      <div className="bg-card-dark border border-border-dark rounded-lg p-4 mb-6">
        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-1">
            Selecionar serviço
          </label>
          <select
            value={selectedService?.id || ''}
            onChange={(e) => {
              const service = services.find(s => s.id === e.target.value);
              setSelectedService(service || null);
            }}
            className="input-dark w-full"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </div>
        
        {selectedService && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-panel-dark p-4 rounded-lg border border-border-dark flex items-center gap-3">
                <div className="p-2 rounded-full bg-neon-blue/10">
                  <Activity className="h-5 w-5 text-neon-blue" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Uptime Médio</p>
                  <p className="text-xl font-semibold">{stats.avgUptime.toFixed(2)}%</p>
                </div>
              </div>
              
              <div className="bg-panel-dark p-4 rounded-lg border border-border-dark flex items-center gap-3">
                <div className="p-2 rounded-full bg-neon-green/10">
                  <CheckCircle2 className="h-5 w-5 text-neon-green" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Operacional</p>
                  <p className="text-xl font-semibold">{stats.online} de 24</p>
                </div>
              </div>
              
              <div className="bg-panel-dark p-4 rounded-lg border border-border-dark flex items-center gap-3">
                <div className="p-2 rounded-full bg-warning/10">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Instabilidades</p>
                  <p className="text-xl font-semibold">{stats.warning} de 24</p>
                </div>
              </div>
              
              <div className="bg-panel-dark p-4 rounded-lg border border-border-dark flex items-center gap-3">
                <div className="p-2 rounded-full bg-neon-red/10">
                  <XCircle className="h-5 w-5 text-neon-red" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Interrupções</p>
                  <p className="text-xl font-semibold">{stats.offline} de 24</p>
                </div>
              </div>
            </div>
            
            <h3 className="font-medium mb-3">Histórico de Uptime (24 horas)</h3>
            
            <div className="h-64 relative">
              {chartData ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-text-secondary">Carregando dados...</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex items-center gap-6 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-neon-green"></span>
                <span>Operacional</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-warning"></span>
                <span>Instável</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-neon-red"></span>
                <span>Indisponível</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;