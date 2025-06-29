/*
  # Fix missing database tables and relationships

  1. New Tables
    - Ensure `point_movements` table exists with proper structure
    - Verify all foreign key relationships are properly established
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    
  3. Indexes
    - Add performance indexes for frequently queried columns
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create or update customer_levels table
CREATE TABLE IF NOT EXISTS customer_levels (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  color text DEFAULT '#3B82F6',
  icon text DEFAULT 'award',
  order_position integer DEFAULT 1,
  min_points integer DEFAULT 0,
  min_purchase_value numeric(10,2) DEFAULT 0,
  timeframe_days integer DEFAULT 0,
  points_multiplier numeric(3,2) DEFAULT 1.0,
  referral_bonus numeric(3,2) DEFAULT 1.0,
  free_shipping boolean DEFAULT false,
  exclusive_events boolean DEFAULT false,
  custom_rewards jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create or update customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  document text UNIQUE NOT NULL,
  points integer DEFAULT 0,
  level_id uuid NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
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

-- Create point_movements table
CREATE TABLE IF NOT EXISTS point_movements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id uuid NOT NULL,
  customer_document text NOT NULL,
  type text NOT NULL CHECK (type IN ('earn', 'redeem', 'expire', 'admin_adjust', 'referral', 'refund')),
  points integer NOT NULL,
  description text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  reference text,
  coupon_code text,
  created_at timestamptz DEFAULT now()
);

-- Create referral_types table
CREATE TABLE IF NOT EXISTS referral_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT 'user-plus',
  color text DEFAULT '#3B82F6',
  is_active boolean DEFAULT true,
  methods jsonb DEFAULT '["email"]'::jsonb,
  referrer_reward jsonb DEFAULT '{}'::jsonb,
  referred_reward jsonb DEFAULT '{}'::jsonb,
  conditions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id uuid NOT NULL,
  referrer_document text NOT NULL,
  referred_id uuid,
  referred_document text,
  referred_identifier text NOT NULL,
  referred_identifier_type text NOT NULL CHECK (referred_identifier_type IN ('email', 'phone')),
  referral_type_id uuid NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected')),
  date date DEFAULT CURRENT_DATE,
  method text NOT NULL CHECK (method IN ('email', 'whatsapp', 'sms', 'qrcode')),
  validated_date date,
  rejected_reason text,
  purchase_value numeric(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  points_cost integer NOT NULL,
  type text NOT NULL CHECK (type IN ('discount', 'product', 'service', 'custom')),
  value numeric(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  expiration_days integer DEFAULT 30,
  image_url text,
  conditions jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('product', 'period')),
  multiplier numeric(3,2) DEFAULT 1.0,
  start_date date NOT NULL,
  end_date date NOT NULL,
  products jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  widget jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company jsonb DEFAULT '{}'::jsonb,
  program jsonb DEFAULT '{}'::jsonb,
  notifications jsonb DEFAULT '{}'::jsonb,
  validation jsonb DEFAULT '{}'::jsonb,
  terms text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraints
DO $$
BEGIN
  -- Add foreign key from customers to customer_levels
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'customers_level_id_fkey'
  ) THEN
    ALTER TABLE customers 
    ADD CONSTRAINT customers_level_id_fkey 
    FOREIGN KEY (level_id) REFERENCES customer_levels(id);
  END IF;

  -- Add foreign key from point_movements to customers
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'point_movements_customer_id_fkey'
  ) THEN
    ALTER TABLE point_movements 
    ADD CONSTRAINT point_movements_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES customers(id);
  END IF;

  -- Add foreign key from referrals to customers (referrer)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'referrals_referrer_id_fkey'
  ) THEN
    ALTER TABLE referrals 
    ADD CONSTRAINT referrals_referrer_id_fkey 
    FOREIGN KEY (referrer_id) REFERENCES customers(id);
  END IF;

  -- Add foreign key from referrals to customers (referred)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'referrals_referred_id_fkey'
  ) THEN
    ALTER TABLE referrals 
    ADD CONSTRAINT referrals_referred_id_fkey 
    FOREIGN KEY (referred_id) REFERENCES customers(id);
  END IF;

  -- Add foreign key from referrals to referral_types
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'referrals_referral_type_id_fkey'
  ) THEN
    ALTER TABLE referrals 
    ADD CONSTRAINT referrals_referral_type_id_fkey 
    FOREIGN KEY (referral_type_id) REFERENCES referral_types(id);
  END IF;
END $$;

-- Create indexes for better performance
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

-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_customer_levels_updated_at ON customer_levels;
CREATE TRIGGER update_customer_levels_updated_at
  BEFORE UPDATE ON customer_levels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_referral_types_updated_at ON referral_types;
CREATE TRIGGER update_referral_types_updated_at
  BEFORE UPDATE ON referral_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_referrals_updated_at ON referrals;
CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rewards_updated_at ON rewards;
CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON rewards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE customer_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Allow authenticated users full access to customer_levels"
  ON customer_levels FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to customers"
  ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to point_movements"
  ON point_movements FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to referral_types"
  ON referral_types FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to referrals"
  ON referrals FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to rewards"
  ON rewards FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to campaigns"
  ON campaigns FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to settings"
  ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);