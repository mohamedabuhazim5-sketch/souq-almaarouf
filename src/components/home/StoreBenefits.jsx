export default function StoreBenefits() {
  const benefits = [
    {
      title: "طلب سريع",
      text: "أضف المنتجات للسلة وأنهِ الطلب بخطوات بسيطة جدًا.",
      icon: "⚡",
    },
    {
      title: "منتجات طازجة",
      text: "خضار وفاكهة ومنتجات مجهزة تُعرض بشكل واضح وسهل.",
      icon: "🥬",
    },
    {
      title: "تواصل مباشر",
      text: "واتساب وروابط الفيس متاحة دائمًا لتأكيد الطلب وخدمة العملاء.",
      icon: "💬",
    },
  ];

  return (
    <section className="section-block benefits-section">
      <div className="container">
        <div className="section-title section-title-inline">
          <div>
            <h2>ليه تختار سوق المعروف؟</h2>
            <p>تجربة شراء سهلة، واضحة، ومناسبة للموبايل والكمبيوتر.</p>
          </div>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="benefit-card">
              <span className="benefit-icon" aria-hidden="true">{benefit.icon}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
