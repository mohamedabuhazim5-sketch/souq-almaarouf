import { useEffect, useState } from "react";
import AdminShell from "../../components/admin/AdminShell";
import PageLoader from "../../components/common/PageLoader";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../../services/categories";
import { uploadProductImage } from "../../services/storage";

const emptyForm = { name_ar: "", slug: "", sort_order: 0, is_active: true, image_url: "" };

export default function AdminCategoriesPage() {
  const [loading, setLoading] = useState(true), [categories, setCategories] = useState([]), [error, setError] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false), [editingCategoryId, setEditingCategoryId] = useState(null), [form, setForm] = useState(emptyForm), [saving, setSaving] = useState(false), [uploadingImage, setUploadingImage] = useState(false);

  const loadData = async () => { setLoading(true); setError(""); try { setCategories(await getAllCategories()); } catch (err) { console.error(err); setError(err.message || "تعذر تحميل الأقسام"); } finally { setLoading(false); } };
  useEffect(() => { loadData(); }, []);
  const handleQuickAdd = async () => { try { await createCategory({ name_ar: `قسم جديد ${Date.now()}`, slug: `category-${Date.now()}`, sort_order: categories.length + 1, is_active: true, image_url: "" }); await loadData(); } catch (err) { setError(err?.message || "تعذر إضافة القسم"); } };
  const handleDelete = async (id) => { if (!window.confirm("هل تريد حذف القسم؟")) return; try { await deleteCategory(id); await loadData(); } catch (err) { setError(err.message || "تعذر حذف القسم"); } };
  const handleToggle = async (category) => { try { await updateCategory(category.id, { is_active: !category.is_active }); await loadData(); } catch (err) { setError(err.message || "تعذر تعديل حالة القسم"); } };
  const openEditModal = (category) => { setEditingCategoryId(category.id); setForm({ name_ar: category.name_ar || "", slug: category.slug || "", sort_order: category.sort_order ?? 0, is_active: category.is_active ?? true, image_url: category.image_url || "" }); setIsEditOpen(true); };
  const closeEditModal = () => { setIsEditOpen(false); setEditingCategoryId(null); setForm(emptyForm); };
  const handleFormChange = (e) => { const { name, value, type, checked } = e.target; setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value })); };
  const handleCategoryImageUpload = async (file) => { if (!file) return; try { setUploadingImage(true); const imageUrl = await uploadProductImage(file); setForm((prev) => ({ ...prev, image_url: imageUrl })); } catch (err) { setError(err.message || "تعذر رفع صورة القسم"); } finally { setUploadingImage(false); } };
  const handleSaveEdit = async (e) => { e.preventDefault(); try { setSaving(true); await updateCategory(editingCategoryId, { name_ar: form.name_ar, slug: form.slug, sort_order: Number(form.sort_order), is_active: form.is_active, image_url: form.image_url || null }); closeEditModal(); await loadData(); } catch (err) { setError(err?.message || "تعذر حفظ تعديل القسم"); } finally { setSaving(false); } };
  if (loading) return <AdminShell title="إدارة الأقسام" subtitle="جاري تحميل الأقسام"><PageLoader text="جاري تحميل الأقسام" /></AdminShell>;
  return <><AdminShell title="إدارة الأقسام" subtitle="إدارة سريعة للأقسام" actions={<button className="primary-btn" onClick={handleQuickAdd}>إضافة سريعة</button>}>
    {error ? <div className="error-box">{error}</div> : null}
    <div className="admin-card"><div className="table-wrap"><table className="admin-table"><thead><tr><th>القسم</th><th>slug</th><th>الترتيب</th><th>الحالة</th><th>إجراءات</th></tr></thead><tbody>
      {categories.map((category) => <tr key={category.id}><td>{category.name_ar}</td><td>{category.slug}</td><td>{category.sort_order}</td><td>{category.is_active ? "ظاهر" : "مخفي"}</td><td><div className="table-actions"><button className="secondary-btn small-btn" onClick={() => openEditModal(category)}>تعديل</button><button className="secondary-btn small-btn" onClick={() => handleToggle(category)}>تبديل الظهور</button><button className="danger-btn small-btn" onClick={() => handleDelete(category.id)}>حذف</button></div></td></tr>)}
      {categories.length === 0 ? <tr><td colSpan="5" style={{textAlign:"center",padding:"20px"}}>لا توجد أقسام</td></tr> : null}
    </tbody></table></div></div></AdminShell>
    {isEditOpen ? <div className="modal-backdrop"><div className="modal-card"><div className="modal-header"><h2>تعديل القسم</h2><button className="danger-btn small-btn" onClick={closeEditModal}>إغلاق</button></div><form className="settings-form" onSubmit={handleSaveEdit}>
      <input name="name_ar" placeholder="اسم القسم" value={form.name_ar} onChange={handleFormChange} required />
      <input name="slug" placeholder="slug" value={form.slug} onChange={handleFormChange} required />
      <input name="sort_order" type="number" placeholder="الترتيب" value={form.sort_order} onChange={handleFormChange} />
      <div><label className="file-upload-chip" style={{display:"inline-flex"}}>{uploadingImage ? "جارٍ رفع الصورة..." : "رفع صورة القسم"}<input type="file" accept="image/*" hidden onChange={(e) => handleCategoryImageUpload(e.target.files?.[0])} /></label></div>
      {form.image_url ? <div style={{marginTop:"10px"}}><img src={form.image_url} alt="صورة القسم" style={{width:"120px",height:"120px",objectFit:"cover",borderRadius:"12px",border:"1px solid #ddd"}} /></div> : null}
      <label style={{display:"flex",gap:"8px",alignItems:"center"}}><input name="is_active" type="checkbox" checked={form.is_active} onChange={handleFormChange} />القسم ظاهر</label>
      <button type="submit" className="primary-btn" disabled={saving}>{saving ? "جاري الحفظ..." : "حفظ التعديل"}</button>
    </form></div></div> : null}</>;
}
