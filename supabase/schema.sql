create extension if not exists pgcrypto;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  slug text not null unique,
  image_url text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  name_ar text not null,
  slug text not null unique,
  short_description text,
  image_url text,
  unit_label text not null default 'كجم',
  weight_value numeric(10,2) not null default 1,
  price numeric(10,2) not null default 0,
  sale_price numeric(10,2),
  min_order_qty integer not null default 1,
  stock_qty integer not null default 0,
  is_featured boolean not null default false,
  is_best_seller boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  phone text not null,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  payment_method text not null check (payment_method in ('cash', 'instapay', 'vodafone_cash')),
  notes text,
  status text not null default 'new' check (status in ('new', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled')),
  total_amount numeric(10,2) not null default 0,
  coupon_code text,
  discount_amount numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  weight_label text not null,
  price numeric(10,2) not null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null default 'سوق المعروف',
  whatsapp_number text not null default '01112223226',
  facebook_group_url text,
  facebook_page_url text,
  instagram_url text,
  support_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('fixed', 'percent')),
  discount_value numeric(10,2) not null default 0,
  min_order_amount numeric(10,2) not null default 0,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
