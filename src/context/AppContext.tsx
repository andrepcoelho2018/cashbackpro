import React, { createContext, useContext, ReactNode } from 'react';
import { PointMovement, Reward, Campaign, Referral, ReferralType, Settings, Branch } from '../types';
import { useSupabaseTable, usePointMovements } from '../hooks/useSupabase';
import { CustomerProvider, useCustomerContext } from './CustomerContext';

interface AppContextType {
  movements: PointMovement[];
  rewards: Reward[];
  campaigns: Campaign[];
  referrals: Referral[];
  referralTypes: ReferralType[];
  branches: Branch[];
  settings: Settings;
  loading: boolean;
  error: string | null;
  addMovement: (movement: Omit<PointMovement, 'id'>) => void;
  addReferral: (referral: Omit<Referral, 'id'>) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  addReferralType: (referralType: Omit<ReferralType, 'id'>) => void;
  updateReferralType: (id: string, referralType: Partial<ReferralType>) => void;
  deleteReferralType: (id: string) => void;
  addBranch: (branch: Omit<Branch, 'id'>) => void;
  updateBranch: (id: string, branch: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Mock branches as fallback
const mockBranches: Branch[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440100',
    name: 'Filial Centro',
    code: 'FIL001',
    address: 'Rua das Flores, 123 - Centro - São Paulo, SP',
    phone: '(11) 3333-4444',
    email: 'centro@empresa.com',
    manager: 'João Silva',
    isActive: true,
    color: '#3B82F6',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    name: 'Filial Shopping',
    code: 'FIL002',
    address: 'Shopping Center, Loja 45 - Vila Madalena - São Paulo, SP',
    phone: '(11) 5555-6666',
    email: 'shopping@empresa.com',
    manager: 'Maria Santos',
    isActive: true,
    color: '#10B981',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const transformMovementFromDB = (dbMovement: any): PointMovement => ({
  id: dbMovement.id,
  customerId: dbMovement.customer_id,
  customerDocument: dbMovement.customer_document,
  branchId: dbMovement.branch_id,
  type: dbMovement.type,
  points: dbMovement.points,
  description: dbMovement.description,
  date: dbMovement.date,
  reference: dbMovement.reference,
  couponCode: dbMovement.coupon_code
});

const transformBranchFromDB = (dbBranch: any): Branch => ({
  id: dbBranch.id,
  name: dbBranch.name,
  code: dbBranch.code,
  address: dbBranch.address,
  phone: dbBranch.phone,
  email: dbBranch.email,
  manager: dbBranch.manager,
  isActive: dbBranch.is_active,
  color: dbBranch.color,
  created_at: dbBranch.created_at,
  updated_at: dbBranch.updated_at
});

const AppProviderInternal: React.FC<{ children: ReactNode }> = ({ children }) => {
  const customerContext = useCustomerContext();

  const { 
    movements: dbMovements, 
    loading: movementsLoading, 
    error: movementsError,
    addMovement: addMovementDB,
    clearMovements
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
    error: referralsError,
    insert: insertReferral
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
    data: dbBranches, 
    loading: branchesLoading, 
    error: branchesError,
    insert: insertBranch,
    update: updateBranchDB,
    remove: removeBranch
  } = useSupabaseTable('branches');

  const { 
    data: dbSettings, 
    loading: settingsLoading, 
    error: settingsError,
    update: updateSettingsDB
  } = useSupabaseTable('settings');

  const movements: PointMovement[] = dbMovements.map(transformMovementFromDB);
  const branches: Branch[] = dbBranches.length > 0 ? dbBranches.map(transformBranchFromDB) : mockBranches;
  
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
    company: { name: 'Loja Exemplo', website: 'https://lojaexemplo.com', address: 'Rua das Flores, 123 - São Paulo, SP' },
    program: { 
      name: 'Programa Fidelidade', 
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

  const loading = customerContext.loading || movementsLoading || 
                 rewardsLoading || campaignsLoading || referralsLoading || 
                 referralTypesLoading || branchesLoading || settingsLoading;

  const error = customerContext.error || movementsError || 
               rewardsError || campaignsError || referralsError || 
               referralTypesError || branchesError || settingsError;

  const addMovement = async (movement: Omit<PointMovement, 'id'>) => {
    try {
      if (!movement.branchId) {
        throw new Error('Filial é obrigatória para movimentações');
      }
      await addMovementDB(movement);
    } catch (error) {
      console.error('Erro ao adicionar movimentação:', error);
      throw error;
    }
  };

  const addReferral = async (referral: Omit<Referral, 'id'>) => {
    try {
      await insertReferral({
        referrer_id: referral.referrerId,
        referrer_document: referral.referrerDocument,
        referred_id: referral.referredId || null,
        referred_document: referral.referredDocument || null,
        referred_identifier: referral.referredIdentifier,
        referred_identifier_type: referral.referredIdentifierType,
        referral_type_id: referral.referralTypeId,
        status: referral.status,
        date: referral.date,
        method: referral.method,
        validated_date: referral.validatedDate || null,
        rejected_reason: referral.rejectedReason || null,
        purchase_value: referral.purchaseValue || null
      });
    } catch (error) {
      console.error('Erro ao adicionar indicação:', error);
      throw error;
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

  const addBranch = async (branchData: Omit<Branch, 'id'>) => {
    try {
      await insertBranch({
        name: branchData.name,
        code: branchData.code,
        address: branchData.address,
        phone: branchData.phone,
        email: branchData.email,
        manager: branchData.manager,
        is_active: branchData.isActive,
        color: branchData.color
      });
    } catch (error) {
      console.error('Erro ao adicionar filial:', error);
    }
  };

  const updateBranch = async (id: string, updatedBranch: Partial<Branch>) => {
    try {
      const updateData: any = {};
      
      if (updatedBranch.name) updateData.name = updatedBranch.name;
      if (updatedBranch.code) updateData.code = updatedBranch.code;
      if (updatedBranch.address) updateData.address = updatedBranch.address;
      if (updatedBranch.phone) updateData.phone = updatedBranch.phone;
      if (updatedBranch.email) updateData.email = updatedBranch.email;
      if (updatedBranch.manager) updateData.manager = updatedBranch.manager;
      if (updatedBranch.isActive !== undefined) updateData.is_active = updatedBranch.isActive;
      if (updatedBranch.color) updateData.color = updatedBranch.color;

      await updateBranchDB(id, updateData);
    } catch (error) {
      console.error('Erro ao atualizar filial:', error);
    }
  };

  const deleteBranch = async (id: string) => {
    try {
      await removeBranch(id);
    } catch (error) {
      console.error('Erro ao deletar filial:', error);
    }
  };

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

  const clearAllData = async () => {
    try {
      if (customerContext.clearCustomers) await customerContext.clearCustomers();
      if (clearMovements) await clearMovements();
      console.log('Todos os dados foram limpos com sucesso');
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      movements,
      rewards,
      campaigns,
      referrals,
      referralTypes,
      branches,
      settings,
      loading,
      error,
      addMovement,
      addReferral,
      updateSettings,
      addReferralType,
      updateReferralType,
      deleteReferralType,
      addBranch,
      updateBranch,
      deleteBranch,
      clearAllData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <CustomerProvider>
      <AppProviderInternal>
        {children}
      </AppProviderInternal>
    </CustomerProvider>
  );
};