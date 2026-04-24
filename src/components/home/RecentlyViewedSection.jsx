import ProductCard from "../ui/ProductCard";
import SectionTitle from "../ui/SectionTitle";
import { useRecentlyViewedStore } from "../../store/useRecentlyViewedStore";

export default function RecentlyViewedSection() {
  const items = useRecentlyViewedStore((state) => state.items);

  if (!items.length) return null;

  return (
    <section className="section-block">
      <div className="container">
        <SectionTitle
          title="شوهدت مؤخرًا"
          subtitle="ارجع بسرعة للمنتجات التي شاهدتها مؤخرًا"
        />

        <div className="products-grid">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
