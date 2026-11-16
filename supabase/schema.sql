-- ==============================================================================
-- Sultan's Kacchi Paris — Database Schema & Official Menu Data
-- Location: 28 Rue du Faubourg Saint-Denis, 75010 Paris
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. MENU ITEMS TABLE
create table if not exists public.menu_items (
    id text primary key,
    name text not null,
    category text not null,
    description text,
    price numeric(10, 2) not null check (price >= 0),
    image_url text,
    is_weekly_special boolean default false,
    is_available boolean default true,
    created_at timestamptz default now()
);

-- 2. ORDERS TABLE
create table if not exists public.orders (
    id text primary key,
    customer_name text not null,
    customer_phone text not null,
    pickup_time text not null,
    items_json jsonb not null default '[]'::jsonb,
    total_amount numeric(10, 2) not null check (total_amount >= 0),
    status text not null default 'Pending' check (status in ('Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled')),
    created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_menu_items_category on public.menu_items(category);
create index if not exists idx_menu_items_available on public.menu_items(is_available);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);

-- 3. ROW LEVEL SECURITY (RLS)
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;

-- Drop existing policies if any
drop policy if exists "Public menu items read access" on public.menu_items;
drop policy if exists "Admin menu items all access" on public.menu_items;
drop policy if exists "Public can insert orders" on public.orders;
drop policy if exists "Admin orders all access" on public.orders;

create policy "Public menu items read access"
    on public.menu_items for select using (true);

create policy "Admin menu items all access"
    on public.menu_items for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

create policy "Public can insert orders"
    on public.orders for insert with check (true);

create policy "Public can read order by id"
    on public.orders for select using (true);

create policy "Admin orders all access"
    on public.orders for all
    using (auth.role() = 'authenticated')
    with check (auth.role() = 'authenticated');

-- 4. SUPABASE STORAGE SETUP FOR MENU IMAGES
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public menu images read" on storage.objects;
drop policy if exists "Admin menu images upload" on storage.objects;
drop policy if exists "Admin menu images update" on storage.objects;
drop policy if exists "Admin menu images delete" on storage.objects;

create policy "Public menu images read"
    on storage.objects for select using (bucket_id = 'menu-images');

create policy "Admin menu images upload"
    on storage.objects for insert
    with check (bucket_id = 'menu-images' and auth.role() = 'authenticated');

create policy "Admin menu images update"
    on storage.objects for update
    using (bucket_id = 'menu-images' and auth.role() = 'authenticated');

create policy "Admin menu images delete"
    on storage.objects for delete
    using (bucket_id = 'menu-images' and auth.role() = 'authenticated');

