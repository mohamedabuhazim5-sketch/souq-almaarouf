import { useMemo, useState } from "react";
import AdminShell from "../../components/admin/AdminShell";
import { createManualOrder } from "../../services/adminOrders";

const emptyItem = {
  product_name: "",
  weight_label: "1 كجم",
  price: 0,
  quantity: 1,
};

export default function AdminCreateOrderPage() {
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    customer_city: "",
    customer_area: "",
    payment_method: "cash",
    payment_status: "pending",
    delivery_type: "delivery",
    delivery_fee: 0,
    discount_amount: 0,
    notes: "",
  });
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    [items]
  );

  const total = useMemo(
    () => subtotal + Number(form.delivery_fee || 0) - Number(form.discount_amount || 0),
    [subtotal, form.delivery_fee, form.discount_amount]
  );

  const updateItem = (index, key, value) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const addItem = () => setItems((prev) => [...prev, { ...emptyItem }]);
  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await createManualOrder({
        ...form,
        subtotal_amount: subtotal,
        total_amount: total,
        items: items.map((item) => ({
          ...item,
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1),
        })),
      });

      setSuccess(`تم إنشاء الطلب بنجاح - رقم الفاتورة: ${result.invoice_number}`);
      setForm({
        customer_name: "",
        customer_phone: "",
        customer_address: "",
        customer_city: "",
        customer_area: "",
        payment_method: "cash",
        payment_status: "pending",
        delivery_type: "delivery",
        delivery_fee: 0,
        discount_amount: 0,
        notes: "",
      });
      setItems([{ ...emptyItem }]);
    } catch (err) {
      console.error("CREATE MANUAL ORDER ERROR:", err);
      setError(err.message || "تعذر إنشاء الطلب");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell title="إضافة طلب" subtitle="إدخال طلب يدوي من لوحة التحكم">
      {error ? <div className="error-box">{error}</div> : null}
      {success ? <div className="success-box">{success}</div> : null}

      <div className="admin-card">
        <form className="settings-form" onSubmit={handleSubmit}>
          <input placeholder="اسم العميل" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} required />
          <input placeholder="رقم الهاتف" value={form.customer_phone} onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} required />
          <input placeholder="العنوان" value={form.customer_address} onChange={(e) => setForm({ ...form, customer_address: e.target.value })} required />

          <div className="two-cols">
            <input placeholder="المدينة" value={form.customer_city} onChange={(e) => setForm({ ...form, customer_city: e.target.value })} />
            <input placeholder="المنطقة" value={form.customer_area} onChange={(e) => setForm({ ...form, customer_area: e.target.value })} />
          </div>

          <div className="two-cols">
            <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })}>
              <option value="cash">كاش</option>
              <option value="instapay">إنستا باي</option>
              <option value="vodafone_cash">فودافون كاش</option>
            </select>
            <select value={form.delivery_type} onChange={(e) => setForm({ ...form, delivery_type: e.target.value })}>
              <option value="delivery">دليفري</option>
              <option value="pickup">استلام من المتجر</option>
            </select>
          </div>

          <div className="two-cols">
            <input type="number" placeholder="رسوم التوصيل" value={form.delivery_fee} onChange={(e) => setForm({ ...form, delivery_fee: e.target.value })} />
            <input type="number" placeholder="الخصم" value={form.discount_amount} onChange={(e) => setForm({ ...form, discount_amount: e.target.value })} />
          </div>

          <textarea placeholder="ملاحظات" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

          <div className="admin-card compact-card">
            <h3>عناصر الطلب</h3>
            {items.map((item, index) => (
              <div key={index} className="manual-order-item-grid">
                <input placeholder="اسم الصنف" value={item.product_name} onChange={(e) => updateItem(index, "product_name", e.target.value)} required />
                <input placeholder="الوزن" value={item.weight_label} onChange={(e) => updateItem(index, "weight_label", e.target.value)} required />
                <input type="number" placeholder="السعر" value={item.price} onChange={(e) => updateItem(index, "price", e.target.value)} required />
                <input type="number" placeholder="الكمية" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} required />
                <button type="button" className="danger-btn small-btn" onClick={() => removeItem(index)}>حذف الصنف</button>
              </div>
            ))}
            <button type="button" className="secondary-btn" onClick={addItem}>إضافة صنف</button>
          </div>

          <div className="invoice-box">
            <p>إجمالي الأصناف: {subtotal} ج</p>
            <p>رسوم التوصيل: {form.delivery_fee || 0} ج</p>
            <p>الخصم: {form.discount_amount || 0} ج</p>
            <strong>الإجمالي النهائي: {total} ج</strong>
          </div>

          <button type="submit" className="primary-btn" disabled={saving}>
            {saving ? "جاري حفظ الطلب..." : "حفظ الطلب وإنشاء الفاتورة"}
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
