import Footer from "../components/common/Footer";
import { useEffect, useState } from "react";
import TopBar from "../components/layout/TopBar";
import Header from "../components/layout/Header";
import PageLoader from "../components/common/PageLoader";
import StatusBadge from "../components/common/StatusBadge";
import { useOrderTracking } from "../hooks/useOrderTracking";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const { loading, error, order, trackOrder } = useOrderTracking();

  useEffect(() => {
    try {
      const lastOrderId = localStorage.getItem("souq-almaarouf-last-order-id");
      if (lastOrderId) setOrderId(lastOrderId);
    } catch {}
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await trackOrder({ orderId, phone });
  };

  return (
    <div>
      <TopBar />
      <Header categories={[]} searchValue="" onSearchChange={() => {}} />

      <main className="container track-order-page">
        <section className="track-order-hero">
          <div>
            <span className="hero-badge">خدمة متابعة الطلب</span>
            <h1>تتبع الطلب</h1>
            <p>أدخل رقم الطلب مع رقم الهاتف الذي تم الطلب به لمعرفة آخر حالة بشكل فوري.</p>
          </div>
          <div className="track-order-hero-card">
            <strong>حالات التتبع</strong>
            <span>جديد</span>
            <span>تم التأكيد</span>
            <span>جاري التجهيز</span>
            <span>خرج للتوصيل</span>
          </div>
        </section>

        <div className="admin-card">
          <form className="settings-form" onSubmit={handleSubmit}>
            <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="رقم الطلب" required />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="رقم الهاتف" required />
            <button type="submit" className="primary-btn">عرض حالة الطلب</button>
          </form>
          <p className="track-order-tip">لو كنت طلبت للتو، ستجد رقم الطلب متعبئًا تلقائيًا.</p>
        </div>

        {loading ? <PageLoader text="جاري البحث عن الطلب" /> : null}
        {error ? <div className="error-box">{error}</div> : null}

        {order ? (
          <div className="admin-card order-track-card">
            <div className="order-track-header">
              <div>
                <h2>الطلب: {order.id}</h2>
                <p>العميل: {order.customer_name}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="invoice-box order-track-invoice">
              {(order.order_items || []).map((item) => (
                <p key={item.id}>{item.product_name} | {item.price} ج | {item.weight_label}</p>
              ))}
              {order.discount_amount ? <p>الخصم: {order.discount_amount} ج</p> : null}
              <strong>الإجمالي: {order.total_amount} ج</strong>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
