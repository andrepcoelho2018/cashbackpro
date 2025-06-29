import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Customer, CustomerLevel, PointMovement, Reward, Campaign, Referral, ReferralType, Settings, CustomerValidation } from '../types';

interface AppContextType {
  customers: Customer[];
  levels: CustomerLevel[];
  movements: PointMovement[];
  rewards: Reward[];
  campaigns: Campaign[];
  referrals: Referral[];
  referralTypes: ReferralType[];
  settings: Settings;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const mockLevels: CustomerLevel[] = [
  {
    id: '1',
    name: 'Bronze',
    color: '#CD7F32',
    icon: 'award',
    order: 1,
    requirements: { minPoints: 0 },
    benefits: {
      pointsMultiplier: 1,
      referralBonus: 1,
      freeShipping: false,
      exclusiveEvents: false,
      customRewards: []
    }
  },
  {
    id: '2',
    name: 'Prata',
    color: '#C0C0C0',
    icon: 'star',
    order: 2,
    requirements: { minPoints: 1000 },
    benefits: {
      pointsMultiplier: 1.5,
      referralBonus: 1.5,
      freeShipping: false,
      exclusiveEvents: true,
      customRewards: ['10% desconto aniversário']
    }
  },
  {
    id: '3',
    name: 'Ouro',
    color: '#FFD700',
    icon: 'crown',
    order: 3,
    requirements: { minPoints: 2500 },
    benefits: {
      pointsMultiplier: 2,
      referralBonus: 2,
      freeShipping: true,
      exclusiveEvents: true,
      customRewards: ['Frete grátis', 'Eventos exclusivos']
    }
  }
];

const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'Maria',
    lastName: 'Silva',
    email: 'maria@email.com',
    phone: '+55 11 99999-9999',
    document: '123.456.789-00',
    points: 1250,
    level: mockLevels[1],
    status: 'active',
    registrationDate: '2024-01-15',
    lastPurchase: '2024-01-20',
    emailVerified: true,
    phoneVerified: true,
    documentVerified: true
  },
  {
    id: '2',
    firstName: 'João',
    lastName: 'Santos',
    email: 'joao@email.com',
    phone: '+55 11 88888-8888',
    document: '987.654.321-00',
    points: 3500,
    level: mockLevels[2],
    status: 'active',
    registrationDate: '2023-12-10',
    lastPurchase: '2024-01-18',
    emailVerified: true,
    phoneVerified: false,
    documentVerified: true
  },
  {
    id: '3',
    firstName: 'Ana',
    lastName: 'Costa',
    email: 'ana@email.com',
    phone: '+55 11 77777-7777',
    document: '456.789.123-00',
    points: 750,
    level: mockLevels[0],
    status: 'active',
    registrationDate: '2024-01-10',
    emailVerified: false,
    phoneVerified: true,
    documentVerified: true
  }
];

const mockMovements: PointMovement[] = [
  {
    id: '1',
    customerId: '1',
    customerDocument: '123.456.789-00',
    type: 'earn',
    points: 250,
    description: 'Compra no valor de R$ 250,00',
    date: '2024-01-20',
    reference: 'PED-001'
  },
  {
    id: '2',
    customerId: '1',
    customerDocument: '123.456.789-00',
    type: 'redeem',
    points: -100,
    description: 'Resgate: Desconto de R$ 10,00',
    date: '2024-01-19',
    reference: 'RES-001',
    couponCode: 'DESC10-ABCD'
  }
];

const mockRewards: Reward[] = [
  {
    id: '1',
    name: 'Desconto R$ 10',
    description: 'Desconto de R$ 10,00 em compras acima de R$ 50,00',
    pointsCost: 100,
    type: 'discount',
    value: 10,
    isActive: true,
    expirationDays: 30,
    conditions: {
      requiresVerification: true
    }
  },
  {
    id: '2',
    name: 'Frete Grátis',
    description: 'Frete grátis para qualquer compra',
    pointsCost: 200,
    type: 'service',
    value: 0,
    isActive: true,
    expirationDays: 15,
    conditions: {
      minLevel: '2',
      maxUsesPerCustomer: 3
    }
  }
];

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Pontos Dobrados - Janeiro',
    type: 'period',
    multiplier: 2,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    isActive: true,
    widget: {
      title: 'Pontos em Dobro!',
      description: 'Ganhe pontos em dobro em Janeiro',
      actionButton: {
        text: 'Comprar Agora',
        url: '/loja'
      }
    }
  }
];

