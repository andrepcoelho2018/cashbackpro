/*
  # Sistema de Fidelidade - Schema Completo

  1. Tabelas Principais
    - `customer_levels` - Níveis de clientes (Bronze, Prata, Ouro)
    - `customers` - Dados dos clientes com CPF como chave primária
    - `point_movements` - Histórico de movimentações de pontos
    - `rewards` - Catálogo de recompensas disponíveis
    - `referral_types` - Tipos de indicação configuráveis
    - `referrals` - Registro de indicações entre clientes
    - `campaigns` - Campanhas promocionais
    - `settings` - Configurações do sistema

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas para usuários autenticados

  3. Índices
    - Otimização para consultas frequentes por CPF, email e telefone
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de níveis de clientes
CREATE TABLE IF NOT EXISTS customer_levels (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6',
  icon text NOT NULL DEFAULT 'award',
  order_position integer NOT NULL DEFAULT 1,
  min_points integer DEFAULT 0,
  min_purchase_value decimal(10,2) DEFAULT 0,
  timeframe_days integer DEFAULT 0,
  points_multiplier decimal(3,2) NOT NULL DEFAULT 1.0,
  referral_bonus decimal(3,2) NOT NULL DEFAULT 1.0,
  free_shipping boolean DEFAULT false,
  exclusive_events boolean DEFAULT false,
  custom_rewards jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  document text NOT NULL UNIQUE, -- CPF como chave primária
  points integer NOT NULL DEFAULT 0,
  level_id uuid REFERENCES customer_levels(id) NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  registration_date date DEFAULT CURRENT_DATE,
  last_purchase date,
  address jsonb,
  preferences jsonb,
  email_verified boolean DEFAULT false,
  phone_verified boolean DEFAULT false,
  document_verified boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de movimentações de pontos
CREATE TABLE IF NOT EXISTS point_movements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid REFERENCES customers(id) NOT NULL,
  customer_document text NOT NULL, -- CPF para referência rápida
  type text NOT NULL CHECK (type IN ('earn', 'redeem', 'expire', 'admin_adjust', 'referral', 'refund')),
  points integer NOT NULL,
  description text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  reference text,
  coupon_code text,
  created_at timestamptz DEFAULT now()
);

-- Tabela de recompensas
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  points_cost integer NOT NULL,
  type text NOT NULL CHECK (type IN ('discount', 'product', 'service', 'custom')),
  value decimal(10,2) NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  expiration_days integer DEFAULT 30,
  image_url text,
  conditions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de tipos de indicação
CREATE TABLE IF NOT EXISTS referral_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'user-plus',
  color text NOT NULL DEFAULT '#3B82F6',
  is_active boolean DEFAULT true,
  methods jsonb NOT NULL DEFAULT '["email"]'::jsonb,
  referrer_reward jsonb NOT NULL DEFAULT '{}'::jsonb,
  referred_reward jsonb NOT NULL DEFAULT '{}'::jsonb,
  conditions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de indicações
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id uuid REFERENCES customers(id) NOT NULL,
  referrer_document text NOT NULL,
  referred_id uuid REFERENCES customers(id),
  referred_document text,
  referred_identifier text NOT NULL, -- Email ou telefone usado na indicação
  referred_identifier_type text NOT NULL CHECK (referred_identifier_type IN ('email', 'phone')),
  referral_type_id uuid REFERENCES referral_types(id) NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected')),
  date date DEFAULT CURRENT_DATE,
  method text NOT NULL CHECK (method IN ('email', 'whatsapp', 'sms', 'qrcode')),
  validated_date date,
  rejected_reason text,
  purchase_value decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de campanhas
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('product', 'period')),
  multiplier decimal(3,2) NOT NULL DEFAULT 1.0,
  start_date date NOT NULL,
  end_date date NOT NULL,
  products jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  widget jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company jsonb NOT NULL DEFAULT '{}'::jsonb,
  program jsonb NOT NULL DEFAULT '{}'::jsonb,
  notifications jsonb NOT NULL DEFAULT '{}'::jsonb,
  validation jsonb NOT NULL DEFAULT '{}'::jsonb,
  terms text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_customers_document ON customers(document);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_level_id ON customers(level_id);
CREATE INDEX IF NOT EXISTS idx_point_movements_customer_id ON point_movements(customer_id);
CREATE INDEX IF NOT EXISTS idx_point_movements_date ON point_movements(date);
CREATE INDEX IF NOT EXISTS idx_point_movements_type ON point_movements(type);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(status);

-- Habilitar RLS
ALTER TABLE customer_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (permitir acesso para usuários autenticados)
CREATE POLICY "Allow authenticated users full access to customer_levels"
  ON customer_levels FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to customers"
  ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to point_movements"
  ON point_movements FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to rewards"
  ON rewards FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to referral_types"
  ON referral_types FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to referrals"
  ON referrals FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to campaigns"
  ON campaigns FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to settings"
  ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_customer_levels_updated_at BEFORE UPDATE ON customer_levels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referral_types_updated_at BEFORE UPDATE ON referral_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();