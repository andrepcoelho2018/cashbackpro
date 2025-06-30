import React from 'react';
import { Users, TrendingUp, Gift, UserPlus, Star, Award, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onPageChange }) => {
  const { customers, movements, rewards, referrals, clearAllData } = useApp();

  // Função para obter nome completo
  const getFullName = (customer: any): string => {
    return `${customer.firstName} ${customer.lastName}`.trim();
  };

  const stats = [
    {
      title: 'Total de Clientes',
      value: customers.length.toString(),
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Pontos Ativos',
      value: customers.reduce((sum, customer) => sum + customer.points, 0).toLocaleString(),
      icon: Star,
      color: 'bg-yellow-500',
      change: '+8%'
    },
    {
      title: 'Resgates do Mês',
      value: movements.filter(m => m.type === 'redeem').length.toString(),
      icon: Gift,
      color: 'bg-green-500',
      change: '+15%'
    },
    {
      title: 'Indicações',
      value: referrals.length.toString(),
      icon: UserPlus,
      color: 'bg-purple-500',
      change: '+25%'
    }
  ];

  const recentMovements = movements.slice(0, 5);
  const topCustomers = customers
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const handleClearAllData = async () => {
    if (confirm('Tem certeza que deseja limpar TODOS os dados de clientes e movimentações? Esta ação não pode ser desfeita.')) {
      try {
        await clearAllData();
        alert('Todos os dados foram limpos com sucesso!');
      } catch (error) {
        alert('Erro ao limpar dados. Tente novamente.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleClearAllData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Dados
          </button>
          <div className="text-sm text-gray-500">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-2">vs mês anterior</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Movements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Movimentações Recentes
          </h2>
          {recentMovements.length > 0 ? (
            <div className="space-y-4">
              {recentMovements.map((movement) => {
                const customer = customers.find(c => c.id === movement.customerId);
                return (
                  <div key={movement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        movement.type === 'earn' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <TrendingUp className={`w-5 h-5 ${
                          movement.type === 'earn' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {customer ? getFullName(customer) : 'Cliente não encontrado'}
                        </p>
                        <p className="text-sm text-gray-500">{movement.description}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      movement.type === 'earn' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.type === 'earn' ? '+' : ''}{movement.points} pts
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma movimentação encontrada</p>
              <p className="text-sm text-gray-400">As movimentações aparecerão aqui quando criadas</p>
            </div>
          )}
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Top Clientes
          </h2>
          {topCustomers.length > 0 ? (
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Award className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {getFullName(customer)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Nível {customer.level.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {customer.points.toLocaleString()} pts
                    </p>
                    <p className="text-xs text-gray-500">#{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum cliente encontrado</p>
              <p className="text-sm text-gray-400">Os clientes aparecerão aqui quando cadastrados</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => onPageChange('customers')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Adicionar Cliente</p>
          </button>
          <button 
            onClick={() => onPageChange('rewards')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <Gift className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Nova Recompensa</p>
          </button>
          <button 
            onClick={() => onPageChange('movements')}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Registrar Pontos</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;