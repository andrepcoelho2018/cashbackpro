import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, Crown, Award, Trophy, Gem, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CustomerLevel } from '../types';

const Levels: React.FC = () => {
  const { levels, addLevel, updateLevel, deleteLevel } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<CustomerLevel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    icon: 'award',
    order: 1,
    requirements: {
      minPoints: 0,
      minPurchaseValue: 0,
      timeframe: 0
    },
    benefits: {
      pointsMultiplier: 1,
      referralBonus: 1,
      freeShipping: false,
      exclusiveEvents: false,
      customRewards: [] as string[]
    }
  });
  const [newCustomReward, setNewCustomReward] = useState('');

  const iconMap = {
    award: Award,
    star: Star,
    crown: Crown,
    trophy: Trophy,
    gem: Gem
  };

  const iconOptions = [
    { value: 'award', label: 'Prêmio', icon: Award },
    { value: 'star', label: 'Estrela', icon: Star },
    { value: 'crown', label: 'Coroa', icon: Crown },
    { value: 'trophy', label: 'Troféu', icon: Trophy },
    { value: 'gem', label: 'Gema', icon: Gem }
  ];

  const colorOptions = [
    '#CD7F32', '#C0C0C0', '#FFD700', '#3B82F6', '#10B981', '#F59E0B', 
    '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#3B82F6',
      icon: 'award',
      order: levels.length + 1,
      requirements: {
        minPoints: 0,
        minPurchaseValue: 0,
        timeframe: 0
      },
      benefits: {
        pointsMultiplier: 1,
        referralBonus: 1,
        freeShipping: false,
        exclusiveEvents: false,
        customRewards: []
      }
    });
    setNewCustomReward('');
  };

  const handleOpenModal = (level?: CustomerLevel) => {
    if (level) {
      setEditingLevel(level);
      setFormData({
        name: level.name,
        color: level.color,
        icon: level.icon,
        order: level.order,
        requirements: level.requirements,
        benefits: level.benefits
      });
    } else {
      setEditingLevel(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLevel(null);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Nome do nível é obrigatório');
      return;
    }

    const levelData = {
      ...formData,
      requirements: {
        minPoints: formData.requirements.minPoints || undefined,
        minPurchaseValue: formData.requirements.minPurchaseValue || undefined,
        timeframe: formData.requirements.timeframe || undefined
      }
    };

    if (editingLevel) {
      updateLevel(editingLevel.id, levelData);
    } else {
      addLevel(levelData);
    }

    handleCloseModal();
  };

  const handleAddCustomReward = () => {
    if (newCustomReward.trim()) {
      setFormData({
        ...formData,
        benefits: {
          ...formData.benefits,
          customRewards: [...formData.benefits.customRewards, newCustomReward.trim()]
        }
      });
      setNewCustomReward('');
    }
  };

  const handleRemoveCustomReward = (index: number) => {
    setFormData({
      ...formData,
      benefits: {
        ...formData.benefits,
        customRewards: formData.benefits.customRewards.filter((_, i) => i !== index)
      }
    });
  };

  const handleDeleteLevel = (level: CustomerLevel) => {
    if (confirm(`Tem certeza que deseja deletar o nível "${level.name}"?`)) {
      deleteLevel(level.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Níveis de Clientes</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Nível
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level) => {
          const IconComponent = iconMap[level.icon as keyof typeof iconMap] || Award;
          
          return (
            <div key={level.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: level.color + '20' }}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: level.color }} 
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{level.name}</h3>
                    <p className="text-sm text-gray-500">Ordem: {level.order}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleOpenModal(level)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteLevel(level)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Requisitos</h4>
                  <p className="text-sm text-gray-600">
                    Mínimo: {level.requirements.minPoints?.toLocaleString() || 0} pontos
                  </p>
                  {level.requirements.minPurchaseValue && (
                    <p className="text-sm text-gray-600">
                      Compra mínima: R$ {level.requirements.minPurchaseValue.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Benefícios</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {level.benefits.pointsMultiplier}x pontos em compras</li>
                    <li>• {level.benefits.referralBonus}x pontos em indicações</li>
                    {level.benefits.freeShipping && <li>• Frete grátis</li>}
                    {level.benefits.exclusiveEvents && <li>• Eventos exclusivos</li>}
                    {level.benefits.customRewards.map((reward, index) => (
                      <li key={index}>• {reward}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Level Management Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumo dos Níveis</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nível
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requisitos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Multiplicador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Benefícios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {levels.map((level) => {
                const IconComponent = iconMap[level.icon as keyof typeof iconMap] || Award;
                
                return (
                  <tr key={level.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: level.color + '20' }}
                        >
                          <IconComponent 
                            className="w-4 h-4" 
                            style={{ color: level.color }} 
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{level.name}</div>
                          <div className="text-sm text-gray-500">Ordem {level.order}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {level.requirements.minPoints?.toLocaleString() || 0} pontos
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {level.benefits.pointsMultiplier}x
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {level.benefits.freeShipping && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Frete grátis
                          </span>
                        )}
                        {level.benefits.exclusiveEvents && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Eventos
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleOpenModal(level)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteLevel(level)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Adicionar/Editar Nível */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingLevel ? 'Editar Nível' : 'Novo Nível'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Nível</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Bronze, Prata, Ouro"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ordem</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ícone</label>
                <div className="grid grid-cols-5 gap-3">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({...formData, icon: option.value})}
                        className={`p-3 border-2 rounded-lg flex flex-col items-center justify-center transition-colors ${
                          formData.icon === option.value 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 mb-1" />
                        <span className="text-xs">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({...formData, color})}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        formData.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Requisitos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Requisitos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pontos Mínimos</label>
                    <input
                      type="number"
                      value={formData.requirements.minPoints || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          minPoints: Number(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compra Mínima (R$)</label>
                    <input
                      type="number"
                      value={formData.requirements.minPurchaseValue || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          minPurchaseValue: Number(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Período (dias)</label>
                    <input
                      type="number"
                      value={formData.requirements.timeframe || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        requirements: {
                          ...formData.requirements,
                          timeframe: Number(e.target.value) || 0
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Benefícios */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Benefícios</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Multiplicador de Pontos</label>
                    <input
                      type="number"
                      value={formData.benefits.pointsMultiplier}
                      onChange={(e) => setFormData({
                        ...formData,
                        benefits: {
                          ...formData.benefits,
                          pointsMultiplier: Number(e.target.value) || 1
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1"
                      step="0.1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bônus de Indicação</label>
                    <input
                      type="number"
                      value={formData.benefits.referralBonus}
                      onChange={(e) => setFormData({
                        ...formData,
                        benefits: {
                          ...formData.benefits,
                          referralBonus: Number(e.target.value) || 1
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="1"
                      step="0.1"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="freeShipping"
                      checked={formData.benefits.freeShipping}
                      onChange={(e) => setFormData({
                        ...formData,
                        benefits: {
                          ...formData.benefits,
                          freeShipping: e.target.checked
                        }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="freeShipping" className="ml-2 block text-sm text-gray-900">
                      Frete grátis
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="exclusiveEvents"
                      checked={formData.benefits.exclusiveEvents}
                      onChange={(e) => setFormData({
                        ...formData,
                        benefits: {
                          ...formData.benefits,
                          exclusiveEvents: e.target.checked
                        }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="exclusiveEvents" className="ml-2 block text-sm text-gray-900">
                      Eventos exclusivos
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recompensas Personalizadas</label>
                  <div className="space-y-2">
                    {formData.benefits.customRewards.map((reward, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">{reward}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomReward(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newCustomReward}
                        onChange={(e) => setNewCustomReward(e.target.value)}
                        placeholder="Digite uma recompensa personalizada"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomReward();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomReward}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingLevel ? 'Atualizar' : 'Criar'} Nível
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Levels;