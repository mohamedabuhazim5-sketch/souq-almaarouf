import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import Header from "../components/layout/Header";
import Footer from "../components/common/Footer";
import { useCartStore } from "../store/useCartStore";
import { submitOrder } from "../services/orders";
import { validateCoupon } from "../services/coupons";
import { useStoreSettings } from "../hooks/useStoreSettings";

const defaultForm = {
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  notes: "",
  paymentMethod: "cash",
};

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { settings } = useStoreSettings();
  const [form, setForm] = useState(() => {
    try {
      const stored = localStorage.getItem("souq-almaarouf-checkout");
      return stored ? { ...defaultForm, ...JSON.parse(stored) } : defaultForm;
    } catch {
      return defaultForm;
    }
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponState, setCouponState] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedOrderId, setSavedOrderId] = useState("");

  useEffect(() => {
    localStorage.setItem("souq-almaarouf-checkout", JSON.stringify(form));
  }, [form]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const discountAmount = couponState?.discountAmount || 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleApplyCoupon = async () => {
    setError("");
    try {
      const result = await validateCoupon(couponCode, subtotal);
      if (!result.valid) {
        setCouponState(null);
        setError(result.message);
        return;
      }
      setCouponState(result);
    } catch (err) {
      setError(err.message || "تعذر تطبيق الكوبون");
    }
  };

  const whatsappUrl = useMemo(() => {
    const lines = items.map((item) => `${item.name} | ${item.price} ج | ${item.weightLabel}`);
    const text = [
      `طلب جديد من ${form.customerName || "عميل"}`,
      ...lines,
      `الإجمالي: ${total} ج`,
      `الدفع: ${form.paymentMethod}`,
    ].join("\n");
    return `https://wa.me/2${settings.whatsapp_number}?text=${encodeURIComponent(text)}`;
  }, [items, form.customerName, form.paymentMethod, total, settings.whatsapp_number]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await submitOrder({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerAddress: form.customerAddress,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
        totalAmount: total,
        couponCode: couponState?.coupon?.code || null,
        discountAmount,
        items: items.map((item) => ({
          product_id: item.productId,
          product_name: item.name,
          weight_label: item.weightLabel,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      setSavedOrderId(result.orderId);
      localStorage.setItem("souq-almaarouf-last-order-id", result.orderId);
      clearCart();
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div>
        <TopBar />
        <Header categories={[]} searchValue="" onSearchChange={() => {}} />
        <main className="container success-page">
          <h1>تم إرسال الطلب بنجاح</h1>
          <p>رقم الطلب: {savedOrderId}</p>
          <p>يمكنك تتبع الطلب من صفحة تتبع الطلبات.</p>
          <Link to="/track-order" className="secondary-btn">تتبع الطلب</Link>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="primary-btn">إرسال نسخة واتساب</a>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <TopBar />
        <Header categories={[]} searchValue="" onSearchChange={() => {}} />
        <main className="container checkout-page">
          <div className="empty-state">
            <h1>لا يوجد طلب لإتمامه</h1>
            <p>أضف منتجات إلى السلة أولًا ثم أكمل الطلب.</p>
            <Link to="/" className="primary-btn">العودة للتسوق</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <TopBar />
      <Header categories={[]} searchValue="" onSearchChange={() => {}} />

      <main className="container checkout-page">
        <h1>إتمام الطلب</h1>
        {error ? <div className="error-box">{error}</div> : null}
        {couponState?.valid ? <div className="success-box">{couponState.message}</div> : null}

        <div className="checkout-helper-grid">
          <div className="checkout-helper-card">
            <strong>بيانات محفوظة</strong>
            <span>سيتم تذكر بياناتك على هذا الجهاز لتسريع الطلب القادم.</span>
          </div>
          <div className="checkout-helper-card">
            <strong>طرق الدفع</strong>
            <span>كاش / إنستا باي / فودافون كاش</span>
          </div>
          <div className="checkout-helper-card">
            <strong>الفاتورة</strong>
            <span>تعرض الصنف + السعر + الوزن فقط كما طلبت.</span>
          </div>
        </div>

        <form className="checkout-form" onSubmit={handleSubmit}>
          <input type="text" name="customerName" placeholder="الاسم" value={form.customerName} onChange={handleChange} required />
          <input type="text" name="customerPhone" placeholder="رقم الهاتف" value={form.customerPhone} onChange={handleChange} required />
          <textarea name="customerAddress" placeholder="العنوان" value={form.customerAddress} onChange={handleChange} required />
          <textarea name="notes" placeholder="ملاحظات" value={form.notes} onChange={handleChange} />

          <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
            <option value="cash">كاش</option>
            <option value="instapay">إنستا باي</option>
            <option value="vodafone_cash">فودافون كاش</option>
          </select>

          <div className="coupon-row">
            <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="كود الخصم" />
            <button type="button" className="secondary-btn" onClick={handleApplyCoupon}>تطبيق الكوبون</button>
          </div>

          <div className="invoice-box">
            <h2>فاتورة الطلب</h2>
            {items.map((item) => (
              <p key={`${item.productId}-${item.weightLabel}`}>{item.name} | {item.price} ج | {item.weightLabel}</p>
            ))}
            <p>الإجمالي قبل الخصم: {subtotal} ج</p>
            {discountAmount ? <p>الخصم: {discountAmount} ج</p> : null}
            <strong>الإجمالي النهائي: {total} ج</strong>
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "جاري إرسال الطلب..." : "تأكيد الطلب"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
