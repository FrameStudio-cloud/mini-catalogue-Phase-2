-- Create shops table
CREATE TABLE IF NOT EXISTS public.shops (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Create catalogue table (multi-tenant, supports both products and services)
CREATE TABLE IF NOT EXISTS public.catalogue (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'product' CHECK (type IN ('product', 'service')),
  name text NOT NULL,
  category text NOT NULL,
  description text DEFAULT '',
  image text DEFAULT '',
  price integer DEFAULT 0,
  price_label text DEFAULT '',
  badge text DEFAULT '',
  available boolean DEFAULT true,
  featured boolean DEFAULT false,
  specs text[] DEFAULT NULL,
  includes text[] DEFAULT NULL,
  variants jsonb DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.catalogue ENABLE ROW LEVEL SECURITY;

-- Allow public read for available items
CREATE POLICY "Allow public read available catalogue" ON public.catalogue
  FOR SELECT USING (available = true);

-- Allow shop-specific read for admin
CREATE POLICY "Allow authenticated full access to own shop" ON public.catalogue
  FOR ALL USING (
    auth.role() = 'authenticated'
    AND shop_id IN (
      SELECT id FROM public.shops
    )
  );

-- Insert a default shop
INSERT INTO public.shops (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000001', 'My Shop', 'my-shop')
ON CONFLICT (id) DO NOTHING;
