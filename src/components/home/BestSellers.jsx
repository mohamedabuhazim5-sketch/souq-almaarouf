import SectionTitle from "../ui/SectionTitle";
import ProductCard from "../ui/ProductCard";

export default function BestSellers({ products = [] }) {
  const bestSellers = products.filter((product) => product.is_best_seller);

  return (
    <section className="section-block" id="best-sellers">
      <div className="container">
        <SectionTitle title="الأكثر مبيعًا" subtitle="منتجات يطلبها العملاء بشكل مستمر" />
        <div className="products-grid">
          {bestSellers.map((product) => (
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
