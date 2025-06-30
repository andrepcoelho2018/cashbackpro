import React, { useState } from 'react';
import { ArrowLeft, Star, Edit, Gift, TrendingUp, Users, Calendar, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCustomerContext } from '../context/CustomerContext';
import { Customer, PointMovement } from '../types';
import PhoneInput from './PhoneInput';

interface CustomerDetailProps {
  customer: Customer;
  onBack: () => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, onBack }) => {
  const { movements, addMovement } = useApp();
  const { levels, updateCustomer } = useCustomerContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(customer);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const [pointsReason, setPointsReason] = useState('');

  const customerMovements = movements.filter(m => m.customerId === customer.id);

  // Função para obter nome completo
  const getFullName = (customer: Customer): string => {
    return `${customer.firstName} ${customer.lastName}`.trim();
  };

  const handleSave = () => {
    updateCustomer(customer.id, editForm);
    setIsEditing(false);
  };

  const handleAddPoints = () => {
    if (pointsToAdd && pointsReason) {
      const movement: Omit<PointMovement, 'id'> = {
        customerId: customer.id,
        customerDocument: customer.document,
        type: 'admin_adjust',
        points: pointsToAdd,
        description: pointsReason,
        date: new Date().toISOString().split('T')[0]
      };
      
      addMovement(movement);
      updateCustomer(customer.id, { points: customer.points + pointsToAdd });
      setPointsToAdd(0);
      setPointsReason('');
    }
  };

  const handleRedeem = (isOnline: boolean) => {
    const points = 100; // Example points to redeem
    const couponCode = isOnline ? `ONLINE-${Date.now()}` : undefined;
    
    const movement: Omit<PointMovement, 'id'> = {
      customerId: customer.id,
      customerDocument: customer.document,
      type: 'redeem',
      points: -points,
      description: `Resgate ${isOnline ? 'online' : 'offline'}: Desconto R$ 10,00`,
      date: new Date().toISOString().split('T')[0],
      couponCode
    };
    
    addMovement(movement);
    updateCustomer(customer.id, { points: customer.points - points });
  };

  const handleDocumentChange = (document: string) => {
    // Formatar CPF enquanto digita
    const cleanDocument = document.replace(/[^\d]/g, '');
    let formattedDocument = cleanDocument;
    
    if (cleanDocument.length >= 4) {
      formattedDocument = cleanDocument.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    if (cleanDocument.length >= 7) {
      formattedDocument = cleanDocument.replace(/(\d{3})\.(\d{3})(\d{1,3})/, '$1.$2.$3');
    }
    if (cleanDocument.length >= 10) {
      formattedDocument = cleanDocument.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }

    setEditForm({...editForm, document: formattedDocument});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Detalhes do Cliente</h1>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Edit className="w-4 h-4 mr-2" />
          {isEditing ? 'Cancelar' : 'Editar'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Customer Info */}
        <div className="space-y-6">
          {/* Customer Basic Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            
            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600">
                      {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{getFullName(customer)}</h3>
                    <p className="text-sm text-gray-500">{customer.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{customer.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{customer.document}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
                    <input
                      type="text"
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Sobrenome"
                    />
                  </div>
                </div>
                
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <PhoneInput
                    value={editForm.phone}
                    onChange={(phone) => setEditForm({...editForm, phone})}
                  />
                </div>
                
                <input
                  type="text"
                  value={editForm.document}
                  onChange={(e) => handleDocumentChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="CPF"
                  maxLength={14}
                />
                <button
                  onClick={handleSave}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            )}
          </div>

          {/* Points Balance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Saldo de Pontos</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-3xl font-bold text-gray-900">{customer.points.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">pontos disponíveis</p>
                </div>
              </div>
              <div 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: customer.level.color + '20', 
                  color: customer.level.color 
                }}
              >
                {customer.level.name}
              </div>
            </div>
          </div>

          {/* Status & Level */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
              <select
                value={customer.status}
                onChange={(e) => updateCustomer(customer.id, { status: e.target.value as 'active' | 'inactive' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nível</h3>
              <select
                value={customer.level.id}
                onChange={(e) => {
                  const newLevel = levels.find(l => l.id === e.target.value);
                  if (newLevel) updateCustomer(customer.id, { level: newLevel });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {levels.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Points Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Gerenciar Pontos</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="number"
                  value={pointsToAdd}
                  onChange={(e) => setPointsToAdd(Number(e.target.value))}
                  placeholder="Pontos"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={pointsReason}
                  onChange={(e) => setPointsReason(e.target.value)}
                  placeholder="Motivo"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleAddPoints}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar Pontos
              </button>
            </div>
          </div>

          {/* Redemption */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resgatar Recompensa</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleRedeem(true)}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Resgate Online
              </button>
              <button
                onClick={() => handleRedeem(false)}
                className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Resgate Offline
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico de Pontos</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {customerMovements.map((movement) => (
              <div key={movement.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  movement.type === 'earn' ? 'bg-green-100' : 
                  movement.type === 'redeem' ? 'bg-red-100' : 
                  movement.type === 'admin_adjust' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {movement.type === 'earn' && <TrendingUp className="w-4 h-4 text-green-600" />}
                  {movement.type === 'redeem' && <Gift className="w-4 h-4 text-red-600" />}
                  {movement.type === 'admin_adjust' && <Edit className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{movement.description}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">
                      {new Date(movement.date).toLocaleDateString('pt-BR')}
                    </p>
                    <p className={`text-sm font-semibold ${
                      movement.points > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.points > 0 ? '+' : ''}{movement.points} pts
                    </p>
                  </div>
                  {movement.couponCode && (
                    <p className="text-xs text-blue-600 mt-1">
                      Cupom: {movement.couponCode}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;