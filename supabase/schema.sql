-- =================================================================
-- SAJAL KIRANA - PostgreSQL Schema for Supabase
-- Wholesale & Retail Grocery Platform
-- =================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    icon_name TEXT DEFAULT 'Package',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Products Table (Wholesale & Retail Dual Support)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    brand TEXT,
    retail_price NUMERIC(10, 2) NOT NULL,
    wholesale_price NUMERIC(10, 2) NOT NULL,
    wholesale_min_qty INT NOT NULL DEFAULT 5,
    unit TEXT NOT NULL DEFAULT 'kg', -- 'kg', 'packet', 'L', 'bag', 'box', 'tin'
    package_size TEXT, -- e.g. '10 kg bag', '1 Litre Pouch', '500g Packet'
    stock_quantity INT NOT NULL DEFAULT 100,
    low_stock_threshold INT NOT NULL DEFAULT 10,
    is_wholesale BOOLEAN DEFAULT true,
    is_retail BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Banners Table (Homepage promotional slides)
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    badge_text TEXT,
    image_url TEXT NOT NULL,
    cta_link TEXT DEFAULT '/catalog',
    cta_text TEXT DEFAULT 'Shop Now',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Inquiries & WhatsApp Orders Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_type TEXT NOT NULL DEFAULT 'retail', -- 'retail' or 'wholesale'
    status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'fulfilled', 'cancelled'
    total_amount NUMERIC(10, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Inquiry Items Table
CREATE TABLE IF NOT EXISTS public.inquiry_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_id UUID REFERENCES public.inquiries(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INT NOT NULL,
    price_type TEXT NOT NULL, -- 'retail' or 'wholesale'
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

-- 7. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL DEFAULT 'Sajal Kirana',
    tagline TEXT DEFAULT 'Your Trusted Fresh Grocery & Kirana Partner',
    phone TEXT DEFAULT '+91 79749 81304',
    whatsapp_number TEXT DEFAULT '+917974981304',
    email TEXT DEFAULT 'orders@sajalkirana.com',
    address TEXT DEFAULT 'Near Gas Agency, Damoh Road, Ahead of Ghantaghar, Gadhakota (MP) - 470229',
    opening_hours TEXT DEFAULT 'Monday – Sunday: 8:30 AM to 9:30 PM (Open all 7 days)',
    wholesale_terms TEXT DEFAULT 'Doorstep grocery delivery available across Gadhakota.',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =================================================================
-- Row Level Security (RLS) Policies
-- =================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Categories: Anyone can view active categories
CREATE POLICY "Public read active categories" ON public.categories 
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admin full categories" ON public.categories 
    FOR ALL USING (auth.role() = 'authenticated');

-- Products: Anyone can view active products
CREATE POLICY "Public read active products" ON public.products 
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admin full products" ON public.products 
    FOR ALL USING (auth.role() = 'authenticated');

-- Banners: Anyone can view active banners
CREATE POLICY "Public read active banners" ON public.banners 
    FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admin full banners" ON public.banners 
    FOR ALL USING (auth.role() = 'authenticated');

-- Inquiries: Public can insert new inquiries, Authenticated admin can view/update
CREATE POLICY "Public insert inquiries" ON public.inquiries 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view inquiries" ON public.inquiries 
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update inquiries" ON public.inquiries 
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Inquiry Items: Public can insert, Authenticated admin can read
CREATE POLICY "Public insert inquiry items" ON public.inquiry_items 
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin view inquiry items" ON public.inquiry_items 
    FOR SELECT USING (auth.role() = 'authenticated');

-- Store settings: Public can read, authenticated admin can update
CREATE POLICY "Public read store settings" ON public.store_settings 
    FOR SELECT USING (true);
CREATE POLICY "Admin update store settings" ON public.store_settings 
    FOR UPDATE USING (auth.role() = 'authenticated');

-- =================================================================
-- Initial Seed Data
-- =================================================================

-- Insert Store Settings
INSERT INTO public.store_settings (store_name, tagline, phone, whatsapp_number, email, address, opening_hours, wholesale_terms)
VALUES (
    'Sajal Kirana',
    'Fresh Grocery Superstore - Best Rates Guaranteed',
    '+91 79749 81304',
    '+917974981304',
    'orders@sajalkirana.com',
    'Near Gas Agency, Damoh Road, Ahead of Ghantaghar, Gadhakota, Madhya Pradesh - 470229',
    'Monday – Sunday: 8:30 AM to 9:30 PM (Open all 7 days)',
    'Doorstep grocery delivery available across Gadhakota.'
) ON CONFLICT DO NOTHING;

-- Insert Categories
INSERT INTO public.categories (id, name, slug, description, image_url, icon_name, sort_order) VALUES
('11111111-1111-1111-1111-111111111101', 'Atta, Flour & Grains', 'atta-flour-grains', 'Fresh chakki atta, maida, sooji, besan and grain sacks', 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80', 'Wheat', 1),
('11111111-1111-1111-1111-111111111102', 'Dals & Pulses', 'dals-pulses', 'Unpolished protein-rich toor, moong, chana, urad and rajma', 'https://images.unsplash.com/photo-1585994192701-f1a505c8574a?w=600&auto=format&fit=crop&q=80', 'Layers', 2),
('11111111-1111-1111-1111-111111111103', 'Rice & Basmati', 'rice-basmati', 'Aromatic premium basmati, rozana rice, and sona masoori sacks', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80', 'Sparkles', 3),
('11111111-1111-1111-1111-111111111104', 'Edible Oils & Pure Ghee', 'edible-oils-ghee', 'Kachi ghani mustard oil, refined sunflower oil, desi cow ghee', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80', 'Droplet', 4),
('11111111-1111-1111-1111-111111111105', 'Spices & Whole Masala', 'spices-masala', 'Pure grounded spices, turmeric, red chilli, jeera, hing and garam masala', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80', 'Flame', 5),
('11111111-1111-1111-1111-111111111106', 'Sugar, Jaggery & Salt', 'sugar-jaggery-salt', 'Clean sulfur-free sugar, desi jaggery gur, iodized rock & table salt', 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=600&auto=format&fit=crop&q=80', 'Cookie', 6),
('11111111-1111-1111-1111-111111111107', 'Dry Fruits & Nuts', 'dry-fruits-nuts', 'California almonds, cashew W240, golden raisins, walnuts and pistachios', 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80', 'Sun', 7),
('11111111-1111-1111-1111-111111111108', 'Tea, Coffee & Beverages', 'tea-coffee-beverages', 'Premium Assam CTC tea, gold leaf blends, instant coffee, sherbats', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80', 'Coffee', 8)
ON CONFLICT (id) DO NOTHING;

-- Insert Hero Banners
INSERT INTO public.banners (title, subtitle, badge_text, image_url, cta_link, cta_text, display_order, is_active) VALUES
(
    'Special Wholesale Rates for Commercial Buyers',
    'Get factory-direct rates on Atta, Basmati Rice, Oil tins and Dal sacks. Direct GST billing & same-day delivery.',
    'B2B Wholesale Mandi',
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&auto=format&fit=crop&q=80',
    '/catalog?type=wholesale',
    'Explore Wholesale Deals',
    1,
    true
),
(
    '100% Pure & Unadulterated Desi Ghee & Edible Oils',
    'Stock your kitchen with fresh Fortune Kachi Ghani Mustard Oil, Dhara Sunflower, and Amul Pure Cow Ghee.',
    'Pure & Fresh Daily',
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&auto=format&fit=crop&q=80',
    '/catalog?category=edible-oils-ghee',
    'Shop Oils & Ghee',
    2,
    true
),
(
    'Premium California Dry Fruits & Whole Masalas',
    'A1 Grade Badam, Kaju W240, Kishmish, and authentic aromatic whole spices at unbeatable prices.',
    'Festive Super Saver',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&auto=format&fit=crop&q=80',
    '/catalog?category=dry-fruits-nuts',
    'Order on WhatsApp',
    3,
    true
)
ON CONFLICT DO NOTHING;

-- Insert Realistic Grocery Products (Dual Wholesale & Retail)
INSERT INTO public.products (category_id, name, slug, description, brand, retail_price, wholesale_price, wholesale_min_qty, unit, package_size, stock_quantity, low_stock_threshold, is_wholesale, is_retail, is_featured, is_active, images) VALUES
-- Atta, Flour & Grains
('11111111-1111-1111-1111-111111111101', 'Aashirvaad Shudh Chakki Atta (10 kg)', 'aashirvaad-shudh-chakki-atta-10kg', '100% whole wheat grain chakki atta with 0% maida. Super soft rotis that stay fresh longer.', 'Aashirvaad', 440.00, 395.00, 5, 'bag', '10 kg bag', 85, 10, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80']),
('11111111-1111-1111-1111-111111111101', 'MP Sharbati Premium Gehu / Wheat (50 kg Sack)', 'mp-sharbati-wheat-50kg-sack', 'Golden grain export quality MP Sehore Sharbati wheat. Ideal for dhabas, caterers and families.', 'Desi Mandi Select', 2150.00, 1920.00, 2, 'bag', '50 kg sack', 40, 5, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80']),
('11111111-1111-1111-1111-111111111101', 'Fortune Super Food Besan (1 kg)', 'fortune-besan-1kg', 'Made from 100% pure chana dal, finely ground and rich in natural aroma and protein.', 'Fortune', 115.00, 98.00, 10, 'packet', '1 kg pack', 120, 15, true, true, false, true, ARRAY['https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=80']),

-- Dals & Pulses
('11111111-1111-1111-1111-111111111102', 'Tata Sampann Unpolished Toor / Arhar Dal (1 kg)', 'tata-sampann-toor-dal-1kg', 'Natural unpolished Toor Dal with original goodness and natural protein intact. Fast cooking and delicious.', 'Tata Sampann', 178.00, 152.00, 10, 'kg', '1 kg pack', 150, 20, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1585994192701-f1a505c8574a?w=600&auto=format&fit=crop&q=80']),
('11111111-1111-1111-1111-111111111102', 'Premium Kabuli Chana / Big Chickpeas (30 kg Sack)', 'premium-kabuli-chana-30kg-sack', 'Bold jumbo size white chickpeas. Perfect for restaurants, chole bhature stalls, and bulk catering.', 'Mandi Gold', 4200.00, 3650.00, 2, 'bag', '30 kg sack', 25, 5, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80']),
('11111111-1111-1111-1111-111111111102', 'Moong Dal Dhuli (Yellow Moong) (1 kg)', 'moong-dal-dhuli-1kg', 'Light, easy to digest and protein-packed yellow moong split lentils.', 'Sajal Select', 135.00, 116.00, 10, 'kg', '1 kg pack', 90, 12, true, true, false, true, ARRAY['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&auto=format&fit=crop&q=80']),

-- Rice & Basmati
('11111111-1111-1111-1111-111111111103', 'Daawat Rozana Gold Basmati Rice (5 kg)', 'daawat-rozana-gold-basmati-5kg', 'Extra-long grain basmati rice with heavenly aroma. Perfect for everyday pulav and biryani.', 'Daawat', 460.00, 395.00, 4, 'bag', '5 kg bag', 75, 10, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80']),
('11111111-1111-1111-1111-111111111103', 'India Gate Super Basmati Rice (25 kg Commercial Sack)', 'india-gate-super-basmati-25kg', 'Aged aged basmati grains that double in size after cooking. Commercial wholesale bag for hoteliers.', 'India Gate', 3150.00, 2750.00, 2, 'bag', '25 kg bag', 35, 5, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&auto=format&fit=crop&q=80']),
('11111111-1111-1111-1111-111111111103', 'Premium Sona Masoori Rice (25 kg Sack)', 'premium-sona-masoori-rice-25kg', 'Lightweight, fragrant and soft staple rice popular across South & Central Indian households.', 'Heritage Rice', 1580.00, 1380.00, 3, 'bag', '25 kg sack', 45, 8, true, true, false, true, ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop&q=80']),

-- Edible Oils & Pure Ghee
('11111111-1111-1111-1111-111111111104', 'Fortune Kachi Ghani Pure Mustard Oil (1 Litre)', 'fortune-kachi-ghani-mustard-oil-1l', 'Traditional cold-pressed pungency and richness. Best for traditional Indian cooking and pickles.', 'Fortune', 165.00, 142.00, 12, 'L', '1 Litre Pouch', 160, 20, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80']),
('11111111-1111-1111-1111-111111111104', 'Fortune Kachi Ghani Mustard Oil (15 Litre Commercial Tin)', 'fortune-mustard-oil-15l-tin', 'Heavy duty 15 litre tin for commercial kitchens, halwais, and bulk households.', 'Fortune', 2350.00, 2080.00, 2, 'tin', '15 L Tin', 30, 4, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&auto=format&fit=crop&q=80']),
('11111111-1111-1111-1111-111111111104', 'Amul Pure Ghee (1 Litre Tin)', 'amul-pure-ghee-1l-tin', 'Rich granular texture and authentic aroma crafted from fresh cow and buffalo milk fat.', 'Amul', 680.00, 610.00, 6, 'tin', '1 Litre Tin', 55, 8, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80']),

-- Spices & Whole Masala
('11111111-1111-1111-1111-111111111105', 'Everest Kashmiri Lal Mirch Powder (500g)', 'everest-kashmiri-lal-mirch-500g', 'Gives deep rich natural red color with mild heat. A must-have for rich curries and gravies.', 'Everest', 240.00, 205.00, 10, 'packet', '500g Pack', 80, 10, true, true, false, true, ARRAY['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80']),
('11111111-1111-1111-1111-111111111105', 'Whole Cumin Seeds / Sabut Jeera (1 kg Wholesale Pack)', 'whole-cumin-seeds-jeera-1kg', 'Machine-cleaned A-grade unadulterated whole jeera with high essential oil content.', 'Sajal Select', 390.00, 320.00, 5, 'kg', '1 kg bag', 60, 8, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&auto=format&fit=crop&q=80']),
('11111111-1111-1111-1111-111111111105', 'MDH Deggi Mirch & Garam Masala Combo (100g x 5 Packs)', 'mdh-masala-combo-wholesale', 'Authentic blend of 13 roasted whole spices and mild fragrant chilli.', 'MDH', 450.00, 385.00, 4, 'box', '5 x 100g Boxes', 45, 6, true, true, false, true, ARRAY['https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80']),

-- Sugar, Jaggery & Salt
('11111111-1111-1111-1111-111111111106', 'Refined Sparkling White Sugar (50 kg Sack)', 'refined-white-sugar-50kg-sack', 'Sulfur-free crystal clear sparkling sugar. Bulk wholesale sack for tea stalls, bakeries and homes.', 'Dhampure Gold', 2450.00, 2180.00, 2, 'bag', '50 kg sack', 35, 5, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=600&auto=format&fit=crop&q=80']),
('11111111-1111-1111-1111-111111111106', 'Tata Salt Vacuum Evaporated Iodized (1 kg x 24 Pouch Carton)', 'tata-salt-1kg-carton-24', 'Desh ka namak. Complete master wholesale carton containing 24 individual 1kg packets.', 'Tata', 672.00, 560.00, 2, 'box', '24 x 1kg Carton', 40, 6, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&auto=format&fit=crop&q=80']),

-- Dry Fruits & Nuts
('11111111-1111-1111-1111-111111111107', 'Premium California Almonds / Badam (1 kg Pack)', 'premium-california-almonds-1kg', 'Crunchy, sweet and vacuum-packed jumbo California almonds. Zero preservatives.', 'Royal Dry Fruits', 890.00, 770.00, 5, 'kg', '1 kg bag', 65, 8, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=600&auto=format&fit=crop&q=80']),
('11111111-1111-1111-1111-111111111107', 'Whole Cashews Kaju W240 Grade (10 kg Commercial Box)', 'cashews-kaju-w240-10kg-box', 'Export grade large whole cashew kernels. Ideal for sweets manufacturers and restaurants.', 'Royal Dry Fruits', 8800.00, 7650.00, 1, 'box', '10 kg Tin/Box', 18, 3, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1536591375315-1b838421372a?w=600&auto=format&fit=crop&q=80']),

-- Tea, Coffee & Beverages
('11111111-1111-1111-1111-111111111108', 'Tata Tea Gold CTC with Long Leaves (1 kg)', 'tata-tea-gold-1kg', 'Exquisite balance of strong taste and rich aroma with 15% gently rolled long leaves.', 'Tata Tea', 580.00, 510.00, 6, 'packet', '1 kg pack', 70, 10, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80']),
('11111111-1111-1111-1111-111111111108', 'Wagh Bakri Premium CTC Tea (5 kg Commercial Bag)', 'wagh-bakri-tea-5kg-commercial', 'Special commercial blend formulated for tea stalls, canteens, dhabas and offices.', 'Wagh Bakri', 2250.00, 1940.00, 2, 'bag', '5 kg bag', 30, 4, true, true, true, true, ARRAY['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80'])
ON CONFLICT (slug) DO NOTHING;
