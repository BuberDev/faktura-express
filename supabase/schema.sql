-- 1. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    company_name TEXT,
    nip TEXT,
    address TEXT,
    bank_account TEXT,
    gold_subscription BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    nip TEXT NOT NULL,
    address TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    number TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('VAT', 'Proforma', 'Correction')),
    issue_date DATE NOT NULL,
    sale_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('unpaid', 'paid')),
    
    -- Issuer details (denormalized for the specific invoice)
    issuer_name TEXT NOT NULL,
    issuer_nip TEXT NOT NULL,
    issuer_address TEXT NOT NULL,
    
    -- Client details (denormalized for the specific invoice)
    client_name TEXT NOT NULL,
    client_nip TEXT NOT NULL,
    client_address TEXT NOT NULL,
    
    -- Totals
    total_net NUMERIC(15, 2) NOT NULL,
    total_vat NUMERIC(15, 2) NOT NULL,
    total_gross NUMERIC(15, 2) NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, number)
);

-- 4. Invoice items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC(15, 2) NOT NULL,
    unit TEXT NOT NULL CHECK (unit IN ('szt', 'godz', 'km')),
    net_price NUMERIC(15, 2) NOT NULL,
    vat_rate TEXT NOT NULL CHECK (vat_rate IN ('23', '8', '5', '0', 'zw', 'np')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS)

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Profiles are viewable by owner" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles are editable by owner" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for Invoices
CREATE POLICY "Invoices are viewable by owner" ON public.invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Invoices are insertable by owner" ON public.invoices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Invoices are updatable by owner" ON public.invoices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Invoices are deletable by owner" ON public.invoices FOR DELETE USING (auth.uid() = user_id);

-- Policies for Invoice Items
CREATE POLICY "Items are viewable by invoice owner" ON public.invoice_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_id AND user_id = auth.uid())
);
CREATE POLICY "Items are insertable by invoice owner" ON public.invoice_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_id AND user_id = auth.uid())
);
CREATE POLICY "Items are updatable by invoice owner" ON public.invoice_items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_id AND user_id = auth.uid())
);
CREATE POLICY "Items are deletable by invoice owner" ON public.invoice_items FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.invoices WHERE id = invoice_id AND user_id = auth.uid())
);

-- AUTOMATION: Profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
