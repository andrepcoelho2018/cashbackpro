import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, MoreVertical, Star, Clock, Gift, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCustomerContext } from '../context/CustomerContext';
import { Customer } from '../types';
import CustomerDetail from './CustomerDetail';
import PhoneInput from './PhoneInput';

const Customers: React.FC = () => {
  const { levels } = useApp();
  const { customers, validateCustomer, addCustomer } = useCustomerContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    document: '',
    points: 0,
    status: 'active' as 'active' | 'inactive'
  });
  const [validationResult, setValidationResult] = useState<any>(null);

  // Função para obter nome completo
  const getFullName = (customer: Customer): string => {
    return `${customer.firstName} ${customer.lastName}`.trim();
  };

  const filteredCustomers = customers.filter(customer => {
    const fullName = getFullName(customer);
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.document.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
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

    setNewCustomer({ ...newCustomer, document: formattedDocument });

    // Validar em tempo real se o CPF estiver completo
    if (cleanDocument.length === 11) {
      const validation = validateCustomer(cleanDocument, newCustomer.email, newCustomer.phone);
      setValidationResult(validation);
    } else {
      setValidationResult(null);
    }
  };

  const handleEmailChange = (email: string) => {
    setNewCustomer({ ...newCustomer, email });
    
    if (newCustomer.document.replace(/[^\d]/g, '').length === 11) {
      const validation = validateCustomer(newCustomer.document, email, newCustomer.phone);
      setValidationResult(validation);
    }
  };

  const handlePhoneChange = (phone: string) => {
    setNewCustomer({ ...newCustomer, phone });
    
    if (newCustomer.document.replace(/[^\d]/g, '').length === 11) {
      const validation = validateCustomer(newCustomer.document, newCustomer.email, phone);
      setValidationResult(validation);
    }
  };

  const handleAddCustomer = () => {
    if (!validationResult?.isValid) return;

    const customerData = {
      ...newCustomer,
      level: levels[0], // Nível inicial
      registrationDate: new Date().toISOString().split('T')[0],
      emailVerified: false,
      phoneVerified: false,
      documentVerified: true
    };

    const result = addCustomer(customerData);
    
    if (result) {
      setShowAddModal(false);
      setNewCustomer({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        document: '',
        points: 0,
        status: 'active'
      });
      setValidationResult(null);
    }
  };

  const getVerificationIcon = (customer: Customer) => {
    const verifications = [
      customer.documentVerified,
      customer.emailVerified,
      customer.phoneVerified
    ];
    
    const verifiedCount = verifications.filter(Boolean).length;
    
    if (verifiedCount === 3) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (verifiedCount >= 1) {
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  if (selectedCustomer) {
    return (
      <CustomerDetail 
        customer={selectedCustomer} 
        onBack={() => setSelectedCustomer(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verificação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pontos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nível
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{getFullName(customer)}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.document}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getVerificationIcon(customer)}
                      <div className="text-xs text-gray-500">
                        <div className={customer.documentVerified ? 'text-green-600' : 'text-red-600'}>
                          CPF: {customer.documentVerified ? 'Verificado' : 'Pendente'}
                        </div>
                        <div className={customer.emailVerified ? 'text-green-600' : 'text-red-600'}>
                          Email: {customer.emailVerified ? 'Verificado' : 'Pendente'}
                        </div>
                        <div className={customer.phoneVerified ? 'text-green-600' : 'text-red-600'}>
                          Tel: {customer.phoneVerified ? 'Verificado' : 'Pendente'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">
                        {customer.points.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: customer.level.color + '20', 
                        color: customer.level.color 
                      }}
                    >
                      {customer.level.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.lastPurchase ? new Date(customer.lastPurchase).toLocaleDateString('pt-BR') : 'Nunca'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Clientes Ativos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {customers.filter(c => c.status === 'active').length}
              </p>
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
              <p className="text-sm font-medium text-gray-500">Totalmente Verificados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {customers.filter(c => c.documentVerified && c.emailVerified && c.phoneVerified).length}
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
              <p className="text-sm font-medium text-gray-500">Pontos Totais</p>
              <p className="text-2xl font-semibold text-gray-900">
                {customers.reduce((sum, c) => sum + c.points, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Gift className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Média de Pontos</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(customers.reduce((sum, c) => sum + c.points, 0) / customers.length).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Novo Cliente</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={newCustomer.firstName}
                    onChange={(e) => setNewCustomer({...newCustomer, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="João"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
                  <input
                    type="text"
                    value={newCustomer.lastName}
                    onChange={(e) => setNewCustomer({...newCustomer, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Silva"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF (Chave Primária)</label>
                <input
                  type="text"
                  value={newCustomer.document}
                  onChange={(e) => handleDocumentChange(e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    validationResult && !validationResult.isValid ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationResult && !validationResult.isValid && (
                  <div className="mt-1 text-sm text-red-600">
                    {validationResult.conflicts?.duplicateDocument && 'CPF já cadastrado'}
                    {!validationResult.conflicts?.duplicateDocument && 'CPF inválido'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Chave Secundária)</label>
                <input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    validationResult?.conflicts?.duplicateEmail ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="joao@email.com"
                />
                {validationResult?.conflicts?.duplicateEmail && (
                  <div className="mt-1 text-sm text-red-600">
                    Email já cadastrado para outro CPF
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone Celular (Chave Secundária)
                </label>
                <PhoneInput
                  value={newCustomer.phone}
                  onChange={handlePhoneChange}
                  placeholder="+55 85 99999-9999"
                  error={validationResult?.conflicts?.duplicatePhone ? 'Telefone já cadastrado para outro CPF' : undefined}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pontos Iniciais</label>
                <input
                  type="number"
                  value={newCustomer.points}
                  onChange={(e) => setNewCustomer({...newCustomer, points: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {validationResult?.conflicts?.existingCustomer && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="text-sm font-medium text-yellow-800">Cliente Existente Encontrado:</h4>
                  <p className="text-sm text-yellow-700">
                    {getFullName(validationResult.conflicts.existingCustomer)} - {validationResult.conflicts.existingCustomer.document}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setValidationResult(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCustomer}
                disabled={!validationResult?.isValid}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Adicionar Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;