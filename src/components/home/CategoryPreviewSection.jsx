import ProductCard from "../ui/ProductCard";
import { Link } from "react-router-dom";

export default function CategoryPreviewSection({ category, products }) {
  return (
    <section className="section-block" id={category.slug}>
      <div className="container">
        <div className="category-preview-header">
          <h2>{category.name_ar}</h2>
          <Link to={`/category/${category.slug}`}>عرض الكل</Link>
        </div>

        <div className="products-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name_ar,
                image: product.image_url || "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1200&auto=format&fit=crop",
                price: product.sale_price || product.price,
                oldPrice: product.sale_price ? product.price : null,
                weightLabel: `${product.weight_value} ${product.unit_label}`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
