-- Migration: Add new tables for full sidebar functionality
-- Run this in Supabase SQL Editor or use: npm run db:push

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  nip TEXT,
  address TEXT,
  email TEXT,
  phone TEXT,
  bank_account TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own clients"
  ON clients FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Products / Services table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL DEFAULT 'szt',
  net_price NUMERIC(15,2) NOT NULL,
  vat_rate TEXT NOT NULL DEFAULT '23',
  sku TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own products"
  ON products FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Costs (purchase invoices, expenses) table
CREATE TABLE IF NOT EXISTS costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  number TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'invoice',
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid',
  vendor_name TEXT NOT NULL,
  vendor_nip TEXT,
  vendor_address TEXT,
  total_net NUMERIC(15,2) NOT NULL,
  total_vat NUMERIC(15,2) NOT NULL,
  total_gross NUMERIC(15,2) NOT NULL,
  ksef_id TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own costs"
  ON costs FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Cost line items
CREATE TABLE IF NOT EXISTS cost_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cost_id UUID NOT NULL REFERENCES costs(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(15,2) NOT NULL,
  unit TEXT NOT NULL,
  net_price NUMERIC(15,2) NOT NULL,
  vat_rate TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE cost_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access items of their own costs"
  ON cost_items FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM costs WHERE costs.id = cost_items.cost_id AND costs.user_id = auth.uid()
    )
  );

-- Bank accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  iban TEXT NOT NULL,
  bank_name TEXT,
  currency TEXT NOT NULL DEFAULT 'PLN',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own bank accounts"
  ON bank_accounts FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  due_days NUMERIC(4,0) NOT NULL DEFAULT 14,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own payment methods"
  ON payment_methods FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_costs_user_id ON costs(user_id);
CREATE INDEX IF NOT EXISTS idx_costs_type ON costs(type);
CREATE INDEX IF NOT EXISTS idx_costs_status ON costs(status);
CREATE INDEX IF NOT EXISTS idx_cost_items_cost_id ON cost_items(cost_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
