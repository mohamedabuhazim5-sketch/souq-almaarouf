import ProductCard from "../ui/ProductCard";
import SectionTitle from "../ui/SectionTitle";

export default function SearchResultsSection({ search, products }) {
  if (!search.trim()) return null;

  return (
    <section className="section-block">
      <div className="container">
        <SectionTitle title={`نتائج البحث عن: ${search}`} subtitle={`عدد النتائج: ${products.length}`} />

        {products.length === 0 ? (
          <div className="empty-state"><p>لا توجد منتجات مطابقة للبحث.</p></div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
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
        )}
      </div>
    </section>
  );
}
