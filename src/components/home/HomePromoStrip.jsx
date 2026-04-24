import { Link } from "react-router-dom";

export default function HomePromoStrip() {
  return (
    <section className="promo-strip-wrap">
      <div className="container">
        <div className="promo-strip">
          <div>
            <strong>طلبك أسرع من الأول</strong>
            <p>تسوق حسب القسم أو ابحث مباشرة عن المنتج الذي تريده.</p>
          </div>
          <div className="promo-strip-actions">
            <a href="#best-sellers" className="secondary-btn">الأكثر مبيعًا</a>
            <Link to="/track-order" className="primary-btn">تتبع الطلب</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
