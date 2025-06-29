/*
  # Insert default data for the loyalty program

  1. Default Data
    - Insert default customer level
    - Insert default settings
    - Insert sample referral type
    
  2. Notes
    - Only inserts data if tables are empty to avoid duplicates
*/

-- Insert default customer level if none exists
INSERT INTO customer_levels (name, color, icon, order_position, min_points, points_multiplier)
SELECT 'Bronze', '#CD7F32', 'award', 1, 0, 1.0
WHERE NOT EXISTS (SELECT 1 FROM customer_levels);

-- Insert default settings if none exists
INSERT INTO settings (company, program, notifications, validation, terms)
SELECT 
  '{"name": "", "website": "", "address": ""}'::jsonb,
  '{"name": "Programa de Fidelidade", "primaryColor": "#3B82F6", "secondaryColor": "#10B981", "font": "Inter", "pointsPerReal": 1, "minPurchaseValue": 50, "pointsExpiration": {"enabled": true, "days": 365, "notifyDaysBefore": 30}}'::jsonb,
  '{"email": true, "whatsapp": true, "sms": false}'::jsonb,
  '{"requireCpfValidation": true, "requireEmailVerification": false, "requirePhoneVerification": false, "allowDuplicateEmail": false, "allowDuplicatePhone": true}'::jsonb,
  ''
WHERE NOT EXISTS (SELECT 1 FROM settings);

-- Insert default referral type if none exists
INSERT INTO referral_types (name, description, icon, color, methods, referrer_reward, referred_reward)
SELECT 
  'Indicação Padrão',
  'Indique um amigo e ganhe pontos quando ele fizer sua primeira compra',
  'user-plus',
  '#3B82F6',
  '["email"]'::jsonb,
  '{"type": "points", "value": 100}'::jsonb,
  '{"type": "points", "value": 50}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM referral_types);