/*
  # Adicionar Sistema de Filiais

  1. Nova Tabela
    - `branches` - Tabela para gerenciar filiais
      - `id` (uuid, primary key)
      - `name` (text) - Nome da filial
      - `code` (text, unique) - Código único da filial
      - `address` (text) - Endereço da filial
      - `phone` (text) - Telefone da filial
      - `email` (text) - Email da filial
      - `manager` (text) - Nome do gerente
      - `is_active` (boolean) - Status da filial
      - `color` (text) - Cor para identificação visual
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Modificações
    - Adicionar `branch_id` na tabela `point_movements`
    - Criar índices para otimização
    - Configurar RLS
    - Inserir filial padrão
*/

-- Criar tabela de filiais
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  manager text NOT NULL,
  is_active boolean DEFAULT true,
  color text NOT NULL DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Adicionar coluna branch_id na tabela point_movements
ALTER TABLE point_movements 
ADD COLUMN IF NOT EXISTS branch_id uuid REFERENCES branches(id);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_branches_code ON branches(code);
CREATE INDEX IF NOT EXISTS idx_branches_is_active ON branches(is_active);
CREATE INDEX IF NOT EXISTS idx_point_movements_branch_id ON point_movements(branch_id);

-- Habilitar RLS
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para branches
CREATE POLICY "Enable all operations for authenticated users" ON branches
  FOR ALL TO authenticated, service_role USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for anon users" ON branches
  FOR ALL TO anon USING (true) WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_branches_updated_at 
  BEFORE UPDATE ON branches 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir filial padrão
INSERT INTO branches (name, code, address, phone, email, manager, color) VALUES
('Filial Principal', 'FIL001', 'Rua Principal, 123 - Centro', '(11) 99999-9999', 'principal@empresa.com', 'Gerente Principal', '#3B82F6')
ON CONFLICT (code) DO NOTHING;

-- Atualizar movimentações existentes para usar a filial padrão
UPDATE point_movements 
SET branch_id = (SELECT id FROM branches WHERE code = 'FIL001' LIMIT 1)
WHERE branch_id IS NULL;

-- Tornar branch_id obrigatório após a atualização
ALTER TABLE point_movements 
ALTER COLUMN branch_id SET NOT NULL;