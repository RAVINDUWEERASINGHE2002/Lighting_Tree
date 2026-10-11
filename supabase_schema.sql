
-- ==============================================================================
-- LIGHTING TREE POS & FINANCIAL MANAGEMENT SYSTEM
-- Supabase PostgreSQL Database Schema & Realtime Setup
-- ==============================================================================
-- Run this script in your Supabase Project's SQL Editor (supabase.com -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create shop_items table
CREATE TABLE IF NOT EXISTS public.shop_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    category TEXT NOT NULL DEFAULT 'Other',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Colombo', NOW()),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Colombo', NOW())
);

-- 2. Create bills table
CREATE TABLE IF NOT EXISTS public.bills (
    id TEXT PRIMARY KEY,
    bill_number TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    grand_total NUMERIC NOT NULL DEFAULT 0,
    cashier TEXT NOT NULL DEFAULT 'Madhawa',
    payment_method TEXT NOT NULL DEFAULT 'cash',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Colombo', NOW())
);

-- 3. Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    paid_by TEXT NOT NULL DEFAULT 'Business',
    category TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Colombo', NOW())
);

-- 4. Create advances table
CREATE TABLE IF NOT EXISTS public.advances (
    id TEXT PRIMARY KEY,
    partner TEXT NOT NULL,
    date TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Colombo', NOW())
);

-- 5. Create investments (initial capital) table
CREATE TABLE IF NOT EXISTS public.investments (
    id TEXT PRIMARY KEY,
    partner TEXT NOT NULL,
    date TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Colombo', NOW())
);

-- 6. Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id TEXT PRIMARY KEY DEFAULT 'app_settings',
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Colombo', NOW())
);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- Allow web app (anon & authenticated) full read/write access
-- ==============================================================================

ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public access on shop_items" ON public.shop_items;
    DROP POLICY IF EXISTS "Public access on bills" ON public.bills;
    DROP POLICY IF EXISTS "Public access on expenses" ON public.expenses;
    DROP POLICY IF EXISTS "Public access on advances" ON public.advances;
    DROP POLICY IF EXISTS "Public access on investments" ON public.investments;
    DROP POLICY IF EXISTS "Public access on settings" ON public.settings;
END $$;

CREATE POLICY "Public access on shop_items" ON public.shop_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access on bills" ON public.bills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access on expenses" ON public.expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access on advances" ON public.advances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access on investments" ON public.investments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access on settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 8. ENABLE REALTIME SYNC (WebSockets)
-- Ensures Madhawa, Sandeep & Fab get instant live updates on phone screens
-- ==============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.shop_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bills;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.advances;
ALTER PUBLICATION supabase_realtime ADD TABLE public.investments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.settings;

-- ==============================================================================
-- 9. INITIAL SEED DATA (Lighting Tree Thanamalwila Demo)
-- ==============================================================================

-- Seed Items
INSERT INTO public.shop_items (id, name, price, category, is_active)
VALUES
    ('item-curd', 'Fresh Curd with Mee Pani (මී පැණි සමඟ කිරි)', 450, 'Desserts', true),
    ('item-hakuru', 'Pure Kithul Hakuru (කිතුල් හකුරු)', 350, 'Local Sweets', true),
    ('item-sandwich', 'Chicken & Salad Sandwich (සැන්ඩ්විච්)', 650, 'Food', true),
    ('item-faluda', 'Special Rose Faluda (ෆලුඩා)', 400, 'Beverages', true),
    ('item-lime', 'Fresh Lime Juice (දෙහි ජූස්)', 250, 'Beverages', true),
    ('item-tea', 'Ceylon Spiced Tea (තේ)', 150, 'Beverages', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Investments (Working Capital)
INSERT INTO public.investments (id, partner, date, amount, note)
VALUES
    ('inv-demo-1', 'Sandeep', CURRENT_DATE::text, 100000, 'Initial shop setup & renovation investment'),
    ('inv-demo-2', 'Fab', CURRENT_DATE::text, 100000, 'Refrigeration, juice blenders & equipment'),
    ('inv-demo-3', 'Madhawa', CURRENT_DATE::text, 50000, 'Initial ingredient stock & cash float')
ON CONFLICT (id) DO NOTHING;

-- Seed Default Settings
INSERT INTO public.settings (id, data)
VALUES (
    'app_settings',
    '{
        "shopName": "Lighting Tree",
        "address": "Lighting Tree, Opposite Busstand, Thanamalwila",
        "phone": "+94 707504455",
        "currencySymbol": "Rs",
        "monthlyRent": 30000,
        "dailyUtilities": 250,
        "businessSharePercent": 10,
        "partnerSharePercent": 30,
        "partners": ["Sandeep", "Fab", "Madhawa"],
        "thermalFormat": "58mm"
    }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Verification query
SELECT 'Lighting Tree Supabase schema initialized successfully!' AS status;
