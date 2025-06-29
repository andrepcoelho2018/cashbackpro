import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, Crown, Award, Trophy, Gem } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Levels: React.FC = () => {
  const { levels } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const iconMap = {
    award: Award,
    star: Star,
    crown: Crown,
    trophy: Trophy,
    gem: Gem
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Níveis de Clientes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
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
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
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
                      <button className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
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
    </div>
  );
};

export default Levels;