const mockReferralTypes: ReferralType[] = [
  {
    id: '1',
    name: 'Indicação Básica',
    description: 'Indicação padrão para novos clientes',
    icon: 'user-plus',
    color: '#3B82F6',
    isActive: true,
    methods: ['email', 'whatsapp', 'sms'],
    referrerReward: {
      type: 'points',
      value: 500,
      description: '500 pontos por indicação validada'
    },
    referredReward: {
      type: 'points',
      value: 250,
      description: '250 pontos de boas-vindas'
    },
    conditions: {
      requiresFirstPurchase: true,
      validityDays: 30
    }
  },
  {
    id: '2',
    name: 'Indicação Premium',
    description: 'Para clientes VIP com recompensas maiores',
    icon: 'crown',
    color: '#FFD700',
    isActive: true,
    methods: ['email', 'whatsapp', 'qrcode'],
    referrerReward: {
      type: 'fixed',
      value: 50,
      description: 'R$ 50,00 em crédito na loja'
    },
    referredReward: {
      type: 'percentage',
      value: 20,
      description: '20% de desconto na primeira compra'
    },
    conditions: {
      minPurchaseValue: 200,
      requiresFirstPurchase: true,
      validityDays: 60,
      maxReferrals: 5
    }
  }
];

const mockReferrals: Referral[] = [
  {
    id: '1',
    referrerId: '1',
    referrerDocument: '123.456.789-00',
    referredId: '2',
    referredDocument: '987.654.321-00',
    referredIdentifier: 'joao@email.com',
    referredIdentifierType: 'email',
    referralTypeId: '1',
    status: 'validated',
    date: '2024-01-10',
    method: 'email',
    validatedDate: '2024-01-15',
    purchaseValue: 150
  },
  {
    id: '2',
    referrerId: '1',
    referrerDocument: '123.456.789-00',
    referredId: '3',
    referredDocument: '456.789.123-00',
    referredIdentifier: '+55 11 77777-7777',
    referredIdentifierType: 'phone',
    referralTypeId: '2',
    status: 'pending',
    date: '2024-01-18',
    method: 'whatsapp'
  }
];

const mockSettings: Settings = {
  company: {
    name: 'Loja Exemplo',
    website: 'https://lojaexemplo.com',
    address: 'Rua das Flores, 123 - São Paulo, SP'
  },
  program: {
    name: 'Programa Fidelidade',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    font: 'Inter',
    pointsPerReal: 1,
    minPurchaseValue: 50,
    pointsExpiration: {
      enabled: true,
      days: 365,
      notifyDaysBefore: 30
    }
  },
  notifications: {
    email: true,
    whatsapp: true,
    sms: false
  },
  validation: {
    requireCpfValidation: true,
    requireEmailVerification: false,
    requirePhoneVerification: false,
    allowDuplicateEmail: false,
    allowDuplicatePhone: true
  },
  terms: 'Termos e condições do programa de fidelidade...'
};

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

// Função para obter nome completo
const getFullName = (customer: Customer): string => {
  return `${customer.firstName} ${customer.lastName}`.trim();
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [levels] = useState<CustomerLevel[]>(mockLevels);
  const [movements, setMovements] = useState<PointMovement[]>(mockMovements);
  const [rewards] = useState<Reward[]>(mockRewards);
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [referrals] = useState<Referral[]>(mockReferrals);
  const [referralTypes, setReferralTypes] = useState<ReferralType[]>(mockReferralTypes);
  const [settings, setSettings] = useState<Settings>(mockSettings);

  const findCustomerByDocument = (document: string): Customer | undefined => {
    const cleanDocument = document.replace(/[^\d]/g, '');
    return customers.find(customer => 
      customer.document.replace(/[^\d]/g, '') === cleanDocument
    );
  };

  const findCustomerByEmail = (email: string): Customer | undefined => {
    return customers.find(customer => 
      customer.email.toLowerCase() === email.toLowerCase()
    );
  };

  const findCustomerByPhone = (phone: string): Customer | undefined => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    return customers.find(customer => 
      customer.phone.replace(/[^\d]/g, '') === cleanPhone
    );
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

  const addCustomer = (customerData: Omit<Customer, 'id'>): Customer | null => {
    const validation = validateCustomer(customerData.document, customerData.email, customerData.phone);
    
    if (!validation.isValid) {
      return null;
    }

    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      document: formatCPF(customerData.document),
      emailVerified: false,
      phoneVerified: false,
      documentVerified: settings.validation.requireCpfValidation
    };

    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updatedCustomer: Partial<Customer>) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === id ? { ...customer, ...updatedCustomer } : customer
      )
    );
  };

  const addMovement = (movement: Omit<PointMovement, 'id'>) => {
    const customer = customers.find(c => c.id === movement.customerId);
    const newMovement: PointMovement = {
      ...movement,
      id: Date.now().toString(),
      customerDocument: customer?.document || ''
    };
    setMovements(prev => [newMovement, ...prev]);
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addReferralType = (referralType: Omit<ReferralType, 'id'>) => {
    const newReferralType: ReferralType = {
      ...referralType,
      id: Date.now().toString()
    };
    setReferralTypes(prev => [...prev, newReferralType]);
  };

  const updateReferralType = (id: string, updatedReferralType: Partial<ReferralType>) => {
    setReferralTypes(prev =>
      prev.map(type =>
        type.id === id ? { ...type, ...updatedReferralType } : type
      )
    );
  };

  const deleteReferralType = (id: string) => {
    setReferralTypes(prev => prev.filter(type => type.id !== id));
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
      addCustomer
    }}>
      {children}
    </AppContext.Provider>
  );
};