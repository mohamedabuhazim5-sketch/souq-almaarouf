import { useState } from "react";

export default function BannersSection({ banners = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!banners.length) return null;

  const activeBanner = banners[activeIndex] || banners[0];

  return (
    <section className="section-block">
      <div className="container">
        <div className="banner-hero-card">
          <div className="banner-hero-content">
            <span className="hero-badge">عروض ومميزات المتجر</span>
            <h2>{activeBanner.title_ar}</h2>
            {activeBanner.subtitle_ar ? <p>{activeBanner.subtitle_ar}</p> : null}

            {activeBanner.button_text ? (
              <a
                href={activeBanner.button_link || "/"}
                className="primary-btn"
              >
                {activeBanner.button_text}
              </a>
            ) : null}
          </div>

          {activeBanner.image_url ? (
            <div className="banner-hero-image-wrap">
              <img
                src={activeBanner.image_url}
                alt={activeBanner.title_ar}
                className="banner-hero-image"
              />
            </div>
          ) : null}
        </div>

        {banners.length > 1 ? (
          <div className="banner-dots">
            {banners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                className={`banner-dot ${index === activeIndex ? "banner-dot-active" : ""}`}
                onClick={() => setActiveIndex(index)}
                aria-label={banner.title_ar}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
