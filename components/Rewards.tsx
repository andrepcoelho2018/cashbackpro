import React, { useState } from 'react';
import { Plus, Edit, Trash2, Gift, Star, Calendar, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Reward } from '../types';

const Rewards: React.FC = () => {
  const { rewards } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [newReward, setNewReward] = useState({
    name: '',
    description: '',
    pointsCost: 0,
    type: 'discount' as 'discount' | 'product' | 'service' | 'custom',
    value: 0,
    isActive: true,
    expirationDays: 30
  });

  const handleSaveReward = () => {
    // Implementation would save to context
    setShowModal(false);
    setEditingReward(null);
    setNewReward({
      name: '',
      description: '',
      pointsCost: 0,
      type: 'discount',
      value: 0,
      isActive: true,
      expirationDays: 30
    });
  };

  const getRewardTypeLabel = (type: string) => {
    switch (type) {
      case 'discount': return 'Desconto';
      case 'product': return 'Produto';
      case 'service': return 'Serviço';
      case 'custom': return 'Personalizado';
      default: return type;
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount': return <Gift className="w-5 h-5 text-green-600" />;
      case 'product': return <Star className="w-5 h-5 text-blue-600" />;
      case 'service': return <Calendar className="w-5 h-5 text-purple-600" />;
      default: return <Gift className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Recompensas</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Recompensa
        </button>
      </div>

      {/* Configuration Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuração de Pontos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pontos por Real (R$)
            </label>
            <input
              type="number"
              defaultValue={1}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Quantos pontos vale cada R$1,00 gasto</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Mínimo de Compra (R$)
            </label>
            <input
              type="number"
              defaultValue={50}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Valor mínimo para acumular pontos</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiração de Pontos (dias)
            </label>
            <input
              type="number"
              defaultValue={365}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Dias para expiração dos pontos</p>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div key={reward.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getRewardIcon(reward.type)}
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{reward.name}</h3>
                  <p className="text-sm text-gray-500">{getRewardTypeLabel(reward.type)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {reward.isActive ? (
                  <Eye className="w-4 h-4 text-green-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
                <button
                  onClick={() => {
                    setEditingReward(reward);
                    setShowModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{reward.description}</p>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Custo:</span>
                <span className="text-sm font-bold text-blue-600">{reward.pointsCost} pontos</span>
              </div>
              
              {reward.type === 'discount' && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Desconto:</span>
                  <span className="text-sm font-bold text-green-600">R$ {reward.value}</span>
                </div>
              )}

              {reward.expirationDays && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Validade:</span>
                  <span className="text-sm text-gray-600">{reward.expirationDays} dias</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`text-sm font-medium ${
                  reward.isActive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {reward.isActive ? 'Ativa' : 'Inativa'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Reward Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingReward ? 'Editar Recompensa' : 'Nova Recompensa'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={editingReward ? editingReward.name : newReward.name}
                  onChange={(e) => editingReward 
                    ? setEditingReward({...editingReward, name: e.target.value})
                    : setNewReward({...newReward, name: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={editingReward ? editingReward.description : newReward.description}
                  onChange={(e) => editingReward 
                    ? setEditingReward({...editingReward, description: e.target.value})
                    : setNewReward({...newReward, description: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={editingReward ? editingReward.type : newReward.type}
                  onChange={(e) => editingReward 
                    ? setEditingReward({...editingReward, type: e.target.value as any})
                    : setNewReward({...newReward, type: e.target.value as any})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="discount">Desconto</option>
                  <option value="product">Produto</option>
                  <option value="service">Serviço</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custo em Pontos</label>
                <input
                  type="number"
                  value={editingReward ? editingReward.pointsCost : newReward.pointsCost}
                  onChange={(e) => editingReward 
                    ? setEditingReward({...editingReward, pointsCost: Number(e.target.value)})
                    : setNewReward({...newReward, pointsCost: Number(e.target.value)})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  value={editingReward ? editingReward.value : newReward.value}
                  onChange={(e) => editingReward 
                    ? setEditingReward({...editingReward, value: Number(e.target.value)})
                    : setNewReward({...newReward, value: Number(e.target.value)})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validade (dias)</label>
                <input
                  type="number"
                  value={editingReward ? editingReward.expirationDays || 30 : newReward.expirationDays}
                  onChange={(e) => editingReward 
                    ? setEditingReward({...editingReward, expirationDays: Number(e.target.value)})
                    : setNewReward({...newReward, expirationDays: Number(e.target.value)})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingReward ? editingReward.isActive : newReward.isActive}
                  onChange={(e) => editingReward 
                    ? setEditingReward({...editingReward, isActive: e.target.checked})
                    : setNewReward({...newReward, isActive: e.target.checked})
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Recompensa ativa
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingReward(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveReward}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;