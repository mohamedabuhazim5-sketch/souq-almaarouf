import { useEffect, useMemo, useState } from "react";
import AdminShell from "../../components/admin/AdminShell";
import PageLoader from "../../components/common/PageLoader";
import OrderInvoice from "../../components/admin/OrderInvoice";
import {
  cancelOrder,
  exportOrdersToCSV,
  getAllOrders,
  incrementInvoicePrintCount,
  updateOrderStatus,
  updateOrderWithItems,
} from "../../services/adminOrders";

const statusOptions = [
  { value: "new", label: "جديد" },
  { value: "confirmed", label: "تم التأكيد" },
  { value: "preparing", label: "جاري التجهيز" },
  { value: "delivering", label: "خرج للتوصيل" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
];

const emptyEditForm = {
  customer_name: "", customer_phone: "", customer_address: "",
  customer_city: "", customer_area: "", payment_method: "cash",
  payment_status: "pending", delivery_type: "delivery",
  delivery_fee: 0, discount_amount: 0, subtotal_amount: 0, total_amount: 0, notes: "",
};

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [printOrder, setPrintOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [editItems, setEditItems] = useState([]);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadData = async () => {
    setLoading(true); setError("");
    try { setOrders(await getAllOrders()); }
    catch (err) { console.error(err); setError(err.message || "تعذر تحميل الطلبات"); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, []);

  const filteredOrders = useMemo(() => orders.filter((order) => {
    const keyword = search.trim().toLowerCase();
    const matchesSearch = !keyword || String(order.customer_name || "").toLowerCase().includes(keyword) || String(order.customer_phone || "").toLowerCase().includes(keyword) || String(order.invoice_number || "").toLowerCase().includes(keyword);
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDelivery = deliveryFilter === "all" || order.delivery_type === deliveryFilter;
    return matchesSearch && matchesStatus && matchesDelivery;
  }), [orders, search, statusFilter, deliveryFilter]);

  const handleStatusChange = async (id, status) => { try { await updateOrderStatus(id, status); await loadData(); } catch (err) { setError(err.message || "تعذر تحديث حالة الطلب"); } };
  const handlePrintInvoice = async (order) => {
    setPrintOrder(order);
    setTimeout(async () => { window.print(); try { await incrementInvoicePrintCount(order.id, order.printed_count || 0); await loadData(); } catch {} }, 300);
  };
  const handleCancelOrder = async (id) => { if (!window.confirm("هل تريد إلغاء هذا الطلب؟")) return; try { await cancelOrder(id); await loadData(); } catch (err) { setError(err.message || "تعذر إلغاء الطلب"); } };

  const openEditModal = (order) => {
    setEditingOrderId(order.id);
    setEditForm({
      customer_name: order.customer_name || "", customer_phone: order.customer_phone || "", customer_address: order.customer_address || "",
      customer_city: order.customer_city || "", customer_area: order.customer_area || "",
      payment_method: order.payment_method || "cash", payment_status: order.payment_status || "pending",
      delivery_type: order.delivery_type || "delivery", delivery_fee: order.delivery_fee || 0,
      discount_amount: order.discount_amount || 0, subtotal_amount: order.subtotal_amount || 0,
      total_amount: order.total_amount || 0, notes: order.notes || "",
    });
    setEditItems((order.order_items || []).map((item) => ({
      id: item.id, product_name: item.product_name || "", weight_label: item.weight_label || "",
      price: item.price || 0, quantity: item.quantity || 1,
    })));
    setIsEditOpen(true);
  };
  const closeEditModal = () => { setIsEditOpen(false); setEditingOrderId(null); setEditForm(emptyEditForm); setEditItems([]); };
  const handleEditChange = (e) => { const { name, value } = e.target; setEditForm((prev) => ({ ...prev, [name]: value })); };
  const updateEditItem = (index, key, value) => setEditItems((prev) => prev.map((item, i) => i === index ? { ...item, [key]: value } : item));
  const addEditItem = () => setEditItems((prev) => [...prev, { product_name: "", weight_label: "1 كجم", price: 0, quantity: 1 }]);
  const removeEditItem = (index) => setEditItems((prev) => prev.filter((_, i) => i !== index));
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setSavingEdit(true); setError("");
      const subtotal = editItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
      const total = subtotal + Number(editForm.delivery_fee || 0) - Number(editForm.discount_amount || 0);
      await updateOrderWithItems(editingOrderId, {
        ...editForm, subtotal_amount: subtotal, total_amount: total,
        items: editItems.map((item) => ({ ...item, price: Number(item.price || 0), quantity: Number(item.quantity || 1) })),
      });
      closeEditModal(); await loadData();
    } catch (err) { console.error(err); setError(err.message || "تعذر حفظ تعديل الطلب"); }
    finally { setSavingEdit(false); }
  };

  if (loading) return <AdminShell title="الطلبات" subtitle="جاري تحميل الطلبات"><PageLoader text="جاري تحميل الطلبات" /></AdminShell>;

  return (<>
    <AdminShell title="الطلبات" subtitle="إدارة طلبات المتجر والدليفري" actions={<button className="primary-btn" onClick={() => exportOrdersToCSV(filteredOrders)}>تصدير CSV</button>}>
      {error ? <div className="error-box">{error}</div> : null}
      <div className="admin-toolbar">
        <input type="text" placeholder="ابحث باسم العميل أو الهاتف أو رقم الفاتورة" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">كل الحالات</option>{statusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
        </select>
        <select value={deliveryFilter} onChange={(e) => setDeliveryFilter(e.target.value)}>
          <option value="all">كل الأنواع</option><option value="delivery">دليفري</option><option value="pickup">استلام من المتجر</option>
        </select>
      </div>
      <div className="admin-card"><div className="table-wrap"><table className="admin-table">
        <thead><tr><th>رقم الفاتورة</th><th>العميل</th><th>الهاتف</th><th>طريقة الدفع</th><th>نوع الطلب</th><th>الحالة</th><th>الإجمالي</th><th>طباعة</th><th>إجراءات</th></tr></thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.invoice_number || "—"}</td><td>{order.customer_name}</td><td>{order.customer_phone}</td><td>{order.payment_method}</td><td>{order.delivery_type === "delivery" ? "دليفري" : "استلام"}</td>
              <td><select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>{statusOptions.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></td>
              <td>{order.total_amount} ج</td><td>{order.printed_count || 0}</td>
              <td><div className="table-actions">
                <button className="secondary-btn small-btn" onClick={() => setActiveOrder(order)}>التفاصيل</button>
                <button className="secondary-btn small-btn" onClick={() => openEditModal(order)}>تعديل</button>
                <button className="primary-btn small-btn" onClick={() => handlePrintInvoice(order)}>طباعة الفاتورة</button>
                <button className="danger-btn small-btn" onClick={() => handleCancelOrder(order.id)}>إلغاء</button>
              </div></td>
            </tr>
          ))}
          {filteredOrders.length === 0 ? <tr><td colSpan="9" style={{textAlign:"center",padding:"20px"}}>لا توجد طلبات مطابقة</td></tr> : null}
        </tbody></table></div></div>
    </AdminShell>

    {activeOrder ? <div className="modal-backdrop"><div className="modal-card large-modal"><div className="modal-header"><h2>تفاصيل الطلب</h2><button className="danger-btn small-btn" onClick={() => setActiveOrder(null)}>إغلاق</button></div>
      <div className="order-details-grid">
        <div className="admin-card compact-card">
          <p><strong>رقم الفاتورة:</strong> {activeOrder.invoice_number || "—"}</p>
          <p><strong>العميل:</strong> {activeOrder.customer_name}</p>
          <p><strong>الهاتف:</strong> {activeOrder.customer_phone}</p>
          <p><strong>العنوان:</strong> {activeOrder.customer_address}</p>
          <p><strong>المدينة:</strong> {activeOrder.customer_city || "—"}</p>
          <p><strong>المنطقة:</strong> {activeOrder.customer_area || "—"}</p>
          <p><strong>نوع الطلب:</strong> {activeOrder.delivery_type === "delivery" ? "دليفري" : "استلام من المتجر"}</p>
          <p><strong>الدفع:</strong> {activeOrder.payment_method}</p>
          <p><strong>حالة الدفع:</strong> {activeOrder.payment_status}</p>
          <p><strong>الحالة:</strong> {activeOrder.status}</p>
          <p><strong>المصدر:</strong> {activeOrder.order_source || "website"}</p>
          <p><strong>عدد مرات طباعة الفاتورة:</strong> {activeOrder.printed_count || 0}</p>
          <p><strong>ملاحظات:</strong> {activeOrder.notes || "لا يوجد"}</p>
        </div>
        <div className="admin-card compact-card">
          <h3>عناصر الطلب</h3>
          {(activeOrder.order_items || []).map((item) => <p key={item.id}>{item.product_name} | {item.price} ج | {item.weight_label} | الكمية: {item.quantity}</p>)}
          <hr />
          <p><strong>إجمالي الأصناف:</strong> {activeOrder.subtotal_amount} ج</p>
          <p><strong>رسوم التوصيل:</strong> {activeOrder.delivery_fee} ج</p>
          <p><strong>الخصم:</strong> {activeOrder.discount_amount} ج</p>
          <p><strong>الإجمالي النهائي:</strong> {activeOrder.total_amount} ج</p>
        </div>
      </div></div></div> : null}

    {isEditOpen ? <div className="modal-backdrop"><div className="modal-card large-modal"><div className="modal-header"><h2>تعديل الطلب</h2><button className="danger-btn small-btn" onClick={closeEditModal}>إغلاق</button></div>
      <form className="settings-form" onSubmit={handleSaveEdit}>
        <input name="customer_name" placeholder="اسم العميل" value={editForm.customer_name} onChange={handleEditChange} required />
        <input name="customer_phone" placeholder="رقم الهاتف" value={editForm.customer_phone} onChange={handleEditChange} required />
        <input name="customer_address" placeholder="العنوان" value={editForm.customer_address} onChange={handleEditChange} required />
        <div className="two-cols">
          <input name="customer_city" placeholder="المدينة" value={editForm.customer_city} onChange={handleEditChange} />
          <input name="customer_area" placeholder="المنطقة" value={editForm.customer_area} onChange={handleEditChange} />
        </div>
        <div className="two-cols">
          <select name="payment_method" value={editForm.payment_method} onChange={handleEditChange}>
            <option value="cash">كاش</option><option value="instapay">إنستا باي</option><option value="vodafone_cash">فودافون كاش</option>
          </select>
          <select name="payment_status" value={editForm.payment_status} onChange={handleEditChange}>
            <option value="pending">قيد الانتظار</option><option value="paid">مدفوع</option><option value="failed">فشل</option><option value="refunded">مرتجع</option>
          </select>
        </div>
        <div className="two-cols">
          <select name="delivery_type" value={editForm.delivery_type} onChange={handleEditChange}>
            <option value="delivery">دليفري</option><option value="pickup">استلام من المتجر</option>
          </select>
          <input name="delivery_fee" type="number" placeholder="رسوم التوصيل" value={editForm.delivery_fee} onChange={handleEditChange} />
        </div>
        <div className="two-cols">
          <input name="discount_amount" type="number" placeholder="الخصم" value={editForm.discount_amount} onChange={handleEditChange} />
          <input name="subtotal_amount" type="number" placeholder="إجمالي الأصناف" value={editForm.subtotal_amount} onChange={handleEditChange} />
        </div>
        <input name="total_amount" type="number" placeholder="الإجمالي النهائي" value={editForm.total_amount} onChange={handleEditChange} />
        <textarea name="notes" placeholder="ملاحظات" value={editForm.notes} onChange={handleEditChange} />
        <div className="admin-card compact-card">
          <h3>تعديل أصناف الطلب</h3>
          {editItems.map((item, index) => (
            <div key={index} className="manual-order-item-grid">
              <input placeholder="اسم الصنف" value={item.product_name} onChange={(e) => updateEditItem(index, "product_name", e.target.value)} required />
              <input placeholder="الوزن" value={item.weight_label} onChange={(e) => updateEditItem(index, "weight_label", e.target.value)} required />
              <input type="number" placeholder="السعر" value={item.price} onChange={(e) => updateEditItem(index, "price", e.target.value)} required />
              <input type="number" placeholder="الكمية" value={item.quantity} onChange={(e) => updateEditItem(index, "quantity", e.target.value)} required />
              <button type="button" className="danger-btn small-btn" onClick={() => removeEditItem(index)}>حذف الصنف</button>
            </div>
          ))}
          <button type="button" className="secondary-btn" onClick={addEditItem}>إضافة صنف</button>
        </div>
        <div className="invoice-box">
          <p>إجمالي الأصناف: {editItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)} ج</p>
          <p>رسوم التوصيل: {editForm.delivery_fee || 0} ج</p>
          <p>الخصم: {editForm.discount_amount || 0} ج</p>
          <strong>الإجمالي النهائي: {editItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0) + Number(editForm.delivery_fee || 0) - Number(editForm.discount_amount || 0)} ج</strong>
        </div>
        <button type="submit" className="primary-btn" disabled={savingEdit}>{savingEdit ? "جاري الحفظ..." : "حفظ التعديل"}</button>
      </form>
    </div></div> : null}

    {printOrder ? <div className="print-only-wrapper"><OrderInvoice order={printOrder} /></div> : null}
  </>);
}
