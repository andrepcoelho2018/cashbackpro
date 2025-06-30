import React, { createContext, useContext, ReactNode } from 'react';
import { Customer, CustomerLevel, CustomerValidation } from '../types';
import { useCustomers, useSupabaseTable } from '../hooks/useSupabase';

interface CustomerContextType {
  customers: Customer[];
  levels: CustomerLevel[];
  loading: boolean;
  error: string | null;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer | null;
  validateCustomer: (document: string, email?: string, phone?: string) => CustomerValidation;
  findCustomerByDocument: (document: string) => Customer | undefined;
  findCustomerByEmail: (email: string) => Customer | undefined;
  findCustomerByPhone: (phone: string) => Customer | undefined;
  addLevel: (level: Omit<CustomerLevel, 'id'>) => void;
  updateLevel: (id: string, level: Partial<CustomerLevel>) => void;
  deleteLevel: (id: string) => void;
  clearCustomers: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomerContext must be used within a CustomerProvider');
  }
  return context;
};

// Mock levels as fallback
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

// Validation functions
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

const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Transform functions
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

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { 
    customers: dbCustomers, 
    loading: customersLoading, 
    error: customersError,
    addCustomer: addCustomerDB,
    updateCustomer: updateCustomerDB,
    findCustomerByDocument: findCustomerByDocumentDB,
    findCustomerByEmail: findCustomerByEmailDB,
    findCustomerByPhone: findCustomerByPhoneDB,
    clearCustomers
  } = useCustomers();

  const { 
    data: dbLevels, 
    loading: levelsLoading, 
    error: levelsError,
    insert: insertLevel,
    update: updateLevelDB,
    remove: removeLevel
  } = useSupabaseTable('customer_levels');

  const customers: Customer[] = dbCustomers.map(transformCustomerFromDB);
  const levels: CustomerLevel[] = dbLevels.length > 0 ? dbLevels.map(transformLevelFromDB) : mockLevels;
  
  const loading = customersLoading || levelsLoading;
  const error = customersError || levelsError;

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

    const existingByDocument = findCustomerByDocument(cleanDocument);
    if (existingByDocument) {
      conflicts.duplicateDocument = true;
      conflicts.existingCustomer = existingByDocument;
      hasConflicts = true;
    }

    return {
      document: formatCPF(cleanDocument),
      email,
      phone,
      isValid: !hasConflicts,
      conflicts: hasConflicts ? conflicts : undefined
    };
  };

  const addCustomer = async (customerData: Omit<Customer, 'id'>): Promise<Customer | null> => {
    const validation = validateCustomer(customerData.document, customerData.email, customerData.phone);
    
    if (!validation.isValid) {
      return null;
    }

    try {
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
    const customersWithLevel = customers.filter(customer => customer.level.id === id);
    if (customersWithLevel.length > 0) {
      alert(`Não é possível deletar este nível pois há ${customersWithLevel.length} cliente(s) associado(s) a ele.`);
      return;
    }

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

  return (
    <CustomerContext.Provider value={{
      customers,
      levels,
      loading,
      error,
      updateCustomer,
      addCustomer,
      validateCustomer,
      findCustomerByDocument,
      findCustomerByEmail,
      findCustomerByPhone,
      addLevel,
      updateLevel,
      deleteLevel,
      clearCustomers
    }}>
      {children}
    </CustomerContext.Provider>
  );
};