import { Link } from "react-router-dom";

export default function CategoryQuickLinks({ categories = [] }) {
  if (!categories.length) return null;

  return (
    <section className="section-block quick-links-section">
      <div className="container">
        <div className="quick-links-row">
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.slug}`} className="quick-link-chip">
              {category.name_ar}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
