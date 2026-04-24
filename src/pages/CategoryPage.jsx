import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import Header from "../components/layout/Header";
import ProductCard from "../components/ui/ProductCard";
import PageLoader from "../components/common/PageLoader";
import Footer from "../components/common/Footer";
import SeoMeta from "../components/common/SeoMeta";
import { useCategoryBySlug } from "../hooks/useCategoryBySlug";
import { useStoreSettings } from "../hooks/useStoreSettings";

export default function CategoryPage() {
  const { slug } = useParams();
  const { settings } = useStoreSettings();
  const { category, products, loading } = useCategoryBySlug(slug);

  if (loading) {
    return (
      <div>
        <TopBar />
        <Header categories={[]} searchValue="" onSearchChange={() => {}} />
        <main className="container"><PageLoader text="جاري تحميل القسم" /></main>
      </div>
    );
  }

  if (!category) {
    return (
      <div>
        <TopBar />
        <Header categories={[]} searchValue="" onSearchChange={() => {}} />
        <main className="container not-found-page">
          <h1>القسم غير موجود</h1>
          <Link to="/" className="primary-btn">العودة للرئيسية</Link>
        </main>
      </div>
    );
  }

  return (
    <div>
      <SeoMeta title={`${category.name_ar} | ${settings.store_name}`} description={`تسوق من قسم ${category.name_ar}`} />
      <TopBar />
      <Header categories={[]} searchValue="" onSearchChange={() => {}} />

      <main className="container category-page">
        <section className="category-hero-card">
          <div>
            <h1>{category.name_ar}</h1>
            <p>عدد المنتجات المتاحة: {products.length}</p>
          </div>
          {category.image_url ? <img src={category.image_url} alt={category.name_ar} className="category-hero-image" /> : null}
        </section>

        {products.length === 0 ? (
          <div className="empty-state"><p>لا توجد منتجات في هذا القسم حاليًا.</p></div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name_ar,
                  image: product.image_url || "",
                  price: product.sale_price || product.price,
                  oldPrice: product.sale_price ? product.price : null,
                  weightLabel: `${product.weight_value} ${product.unit_label}`,
                }}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
