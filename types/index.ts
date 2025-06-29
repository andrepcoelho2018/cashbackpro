export interface Customer {
  id: string;
  firstName: string; // Nome
  lastName: string;  // Sobrenome
  email: string;
  phone: string;
  document: string; // CPF - Chave Primária
  points: number;
  level: CustomerLevel;
  status: 'active' | 'inactive';
  registrationDate: string;
  lastPurchase?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  preferences?: {
    products: string[];
    brands: string[];
    services: string[];
    hairColor?: string;
  };
  // Campos para validação de chaves
  emailVerified: boolean;
  phoneVerified: boolean;
  documentVerified: boolean;
}

export interface CustomerLevel {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  requirements: {
    minPoints?: number;
    minPurchaseValue?: number;
    timeframe?: number; // days
  };
  benefits: {
    pointsMultiplier: number;
    referralBonus: number;
    freeShipping: boolean;
    exclusiveEvents: boolean;
    customRewards: string[];
  };
}

export interface PointMovement {
  id: string;
  customerId: string;
  customerDocument: string; // CPF para referência rápida
  type: 'earn' | 'redeem' | 'expire' | 'admin_adjust' | 'referral' | 'refund';
  points: number;
  description: string;
  date: string;
  reference?: string;
  couponCode?: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'product' | 'service' | 'custom';
  value: number;
  isActive: boolean;
  expirationDays?: number;
  image?: string;
  conditions?: {
    minLevel?: string;
    maxUsesPerCustomer?: number;
    requiresVerification?: boolean;
  };
}

export interface Campaign {
  id: string;
  name: string;
  type: 'product' | 'period';
  multiplier: number;
  startDate: string;
  endDate: string;
  products?: string[];
  isActive: boolean;
  widget: {
    icon?: string;
    title: string;
    description: string;
    actionButton?: {
      text: string;
      url: string;
    };
  };
}

export interface ReferralType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  methods: ('email' | 'whatsapp' | 'sms' | 'qrcode')[];
  referrerReward: {
    type: 'fixed' | 'percentage' | 'points' | 'gift';
    value: number;
    description: string;
  };
  referredReward: {
    type: 'fixed' | 'percentage' | 'points' | 'gift';
    value: number;
    description: string;
  };
  conditions?: {
    minPurchaseValue?: number;
    validityDays?: number;
    maxReferrals?: number;
    requiresFirstPurchase?: boolean;
  };
}

export interface Referral {
  id: string;
  referrerId: string;
  referrerDocument: string; // CPF do indicador
  referredId: string;
  referredDocument: string; // CPF do indicado
  referredIdentifier: string; // Email ou telefone usado na indicação
  referredIdentifierType: 'email' | 'phone';
  referralTypeId: string;
  status: 'pending' | 'validated' | 'rejected';
  date: string;
  method: 'email' | 'whatsapp' | 'sms' | 'qrcode';
  validatedDate?: string;
  rejectedReason?: string;
  purchaseValue?: number;
}

export interface CustomerValidation {
  document: string; // CPF
  email?: string;
  phone?: string;
  isValid: boolean;
  conflicts?: {
    duplicateDocument?: boolean;
    duplicateEmail?: boolean;
    duplicatePhone?: boolean;
    existingCustomer?: Customer;
  };
}

export interface Settings {
  company: {
    name: string;
    logo?: string;
    website: string;
    address: string;
  };
  program: {
    name: string;
    primaryColor: string;
    secondaryColor: string;
    font: string;
    pointsPerReal: number;
    minPurchaseValue: number;
    pointsExpiration: {
      enabled: boolean;
      days: number;
      notifyDaysBefore: number;
    };
  };
  notifications: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
  };
  validation: {
    requireCpfValidation: boolean;
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
    allowDuplicateEmail: boolean;
    allowDuplicatePhone: boolean;
  };
  terms: string;
}