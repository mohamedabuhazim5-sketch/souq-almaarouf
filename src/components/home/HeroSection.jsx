import { Link } from "react-router-dom";
import { useStoreSettings } from "../../hooks/useStoreSettings";

export default function HeroSection() {
  const { settings } = useStoreSettings();

  const heroTitle = settings.hero_title || settings.store_name || "سوق المعروف";
  const heroSubtitle =
    settings.hero_subtitle ||
    settings.support_text ||
    "اطلب خضارك وفاكهتك ومنتجاتك اليومية بسهولة";
  const heroImage =
    settings.hero_image_url ||
    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1400&auto=format&fit=crop";

  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-text">
          <span className="hero-badge">توصيل سريع وخدمة يومية</span>
          <h1>{heroTitle}</h1>
          <p>{heroSubtitle}</p>

          <div className="hero-actions">
            <a href="#best-sellers" className="primary-btn">
              الأكثر مبيعًا
            </a>
            <Link to="/cart" className="secondary-btn">
              اذهب إلى السلة
            </Link>
          </div>
        </div>

        <div className="hero-image-wrap">
          <img
            src={heroImage}
            alt={heroTitle}
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
}
