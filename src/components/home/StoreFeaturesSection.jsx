const iconMap = {
  truck: "🚚",
  leaf: "🥬",
  wallet: "💳",
  "message-circle": "💬",
};

export default function StoreFeaturesSection({ features = [] }) {
  if (!features.length) return null;

  return (
    <section className="section-block">
      <div className="container">
        <div className="section-title">
          <h2>مميزات المتجر</h2>
          <p>كل ما يميز تجربة الطلب من سوق المعروف</p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">
                {iconMap[feature.icon_name] || "⭐"}
              </div>
              <h3>{feature.title_ar}</h3>
              {feature.description_ar ? <p>{feature.description_ar}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
