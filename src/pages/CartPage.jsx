import { Link } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import Header from "../components/layout/Header";
import Footer from "../components/common/Footer";
import { useCartStore } from "../store/useCartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <TopBar />
      <Header categories={[]} searchValue="" onSearchChange={() => {}} />

      <main className="container cart-page">
        <h1>السلة</h1>

        {items.length === 0 ? (
          <div className="empty-state">
            <p>السلة فارغة حاليًا.</p>
            <Link to="/" className="primary-btn">العودة للتسوق</Link>
          </div>
        ) : (
          <>
            <div className="cart-list">
              {items.map((item) => (
                <div key={`${item.productId}-${item.weightLabel}`} className="cart-item cart-item-extended">
                  <div>
                    <h3>{item.name}</h3>
                    <p>السعر: {item.price} ج</p>
                    <p>الوزن: {item.weightLabel}</p>
                  </div>
                  <div className="cart-actions-wrap">
                    <div className="qty-controls">
                      <button type="button" className="secondary-btn small-btn" onClick={() => updateQuantity(item.productId, item.weightLabel, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" className="secondary-btn small-btn" onClick={() => updateQuantity(item.productId, item.weightLabel, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.productId, item.weightLabel)} className="danger-btn">حذف</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="invoice-box">
              <h2>فاتورة الطلب</h2>
              {items.map((item) => (
                <p key={`invoice-${item.productId}-${item.weightLabel}`}>
                  {item.name} | {item.price} ج | {item.weightLabel}
                </p>
              ))}
              <strong>الإجمالي: {total} ج</strong>
            </div>

            <Link to="/checkout" className="primary-btn">متابعة إنهاء الطلب</Link>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
