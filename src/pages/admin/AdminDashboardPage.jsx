import { useEffect, useMemo, useState } from "react";
import AdminShell from "../../components/admin/AdminShell";
import PageLoader from "../../components/common/PageLoader";
import { getAllOrders } from "../../services/adminOrders";
import { getAllProducts } from "../../services/products";
import { getAllCategories } from "../../services/categories";

function isSameDay(date) {
  const now = new Date();
  const d = new Date(date);
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}
function isWithinDays(date, days) {
  const now = new Date();
  const d = new Date(date);
  return now - d <= days * 24 * 60 * 60 * 1000;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [range, setRange] = useState("all");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [ordersData, productsData, categoriesData] = await Promise.all([
          getAllOrders(),
          getAllProducts(),
          getAllCategories(),
        ]);
        setOrders(ordersData);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("DASHBOARD LOAD ERROR:", err);
        setError(err.message || "تعذر تحميل بيانات لوحة التحكم");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const rangedOrders = useMemo(() => {
    if (range === "today") return orders.filter((o) => o.created_at && isSameDay(o.created_at));
    if (range === "week") return orders.filter((o) => o.created_at && isWithinDays(o.created_at, 7));
    if (range === "month") return orders.filter((o) => o.created_at && isWithinDays(o.created_at, 30));
    return orders;
  }, [orders, range]);

  const stats = useMemo(() => {
    const totalOrders = rangedOrders.length;
    const newOrders = rangedOrders.filter((o) => o.status === "new").length;
    const deliveryOrders = rangedOrders.filter((o) => o.delivery_type === "delivery").length;
    const completedOrders = rangedOrders.filter((o) => o.status === "completed").length;
    const cancelledOrders = rangedOrders.filter((o) => o.status === "cancelled").length;
    const totalSales = rangedOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    return { totalOrders, newOrders, deliveryOrders, completedOrders, cancelledOrders, totalSales };
  }, [rangedOrders]);

  if (loading) return <AdminShell title="الرئيسية" subtitle="جاري تحميل لوحة التحكم"><PageLoader text="جاري تحميل لوحة التحكم" /></AdminShell>;

  return (
    <AdminShell title="الرئيسية" subtitle="ملخص سريع لحالة المتجر">
      {error ? <div className="error-box">{error}</div> : null}
      <div className="admin-toolbar">
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="all">كل الفترات</option>
          <option value="today">اليوم</option>
          <option value="week">آخر 7 أيام</option>
          <option value="month">آخر 30 يوم</option>
        </select>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><span>عدد الطلبات</span><strong>{stats.totalOrders}</strong></div>
        <div className="stat-card"><span>طلبات جديدة</span><strong>{stats.newOrders}</strong></div>
        <div className="stat-card"><span>طلبات الدليفري</span><strong>{stats.deliveryOrders}</strong></div>
        <div className="stat-card"><span>طلبات مكتملة</span><strong>{stats.completedOrders}</strong></div>
        <div className="stat-card"><span>طلبات ملغية</span><strong>{stats.cancelledOrders}</strong></div>
        <div className="stat-card"><span>إجمالي المبيعات</span><strong>{stats.totalSales} ج</strong></div>
        <div className="stat-card"><span>عدد المنتجات</span><strong>{products.length}</strong></div>
        <div className="stat-card"><span>عدد الأقسام</span><strong>{categories.length}</strong></div>
      </div>
      <div className="admin-card">
        <div className="admin-page-header"><div><h2>آخر الطلبات</h2><p>أحدث الطلبات حسب الفلتر المختار</p></div></div>
        <div className="table-wrap">
          <table className="admin-table">
            <thead><tr><th>رقم الفاتورة</th><th>العميل</th><th>الهاتف</th><th>نوع الطلب</th><th>الحالة</th><th>الإجمالي</th></tr></thead>
            <tbody>
              {rangedOrders.slice(0, 8).map((order) => (
                <tr key={order.id}>
                  <td>{order.invoice_number || "—"}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.customer_phone}</td>
                  <td>{order.delivery_type === "delivery" ? "دليفري" : "استلام من المتجر"}</td>
                  <td>{order.status}</td>
                  <td>{order.total_amount} ج</td>
                </tr>
              ))}
              {rangedOrders.length === 0 ? <tr><td colSpan="6" style={{textAlign:"center",padding:"20px"}}>لا توجد طلبات في هذه الفترة</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
