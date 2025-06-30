import React, { useState } from 'react';
import { UserPlus, Mail, MessageSquare, Smartphone, QrCode, Check, X, Clock, Gift, Plus, Edit, Trash2, Crown, Heart, Building, Eye, EyeOff, Search, Filter, Star, Award, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ReferralType, Customer, Referral } from '../types';
import PhoneInput from './PhoneInput';

const Referrals: React.FC = () => {
  const { referrals, referralTypes, customers, addReferralType, updateReferralType, deleteReferralType, addReferral, findCustomerByDocument } = useApp();
  const [activeTab, setActiveTab] = useState<'list' | 'types' | 'config'>('list');
  const [showModal, setShowModal] = useState(false); // Para Adicionar/Editar Tipo de Indicação
  const [showAddReferralModal, setShowAddReferralModal] = useState(false); // Para Adicionar Nova Indicação
  const [editingType, setEditingType] = useState<ReferralType | null>(null);
  const [newReferralType, setNewReferralType] = useState({
    name: '',
    description: '',
    icon: 'user-plus',
    color: '#3B82F6',
    isActive: true,
    methods: ['email'] as ('email' | 'whatsapp' | 'sms' | 'qrcode')[],
    referrerReward: {
      type: 'points' as 'fixed' | 'percentage' | 'points' | 'gift',
      value: 0,
      description: ''
    },
    referredReward: {
      type: 'points' as 'fixed' | 'percentage' | 'points' | 'gift',
      value: 0,
      description: ''
    },
    conditions: {
      minPurchaseValue: 0,
      validityDays: 30,
      maxReferrals: 0,
      requiresFirstPurchase: false
    }
  });

  // Estado para o formulário de nova indicação
  const [newReferral, setNewReferral] = useState({
    referrerDocument: '',
    referredIdentifier: '',
    referredIdentifierType: 'email' as 'email' | 'phone',
    referralTypeId: '',
    method: 'email' as 'email' | 'whatsapp' | 'sms' | 'qrcode',
  });
  const [selectedReferrerCustomer, setSelectedReferrerCustomer] = useState<Customer | null>(null);
  const [referrerDocumentError, setReferrerDocumentError] = useState<string | null>(null);
  const [referredIdentifierError, setReferredIdentifierError] = useState<string | null>(null);

  // Estados de filtro para a lista de indicações
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'validated' | 'rejected'>('all');

  // Função para obter nome completo
  const getFullName = (customer: Customer): string => {
    return `${customer.firstName} ${customer.lastName}`.trim();
  };

  // Filtrar indicações com base na pesquisa e status
  const filteredReferrals = referrals.filter(referral => {
    const referrer = customers.find(c => c.id === referral.referrerId);
    const referrerName = referrer ? getFullName(referrer) : '';
    const matchesSearch = referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.referrerDocument.includes(searchTerm) ||
                         referral.referredIdentifier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated': return <Check className="w-5 h-5 text-green-600" />;
      case 'rejected': return <X className="w-5 h-5 text-red-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'validated': return 'Validada';
      case 'rejected': return 'Rejeitada';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'qrcode': return <QrCode className="w-4 h-4" />;
      default: return <UserPlus className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (icon: string) => {
    switch (icon) {
      case 'crown': return <Crown className="w-5 h-5" />;
      case 'heart': return <Heart className="w-5 h-5" />;
      case 'building': return <Building className="w-5 h-5" />;
      case 'gift': return <Gift className="w-5 h-5" />;
      case 'star': return <Star className="w-5 h-5" />;
      case 'award': return <Award className="w-5 h-5" />;
      case 'trophy': return <Trophy className="w-5 h-5" />;
      default: return <UserPlus className="w-5 h-5" />;
    }
  };

  const getRewardTypeLabel = (type: string) => {
    switch (type) {
      case 'fixed': return 'Valor Fixo (R$)';
      case 'percentage': return 'Percentual (%)';
      case 'points': return 'Pontos';
      case 'gift': return 'Brinde';
      default: return type;
    }
  };

  const handleSaveReferralType = () => {
    if (editingType) {
      updateReferralType(editingType.id, newReferralType);
    } else {
      addReferralType(newReferralType);
    }
    
    setShowModal(false);
    setEditingType(null);
    setNewReferralType({
      name: '',
      description: '',
      icon: 'user-plus',
      color: '#3B82F6',
      isActive: true,
      methods: ['email'],
      referrerReward: {
        type: 'points',
        value: 0,
        description: ''
      },
      referredReward: {
        type: 'points',
        value: 0,
        description: ''
      },
      conditions: {
        minPurchaseValue: 0,
        validityDays: 30,
        maxReferrals: 0,
        requiresFirstPurchase: false
      }
    });
  };

  const handleEditType = (type: ReferralType) => {
    setEditingType(type);
    setNewReferralType({
      name: type.name,
      description: type.description,
      icon: type.icon,
      color: type.color,
      isActive: type.isActive,
      methods: type.methods,
      referrerReward: type.referrerReward,
      referredReward: type.referredReward,
      conditions: type.conditions || {
        minPurchaseValue: 0,
        validityDays: 30,
        maxReferrals: 0,
        requiresFirstPurchase: false
      }
    });
    setShowModal(true);
  };

  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4',
    '#84CC16', '#F97316', '#EC4899', '#6366F1', '#FFD700', '#CD7F32'
  ];

  const iconOptions = [
    { value: 'user-plus', label: 'Usuário Plus' },
    { value: 'crown', label: 'Coroa' },
    { value: 'heart', label: 'Coração' },
    { value: 'building', label: 'Prédio' },
    { value: 'gift', label: 'Presente' },
    { value: 'star', label: 'Estrela' },
    { value: 'award', label: 'Prêmio' },
    { value: 'trophy', label: 'Troféu' }
  ];

  // Lógica de Nova Indicação
  const handleReferrerDocumentChange = (document: string) => {
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

    setNewReferral({ ...newReferral, referrerDocument: formattedDocument });
    setReferrerDocumentError(null);

    if (cleanDocument.length === 11) {
      const foundCustomer = findCustomerByDocument(cleanDocument);
      if (foundCustomer) {
        setSelectedReferrerCustomer(foundCustomer);
        setReferrerDocumentError(null);
      } else {
        setSelectedReferrerCustomer(null);
        setReferrerDocumentError('Cliente não encontrado com este CPF.');
      }
    } else {
      setSelectedReferrerCustomer(null);
    }
  };

  const handleAddReferral = async () => {
    if (!selectedReferrerCustomer) {
      setReferrerDocumentError('Selecione um cliente indicador válido.');
      return;
    }
    if (!newReferral.referredIdentifier.trim()) {
      setReferredIdentifierError('Identificador do indicado é obrigatório.');
      return;
    }
    if (!newReferral.referralTypeId) {
      alert('Selecione um tipo de indicação.');
      return;
    }
    if (!newReferral.method) {
      alert('Selecione um método de indicação.');
      return;
    }

    const referralData: Omit<Referral, 'id'> = {
      referrerId: selectedReferrerCustomer.id,
      referrerDocument: selectedReferrerCustomer.document,
      referredId: null, // Inicialmente nulo, será atualizado se o cliente indicado se cadastrar
      referredDocument: null, // Inicialmente nulo
      referredIdentifier: newReferral.referredIdentifier,
      referredIdentifierType: newReferral.referredIdentifierType,
      referralTypeId: newReferral.referralTypeId,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      method: newReferral.method,
      validatedDate: undefined,
      rejectedReason: undefined,
      purchaseValue: undefined
    };

    try {
      await addReferral(referralData);
      setShowAddReferralModal(false);
      setNewReferral({
        referrerDocument: '',
        referredIdentifier: '',
        referredIdentifierType: 'email',
        referralTypeId: '',
        method: 'email',
      });
      setSelectedReferrerCustomer(null);
      setReferrerDocumentError(null);
      setReferredIdentifierError(null);
      alert('Indicação adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar indicação:', error);
      alert('Erro ao adicionar indicação. Verifique o console para mais detalhes.');
    }
  };

  const handleCloseAddReferralModal = () => {
    setShowAddReferralModal(false);
    setNewReferral({
      referrerDocument: '',
      referredIdentifier: '',
      referredIdentifierType: 'email',
      referralTypeId: '',
      method: 'email',
    });
    setSelectedReferrerCustomer(null);
    setReferrerDocumentError(null);
    setReferredIdentifierError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Sistema de Indicações</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Indicações
          </button>
          <button
            onClick={() => setActiveTab('types')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'types' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Tipos de Indicação
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'config' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Configurações
          </button>
        </div>
      </div>

      {activeTab === 'list' && (
        <>
          {/* Cartões de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Total de Indicações</p>
                  <p className="text-2xl font-semibold text-gray-900">{referrals.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Validadas</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {referrals.filter(r => r.status === 'validated').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Pendentes</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {referrals.filter(r => r.status === 'pending').length}
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
                  <p className="text-sm font-medium text-gray-500">Tipos Ativos</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {referralTypes.filter(t => t.isActive).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar por CPF ou identificador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'validated' | 'rejected')}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os status</option>
                  <option value="pending">Pendentes</option>
                  <option value="validated">Validadas</option>
                  <option value="rejected">Rejeitadas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabela de Indicações */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Indicações</h2>
              <button
                onClick={() => setShowAddReferralModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Indicação
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Indicador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Indicado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReferrals.map((referral) => {
                    const referrer = customers.find(c => c.id === referral.referrerId);
                    const referred = customers.find(c => c.id === referral.referredId);
                    const referralType = referralTypes.find(t => t.id === referral.referralTypeId);
                    
                    return (
                      <tr key={referral.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(referral.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{referrer ? getFullName(referrer) : 'N/A'}</div>
                          <div className="text-sm text-gray-500">{referral.referrerDocument}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{referred ? getFullName(referred) : referral.referredIdentifier}</div>
                          <div className="text-sm text-gray-500">{referral.referredDocument || referral.referredIdentifierType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                              style={{ backgroundColor: referralType?.color + '20' }}
                            >
                              <div style={{ color: referralType?.color }}>
                                {getTypeIcon(referralType?.icon || 'user-plus')}
                              </div>
                            </div>
                            <span className="text-sm text-gray-900">{referralType?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getMethodIcon(referral.method)}
                            <span className="ml-2 text-sm text-gray-900 capitalize">
                              {referral.method}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(referral.status)}
                            <span className="ml-2 text-sm text-gray-900">
                              {getStatusLabel(referral.status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {referral.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button className="text-green-600 hover:text-green-900">
                                <Check className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredReferrals.length === 0 && (
              <div className="text-center py-12">
                <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma indicação encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros de busca.'
                    : 'Comece criando uma nova indicação.'
                  }
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'types' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Tipos de Indicação</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Tipo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {referralTypes.map((type) => (
              <div key={type.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: type.color + '20' }}
                    >
                      <div style={{ color: type.color }}>
                        {getTypeIcon(type.icon)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{type.name}</h3>
                      <div className="flex items-center mt-1">
                        {type.isActive ? (
                          <Eye className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400 mr-1" />
                        )}
                        <span className={`text-sm ${type.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                          {type.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditType(type)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteReferralType(type.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{type.description}</p>

                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recompensa do Indicador</h4>
                    <p className="text-sm text-gray-600">
                      {getRewardTypeLabel(type.referrerReward.type)}: {type.referrerReward.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{type.referrerReward.description}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recompensa do Indicado</h4>
                    <p className="text-sm text-gray-600">
                      {getRewardTypeLabel(type.referredReward.type)}: {type.referredReward.value}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{type.referredReward.description}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Métodos Disponíveis</h4>
                    <div className="flex flex-wrap gap-1">
                      {type.methods.map((method) => (
                        <span key={method} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getMethodIcon(method)}
                          <span className="ml-1 capitalize">{method}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {type.conditions && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Condições</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        {type.conditions.minPurchaseValue && (
                          <div>• Compra mínima: R$ {type.conditions.minPurchaseValue}</div>
                        )}
                        {type.conditions.validityDays && (
                          <div>• Validade: {type.conditions.validityDays} dias</div>
                        )}
                        {type.conditions.maxReferrals && (
                          <div>• Máximo: {type.conditions.maxReferrals} indicações</div>
                        )}
                        {type.conditions.requiresFirstPurchase && (
                          <div>• Requer primeira compra</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurações Gerais</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Validação Automática
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="manual">Manual</option>
                  <option value="first_purchase">Após primeira compra</option>
                  <option value="immediate">Imediata</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limite Global de Indicações por Cliente
                </label>
                <input
                  type="number"
                  defaultValue={50}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowSelfReferral"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="allowSelfReferral" className="ml-2 block text-sm text-gray-900">
                Permitir auto-indicação (mesmo email/telefone)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="trackReferralSource"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="trackReferralSource" className="ml-2 block text-sm text-gray-900">
                Rastrear origem das indicações
              </label>
            </div>

            <div className="mt-6">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Adicionar/Editar Tipo de Indicação */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingType ? 'Editar Tipo de Indicação' : 'Novo Tipo de Indicação'}
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={newReferralType.name}
                    onChange={(e) => setNewReferralType({...newReferralType, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
                  <select
                    value={newReferralType.icon}
                    onChange={(e) => setNewReferralType({...newReferralType, icon: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon.value} value={icon.value}>{icon.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={newReferralType.description}
                  onChange={(e) => setNewReferralType({...newReferralType, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewReferralType({...newReferralType, color})}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newReferralType.color === color ? 'border-gray-800' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Métodos de Indicação</label>
                <div className="grid grid-cols-2 gap-2">
                  {['email', 'whatsapp', 'sms', 'qrcode'].map(method => (
                    <label key={method} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newReferralType.methods.includes(method as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewReferralType({
                              ...newReferralType,
                              methods: [...newReferralType.methods, method as any]
                            });
                          } else {
                            setNewReferralType({
                              ...newReferralType,
                              methods: newReferralType.methods.filter(m => m !== method)
                            });
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900 capitalize">{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Recompensa do Indicador</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      value={newReferralType.referrerReward.type}
                      onChange={(e) => setNewReferralType({
                        ...newReferralType,
                        referrerReward: { ...newReferralType.referrerReward, type: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="points">Pontos</option>
                      <option value="fixed">Valor Fixo (R$)</option>
                      <option value="percentage">Percentual (%)</option>
                      <option value="gift">Brinde</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                    <input
                      type="number"
                      value={newReferralType.referrerReward.value}
                      onChange={(e) => setNewReferralType({
                        ...newReferralType,
                        referrerReward: { ...newReferralType.referrerReward, value: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input
                      type="text"
                      value={newReferralType.referrerReward.description}
                      onChange={(e) => setNewReferralType({
                        ...newReferralType,
                        referrerReward: { ...newReferralType.referrerReward, description: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Recompensa do Indicado</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      value={newReferralType.referredReward.type}
                      onChange={(e) => setNewReferralType({
                        ...newReferralType,
                        referredReward: { ...newReferralType.referredReward, type: e.target.value as any }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="points">Pontos</option>
                      <option value="fixed">Valor Fixo (R$)</option>
                      <option value="percentage">Percentual (%)</option>
                      <option value="gift">Brinde</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                    <input
                      type="number"
                      value={newReferralType.referredReward.value}
                      onChange={(e) => setNewReferralType({
                        ...newReferralType,
                        referredReward: { ...newReferralType.referredReward, value: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <input
                      type="text"
                      value={newReferralType.referredReward.description}
                      onChange={(e) => setNewReferralType({
                        ...newReferralType,
                        referredReward: { ...newReferralType.referredReward, description: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Condições</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compra Mínima (R$)</label>
                    <input
                      type="number"
                      value={newReferralType.conditions.minPurchaseValue}
                      onChange={(e) => setNewReferralType({
                        ...newReferralType,
                        conditions: { ...newReferralType.conditions, minPurchaseValue: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Validade (dias)</label>
                    <input
                      type="number"
                      value={newReferralType.conditions.validityDays}
                      onChange={(e) => setNewReferralType({
                        ...newReferralType,
                        conditions: { ...newReferralType.conditions, validityDays: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Máximo de Indicações</label>
                    <input
                      type="number"
                      value={newReferralType.conditions.maxReferrals}
                      onChange={(e) => setNewReferralType({
                        ...newReferralType,
                        conditions: { ...newReferralType.conditions, maxReferrals: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requiresFirstPurchase"
                      checked={newReferralType.conditions.requiresFirstPurchase}
                      onChange={(e) => setNewReferralType({
                        ...newReferralType,
                        conditions: { ...newReferralType.conditions, requiresFirstPurchase: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="requiresFirstPurchase" className="ml-2 block text-sm text-gray-900">
                      Requer primeira compra
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newReferralType.isActive}
                  onChange={(e) => setNewReferralType({...newReferralType, isActive: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Tipo de indicação ativo
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingType(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveReferralType}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingType ? 'Atualizar' : 'Criar'} Tipo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Adicionar Nova Indicação */}
      {showAddReferralModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Nova Indicação</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF do Indicador</label>
                <input
                  type="text"
                  value={newReferral.referrerDocument}
                  onChange={(e) => handleReferrerDocumentChange(e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    referrerDocumentError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {selectedReferrerCustomer && (
                  <p className="mt-1 text-sm text-green-600">
                    Cliente: {getFullName(selectedReferrerCustomer)}
                  </p>
                )}
                {referrerDocumentError && (
                  <p className="mt-1 text-sm text-red-600">{referrerDocumentError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Identificador do Indicado</label>
                <select
                  value={newReferral.referredIdentifierType}
                  onChange={(e) => setNewReferral({ ...newReferral, referredIdentifierType: e.target.value as 'email' | 'phone', referredIdentifier: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email">E-mail</option>
                  <option value="phone">Telefone</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Identificador do Indicado</label>
                {newReferral.referredIdentifierType === 'email' ? (
                  <input
                    type="email"
                    value={newReferral.referredIdentifier}
                    onChange={(e) => {
                      setNewReferral({ ...newReferral, referredIdentifier: e.target.value });
                      setReferredIdentifierError(null);
                    }}
                    placeholder="email@exemplo.com"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      referredIdentifierError ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ) : (
                  <PhoneInput
                    value={newReferral.referredIdentifier}
                    onChange={(phone) => {
                      setNewReferral({ ...newReferral, referredIdentifier: phone });
                      setReferredIdentifierError(null);
                    }}
                    error={referredIdentifierError || undefined}
                  />
                )}
                {referredIdentifierError && (
                  <p className="mt-1 text-sm text-red-600">{referredIdentifierError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Indicação</label>
                <select
                  value={newReferral.referralTypeId}
                  onChange={(e) => {
                    const selectedType = referralTypes.find(type => type.id === e.target.value);
                    setNewReferral({ 
                      ...newReferral, 
                      referralTypeId: e.target.value,
                      method: selectedType?.methods[0] || 'email' // Define o método padrão do tipo selecionado
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um tipo</option>
                  {referralTypes.filter(type => type.isActive).map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              {newReferral.referralTypeId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método de Indicação</label>
                  <select
                    value={newReferral.method}
                    onChange={(e) => setNewReferral({ ...newReferral, method: e.target.value as 'email' | 'whatsapp' | 'sms' | 'qrcode' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {referralTypes.find(type => type.id === newReferral.referralTypeId)?.methods.map(method => (
                      <option key={method} value={method}>{method.charAt(0).toUpperCase() + method.slice(1)}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseAddReferralModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddReferral}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!selectedReferrerCustomer || !newReferral.referredIdentifier.trim() || !newReferral.referralTypeId || !newReferral.method}
              >
                Adicionar Indicação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referrals;
