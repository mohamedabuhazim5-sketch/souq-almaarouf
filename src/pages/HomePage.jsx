import TopBar from "../components/layout/TopBar";
import Header from "../components/layout/Header";
import HeroSection from "../components/home/HeroSection";
import BannersSection from "../components/home/BannersSection";
import StoreFeaturesSection from "../components/home/StoreFeaturesSection";
import FeaturedCategories from "../components/home/FeaturedCategories";
import BestSellers from "../components/home/BestSellers";
import CategoryPreviewSection from "../components/home/CategoryPreviewSection";
import SearchResultsSection from "../components/home/SearchResultsSection";
import RecentlyViewedSection from "../components/home/RecentlyViewedSection";
import PageLoader from "../components/common/PageLoader";
import Footer from "../components/common/Footer";
import SeoMeta from "../components/common/SeoMeta";
import { useStoreData } from "../hooks/useStoreData";
import { useProductSearch } from "../hooks/useProductSearch";
import { useStoreSettings } from "../hooks/useStoreSettings";
import { useHomeContent } from "../hooks/useHomeContent";

export default function HomePage() {
  const { categories, products, loading, error } = useStoreData();
  const { settings } = useStoreSettings();
  const { banners, features } = useHomeContent();
  const { search, setSearch, filteredProducts } = useProductSearch(products);

  if (loading) {
    return (
      <div>
        <TopBar />
        <Header categories={[]} searchValue="" onSearchChange={() => {}} />
        <main className="container">
          <PageLoader text="جاري تحميل المتجر" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <TopBar />
        <Header categories={[]} searchValue="" onSearchChange={() => {}} />
        <main className="container error-box">{error}</main>
      </div>
    );
  }

  return (
    <div id="top">
      <SeoMeta />
      <TopBar />
      <Header categories={categories} searchValue={search} onSearchChange={setSearch} />

      <HeroSection />
      <BannersSection banners={banners} />
      <StoreFeaturesSection features={features} />

      {settings.show_featured_categories ? (
        <FeaturedCategories categories={categories} />
      ) : null}

      <SearchResultsSection search={search} products={filteredProducts} />

      {!search.trim() ? (
        <>
          {settings.show_best_sellers ? <BestSellers products={products} /> : null}

          {categories.map((category) => {
            const categoryProducts = products.filter(
              (product) => product.category_id === category.id
            );

            return (
              <CategoryPreviewSection
                key={category.id}
                category={category}
                products={categoryProducts}
              />
            );
          })}
          <RecentlyViewedSection />
        </>
      ) : null}

      <Footer />
    </div>
  );
}
