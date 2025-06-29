import React, { useState } from 'react';
import { Search, Filter, Plus, TrendingUp, Gift, Edit, Calendar, QrCode, Receipt } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PointMovement } from '../types';

const Movements: React.FC = () => {
  const { movements, customers, addMovement, updateCustomer } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'earn' | 'redeem' | 'admin_adjust'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMovement, setNewMovement] = useState({
    customerId: '',
    type: 'earn' as 'earn' | 'redeem' | 'admin_adjust',
    points: 0,
    description: '',
    reference: ''
  });

  const filteredMovements = movements.filter(movement => {
    const customer = customers.find(c => c.id === movement.customerId);
    const matchesSearch = customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || movement.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddMovement = () => {
    if (newMovement.customerId && newMovement.points && newMovement.description) {
      const movement: Omit<PointMovement, 'id'> = {
        ...newMovement,
        date: new Date().toISOString().split('T')[0]
      };
      
      addMovement(movement);
      
      // Update customer points
      const customer = customers.find(c => c.id === newMovement.customerId);
      if (customer) {
        const pointsChange = newMovement.type === 'redeem' ? -Math.abs(newMovement.points) : newMovement.points;
        updateCustomer(customer.id, { points: customer.points + pointsChange });
      }
      
      setNewMovement({
        customerId: '',
        type: 'earn',
        points: 0,
        description: '',
        reference: ''
      });
      setShowAddModal(false);
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'earn': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'redeem': return <Gift className="w-5 h-5 text-red-600" />;
      case 'admin_adjust': return <Edit className="w-5 h-5 text-blue-600" />;
      default: return <TrendingUp className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case 'earn': return 'Ganho';
      case 'redeem': return 'Resgate';
      case 'admin_adjust': return 'Ajuste Admin';
      case 'referral': return 'Indicação';
      case 'expire': return 'Expiração';
      case 'refund': return 'Reembolso';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Movimentos de Pontos</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Movimentação
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por cliente ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | 'earn' | 'redeem' | 'admin_adjust')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Tipos</option>
            <option value="earn">Ganho</option>
            <option value="redeem">Resgate</option>
            <option value="admin_adjust">Ajuste Admin</option>
          </select>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Resgate Offline</h3>
              <p className="text-sm text-gray-500">Gerar cupom para impressão</p>
            </div>
            <Receipt className="w-8 h-8 text-blue-600" />
          </div>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Iniciar Resgate
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Resgate Online</h3>
              <p className="text-sm text-gray-500">Gerar cupom digital</p>
            </div>
            <QrCode className="w-8 h-8 text-green-600" />
          </div>
          <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
            Gerar Cupom
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Acumular Pontos</h3>
              <p className="text-sm text-gray-500">Registrar compra</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-600" />
          </div>
          <button className="mt-4 w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors">
            Registrar Compra
          </button>
        </div>
      </div>

      {/* Movements List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pontos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referência
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovements.map((movement) => {
                const customer = customers.find(c => c.id === movement.customerId);
                return (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(movement.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer?.name}</div>
                      <div className="text-sm text-gray-500">{customer?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getMovementIcon(movement.type)}
                        <span className="ml-2 text-sm text-gray-900">
                          {getMovementTypeLabel(movement.type)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {movement.description}
                      {movement.couponCode && (
                        <div className="text-xs text-blue-600 mt-1">
                          Cupom: {movement.couponCode}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-semibold ${
                        movement.points > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {movement.points > 0 ? '+' : ''}{movement.points}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {movement.reference || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Movement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nova Movimentação</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select
                  value={newMovement.customerId}
                  onChange={(e) => setNewMovement({...newMovement, customerId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um cliente</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={newMovement.type}
                  onChange={(e) => setNewMovement({...newMovement, type: e.target.value as 'earn' | 'redeem' | 'admin_adjust'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="earn">Ganho</option>
                  <option value="redeem">Resgate</option>
                  <option value="admin_adjust">Ajuste Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pontos</label>
                <input
                  type="number"
                  value={newMovement.points}
                  onChange={(e) => setNewMovement({...newMovement, points: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={newMovement.description}
                  onChange={(e) => setNewMovement({...newMovement, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referência (opcional)</label>
                <input
                  type="text"
                  value={newMovement.reference}
                  onChange={(e) => setNewMovement({...newMovement, reference: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddMovement}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movements;