import React, { useState } from 'react';
import { Target, User, Phone, MapPin, Star, ShoppingBag, CheckCircle, Circle } from 'lucide-react';

const Objectives: React.FC = () => {
  const [objectives] = useState([
    {
      id: '1',
      title: 'Criar a Conta (Cadastro Nível 1)',
      description: 'Cliente realiza o cadastro básico com nome e email',
      icon: User,
      reward: { type: 'points', value: 100 },
      completed: 85,
      total: 100,
      status: 'active'
    },
    {
      id: '2',
      title: 'Cadastro Nível 2',
      description: 'Cliente completa cadastro com telefone, endereço e WhatsApp',
      icon: Phone,
      reward: { type: 'points', value: 200 },
      completed: 67,
      total: 100,
      status: 'active'
    },
    {
      id: '3',
      title: 'Cadastro Nível 3',
      description: 'Cliente informa preferências de produtos, marcas, serviços e cor de cabelo',
      icon: MapPin,
      reward: { type: 'points', value: 300 },
      completed: 23,
      total: 100,
      status: 'active'
    },
    {
      id: '4',
      title: 'Review de Produtos',
      description: 'Cliente avalia produtos comprados',
      icon: Star,
      reward: { type: 'points', value: 50 },
      completed: 45,
      total: 100,
      status: 'active'
    },
    {
      id: '5',
      title: 'Comprar uma Categoria de Produtos',
      description: 'Cliente realiza compra em categoria específica',
      icon: ShoppingBag,
      reward: { type: 'points', value: 500 },
      completed: 12,
      total: 100,
      status: 'active'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newObjective, setNewObjective] = useState({
    title: '',
    description: '',
    rewardType: 'points',
    rewardValue: 0,
    target: 100
  });

  const getCompletionPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Objetivos e Metas</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Target className="w-4 h-4 mr-2" />
          Novo Objetivo
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Objetivos Ativos</p>
              <p className="text-2xl font-semibold text-gray-900">{objectives.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Taxa de Conclusão</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(objectives.reduce((acc, obj) => acc + getCompletionPercentage(obj.completed, obj.total), 0) / objectives.length)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Pontos Distribuídos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {objectives.reduce((acc, obj) => acc + (obj.reward.value * obj.completed), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Participantes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {objectives.reduce((acc, obj) => acc + obj.completed, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Objectives List */}
      <div className="space-y-4">
        {objectives.map((objective) => {
          const IconComponent = objective.icon;
          const completionPercentage = getCompletionPercentage(objective.completed, objective.total);
          
          return (
            <div key={objective.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{objective.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{objective.description}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Progresso</span>
                        <span className="font-medium text-gray-900">
                          {objective.completed}/{objective.total} ({completionPercentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center space-x-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span>Recompensa: {objective.reward.value} pontos</span>
                      </div>
                      <div className="flex items-center text-sm">
                        {objective.status === 'active' ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-green-600">Ativo</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-gray-500">Inativo</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                    <Target className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customer Journey Visualization */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Jornada do Cliente</h2>
        
        <div className="relative">
          <div className="flex items-center justify-between">
            {objectives.map((objective, index) => {
              const IconComponent = objective.icon;
              const completionPercentage = getCompletionPercentage(objective.completed, objective.total);
              const isCompleted = completionPercentage >= 80;
              
              return (
                <div key={objective.id} className="flex flex-col items-center relative">
                  {index < objectives.length - 1 && (
                    <div className="absolute top-6 left-full w-full h-0.5 bg-gray-200 z-0" />
                  )}
                  
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                    isCompleted 
                      ? 'bg-green-100 border-2 border-green-500' 
                      : 'bg-gray-100 border-2 border-gray-300'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <div className="mt-3 text-center max-w-24">
                    <p className="text-xs font-medium text-gray-900 leading-tight">
                      {objective.title.split(' ').slice(0, 2).join(' ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {completionPercentage}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Objective Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Novo Objetivo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={newObjective.title}
                  onChange={(e) => setNewObjective({...newObjective, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={newObjective.description}
                  onChange={(e) => setNewObjective({...newObjective, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Recompensa</label>
                  <select
                    value={newObjective.rewardType}
                    onChange={(e) => setNewObjective({...newObjective, rewardType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="points">Pontos</option>
                    <option value="discount">Desconto</option>
                    <option value="gift">Brinde</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                  <input
                    type="number"
                    value={newObjective.rewardValue}
                    onChange={(e) => setNewObjective({...newObjective, rewardValue: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta</label>
                <input
                  type="number"
                  value={newObjective.target}
                  onChange={(e) => setNewObjective({...newObjective, target: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Implementation would save to context
                  setShowModal(false);
                  setNewObjective({
                    title: '',
                    description: '',
                    rewardType: 'points',
                    rewardValue: 0,
                    target: 100
                  });
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Criar Objetivo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Objectives;