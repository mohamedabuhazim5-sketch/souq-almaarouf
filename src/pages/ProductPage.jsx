import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import Header from "../components/layout/Header";
import ProductCard from "../components/ui/ProductCard";
import PageLoader from "../components/common/PageLoader";
import Footer from "../components/common/Footer";
import SeoMeta from "../components/common/SeoMeta";
import { useCartStore } from "../store/useCartStore";
import { useProductBySlug } from "../hooks/useProductBySlug";
import { useStoreSettings } from "../hooks/useStoreSettings";
import { useRecentlyViewedStore } from "../store/useRecentlyViewedStore";

const fallbackImage =
  "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?q=80&w=1200&auto=format&fit=crop";

export default function ProductPage() {
  const { slug } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const addViewedProduct = useRecentlyViewedStore((state) => state.addViewedProduct);
  const { settings } = useStoreSettings();
  const { product, similarProducts, loading } = useProductBySlug(slug);
  const [quantity, setQuantity] = useState(1);

  const mappedProduct = useMemo(() => {
    if (!product) return null;
    return {
      id: product.id,
      slug: product.slug,
      name: product.name_ar,
      image: product.image_url || fallbackImage,
      price: product.sale_price || product.price,
      oldPrice: product.sale_price ? product.price : null,
      weightLabel: `${product.weight_value} ${product.unit_label}`,
    };
  }, [product]);

  useEffect(() => {
    if (mappedProduct) addViewedProduct(mappedProduct);
  }, [mappedProduct, addViewedProduct]);

  if (loading) {
    return (
      <div>
        <TopBar />
        <Header categories={[]} searchValue="" onSearchChange={() => {}} />
        <main className="container"><PageLoader text="جاري تحميل المنتج" /></main>
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <TopBar />
        <Header categories={[]} searchValue="" onSearchChange={() => {}} />
        <main className="container not-found-page">
          <h1>المنتج غير موجود</h1>
          <Link to="/" className="primary-btn">العودة للرئيسية</Link>
        </main>
      </div>
    );
  }

  const price = product.sale_price || product.price;
  const weightLabel = `${product.weight_value} ${product.unit_label}`;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i += 1) {
      addItem({
        productId: product.id,
        name: product.name_ar,
        weightLabel,
        price,
        image: product.image_url || fallbackImage,
      });
    }
  };

  return (
    <div>
      <SeoMeta title={`${product.name_ar} | ${settings.store_name}`} description={product.short_description || `اطلب ${product.name_ar} الآن`} />
      <TopBar />
      <Header categories={[]} searchValue="" onSearchChange={() => {}} />

      <main className="container product-page">
        <div className="product-page-grid">
          <div className="product-page-image-wrap">
            <img src={product.image_url || fallbackImage} alt={product.name_ar} className="product-page-image" />
          </div>

          <div className="product-page-info">
            <span className="product-page-badge">منتج طازج</span>
            <h1>{product.name_ar}</h1>
            <p className="product-page-description">{product.short_description || "منتج طازج بجودة ممتازة وسعر مناسب."}</p>

            <div className="product-meta-box">
              <div><span>الوزن</span><strong>{weightLabel}</strong></div>
              <div><span>الحد الأدنى</span><strong>{product.min_order_qty}</strong></div>
              <div><span>السعر</span><strong>{price} ج</strong></div>
            </div>

            <div className="quantity-row">
              <label htmlFor="quantity">الكمية</label>
              <input id="quantity" type="number" min={product.min_order_qty || 1} value={quantity} onChange={(e) => setQuantity(Math.max(product.min_order_qty || 1, Number(e.target.value) || 1))} />
            </div>

            <div className="product-page-actions">
              <button onClick={handleAddToCart} className="primary-btn">أضف للسلة</button>
              <Link to="/cart" className="secondary-btn">عرض السلة</Link>
            </div>

            <div className="product-selling-points">
              <div className="selling-point-card"><strong>طلب سريع</strong><span>إضافة للسلة في ثوانٍ</span></div>
              <div className="selling-point-card"><strong>فاتورة واضحة</strong><span>الصنف + السعر + الوزن</span></div>
              <div className="selling-point-card"><strong>دفع مرن</strong><span>كاش / إنستا باي / فودافون كاش</span></div>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <section className="section-block">
            <div className="section-title"><h2>منتجات مشابهة</h2><p>منتجات من نفس القسم قد تناسبك أيضًا</p></div>
            <div className="products-grid">
              {similarProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={{
                    id: item.id,
                    slug: item.slug,
                    name: item.name_ar,
                    image: item.image_url || fallbackImage,
                    price: item.sale_price || item.price,
                    oldPrice: item.sale_price ? item.price : null,
                    weightLabel: `${item.weight_value} ${item.unit_label}`,
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
