import { Link } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import Header from "../components/layout/Header";
import Footer from "../components/common/Footer";
import SeoMeta from "../components/common/SeoMeta";

export default function NotFoundPage() {
  return (
    <div>
      <SeoMeta title="الصفحة غير موجودة | سوق المعروف" description="الصفحة المطلوبة غير موجودة" />
      <TopBar />
      <Header categories={[]} searchValue="" onSearchChange={() => {}} />
      <main className="container not-found-page">
        <div className="empty-state">
          <h1>الصفحة غير موجودة</h1>
          <p>الرابط الذي فتحته غير متاح حاليًا.</p>
          <Link to="/" className="primary-btn">العودة للرئيسية</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
