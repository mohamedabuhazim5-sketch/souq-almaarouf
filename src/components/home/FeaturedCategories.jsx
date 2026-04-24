import SectionTitle from "../ui/SectionTitle";
import { Link } from "react-router-dom";

export default function FeaturedCategories({ categories = [] }) {
  return (
    <section className="section-block">
      <div className="container">
        <SectionTitle title="الأقسام الشائعة" subtitle="اختر القسم المناسب وابدأ التسوق بسهولة" />
        <div className="categories-grid">
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.slug}`} className="category-card">
              <img src={category.image_url || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"} alt={category.name_ar} />
              <div className="category-card-overlay"><h3>{category.name_ar}</h3></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