-- 5. OFFICIAL SEED DATA (46 items from Sultan's Kacchi Paris Menu)
insert into public.menu_items (id, name, category, description, price, image_url, is_weekly_special, is_available)
values
    -- Mutton Kacchi
    ('kacchi-regular', 'Kacchi', 'Mutton Kacchi', 'Tender prime mutton marinated in royal spices and slow-cooked with aged basmati rice and potatoes.', 9.90, '/images/biryani-mouton.jpg', false, true),
    ('kacchi-borhani', 'Kacchi, Borhani', 'Mutton Kacchi', 'Royal mutton kacchi served with traditional chilled spiced yogurt Borhani.', 12.90, '/images/biryani-mouton.jpg', false, true),
    ('kacchi-borhani-dessert', 'Kacchi, Borhani, Firni/Jorda', 'Mutton Kacchi', 'Royal mutton kacchi served with chilled Borhani and your choice of Firni or golden sweet Jorda.', 14.90, '/images/biryani-mouton.jpg', false, true),
    ('kacchi-jali-borhani-dessert', 'Kacchi, Jali kabab, Borhani, Firni/jorda', 'Mutton Kacchi', 'Royal mutton kacchi accompanied by minced mutton Jali Kabab, chilled Borhani, and Firni or Jorda.', 16.90, '/images/biryani-mouton.jpg', false, true),
    ('kacchi-chicken-roast-borhani-dessert', 'Kacchi, Chicken roast, Borhani, Firni/jorda', 'Mutton Kacchi', 'Imperial feast featuring royal mutton kacchi, golden chicken roast, chilled Borhani, and Firni or Jorda.', 18.90, '/images/biryani-mouton.jpg', true, true),

    -- Polau
    ('polau-chicken-roast', 'Plain polau, Chicken roast', 'Polau', 'Fragrant Chinigura polau prepared with clarified butter and served with golden braised chicken roast.', 9.90, '/images/roast-polau.jpg', false, true),
    ('polau-beef-rezala', 'Plain polau, Beef Rezala', 'Polau', 'Fragrant Chinigura polau paired with rich slow-cooked Beef Rezala in fragrant yogurt and nut gravy.', 12.90, '/images/beef-rezala-v2.jpg', false, true),
    ('polau-chicken-roast-borhani', 'Plain polau, Chicken roast, Borhani', 'Polau', 'Fragrant polau with golden chicken roast and chilled spiced Borhani.', 12.90, '/images/roast-polau.jpg', false, true),
    ('polau-beef-rezala-borhani', 'Plain polau, Beef Rezala, Borhani', 'Polau', 'Fragrant polau, slow-braised Beef Rezala, and chilled royal Borhani drink.', 14.90, '/images/beef-rezala-v2.jpg', false, true),

    -- Tehari
    ('beef-tehari', 'Beef Tehari', 'Tehari', 'Authentic Old Dhaka aromatic mustard oil short-grain Chinigura rice with tender spiced beef cubes.', 9.90, '/images/beef-tehari.jpg', false, true),
    ('beef-tehari-jali-kabab', 'Beef Tehari, Jali kabab', 'Tehari', 'Old Dhaka Beef Tehari served with an egg-netted minced mutton Jali Kabab.', 11.90, '/images/beef-tehari.jpg', false, true),
    ('beef-tehari-jali-kabab-borhani', 'Beef Tehari, Jali Kabab, Borhani', 'Tehari', 'Complete Old Dhaka banquet of Beef Tehari, Jali Kabab, and chilled Borhani.', 14.90, '/images/beef-tehari.jpg', false, true),

    -- Weekly Special
    ('beef-chui-jhal', 'Beef Chui Jhal', 'Weekly Special', 'Traditional hot and aromatic beef curry infused with authentic Chui Jhal herb twigs.', 9.90, '/images/boeuf-au-curry.jpg', true, true),
    ('mutton-rezala', 'Mutton Rezala', 'Weekly Special', 'Tender mutton simmered in a creamy yogurt, poppy seed, and cashew nut gravy.', 9.90, '/images/angeau-au-curry.jpg', true, true),
    ('hass-bhuna', 'Hass Bhuna', 'Weekly Special', 'Slow-roasted succulent duck cooked in caramelized onions and roasted whole spices.', 9.90, '/images/boeuf-au-curry.jpg', true, true),
    ('kala-bhuna', 'Kala Bhuna', 'Weekly Special', 'Traditional Chittagong-style caramelized beef cooked dark and tender with roasted spices.', 9.90, '/images/boeuf-au-curry.jpg', true, true),
    ('beef-mejbaan', 'Beef Mejbaan', 'Weekly Special', 'Authentic Chittagong ceremonial beef stew cooked with mustard paste and fiery spices.', 9.90, '/images/beef-rezala-v2.jpg', true, true),

    -- Evening Special
    ('mutton-halim', 'Mutton Halim', 'Evening Special', 'Slow-cooked lentils, wheat, and shredded mutton porridge served with ginger, mint, and fried onions.', 6.90, '/images/angeau-au-curry.jpg', false, true),
    ('buri-fry', 'Buri Fry', 'Evening Special', 'Crispy pan-fried spiced beef tripe prepared in traditional Old Dhaka style.', 6.90, '/images/poulet-tikka.jpg', false, true),
    ('thai-soup', 'Thai Soup', 'Evening Special', 'Rich comforting sweet and spicy chicken soup with lemongrass and lime leaves.', 6.90, '/images/curry-au-légume.jpg', false, true),
    ('whole-chicken-grill-half', 'Whole Chicken Grill Half', 'Evening Special', 'Half spring chicken marinated in yogurt and tandoori spices, flame-grilled.', 6.90, '/images/poulet-tandoori.jpg', false, true),
    ('whole-chicken-grill-full', 'Whole Chicken Grill Full', 'Evening Special', 'Full whole chicken marinated in royal tandoori herbs, slow-grilled to tender perfection.', 10.90, '/images/poulet-tandoori.jpg', false, true),

    -- Party Special
    ('party-special-1', 'Kacchi, Chicken Roast, Jali kabab, Borhani, Jorda/Firni, Chutney, Salad', 'Party Special', 'Complete royal party banquet with Mutton Kacchi, chicken roast, jali kabab, borhani, dessert, chutney, and fresh salad.', 19.90, '/images/biryani-mouton.jpg', false, true),
    ('party-special-2', 'Kacchi, Jali kabab, Beef Rezala, Borhani, Jorda/Firni, Chutney, Salad', 'Party Special', 'Grand royal banquet featuring Mutton Kacchi, jali kabab, rich beef rezala, borhani, dessert, chutney, and salad.', 21.90, '/images/biryani-mouton.jpg', false, true),
    ('party-special-3', 'Plain Polau, Jali Kabab, Chicken Roast, Beef Rezala/Mutton Rezala, Borhani, Jorda/Firni, Chutney, Salad', 'Party Special', 'Ultimate grand banquet platter: fragrant polau, jali kabab, chicken roast, rezala, borhani, dessert, chutney, and salad.', 25.90, '/images/roast-polau.jpg', false, true),

    -- Rooti
    ('rumali-rooti', 'Rumali Rooti', 'Rooti', 'Handkerchief-thin delicate soft flatbread baked over a domed griddle.', 2.50, '/images/naan-fromage.jpg', false, true),
    ('plain-nan', 'Plain Nan', 'Rooti', 'Traditional tandoor-baked leavened flatbread with a golden crust.', 2.00, '/images/naan-fromage.jpg', false, true),
    ('garlic-nan', 'Garlic Nan', 'Rooti', 'Freshly baked tandoori nan brushed with aromatic garlic butter and coriander.', 2.90, '/images/naan-ail-fromage.jpg', false, true),
    ('chees-nan', 'Chees Nan', 'Rooti', 'Tandoori nan generously filled with melted French cheese.', 3.90, '/images/naan-fromage.jpg', false, true),

    -- Additional
    ('extra-jali-kabab', 'Jali Kabab', 'Additional', 'Minced mutton spiced patty wrapped in delicate golden egg net filigree.', 2.50, '/images/poulet-tikka.jpg', false, true),
    ('extra-plain-polau', 'Plain polau', 'Additional', 'Steamed fragrant Chinigura rice infused with whole cardamom, cinnamon, and ghee.', 4.90, '/images/roast-polau.jpg', false, true),
    ('extra-chicken-roast', 'Chicken Roast', 'Additional', 'Golden chicken quarter braised in a rich aromatic poppy-seed and onion gravy.', 6.90, '/images/chicken-roast.jpg', false, true),
    ('extra-beef-rezala', 'Beef Rezala', 'Additional', 'Tender beef cubes slow-simmered in seasoned yogurt and ground nut sauce.', 7.90, '/images/beef-rezala-v2.jpg', false, true),
    ('extra-chutney', 'Chutney', 'Additional', 'Sweet and tangy tamarind and mint house chutney.', 1.00, '/images/curry-au-légume.jpg', false, true),
    ('extra-french-fry', 'French Fry', 'Additional', 'Crispy fried potato batons seasoned with mild roasted spices.', 2.90, '/images/poulet-tikka.jpg', false, true),

    -- Desserts
    ('firni', 'Firni', 'Desserts', 'Traditional slow-cooked ground aromatic rice pudding scented with kewra and crushed nuts.', 3.00, '/images/firni.jpg', false, true),
    ('jorda', 'Jorda', 'Desserts', 'Sweet saffron basmati rice with ghee, nuts, raisins, and baby sweetmeats.', 3.00, '/images/jorda.jpg', false, true),

    -- Beverage
    ('mineral-water-50cl', 'Mineral Water... 50cl', 'Beverage', 'Chilled natural French mineral water bottle (50cl).', 2.50, '/images/lassi-nature.jpg', false, true),
    ('gaz-water-50cl', 'Gaz Water... 50cl', 'Beverage', 'Sparkling mineral water bottle (50cl).', 2.50, '/images/lassi-nature.jpg', false, true),
    ('coca-cola-33cl', 'Coca cola... 33cl', 'Beverage', 'Chilled Coca-Cola can (33cl).', 2.50, '/images/lassi-nature.jpg', false, true),
    ('sprite-33cl', 'Sprite... 33cl', 'Beverage', 'Chilled Sprite can (33cl).', 2.50, '/images/lassi-nature.jpg', false, true),
    ('7up-33cl', '7up... 33cl', 'Beverage', 'Chilled 7up can (33cl).', 2.50, '/images/lassi-nature.jpg', false, true),
    ('borhani-33cl', 'Borhani... 33cl', 'Beverage', 'Authentic Old Dhaka spiced yogurt drink with roasted cumin, mint, and rock salt (33cl).', 3.00, '/images/lassi-nature.jpg', false, true),
    ('mango-lacchi-33cl', 'Mango Lacchi... 33cl', 'Beverage', 'Thick creamy yogurt drink blended with sweet Alphonso mango puree (33cl).', 3.00, '/images/lassi-mangue.jpg', false, true),
    ('badam-sorbat-33cl', 'Badam Sorbat... 33cl', 'Beverage', 'Chilled almond milk elixir with green cardamom and crushed pistachios (33cl).', 3.00, '/images/lassi-rose.jpg', false, true),
    ('zafrani-sorbat-33cl', 'Zafrani Sorbat... 33cl', 'Beverage', 'Royal chilled milk sharbat infused with Iranian saffron and rose essence (33cl).', 3.00, '/images/lassi-rose.jpg', false, true)
on conflict (id) do update set
    name = excluded.name,
    category = excluded.category,
    description = excluded.description,
    price = excluded.price,
    image_url = excluded.image_url,
    is_weekly_special = excluded.is_weekly_special,
    is_available = excluded.is_available;


-- ==============================================================================
-- 5. MAIN ADMIN USER SEED (amir26hossin@gmail.com / Riad@1234)
-- Run this block in your Supabase SQL editor to provision the Main Admin account.
-- ==============================================================================

do $$
declare
  admin_uid uuid := 'a1111111-1111-1111-1111-111111111111'::uuid;
begin
  if not exists (select 1 from auth.users where email = 'amir26hossin@gmail.com') then
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token
    ) values (
      '00000000-0000-0000-0000-000000000000',
      admin_uid,
      'authenticated',
      'authenticated',
      'amir26hossin@gmail.com',
      crypt('Riad@1234', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Amir Hossin","role":"Main Admin"}'::jsonb,
      now(),
      now(),
      ''
    );

    insert into auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      admin_uid,
      format('{"sub":"%s","email":"%s"}', admin_uid::text, 'amir26hossin@gmail.com')::jsonb,
      'email',
      admin_uid::text,
      now(),
      now(),
      now()
    );
  end if;
end $$;
