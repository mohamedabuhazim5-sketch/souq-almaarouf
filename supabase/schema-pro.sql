-- =========================================================
-- Souq Almaarouf - PRO Supabase SQL
-- نسخة أكبر ومضبوطة
-- =========================================================

create extension if not exists pgcrypto;

drop function if exists public.set_updated_at() cascade;
drop function if exists public.set_order_item_line_total() cascade;
drop function if exists public.set_order_tracking_code() cascade;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  slug text not null unique,
  description_ar text,
  image_url text,
  banner_url text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name_ar text not null,
  slug text not null unique,
  short_description text,
  long_description text,
  image_url text,
  sku text unique,
  unit_label text not null default 'كجم',
  weight_value numeric(10,2) not null default 1,
  price numeric(10,2) not null default 0,
  sale_price numeric(10,2),
  min_order_qty integer not null default 1,
  max_order_qty integer,
  stock_qty integer not null default 0,
  low_stock_threshold integer not null default 5,
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_active boolean not null default true,
  meta_title text,
  meta_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  phone text not null,
  email text,
  address text,
  city text,
  area text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_city text,
  customer_area text,
  payment_method text not null check (payment_method in ('cash', 'instapay', 'vodafone_cash')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  notes text,
  admin_notes text,
  status text not null default 'new' check (status in ('new', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled')),
  subtotal_amount numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null default 0,
  coupon_code text,
  tracking_code text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_slug text,
  weight_label text not null,
  price numeric(10,2) not null,
  quantity integer not null default 1 check (quantity > 0),
  line_total numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null default 'سوق المعروف',
  whatsapp_number text not null default '01112223226',
  facebook_group_url text,
  facebook_page_url text,
  instagram_url text,
  tiktok_url text,
  support_text text,
  address_text text,
  delivery_policy text,
  refund_policy text,
  seo_home_title text,
  seo_home_description text,
  hero_title text,
  hero_subtitle text,
  hero_image_url text,
  show_best_sellers boolean not null default true,
  show_featured_categories boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description_ar text,
  discount_type text not null check (discount_type in ('fixed', 'percent')),
  discount_value numeric(10,2) not null default 0,
  min_order_amount numeric(10,2) not null default 0,
  max_discount_amount numeric(10,2),
  usage_limit integer,
  used_count integer not null default 0,
  is_active boolean not null default true,
  starts_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  email text not null unique,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  subtitle_ar text,
  image_url text,
  button_text text,
  button_link text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_features (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  description_ar text,
  icon_name text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_categories_sort_order on public.categories(sort_order);
create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_products_is_active on public.products(is_active);
create index if not exists idx_products_is_best_seller on public.products(is_best_seller);
create index if not exists idx_orders_customer_phone on public.orders(customer_phone);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_tracking_code on public.orders(tracking_code);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_customers_phone on public.customers(phone);
create index if not exists idx_coupons_code on public.coupons(code);

drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_customers_updated_at on public.customers;
create trigger trg_customers_updated_at before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists trg_store_settings_updated_at on public.store_settings;
create trigger trg_store_settings_updated_at before update on public.store_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_coupons_updated_at on public.coupons;
create trigger trg_coupons_updated_at before update on public.coupons
for each row execute function public.set_updated_at();

drop trigger if exists trg_admin_users_updated_at on public.admin_users;
create trigger trg_admin_users_updated_at before update on public.admin_users
for each row execute function public.set_updated_at();

drop trigger if exists trg_banners_updated_at on public.banners;
create trigger trg_banners_updated_at before update on public.banners
for each row execute function public.set_updated_at();

drop trigger if exists trg_store_features_updated_at on public.store_features;
create trigger trg_store_features_updated_at before update on public.store_features
for each row execute function public.set_updated_at();

create or replace function public.set_order_item_line_total()
returns trigger
language plpgsql
as $$
begin
  new.line_total = coalesce(new.price, 0) * coalesce(new.quantity, 0);
  return new;
end;
$$;

drop trigger if exists trg_order_items_line_total on public.order_items;
create trigger trg_order_items_line_total before insert or update on public.order_items
for each row execute function public.set_order_item_line_total();

create or replace function public.set_order_tracking_code()
returns trigger
language plpgsql
as $$
begin
  if new.tracking_code is null then
    new.tracking_code = upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 10));
  end if;
  return new;
end;
$$;

drop trigger if exists trg_orders_tracking_code on public.orders;
create trigger trg_orders_tracking_code before insert on public.orders
for each row execute function public.set_order_tracking_code();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.store_settings enable row level security;
alter table public.coupons enable row level security;
alter table public.admin_users enable row level security;
alter table public.banners enable row level security;
alter table public.store_features enable row level security;

do $$
declare
  r record;
begin
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'categories','products','product_images','customers','orders','order_items',
        'store_settings','coupons','admin_users','banners','store_features'
      )
  loop
    execute format('drop policy if exists %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;
end $$;

create policy "public read active categories"
on public.categories for select
using (is_active = true);

create policy "public read active products"
on public.products for select
using (is_active = true);

create policy "public read product images"
on public.product_images for select
using (true);

create policy "public read store settings"
on public.store_settings for select
using (true);

create policy "public read active coupons"
on public.coupons for select
using (is_active = true);

create policy "public read active banners"
on public.banners for select
using (is_active = true);

create policy "public read active store features"
on public.store_features for select
using (is_active = true);

create policy "public insert customers"
on public.customers for insert
with check (true);

create policy "public update customers"
on public.customers for update
using (true)
with check (true);

create policy "public insert orders"
on public.orders for insert
with check (true);

create policy "public insert order items"
on public.order_items for insert
with check (true);

create policy "auth manage categories"
on public.categories for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "auth manage products"
on public.products for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "auth manage product images"
on public.product_images for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "auth manage customers"
on public.customers for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "auth manage orders"
on public.orders for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "auth manage order items"
on public.order_items for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "auth manage store settings"
on public.store_settings for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "auth manage coupons"
on public.coupons for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "auth manage admin users"
on public.admin_users for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "auth manage banners"
on public.banners for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "auth manage store features"
on public.store_features for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

insert into public.store_settings (
  store_name, whatsapp_number, facebook_group_url, facebook_page_url, instagram_url,
  support_text, address_text, delivery_policy, refund_policy, seo_home_title,
  seo_home_description, hero_title, hero_subtitle, hero_image_url
)
values (
  'سوق المعروف',
  '01112223226',
  'https://www.facebook.com/almaroufmarket',
  'https://www.facebook.com/almaroufmarket',
  '',
  'أهلاً بك في سوق المعروف - خضار وفاكهة ومنتجات طازجة يوميًا',
  'خدمة توصيل سريعة داخل المنطقة',
  'التوصيل حسب المنطقة ووقت الطلب',
  'يمكن الاستبدال أو الاسترجاع حسب الحالة خلال نفس اليوم',
  'سوق المعروف | خضار وفاكهة طازجة',
  'متجر عربي لطلب الخضار والفاكهة والمنتجات الطازجة بسهولة وسرعة',
  'سوق المعروف',
  'اطلب خضارك وفاكهتك ومنتجاتك اليومية بسهولة',
  'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1400&auto=format&fit=crop'
)
on conflict do nothing;

insert into public.categories (name_ar, slug, description_ar, image_url, banner_url, is_featured, sort_order, is_active)
values
('خضار طازج', 'fresh-vegetables', 'خضروات طازجة يوميًا وبجودة ممتازة', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop', null, true, 1, true),
('فاكهة طازجة', 'fresh-fruits', 'فاكهة طازجة مختارة بعناية', 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=1200&auto=format&fit=crop', null, true, 2, true),
('ورقيات وأعشاب', 'greens-herbs', 'ملوخية وبقدونس وشبت وكزبرة وغيرهم', 'https://images.unsplash.com/photo-1524593166156-312f362cada0?q=80&w=1200&auto=format&fit=crop', null, true, 3, true),
('منتجات مجهزة', 'prepared-items', 'خضار مجهز للطبخ السريع', 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop', null, false, 4, true),
('عروض اليوم', 'today-offers', 'أفضل عروض وأسعار اليوم', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1200&auto=format&fit=crop', null, true, 5, true)
on conflict (slug) do nothing;

insert into public.products (
  category_id, name_ar, slug, short_description, long_description, image_url, sku,
  unit_label, weight_value, price, sale_price, min_order_qty, max_order_qty,
  stock_qty, low_stock_threshold, is_featured, is_best_seller, is_active,
  meta_title, meta_description
)
select c.id, p.name_ar, p.slug, p.short_description, p.long_description, p.image_url, p.sku,
       p.unit_label, p.weight_value, p.price, p.sale_price, p.min_order_qty, p.max_order_qty,
       p.stock_qty, p.low_stock_threshold, p.is_featured, p.is_best_seller, p.is_active,
       p.meta_title, p.meta_description
from public.categories c
join (
  values
  ('fresh-vegetables','طماطم','tomatoes','طماطم طازجة يوميًا بجودة ممتازة.','طماطم حمراء طازجة مناسبة للسلطة والطهي اليومي.','https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1200&auto=format&fit=crop','SKU-TOM-001','كجم',1::numeric,18::numeric,16::numeric,1,10,100,5,true,true,true,'طماطم طازجة | سوق المعروف','اطلب طماطم طازجة يوميًا من سوق المعروف'),
  ('fresh-vegetables','خيار','cucumber','خيار طازج مناسب للسلطة اليومية.','خيار أخضر طازج بطعم ممتاز للاستخدام اليومي.','https://images.unsplash.com/photo-1604977046806-87a1eccf7d66?q=80&w=1200&auto=format&fit=crop','SKU-CUC-001','كجم',1::numeric,22::numeric,null,1,10,120,5,true,false,true,'خيار طازج | سوق المعروف','اطلب خيار طازج من سوق المعروف'),
  ('fresh-vegetables','بطاطس','potatoes','بطاطس ممتازة للطهي والتحمير.','بطاطس مختارة بعناية مناسبة لكل الاستخدامات المنزلية.','https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=1200&auto=format&fit=crop','SKU-POT-001','كجم',1::numeric,20::numeric,18::numeric,1,15,150,8,false,true,true,'بطاطس | سوق المعروف','بطاطس طازجة يوميًا'),
  ('fresh-fruits','برتقال','orange','برتقال طازج بطعم حلو ومميز.','برتقال طازج غني بالعصير وطعم ممتاز.','https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=1200&auto=format&fit=crop','SKU-ORG-001','كجم',1::numeric,35::numeric,30::numeric,1,10,90,5,true,true,true,'برتقال | سوق المعروف','اطلب برتقال طازج'),
  ('fresh-fruits','موز','banana','موز طازج مناسب للفطور والعصائر.','موز طازج عالي الجودة.','https://images.unsplash.com/photo-1574226516831-e1dff420e37f?q=80&w=1200&auto=format&fit=crop','SKU-BAN-001','كجم',1::numeric,38::numeric,null,1,10,70,5,false,false,true,'موز | سوق المعروف','موز طازج يوميًا'),
  ('greens-herbs','ملوخية','molokhia','ملوخية خضراء طازجة.','ملوخية طازجة مناسبة للطبخ اليومي.','https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=1200&auto=format&fit=crop','SKU-MOL-001','ربطة',1::numeric,12::numeric,null,1,20,60,5,false,false,true,'ملوخية | سوق المعروف','ملوخية خضراء طازجة'),
  ('greens-herbs','بقدونس','parsley','بقدونس طازج يوميًا.','بقدونس أخضر وطازج.','https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?q=80&w=1200&auto=format&fit=crop','SKU-PAR-001','ربطة',1::numeric,5::numeric,null,1,20,80,10,false,false,true,'بقدونس | سوق المعروف','بقدونس طازج'),
  ('prepared-items','خضار مشكل للشوربة','mixed-soup-vegetables','خضار مجهز للشوربة والطهي السريع.','خضار مقطع ومجهز لتسهيل الطبخ اليومي.','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop','SKU-MIX-001','جم',500::numeric,28::numeric,null,1,10,40,5,false,true,true,'خضار مشكل | سوق المعروف','خضار مشكل جاهز للشوربة'),
  ('today-offers','عرض طماطم وخيار','offer-tomato-cucumber','عرض مميز على طماطم وخيار.','سعر خاص لفترة محدودة.','https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop','SKU-OFF-001','عرض',1::numeric,35::numeric,29::numeric,1,5,30,3,true,true,true,'عروض اليوم | سوق المعروف','أفضل عروض اليوم')
) as p(
  category_slug, name_ar, slug, short_description, long_description, image_url, sku,
  unit_label, weight_value, price, sale_price, min_order_qty, max_order_qty,
  stock_qty, low_stock_threshold, is_featured, is_best_seller, is_active,
  meta_title, meta_description
) on c.slug = p.category_slug
on conflict (slug) do nothing;

insert into public.coupons (
  code, description_ar, discount_type, discount_value, min_order_amount,
  max_discount_amount, usage_limit, used_count, is_active, starts_at, expires_at
)
values
('WELCOME10', 'خصم 10% لأول طلب', 'percent', 10, 100, 50, 1000, 0, true, now(), now() + interval '180 days'),
('SAVE20', 'خصم ثابت 20 جنيه', 'fixed', 20, 150, null, 1000, 0, true, now(), now() + interval '180 days'),
('FRUIT15', 'خصم 15% على طلبات الفاكهة', 'percent', 15, 120, 40, 500, 0, true, now(), now() + interval '120 days')
on conflict (code) do nothing;

insert into public.banners (title_ar, subtitle_ar, image_url, button_text, button_link, sort_order, is_active)
values
('عروض اليوم', 'أفضل أسعار الخضار والفاكهة الطازجة', 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=1400&auto=format&fit=crop', 'تسوق الآن', '/', 1, true),
('توصيل سريع', 'اطلب الآن وسيصلك الطلب في أسرع وقت', 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1400&auto=format&fit=crop', 'ابدأ الطلب', '/', 2, true)
on conflict do nothing;

insert into public.store_features (title_ar, description_ar, icon_name, sort_order, is_active)
values
('توصيل سريع', 'نوصّل طلبك بسرعة داخل المنطقة', 'truck', 1, true),
('منتجات طازجة', 'نختار المنتجات بعناية يوميًا', 'leaf', 2, true),
('دفع مرن', 'كاش أو إنستا باي أو فودافون كاش', 'wallet', 3, true),
('خدمة واتساب', 'تواصل سريع ومباشر على واتساب', 'message-circle', 4, true)
on conflict do nothing;

-- ملاحظات:
-- 1) أنشئ bucket باسم products
-- 2) اجعل الـ bucket Public
-- 3) أنشئ الأدمن من Supabase Auth
-- 4) استخدم Project URL فقط بدون /rest/v1
