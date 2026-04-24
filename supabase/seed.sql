insert into store_settings (
  store_name, whatsapp_number, facebook_group_url, facebook_page_url, support_text
) values (
  'سوق المعروف',
  '01112223226',
  'https://www.facebook.com/almaroufmarket',
  'https://www.facebook.com/almaroufmarket',
  'أهلاً بك في سوق المعروف'
);

insert into categories (name_ar, slug, is_featured, sort_order) values
('خضار طازج', 'fresh-vegetables', true, 1),
('فاكهة طازجة', 'fresh-fruits', true, 2),
('ورقيات وأعشاب', 'greens-herbs', true, 3),
('منتجات مجهزة', 'prepared-items', false, 4)
on conflict do nothing;

insert into coupons (code, discount_type, discount_value, min_order_amount, is_active) values
('WELCOME10', 'percent', 10, 100, true),
('SAVE20', 'fixed', 20, 150, true)
on conflict (code) do nothing;
