import { useEffect, useState } from "react";
import AdminShell from "../../components/admin/AdminShell";
import PageLoader from "../../components/common/PageLoader";
import { getStoreSettings, upsertStoreSettings } from "../../services/settings";
import { uploadProductImage } from "../../services/storage";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true), [saving, setSaving] = useState(false), [uploadingHero, setUploadingHero] = useState(false), [error, setError] = useState(""), [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    store_name: "سوق المعروف", whatsapp_number: "01112223226",
    facebook_group_url: "https://www.facebook.com/almaroufmarket", facebook_page_url: "https://www.facebook.com/almaroufmarket",
    instagram_url: "", tiktok_url: "", support_text: "أهلاً بك في سوق المعروف", address_text: "خدمة توصيل سريعة داخل المنطقة",
    delivery_policy: "", refund_policy: "", seo_home_title: "سوق المعروف | خضار وفاكهة طازجة",
    seo_home_description: "متجر عربي لطلب الخضار والفاكهة والمنتجات الطازجة بسهولة", hero_title: "سوق المعروف",
    hero_subtitle: "اطلب خضارك وفاكهتك ومنتجاتك اليومية بسهولة", hero_image_url: "", show_best_sellers: true, show_featured_categories: true,
  });
  useEffect(() => { (async () => { setLoading(true); try { const data = await getStoreSettings(); if (data) setForm((prev) => ({ ...prev, ...data })); } catch (err) { setError(err.message || "تعذر تحميل الإعدادات"); } finally { setLoading(false); } })(); }, []);
  const handleChange = (e) => { const { name, value, type, checked } = e.target; setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value })); };
  const handleHeroImageUpload = async (file) => { if (!file) return; try { setUploadingHero(true); const imageUrl = await uploadProductImage(file); setForm((prev) => ({ ...prev, hero_image_url: imageUrl })); } catch (err) { setError(err.message || "تعذر رفع صورة الهيرو"); } finally { setUploadingHero(false); } };
  const handleSave = async (e) => { e.preventDefault(); setSaving(true); setError(""); setSuccess(""); try { await upsertStoreSettings(form); setSuccess("تم حفظ الإعدادات بنجاح"); } catch (err) { setError(err.message || "تعذر حفظ الإعدادات"); } finally { setSaving(false); } };
  if (loading) return <AdminShell title="الإعدادات" subtitle="جاري تحميل الإعدادات"><PageLoader text="جاري تحميل الإعدادات" /></AdminShell>;
  return <AdminShell title="الإعدادات" subtitle="إدارة بيانات المتجر والواجهة">{error ? <div className="error-box">{error}</div> : null}{success ? <div className="success-box">{success}</div> : null}
    <div className="admin-card"><form className="settings-form" onSubmit={handleSave}>
      <input name="store_name" placeholder="اسم المتجر" value={form.store_name} onChange={handleChange} />
      <input name="whatsapp_number" placeholder="رقم الواتساب" value={form.whatsapp_number} onChange={handleChange} />
      <input name="facebook_group_url" placeholder="رابط جروب الفيس" value={form.facebook_group_url} onChange={handleChange} />
      <input name="facebook_page_url" placeholder="رابط صفحة الفيس" value={form.facebook_page_url} onChange={handleChange} />
      <div className="two-cols"><input name="instagram_url" placeholder="رابط إنستجرام" value={form.instagram_url} onChange={handleChange} /><input name="tiktok_url" placeholder="رابط تيك توك" value={form.tiktok_url} onChange={handleChange} /></div>
      <textarea name="support_text" placeholder="نص ترحيبي عام" value={form.support_text} onChange={handleChange} />
      <input name="address_text" placeholder="العنوان أو وصف مكان الخدمة" value={form.address_text} onChange={handleChange} />
      <textarea name="delivery_policy" placeholder="سياسة التوصيل" value={form.delivery_policy} onChange={handleChange} />
      <textarea name="refund_policy" placeholder="سياسة الاسترجاع" value={form.refund_policy} onChange={handleChange} />
      <div className="admin-card compact-card"><h3>إعدادات SEO</h3><input name="seo_home_title" placeholder="عنوان الصفحة الرئيسية" value={form.seo_home_title} onChange={handleChange} /><textarea name="seo_home_description" placeholder="وصف الصفحة الرئيسية" value={form.seo_home_description} onChange={handleChange} /></div>
      <div className="admin-card compact-card"><h3>إعدادات Hero Section</h3><input name="hero_title" placeholder="عنوان الهيرو" value={form.hero_title} onChange={handleChange} /><textarea name="hero_subtitle" placeholder="وصف الهيرو" value={form.hero_subtitle} onChange={handleChange} />
      <div><label className="file-upload-chip" style={{display:"inline-flex"}}>{uploadingHero ? "جارٍ رفع الصورة..." : "رفع صورة الهيرو"}<input type="file" accept="image/*" hidden onChange={(e) => handleHeroImageUpload(e.target.files?.[0])} /></label></div>
      {form.hero_image_url ? <img src={form.hero_image_url} alt="hero" style={{width:"220px",height:"140px",objectFit:"cover",borderRadius:"12px",border:"1px solid #ddd"}} /> : null}
      </div>
      <div className="checkbox-grid">
        <label><input type="checkbox" name="show_best_sellers" checked={form.show_best_sellers} onChange={handleChange} />عرض الأكثر مبيعًا</label>
        <label><input type="checkbox" name="show_featured_categories" checked={form.show_featured_categories} onChange={handleChange} />عرض الأقسام المميزة</label>
      </div>
      <div className="payment-settings-box"><h2>طرق الدفع المعتمدة</h2><p>كاش / إنستا باي / فودافون كاش</p></div>
      <button type="submit" className="primary-btn" disabled={saving}>{saving ? "جاري الحفظ..." : "حفظ التعديلات"}</button>
    </form></div>
  </AdminShell>;
}
