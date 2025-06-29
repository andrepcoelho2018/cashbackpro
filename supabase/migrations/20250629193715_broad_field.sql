/*
  # Dados Iniciais do Sistema de Fidelidade

  1. Níveis de Cliente
    - Bronze, Prata, Ouro com configurações padrão

  2. Configurações Iniciais
    - Configurações da empresa e programa

  3. Tipos de Indicação
    - Indicação básica e premium
*/

-- Inserir níveis de cliente padrão
INSERT INTO customer_levels (name, color, icon, order_position, min_points, points_multiplier, referral_bonus, free_shipping, exclusive_events, custom_rewards) VALUES
('Bronze', '#CD7F32', 'award', 1, 0, 1.0, 1.0, false, false, '[]'::jsonb),
('Prata', '#C0C0C0', 'star', 2, 1000, 1.5, 1.5, false, true, '["10% desconto aniversário"]'::jsonb),
('Ouro', '#FFD700', 'crown', 3, 2500, 2.0, 2.0, true, true, '["Frete grátis", "Eventos exclusivos"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Inserir configurações iniciais do sistema
INSERT INTO settings (company, program, notifications, validation, terms) VALUES (
  '{
    "name": "Loja Exemplo",
    "website": "https://lojaexemplo.com",
    "address": "Rua das Flores, 123 - São Paulo, SP"
  }'::jsonb,
  '{
    "name": "Programa Fidelidade",
    "primaryColor": "#3B82F6",
    "secondaryColor": "#10B981",
    "font": "Inter",
    "pointsPerReal": 1,
    "minPurchaseValue": 50,
    "pointsExpiration": {
      "enabled": true,
      "days": 365,
      "notifyDaysBefore": 30
    }
  }'::jsonb,
  '{
    "email": true,
    "whatsapp": true,
    "sms": false
  }'::jsonb,
  '{
    "requireCpfValidation": true,
    "requireEmailVerification": false,
    "requirePhoneVerification": false,
    "allowDuplicateEmail": false,
    "allowDuplicatePhone": true
  }'::jsonb,
  'Termos e condições do programa de fidelidade...'
) ON CONFLICT DO NOTHING;

-- Inserir tipos de indicação padrão
INSERT INTO referral_types (name, description, icon, color, is_active, methods, referrer_reward, referred_reward, conditions) VALUES
(
  'Indicação Básica',
  'Indicação padrão para novos clientes',
  'user-plus',
  '#3B82F6',
  true,
  '["email", "whatsapp", "sms"]'::jsonb,
  '{
    "type": "points",
    "value": 500,
    "description": "500 pontos por indicação validada"
  }'::jsonb,
  '{
    "type": "points",
    "value": 250,
    "description": "250 pontos de boas-vindas"
  }'::jsonb,
  '{
    "requiresFirstPurchase": true,
    "validityDays": 30
  }'::jsonb
),
(
  'Indicação Premium',
  'Para clientes VIP com recompensas maiores',
  'crown',
  '#FFD700',
  true,
  '["email", "whatsapp", "qrcode"]'::jsonb,
  '{
    "type": "fixed",
    "value": 50,
    "description": "R$ 50,00 em crédito na loja"
  }'::jsonb,
  '{
    "type": "percentage",
    "value": 20,
    "description": "20% de desconto na primeira compra"
  }'::jsonb,
  '{
    "minPurchaseValue": 200,
    "requiresFirstPurchase": true,
    "validityDays": 60,
    "maxReferrals": 5
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- Inserir recompensas padrão
INSERT INTO rewards (name, description, points_cost, type, value, is_active, expiration_days, conditions) VALUES
(
  'Desconto R$ 10',
  'Desconto de R$ 10,00 em compras acima de R$ 50,00',
  100,
  'discount',
  10.00,
  true,
  30,
  '{"requiresVerification": true}'::jsonb
),
(
  'Frete Grátis',
  'Frete grátis para qualquer compra',
  200,
  'service',
  0.00,
  true,
  15,
  '{"minLevel": "2", "maxUsesPerCustomer": 3}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Inserir campanha de exemplo
INSERT INTO campaigns (name, type, multiplier, start_date, end_date, is_active, widget) VALUES
(
  'Pontos Dobrados - Janeiro',
  'period',
  2.0,
  '2024-01-01',
  '2024-01-31',
  true,
  '{
    "title": "Pontos em Dobro!",
    "description": "Ganhe pontos em dobro em Janeiro",
    "actionButton": {
      "text": "Comprar Agora",
      "url": "/loja"
    }
  }'::jsonb
)
ON CONFLICT DO NOTHING;