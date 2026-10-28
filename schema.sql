-- ========================================================
-- BrizCRM Database Schema (Briz AI Studio)
-- Clean, Professional, Multi-Tenant Sales Pipeline
-- ========================================================

-- 1. Sales Team / Users
CREATE TABLE IF NOT EXISTS briz_sales_reps (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'sales_rep', -- 'admin' or 'sales_rep'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Sales Team
INSERT INTO briz_sales_reps (name, phone, role, is_active)
VALUES 
    ('Briz Patel (Admin)', '+91 98988 60145', 'admin', true),
    ('Anilbhai', '+91 99253 43582', 'sales_rep', true),
    ('Ankitbhai', '+91 81606 94888', 'sales_rep', true),
    ('Hemali', '+91 76228 85040', 'sales_rep', true),
    ('Lata', '+91 72018 90809', 'sales_rep', true),
    ('Mansi', '+91 87809 64019', 'sales_rep', true),
    ('Mukeshbhai', '+91 90545 85040', 'sales_rep', true),
    ('Priyanshi', '+91 93282 63342', 'sales_rep', true),
    ('Ritu', '+91 79904 71987', 'sales_rep', true),
    ('Siya', '+91 97239 28746', 'sales_rep', true)
ON CONFLICT DO NOTHING;

-- 2. Clean Leads Table
CREATE TABLE IF NOT EXISTS briz_leads (
    id SERIAL PRIMARY KEY,
    company_name TEXT DEFAULT 'Jay Shree Ambe Food Machinery',
    customer_name TEXT NOT NULL DEFAULT 'WhatsApp Customer',
    phone TEXT NOT NULL,
    city TEXT DEFAULT 'Not specified',
    state TEXT DEFAULT 'Gujarat',
    requirement TEXT DEFAULT 'Commercial Pulverizer / Atta Mill',
    stage TEXT DEFAULT 'new', -- 'new', 'contacted', 'quotation', 'demo', 'won', 'lost'
    assigned_rep TEXT DEFAULT 'Anilbhai',
    deal_value NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Sample Live Leads
INSERT INTO briz_leads (customer_name, phone, city, state, requirement, stage, assigned_rep, deal_value, notes)
VALUES
    ('Harendra Kumar', '+91 7426896134', 'Jaipur', 'Rajasthan', '7.5 HP Standard Pulverizer', 'won', 'Mukeshbhai', 95000, 'Advance payment of ₹25,000 received via UPI.'),
    ('Abdul Chitrakoot', '+91 9695471959', 'Chitrakoot', 'Uttar Pradesh', '10 HP Cyclone Pulverizer', 'quotation', 'Mukeshbhai', 145000, 'Quotation PDF sent. Follow up on Saturday.'),
    ('Subhashish Kumar', '+91 9934540362', 'Bhagalpur', 'Bihar', '5 HP Mini Flour Mill', 'demo', 'Anilbhai', 68000, 'Visiting factory next Tuesday for live demonstration.'),
    ('Kamal Gupta', '+91 9410679130', 'Aligarh', 'Uttar Pradesh', '5 HP Atta Chakki', 'contacted', 'Anilbhai', 72000, 'Requested YouTube video of continuous grinding.'),
    ('Rajendra Goswami', '+91 919828977577', 'Jaisalmer', 'Rajasthan', '20 HP Heavy Duty Pulverizer', 'quotation', 'Hemali', 220000, 'Big commercial inquiry for masala factory.'),
    ('Pawan Yadav', '+91 6387549596', 'Farrukhabad', 'Uttar Pradesh', '10 HP Masala Grinder', 'contacted', 'Mukeshbhai', 115000, 'Needs quotation with GST and transport charges to UP.'),
    ('Haresh Thakor', '+91 9979098370', 'Gandhinagar', 'Gujarat', 'Double Chamber 7.5 HP', 'new', 'Anilbhai', 85000, 'New WhatsApp inquiry received.')
ON CONFLICT DO NOTHING;

-- 3. Quotations Table
CREATE TABLE IF NOT EXISTS briz_quotations (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES briz_leads(id) ON DELETE CASCADE,
    quote_number TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    machine_model TEXT NOT NULL,
    motor_hp TEXT NOT NULL,
    base_price NUMERIC NOT NULL,
    gst_percent NUMERIC DEFAULT 18,
    total_amount NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Public Read/Write for prototype (or add RLS)
ALTER TABLE briz_sales_reps ENABLE ROW LEVEL SECURITY;
ALTER TABLE briz_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE briz_quotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to briz_sales_reps" ON briz_sales_reps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to briz_leads" ON briz_leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to briz_quotations" ON briz_quotations FOR ALL USING (true) WITH CHECK (true);
