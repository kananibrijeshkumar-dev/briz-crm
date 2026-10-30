-- ========================================================
-- BrizCRM Enterprise Multi-Tenant Database Schema
-- Studio: Briz AiWeb Studio (https://crm.brizpatel.online)
-- Supports: Jay Shree Ambe Food Machinery & MNP Holidays
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Companies / Tenant Workspaces Table
CREATE TABLE IF NOT EXISTS briz_companies (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    industry TEXT NOT NULL,
    city TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    plan TEXT DEFAULT 'Enterprise Plan',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Registered Tenant Workspaces
INSERT INTO briz_companies (name, industry, city, owner_name, whatsapp, plan, status)
VALUES
    ('Jay Shree Ambe Food Machinery', 'Industrial & Agro Food Machinery', 'Ahmedabad, Gujarat', 'Briz Patel', '+91 98988 60145', 'Enterprise Plan', 'active'),
    ('MNP Holidays', 'International & Domestic Tourism', 'Ahmedabad, Gujarat', 'Chirag Shah', '+91 98250 12345', 'Growth Plan', 'active')
ON CONFLICT (name) DO UPDATE 
SET industry = EXCLUDED.industry,
    city = EXCLUDED.city,
    owner_name = EXCLUDED.owner_name,
    whatsapp = EXCLUDED.whatsapp,
    plan = EXCLUDED.plan;

-- 2. Sales Team / Users Table
CREATE TABLE IF NOT EXISTS briz_sales_reps (
    id SERIAL PRIMARY KEY,
    company_name TEXT NOT NULL DEFAULT 'Jay Shree Ambe Food Machinery',
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    role TEXT DEFAULT 'sales_rep', -- 'super_admin', 'client_admin', 'sales_rep'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Sales Team
INSERT INTO briz_sales_reps (company_name, name, phone, role, is_active)
VALUES 
    -- Super Admin
    ('Jay Shree Ambe Food Machinery', 'Briz Patel (Super Admin)', '+91 98988 60145', 'super_admin', true),
    -- Jay Shree Ambe Food Machinery Sales Team
    ('Jay Shree Ambe Food Machinery', 'Anilbhai', '+91 99253 43582', 'sales_rep', true),
    ('Jay Shree Ambe Food Machinery', 'Ankitbhai', '+91 81606 94888', 'sales_rep', true),
    ('Jay Shree Ambe Food Machinery', 'Hemali', '+91 76228 85040', 'sales_rep', true),
    ('Jay Shree Ambe Food Machinery', 'Lata', '+91 72018 90809', 'sales_rep', true),
    ('Jay Shree Ambe Food Machinery', 'Mansi', '+91 87809 64019', 'sales_rep', true),
    ('Jay Shree Ambe Food Machinery', 'Mukeshbhai', '+91 90545 85040', 'sales_rep', true),
    ('Jay Shree Ambe Food Machinery', 'Priyanshi', '+91 93282 63342', 'sales_rep', true),
    ('Jay Shree Ambe Food Machinery', 'Ritu', '+91 79904 71987', 'sales_rep', true),
    ('Jay Shree Ambe Food Machinery', 'Siya', '+91 97239 28746', 'sales_rep', true),
    -- MNP Holidays Team
    ('MNP Holidays', 'Chirag Shah (Admin)', '+91 98250 12345', 'client_admin', true),
    ('MNP Holidays', 'Neha Patel', '+91 98790 11223', 'sales_rep', true),
    ('MNP Holidays', 'Rohan Mehta', '+91 98240 33445', 'sales_rep', true)
ON CONFLICT DO NOTHING;

-- 3. Multi-Tenant Leads Table
CREATE TABLE IF NOT EXISTS briz_leads (
    id BIGINT PRIMARY KEY,
    company_name TEXT NOT NULL DEFAULT 'Jay Shree Ambe Food Machinery',
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT DEFAULT 'Not specified',
    state TEXT DEFAULT 'Gujarat',
    requirement TEXT DEFAULT 'Commercial Machine Inquiry',
    stage TEXT DEFAULT 'new', -- 'new', 'contacted', 'quotation', 'demo', 'won', 'lost'
    assigned_rep TEXT DEFAULT 'Anilbhai',
    deal_value NUMERIC DEFAULT 0,
    notes TEXT,
    followup_date DATE,
    followup_time TEXT,
    followup_note TEXT,
    timeline JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Live Production Leads (Jay Shree Ambe Food Machinery)
INSERT INTO briz_leads (id, company_name, customer_name, phone, city, state, requirement, stage, assigned_rep, deal_value, notes, followup_date, followup_time, followup_note, timeline)
VALUES
    (1, 'Jay Shree Ambe Food Machinery', 'Harendra Kumar', '+91 7426896134', 'Jaipur', 'Rajasthan', '7.5 HP Standard Pulverizer', 'won', 'Mukeshbhai', 95000, 'Advance payment of ₹25,000 received via UPI. Delivery scheduled.', NULL, NULL, NULL, '[{"time": "2026-10-27 09:15 AM", "text": "Inquiry received via WhatsApp Bot"}, {"time": "2026-10-28 11:20 AM", "text": "Advance ₹25,000 confirmed! Deal Marked as Won."}]'::jsonb),
    (2, 'Jay Shree Ambe Food Machinery', 'Abdul Chitrakoot', '+91 9695471959', 'Chitrakoot', 'Uttar Pradesh', '10 HP Double Stage Cyclone Pulverizer', 'quotation', 'Mukeshbhai', 145000, 'Quotation PDF sent. Follow up on transport subsidy.', '2026-10-29', '04:30 PM', 'Follow up on quotation and transport subsidy to Chitrakoot', '[{"time": "2026-10-27 10:45 AM", "text": "WhatsApp inquiry for 10 HP Cyclone Pulverizer"}, {"time": "2026-10-27 02:15 PM", "text": "Quotation generated & sent via WhatsApp"}]'::jsonb),
    (3, 'Jay Shree Ambe Food Machinery', 'Subhashish Kumar', '+91 9934540362', 'Bhagalpur', 'Bihar', '5 HP Mini Flour Mill (Atta Chakki)', 'demo', 'Anilbhai', 68000, 'Visiting factory next Tuesday for live demonstration.', '2026-10-28', '11:00 AM', 'Confirm arrival date for live factory grinding demonstration', '[{"time": "2026-10-27 11:30 AM", "text": "Inquiry received from Indiamart"}]'::jsonb),
    (4, 'Jay Shree Ambe Food Machinery', 'Kamal Gupta', '+91 9410679130', 'Aligarh', 'Uttar Pradesh', '5 HP Heavy Duty Commercial Chakki', 'contacted', 'Anilbhai', 72000, 'Requested live grinding video of wheat & maize on WhatsApp.', '2026-10-29', '02:00 PM', 'Send YouTube video of 5 HP continuous wheat grinding test', '[{"time": "2026-10-27 12:00 PM", "text": "Inquiry captured by sales agent"}]'::jsonb),
    (5, 'Jay Shree Ambe Food Machinery', 'Rajendra Goswami', '+91 9828977577', 'Jaisalmer', 'Rajasthan', '20 HP Heavy Commercial Masala Mill', 'quotation', 'Hemali', 220000, 'Big commercial plant inquiry for turmeric and coriander grinding.', '2026-10-30', '03:30 PM', 'Call back with subsidized transport quote to Jaisalmer', '[{"time": "2026-10-27 01:20 PM", "text": "Inquiry received for full masala plant"}]'::jsonb),
    (6, 'Jay Shree Ambe Food Machinery', 'Pawan Yadav', '+91 6387549596', 'Farrukhabad', 'Uttar Pradesh', '10 HP Masala / Haldi Grinder', 'contacted', 'Lata', 115000, 'Needs GST quotation and transport delivery charges to UP.', '2026-10-30', '05:00 PM', 'Follow up after sharing catalog PDF on WhatsApp', '[{"time": "2026-10-27 02:10 PM", "text": "Inquiry assigned to Lata"}]'::jsonb),
    (7, 'Jay Shree Ambe Food Machinery', 'Haresh Thakor', '+91 9979098370', 'Gandhinagar', 'Gujarat', 'Double Chamber 7.5 HP Pulverizer', 'new', 'Anilbhai', 85000, 'New WhatsApp inquiry received this morning.', '2026-10-31', '10:00 AM', 'Initial discovery call - understand grains vs spices usage', '[{"time": "2026-10-28 08:30 AM", "text": "New WhatsApp inquiry received"}]'::jsonb),
    
    -- Seed Live Leads (MNP Holidays)
    (101, 'MNP Holidays', 'Dr. Mehul Patel', '+91 98240 55667', 'Surat', 'Gujarat', 'Thailand 5N/6D Family Luxury Package', 'won', 'Neha Patel', 185000, 'Full advance paid. Flight tickets and Phuket resort confirmed.', NULL, NULL, NULL, '[{"time": "2026-10-26 11:00 AM", "text": "Inquiry from Instagram Ad"}, {"time": "2026-10-28 04:00 PM", "text": "Advance confirmed. Booking finalized!"}]'::jsonb),
    (102, 'MNP Holidays', 'Chirag Shah', '+91 98250 12345', 'Ahmedabad', 'Gujarat', 'Dubai 4N/5D Corporate Group (12 Pax)', 'quotation', 'Rohan Mehta', 540000, 'Detailed itinerary with Desert Safari and Burj Khalifa sent.', '2026-10-30', '12:00 PM', 'Follow up with board of directors on visa processing timeline', '[{"time": "2026-10-27 02:30 PM", "text": "Corporate group inquiry captured"}]'::jsonb),
    (103, 'MNP Holidays', 'Pooja Varma', '+91 97129 44332', 'Vadodara', 'Gujarat', 'Bali Honeymoon Private Pool Villa 6N/7D', 'demo', 'Neha Patel', 145000, 'Customized flight timings via Singapore Airlines requested.', '2026-10-29', '06:00 PM', 'Call to confirm flight preference and flower bed decoration', '[{"time": "2026-10-28 10:15 AM", "text": "Website inquiry for Bali Honeymoon"}]'::jsonb),
    (104, 'MNP Holidays', 'Karan Desai', '+91 94260 88776', 'Rajkot', 'Gujarat', 'Vietnam 7N/8D Hanoi & Da Nang Tour', 'contacted', 'Rohan Mehta', 210000, 'Sent brochure and hotel options on WhatsApp.', '2026-10-31', '11:30 AM', 'First follow-up call regarding visa document submission', '[{"time": "2026-10-28 03:45 PM", "text": "WhatsApp inquiry for Vietnam package"}]'::jsonb),
    (105, 'MNP Holidays', 'Vikram Sinh', '+91 99090 33221', 'Bhavnagar', 'Gujarat', 'Europe Grand 11N/12D Group Tour', 'new', 'Neha Patel', 420000, 'Inquiry received for Summer vacation 2027.', '2026-11-02', '03:00 PM', 'Send early-bird discount brochure for Swiss & Paris tour', '[{"time": "2026-10-29 09:00 AM", "text": "Inquiry captured via referral"}]'::jsonb)
ON CONFLICT (id) DO UPDATE 
SET company_name = EXCLUDED.company_name,
    customer_name = EXCLUDED.customer_name,
    phone = EXCLUDED.phone,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    requirement = EXCLUDED.requirement,
    stage = EXCLUDED.stage,
    assigned_rep = EXCLUDED.assigned_rep,
    deal_value = EXCLUDED.deal_value,
    notes = EXCLUDED.notes,
    followup_date = EXCLUDED.followup_date,
    followup_time = EXCLUDED.followup_time,
    followup_note = EXCLUDED.followup_note,
    timeline = EXCLUDED.timeline,
    updated_at = NOW();

-- 4. Multi-Tenant Quotations Table
CREATE TABLE IF NOT EXISTS briz_quotations (
    id SERIAL PRIMARY KEY,
    company_name TEXT NOT NULL DEFAULT 'Jay Shree Ambe Food Machinery',
    lead_id BIGINT REFERENCES briz_leads(id) ON DELETE SET NULL,
    quote_number TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    machine_model TEXT NOT NULL,
    motor_hp TEXT NOT NULL,
    base_price NUMERIC NOT NULL,
    gst_percent NUMERIC DEFAULT 18,
    total_amount NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. High-Performance Search & Filter Indexes
CREATE INDEX IF NOT EXISTS idx_briz_leads_company ON briz_leads(company_name);
CREATE INDEX IF NOT EXISTS idx_briz_leads_stage ON briz_leads(stage);
CREATE INDEX IF NOT EXISTS idx_briz_leads_phone ON briz_leads(phone);
CREATE INDEX IF NOT EXISTS idx_briz_leads_created ON briz_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_briz_reps_company ON briz_sales_reps(company_name);
CREATE INDEX IF NOT EXISTS idx_briz_quotations_company ON briz_quotations(company_name);

-- 6. Row Level Security (RLS) Configuration
ALTER TABLE briz_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE briz_sales_reps ENABLE ROW LEVEL SECURITY;
ALTER TABLE briz_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE briz_quotations ENABLE ROW LEVEL SECURITY;

-- Clean existing policies
DROP POLICY IF EXISTS "Allow public access to briz_companies" ON briz_companies;
DROP POLICY IF EXISTS "Allow public access to briz_sales_reps" ON briz_sales_reps;
DROP POLICY IF EXISTS "Allow public access to briz_leads" ON briz_leads;
DROP POLICY IF EXISTS "Allow public access to briz_quotations" ON briz_quotations;

-- Production Client Policies
CREATE POLICY "Allow public access to briz_companies" ON briz_companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to briz_sales_reps" ON briz_sales_reps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to briz_leads" ON briz_leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access to briz_quotations" ON briz_quotations FOR ALL USING (true) WITH CHECK (true);
