import React, { createContext, useContext, ReactNode } from 'react';
import { Customer, CustomerLevel, PointMovement, Reward, Campaign, Referral, ReferralType, Settings, CustomerValidation } from '../types';
import { useSupabaseTable, useCustomers, usePointMovements } from '../hooks/useSupabase';

interface AppContextType {
  customers: Customer[];
  levels: CustomerLevel[];
  movements: PointMovement[];
  rewards: Reward[];
  campaigns: Campaign[];
  referrals: Referral[];
  referralTypes: ReferralType[];
  settings: Settings;
  loading: boolean;
  error: string | null;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  addMovement: (movement: Omit<PointMovement, 'id'>) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addReferralType: (referralType: Omit<ReferralType, 'id'>) => void;
  updateReferralType: (id: string, referralType: Partial<ReferralType>) => void;
  deleteReferralType: (id: string) => void;
  validateCustomer: (document: string, email?: string, phone?: string) => CustomerValidation;
  findCustomerByDocument: (document: string) => Customer | undefined;
  findCustomerByEmail: (email: string) => Customer | undefined;
  findCustomerByPhone: (phone: string) => Customer | undefined;
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer | null;
  // Funções para níveis
  addLevel: (level: Omit<CustomerLevel, 'id'>) => void;
  updateLevel: (id: string, level: Partial<CustomerLevel>) => void;
  deleteLevel: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Mock levels como fallback
const mockLevels: CustomerLevel[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Bronze',
    color: '#CD7F32',
    icon: 'award',
    order: 1,
    requirements: {
      minPoints: 0,
      minPurchaseValue: 0,
      timeframe: 0
    },
    benefits: {
      pointsMultiplier: 1.0,
      referralBonus: 1.0,
      freeShipping: false,
      exclusiveEvents: false,
      customRewards: []
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Prata',
    color: '#C0C0C0',
    icon: 'star',
    order: 2,
    requirements: {
      minPoints: 1000,
      minPurchaseValue: 500,
      timeframe: 365
    },
    benefits: {
      pointsMultiplier: 1.2,
      referralBonus: 1.5,
      freeShipping: true,
      exclusiveEvents: false,
      customRewards: []
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Ouro',
    color: '#FFD700',
    icon: 'crown',
    order: 3,
    requirements: {
      minPoints: 5000,
      minPurchaseValue: 2000,
      timeframe: 365
    },
    benefits: {
      pointsMultiplier: 1.5,
      referralBonus: 2.0,
      freeShipping: true,
      exclusiveEvents: true,
      customRewards: []
    }
  }
];

// Função para validar CPF
const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

// Função para formatar CPF
const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Função para transformar dados do Supabase para o formato da aplicação
const transformCustomerFromDB = (dbCustomer: any): Customer => ({
  id: dbCustomer.id,
  firstName: dbCustomer.first_name,
  lastName: dbCustomer.last_name,
  email: dbCustomer.email,
  phone: dbCustomer.phone,
  document: dbCustomer.document,
  points: dbCustomer.points,
  level: transformLevelFromDB(dbCustomer.level),
  status: dbCustomer.status,
  registrationDate: dbCustomer.registration_date,
  lastPurchase: dbCustomer.last_purchase,
  address: dbCustomer.address,
  preferences: dbCustomer.preferences,
  emailVerified: dbCustomer.email_verified,
  phoneVerified: dbCustomer.phone_verified,
  documentVerified: dbCustomer.document_verified
});

const transformLevelFromDB = (dbLevel: any): CustomerLevel => ({
  id: dbLevel.id,
  name: dbLevel.name,
  color: dbLevel.color,
  icon: dbLevel.icon,
  order: dbLevel.order_position,
  requirements: {
    minPoints: dbLevel.min_points,
    minPurchaseValue: dbLevel.min_purchase_value,
    timeframe: dbLevel.timeframe_days
  },
  benefits: {
    pointsMultiplier: dbLevel.points_multiplier,
    referralBonus: dbLevel.referral_bonus,
    freeShipping: dbLevel.free_shipping,
    exclusiveEvents: dbLevel.exclusive_events,
    customRewards: dbLevel.custom_rewards || []
  }
});

const transformMovementFromDB = (dbMovement: any): PointMovement => ({
  id: dbMovement.id,
  customerId: dbMovement.customer_id,
  customerDocument: dbMovement.customer_document,
  type: dbMovement.type,
  points: dbMovement.points,
  description: dbMovement.description,
  date: dbMovement.date,
  reference: dbMovement.reference,
  couponCode: dbMovement.coupon_code
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Hooks do Supabase
  const { 
    customers: dbCustomers, 
    loading: customersLoading, 
    error: customersError,
    addCustomer: addCustomerDB,
    updateCustomer: updateCustomerDB,
    findCustomerByDocument: findCustomerByDocumentDB,
    findCustomerByEmail: findCustomerByEmailDB,
    findCustomerByPhone: findCustomerByPhoneDB
  } = useCustomers();

  const { 
    data: dbLevels, 
    loading: levelsLoading, 
    error: levelsError,
    insert: insertLevel,
    update: updateLevelDB,
    remove: removeLevel
  } = useSupabaseTable('customer_levels');

  const { 
    movements: dbMovements, 
    loading: movementsLoading, 
    error: movementsError,
    addMovement: addMovementDB
  } = usePointMovements();

  const { 
    data: dbRewards, 
    loading: rewardsLoading, 
    error: rewardsError 
  } = useSupabaseTable('rewards');

  const { 
    data: dbCampaigns, 
    loading: campaignsLoading, 
    error: campaignsError 
  } = useSupabaseTable('campaigns');

  const { 
    data: dbReferrals, 
    loading: referralsLoading, 
    error: referralsError 
  } = useSupabaseTable('referrals');

  const { 
    data: dbReferralTypes, 
    loading: referralTypesLoading, 
    error: referralTypesError,
    insert: insertReferralType,
    update: updateReferralTypeDB,
    remove: removeReferralType
  } = useSupabaseTable('referral_types');

  const { 
    data: dbSettings, 
    loading: settingsLoading, 
    error: settingsError,
    update: updateSettingsDB
  } = useSupabaseTable('settings');

  // Transformar dados do banco para o formato da aplicação
  const customers: Customer[] = dbCustomers.map(transformCustomerFromDB);
  
  // Use mock levels as fallback if database levels are empty
  const levels: CustomerLevel[] = dbLevels.length > 0 ? dbLevels.map(transformLevelFromDB) : mockLevels;
  
  const movements: PointMovement[] = dbMovements.map(transformMovementFromDB);
  
  const rewards: Reward[] = dbRewards.map(reward => ({
    id: reward.id,
    name: reward.name,
    description: reward.description,
    pointsCost: reward.points_cost,
    type: reward.type,
    value: reward.value,
    isActive: reward.is_active,
    expirationDays: reward.expiration_days,
    image: reward.image_url,
    conditions: reward.conditions
  }));

  const campaigns: Campaign[] = dbCampaigns.map(campaign => ({
    id: campaign.id,
    name: campaign.name,
    type: campaign.type,
    multiplier: campaign.multiplier,
    startDate: campaign.start_date,
    endDate: campaign.end_date,
    products: campaign.products,
    isActive: campaign.is_active,
    widget: campaign.widget
  }));

  const referrals: Referral[] = dbReferrals.map(referral => ({
    id: referral.id,
    referrerId: referral.referrer_id,
    referrerDocument: referral.referrer_document,
    referredId: referral.referred_id || '',
    referredDocument: referral.referred_document || '',
    referredIdentifier: referral.referred_identifier,
    referredIdentifierType: referral.referred_identifier_type,
    referralTypeId: referral.referral_type_id,
    status: referral.status,
    date: referral.date,
    method: referral.method,
    validatedDate: referral.validated_date,
    rejectedReason: referral.rejected_reason,
    purchaseValue: referral.purchase_value
  }));

  const referralTypes: ReferralType[] = dbReferralTypes.map(type => ({
    id: type.id,
    name: type.name,
    description: type.description,
    icon: type.icon,
    color: type.color,
    isActive: type.is_active,
    methods: type.methods as any,
    referrerReward: type.referrer_reward,
    referredReward: type.referred_reward,
    conditions: type.conditions
  }));

  const settings: Settings = dbSettings[0] ? {
    company: dbSettings[0].company,
    program: dbSettings[0].program,
    notifications: dbSettings[0].notifications,
    validation: dbSettings[0].validation,
    terms: dbSettings[0].terms
  } : {
    company: { name: '', website: '', address: '' },
    program: { 
      name: '', 
      primaryColor: '#3B82F6', 
      secondaryColor: '#10B981', 
      font: 'Inter', 
      pointsPerReal: 1, 
      minPurchaseValue: 50,
      pointsExpiration: { enabled: true, days: 365, notifyDaysBefore: 30 }
    },
    notifications: { email: true, whatsapp: true, sms: false },
    validation: { 
      requireCpfValidation: true, 
      requireEmailVerification: false, 
      requirePhoneVerification: false, 
      allowDuplicateEmail: false, 
      allowDuplicatePhone: true 
    },
    terms: ''
  };

  // Estado de loading geral
  const loading = customersLoading || levelsLoading || movementsLoading || 
                 rewardsLoading || campaignsLoading || referralsLoading || 
                 referralTypesLoading || settingsLoading;

  // Erro geral
  const error = customersError || levelsError || movementsError || 
               rewardsError || campaignsError || referralsError || 
               referralTypesError || settingsError;

  // Funções de validação
  const findCustomerByDocument = (document: string): Customer | undefined => {
    const dbCustomer = findCustomerByDocumentDB(document);
    return dbCustomer ? transformCustomerFromDB(dbCustomer) : undefined;
  };

  const findCustomerByEmail = (email: string): Customer | undefined => {
    const dbCustomer = findCustomerByEmailDB(email);
    return dbCustomer ? transformCustomerFromDB(dbCustomer) : undefined;
  };

  const findCustomerByPhone = (phone: string): Customer | undefined => {
    const dbCustomer = findCustomerByPhoneDB(phone);
    return dbCustomer ? transformCustomerFromDB(dbCustomer) : undefined;
  };

  const validateCustomer = (document: string, email?: string, phone?: string): CustomerValidation => {
    const cleanDocument = document.replace(/[^\d]/g, '');
    
    // Validar CPF
    if (!validateCPF(cleanDocument)) {
      return {
        document: formatCPF(cleanDocument),
        email,
        phone,
        isValid: false,
        conflicts: { duplicateDocument: false }
      };
    }

    const conflicts: CustomerValidation['conflicts'] = {};
    let hasConflicts = false;

    // Verificar CPF duplicado
    const existingByDocument = findCustomerByDocument(cleanDocument);
    if (existingByDocument) {
      conflicts.duplicateDocument = true;
      conflicts.existingCustomer = existingByDocument;
      hasConflicts = true;
    }

    // Verificar email duplicado (se não permitido)
    if (email && !settings.validation.allowDuplicateEmail) {
      const existingByEmail = findCustomerByEmail(email);
      if (existingByEmail && existingByEmail.document !== formatCPF(cleanDocument)) {
        conflicts.duplicateEmail = true;
        if (!conflicts.existingCustomer) conflicts.existingCustomer = existingByEmail;
        hasConflicts = true;
      }
    }

    // Verificar telefone duplicado (se não permitido)
    if (phone && !settings.validation.allowDuplicatePhone) {
      const existingByPhone = findCustomerByPhone(phone);
      if (existingByPhone && existingByPhone.document !== formatCPF(cleanDocument)) {
        conflicts.duplicatePhone = true;
        if (!conflicts.existingCustomer) conflicts.existingCustomer = existingByPhone;
        hasConflicts = true;
      }
    }

    return {
      document: formatCPF(cleanDocument),
      email,
      phone,
      isValid: !hasConflicts,
      conflicts: hasConflicts ? conflicts : undefined
    };
  };

  // Funções CRUD
  const addCustomer = async (customerData: Omit<Customer, 'id'>): Promise<Customer | null> => {
    const validation = validateCustomer(customerData.document, customerData.email, customerData.phone);
    
    if (!validation.isValid) {
      return null;
    }

    try {
      // Ensure we have a valid level - use the first available level
      const defaultLevel = levels[0];
      if (!defaultLevel) {
        console.error('Nenhum nível disponível para atribuir ao cliente');
        return null;
      }

      const dbCustomer = await addCustomerDB({
        ...customerData,
        document: formatCPF(customerData.document),
        level: defaultLevel
      });
      return transformCustomerFromDB(dbCustomer);
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      return null;
    }
  };

  const updateCustomer = async (id: string, updatedCustomer: Partial<Customer>) => {
    try {
      await updateCustomerDB(id, updatedCustomer);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
    }
  };

  const addMovement = async (movement: Omit<PointMovement, 'id'>) => {
    try {
      await addMovementDB(movement);
    } catch (error) {
      console.error('Erro ao adicionar movimentação:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      if (dbSettings[0]) {
        await updateSettingsDB(dbSettings[0].id, {
          company: { ...settings.company, ...newSettings.company },
          program: { ...settings.program, ...newSettings.program },
          notifications: { ...settings.notifications, ...newSettings.notifications },
          validation: { ...settings.validation, ...newSettings.validation },
          terms: newSettings.terms || settings.terms
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
    }
  };

  // Funções para níveis
  const addLevel = async (levelData: Omit<CustomerLevel, 'id'>) => {
    try {
      await insertLevel({
        name: levelData.name,
        color: levelData.color,
        icon: levelData.icon,
        order_position: levelData.order,
        min_points: levelData.requirements.minPoints,
        min_purchase_value: levelData.requirements.minPurchaseValue,
        timeframe_days: levelData.requirements.timeframe,
        points_multiplier: levelData.benefits.pointsMultiplier,
        referral_bonus: levelData.benefits.referralBonus,
        free_shipping: levelData.benefits.freeShipping,
        exclusive_events: levelData.benefits.exclusiveEvents,
        custom_rewards: levelData.benefits.customRewards
      });
    } catch (error) {
      console.error('Erro ao adicionar nível:', error);
    }
  };

  const updateLevel = async (id: string, updatedLevel: Partial<CustomerLevel>) => {
    try {
      const updateData: any = {};
      
      if (updatedLevel.name) updateData.name = updatedLevel.name;
      if (updatedLevel.color) updateData.color = updatedLevel.color;
      if (updatedLevel.icon) updateData.icon = updatedLevel.icon;
      if (updatedLevel.order) updateData.order_position = updatedLevel.order;
      
      if (updatedLevel.requirements) {
        if (updatedLevel.requirements.minPoints !== undefined) updateData.min_points = updatedLevel.requirements.minPoints;
        if (updatedLevel.requirements.minPurchaseValue !== undefined) updateData.min_purchase_value = updatedLevel.requirements.minPurchaseValue;
        if (updatedLevel.requirements.timeframe !== undefined) updateData.timeframe_days = updatedLevel.requirements.timeframe;
      }
      
      if (updatedLevel.benefits) {
        if (updatedLevel.benefits.pointsMultiplier !== undefined) updateData.points_multiplier = updatedLevel.benefits.pointsMultiplier;
        if (updatedLevel.benefits.referralBonus !== undefined) updateData.referral_bonus = updatedLevel.benefits.referralBonus;
        if (updatedLevel.benefits.freeShipping !== undefined) updateData.free_shipping = updatedLevel.benefits.freeShipping;
        if (updatedLevel.benefits.exclusiveEvents !== undefined) updateData.exclusive_events = updatedLevel.benefits.exclusiveEvents;
        if (updatedLevel.benefits.customRewards !== undefined) updateData.custom_rewards = updatedLevel.benefits.customRewards;
      }

      await updateLevelDB(id, updateData);
    } catch (error) {
      console.error('Erro ao atualizar nível:', error);
    }
  };

  const deleteLevel = async (id: string) => {
    // Verificar se há clientes neste nível
    const customersWithLevel = customers.filter(customer => customer.level.id === id);
    if (customersWithLevel.length > 0) {
      alert(`Não é possível deletar este nível pois há ${customersWithLevel.length} cliente(s) associado(s) a ele.`);
      return;
    }

    // Verificar se é o último nível
    if (levels.length <= 1) {
      alert('Não é possível deletar o último nível. Deve haver pelo menos um nível ativo.');
      return;
    }

    try {
      await removeLevel(id);
    } catch (error) {
      console.error('Erro ao deletar nível:', error);
    }
  };

  // Funções para tipos de indicação
  const addReferralType = async (referralType: Omit<ReferralType, 'id'>) => {
    try {
      await insertReferralType({
        name: referralType.name,
        description: referralType.description,
        icon: referralType.icon,
        color: referralType.color,
        is_active: referralType.isActive,
        methods: referralType.methods,
        referrer_reward: referralType.referrerReward,
        referred_reward: referralType.referredReward,
        conditions: referralType.conditions
      });
    } catch (error) {
      console.error('Erro ao adicionar tipo de indicação:', error);
    }
  };

  const updateReferralType = async (id: string, updatedReferralType: Partial<ReferralType>) => {
    try {
      const updateData: any = {};
      
      if (updatedReferralType.name) updateData.name = updatedReferralType.name;
      if (updatedReferralType.description) updateData.description = updatedReferralType.description;
      if (updatedReferralType.icon) updateData.icon = updatedReferralType.icon;
      if (updatedReferralType.color) updateData.color = updatedReferralType.color;
      if (updatedReferralType.isActive !== undefined) updateData.is_active = updatedReferralType.isActive;
      if (updatedReferralType.methods) updateData.methods = updatedReferralType.methods;
      if (updatedReferralType.referrerReward) updateData.referrer_reward = updatedReferralType.referrerReward;
      if (updatedReferralType.referredReward) updateData.referred_reward = updatedReferralType.referredReward;
      if (updatedReferralType.conditions) updateData.conditions = updatedReferralType.conditions;

      await updateReferralTypeDB(id, updateData);
    } catch (error) {
      console.error('Erro ao atualizar tipo de indicação:', error);
    }
  };

  const deleteReferralType = async (id: string) => {
    try {
      await removeReferralType(id);
    } catch (error) {
      console.error('Erro ao deletar tipo de indicação:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      customers,
      levels,
      movements,
      rewards,
      campaigns,
      referrals,
      referralTypes,
      settings,
      loading,
      error,
      updateCustomer,
      addMovement,
      updateSettings,
      addReferralType,
      updateReferralType,
      deleteReferralType,
      validateCustomer,
      findCustomerByDocument,
      findCustomerByEmail,
      findCustomerByPhone,
      addCustomer,
      addLevel,
      updateLevel,
      deleteLevel
    }}>
      {children}
    </AppContext.Provider>
  );
};