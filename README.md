# سوق المعروف

متجر عربي RTL مبني بـ React + Vite + Supabase.

## التشغيل
1. انسخ `.env.example` إلى `.env`
2. ضع مفاتيح Supabase
3. نفّذ:
```bash
npm install
npm run dev
```

## النشر
- ارفع المشروع إلى GitHub
- اربطه مع Vercel
- أضف:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## ملاحظات
- طرق الدفع: كاش / إنستا باي / فودافون كاش
- الفاتورة تعرض: الصنف + السعر + الوزن فقط
- جروب الفيس ورقم الواتساب يتم سحبهما من `store_settings`
