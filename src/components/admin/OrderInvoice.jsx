import { useStoreSettings } from "../../hooks/useStoreSettings";

export default function OrderInvoice({ order }) {
  const { settings } = useStoreSettings();

  const paymentLabelMap = {
    cash: "كاش",
    instapay: "إنستا باي",
    vodafone_cash: "فودافون كاش",
  };

  return (
    <div className="invoice-print-sheet" dir="rtl">
      <div className="invoice-print-header">
        <div>
          <h1>{settings.store_name || "سوق المعروف"}</h1>
          <p>{settings.address_text || ""}</p>
          <p>واتساب: {settings.whatsapp_number || "01112223226"}</p>
        </div>

        <div>
          <h2>فاتورة طلب</h2>
          <p>رقم الفاتورة: {order.invoice_number || "—"}</p>
          <p>رقم الطلب: {order.id}</p>
          <p>
            التاريخ:{" "}
            {order.created_at
              ? new Date(order.created_at).toLocaleString("ar-EG")
              : "—"}
          </p>
        </div>
      </div>

      <div className="invoice-customer-box">
        <p><strong>العميل:</strong> {order.customer_name}</p>
        <p><strong>الهاتف:</strong> {order.customer_phone}</p>
        <p><strong>العنوان:</strong> {order.customer_address}</p>
        <p>
          <strong>نوع الطلب:</strong>{" "}
          {order.delivery_type === "delivery" ? "دليفري" : "استلام من المتجر"}
        </p>
        <p>
          <strong>طريقة الدفع:</strong>{" "}
          {paymentLabelMap[order.payment_method] || order.payment_method}
        </p>
      </div>

      <table className="invoice-print-table">
        <thead>
          <tr>
            <th>الصنف</th>
            <th>الوزن</th>
            <th>السعر</th>
            <th>الكمية</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {(order.order_items || []).map((item) => (
            <tr key={item.id}>
              <td>{item.product_name}</td>
              <td>{item.weight_label}</td>
              <td>{item.price} ج</td>
              <td>{item.quantity}</td>
              <td>{item.line_total || item.price * item.quantity} ج</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-print-summary">
        <p>إجمالي الأصناف: {order.subtotal_amount || 0} ج</p>
        <p>رسوم التوصيل: {order.delivery_fee || 0} ج</p>
        <p>الخصم: {order.discount_amount || 0} ج</p>
        <strong>الإجمالي النهائي: {order.total_amount || 0} ج</strong>
      </div>

      <div className="invoice-footer-note">
        <p>شكرًا لتعاملكم مع {settings.store_name || "سوق المعروف"}</p>
      </div>
    </div>
  );
}
