import React, { useState } from 'react';
import { Search, Filter, Plus, TrendingUp, Gift, Edit, Calendar, QrCode, Receipt } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PointMovement, Customer, Branch } from '../types';
import RedemptionReceipt from './RedemptionReceipt';
import { generateUniqueCouponCode } from '../utils/couponGenerator';

const Movements: React.FC = () => {
  const { movements, customers, branches, addMovement, updateCustomer, findCustomerByDocument } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'earn' | 'redeem' | 'admin_adjust'>('all');
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [modalActionType, setModalActionType] = useState<'add_points' | 'redeem_offline' | 'redeem_online' | null>(null);
  const [searchCustomerDocument, setSearchCustomerDocument] = useState('');
  const [selectedCustomerForMovement, setSelectedCustomerForMovement] = useState<Customer | null>(null);
  const [selectedBranchForMovement, setSelectedBranchForMovement] = useState<Branch | null>(null);
  const [newMovement, setNewMovement] = useState({
    type: 'earn' as 'earn' | 'redeem' | 'admin_adjust',
    points: 0,
    description: '',
    reference: '',
    couponCode: ''
  });

  // Estados para o comprovante
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<{
    customer: Customer;
    movement: PointMovement;
  } | null>(null);

  const getFullName = (customer: Customer): string => {
    return `${customer.firstName} ${customer.lastName}`.trim();
  };

  const filteredMovements = movements.filter(movement => {
    const customer = customers.find(c => c.id === movement.customerId);
    const matchesSearch = customer ? 
      getFullName(customer).toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.description.toLowerCase().includes(searchTerm.toLowerCase()) :
      movement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || movement.type === typeFilter;
    return matchesSearch && matchesType;
  });

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

    setSearchCustomerDocument(formattedDocument);

    // Buscar cliente se o CPF estiver completo
    if (cleanDocument.length === 11) {
      const foundCustomer = findCustomerByDocument(cleanDocument);
      setSelectedCustomerForMovement(foundCustomer || null);
    } else {
      setSelectedCustomerForMovement(null);
    }
  };

  const resetMovementForm = () => {
    setSearchCustomerDocument('');
    setSelectedCustomerForMovement(null);
    setSelectedBranchForMovement(null);
    setNewMovement({
      type: 'earn',
      points: 0,
      description: '',
      reference: '',
      couponCode: ''
    });
  };

  const handleOpenAddPointsModal = () => {
    setModalActionType('add_points');
    setNewMovement({
      type: 'earn',
      points: 0,
      description: '',
      reference: '',
      couponCode: ''
    });
    resetMovementForm();
    setShowMovementModal(true);
  };

  const handleOpenRedeemOfflineModal = () => {
    setModalActionType('redeem_offline');
    // Generate unique coupon code for offline redemption
    const couponCode = generateUniqueCouponCode('offline');
    setNewMovement({
      type: 'redeem',
      points: 100,
      description: 'Resgate offline: Desconto R$ 10,00',
      reference: '',
      couponCode: couponCode
    });
    resetMovementForm();
    setShowMovementModal(true);
  };

  const handleOpenRedeemOnlineModal = () => {
    setModalActionType('redeem_online');
    // Generate unique coupon code for online redemption
    const couponCode = generateUniqueCouponCode('online');
    setNewMovement({
      type: 'redeem',
      points: 100,
      description: 'Resgate online: Desconto R$ 10,00',
      reference: '',
      couponCode: couponCode
    });
    resetMovementForm();
    setShowMovementModal(true);
  };

  const handleCloseMovementModal = () => {
    setShowMovementModal(false);
    setModalActionType(null);
    resetMovementForm();
  };

  const handleAddMovement = () => {
    if (selectedCustomerForMovement && selectedBranchForMovement && newMovement.points && newMovement.description) {
      const movement: Omit<PointMovement, 'id'> = {
        customerId: selectedCustomerForMovement.id,
        customerDocument: selectedCustomerForMovement.document,
        branchId: selectedBranchForMovement.id,
        type: newMovement.type,
        points: newMovement.type === 'redeem' ? -Math.abs(newMovement.points) : newMovement.points,
        description: newMovement.description,
        date: new Date().toISOString().split('T')[0],
        reference: newMovement.reference || undefined,
        couponCode: newMovement.couponCode || undefined
      };
      
      addMovement(movement);
      
      // Update customer points
      const pointsChange = newMovement.type === 'redeem' ? -Math.abs(newMovement.points) : newMovement.points;
      updateCustomer(selectedCustomerForMovement.id, { points: selectedCustomerForMovement.points + pointsChange });
      
      // Se for um resgate, mostrar o comprovante
      if (newMovement.type === 'redeem') {
        const movementWithId: PointMovement = {
          ...movement,
          id: Date.now().toString() // Simular o ID que seria gerado
        };
        
        setReceiptData({
          customer: selectedCustomerForMovement,
          movement: movementWithId
        });
        setShowReceiptModal(true);
      }
      
      handleCloseMovementModal();
    }
  };

  const handleCloseReceiptModal = () => {
    setShowReceiptModal(false);
    setReceiptData(null);
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

  const getModalTitle = () => {
    switch (modalActionType) {
      case 'add_points': return 'Registrar Nova Compra';
      case 'redeem_offline': return 'Resgate Offline';
      case 'redeem_online': return 'Resgate Online';
      default: return 'Nova Movimentação';
    }
  };

  const getModalButtonText = () => {
    switch (modalActionType) {
      case 'add_points': return 'Registrar Compra';
      case 'redeem_offline': return 'Confirmar Resgate';
      case 'redeem_online': return 'Gerar Cupom';
      default: return 'Adicionar';
    }
  };

  const getBranchName = (branchId: string): string => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : 'Filial não encontrada';
  };

  const isFormValid = () => {
    return selectedCustomerForMovement && 
           selectedBranchForMovement && 
           newMovement.points > 0 && 
           newMovement.description.trim();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Movimentos de Pontos</h1>
        <button
          onClick={handleOpenAddPointsModal}
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
          <button 
            onClick={handleOpenRedeemOfflineModal}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
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
          <button 
            onClick={handleOpenRedeemOnlineModal}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
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
          <button 
            onClick={handleOpenAddPointsModal}
            className="mt-4 w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
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
                  Filial
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
                      <div className="text-sm font-medium text-gray-900">
                        {customer ? getFullName(customer) : 'Cliente não encontrado'}
                      </div>
                      <div className="text-sm text-gray-500">{customer?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getBranchName(movement.branchId)}
                      </div>
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
                        <div className="text-xs text-blue-600 mt-1 font-mono">
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
      {showMovementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{getModalTitle()}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF do Cliente</label>
                <input
                  type="text"
                  value={searchCustomerDocument}
                  onChange={(e) => handleDocumentChange(e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                
                {/* Exibir cliente encontrado ou mensagem de erro */}
                {searchCustomerDocument.replace(/[^\d]/g, '').length === 11 && (
                  <div className="mt-2">
                    {selectedCustomerForMovement ? (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-green-600">
                              {selectedCustomerForMovement.firstName.charAt(0)}{selectedCustomerForMovement.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              {getFullName(selectedCustomerForMovement)}
                            </p>
                            <p className="text-xs text-green-600">
                              {selectedCustomerForMovement.email} • {selectedCustomerForMovement.points} pontos
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">Cliente não encontrado com este CPF</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filial</label>
                <select
                  value={selectedBranchForMovement?.id || ''}
                  onChange={(e) => {
                    const branch = branches.find(b => b.id === e.target.value);
                    setSelectedBranchForMovement(branch || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione uma filial</option>
                  {branches.filter(branch => branch.isActive).map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} ({branch.code})
                    </option>
                  ))}
                </select>
              </div>

              {!modalActionType && (
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
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {modalActionType === 'add_points' ? 'Pontos Ganhos' : 'Pontos'}
                </label>
                <input
                  type="number"
                  value={newMovement.points}
                  onChange={(e) => setNewMovement({...newMovement, points: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={newMovement.description}
                  onChange={(e) => setNewMovement({...newMovement, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    modalActionType === 'add_points' 
                      ? 'Ex: Compra no valor de R$ 150,00'
                      : modalActionType === 'redeem_offline'
                      ? 'Ex: Resgate offline: Desconto R$ 10,00'
                      : modalActionType === 'redeem_online'
                      ? 'Ex: Resgate online: Desconto R$ 10,00'
                      : 'Descrição da movimentação'
                  }
                />
              </div>

              {modalActionType === 'add_points' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referência (opcional)</label>
                  <input
                    type="text"
                    value={newMovement.reference}
                    onChange={(e) => setNewMovement({...newMovement, reference: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Pedido #12345"
                  />
                </div>
              )}

              {(modalActionType === 'redeem_offline' || modalActionType === 'redeem_online') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código do Cupom</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newMovement.couponCode}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                    />
                    <div className="absolute right-2 top-2">
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        Único
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Código único gerado automaticamente para este resgate
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseMovementModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddMovement}
                disabled={!isFormValid()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {getModalButtonText()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Redemption Receipt Modal */}
      {showReceiptModal && receiptData && (
        <RedemptionReceipt
          customer={receiptData.customer}
          movement={receiptData.movement}
          onClose={handleCloseReceiptModal}
        />
      )}
    </div>
  );
};

export default Movements;