export default function HomeDealsBanner() {
  return (
    <section className="home-deals-wrap">
      <div className="container">
        <div className="home-deals-grid">
          <div className="home-deal-card featured-deal-card">
            <span className="deal-badge">عرض ترحيبي</span>
            <h3>خصم مبدئي على أول طلب</h3>
            <p>يمكنك تفعيل كوبون تجريبي عند التشغيل مثل <strong>WELCOME10</strong> ليظهر للعملاء في صفحة الدفع.</p>
          </div>

          <div className="home-deal-card">
            <h4>فاتورة بسيطة وواضحة</h4>
            <p>الصنف + السعر + الوزن فقط داخل الفاتورة كما طلبت.</p>
          </div>

          <div className="home-deal-card">
            <h4>طرق دفع مرنة</h4>
            <p>كاش، إنستا باي، وفودافون كاش جاهزة داخل المشروع.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
