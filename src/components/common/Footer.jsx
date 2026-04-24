import { Link } from "react-router-dom";
import { useStoreSettings } from "../../hooks/useStoreSettings";

export default function Footer() {
  const { settings } = useStoreSettings();

  return (
    <footer className="site-footer">
      <div className="container site-footer-grid">
        <div>
          <h3>{settings.store_name}</h3>
          <p>
            {settings.support_text ||
              "متجر خضار وفاكهة ومنتجات طازجة بواجهة سهلة وسريعة وتواصل مباشر مع العميل."}
          </p>
          <div className="footer-badges">
            <span>طلب سريع</span>
            <span>دفع مرن</span>
            <span>تواصل مباشر</span>
          </div>
        </div>

        <div>
          <h4>التنقل</h4>
          <div className="footer-links">
            <Link to="/">الرئيسية</Link>
            <Link to="/track-order">تتبع الطلب</Link>
            <Link to="/cart">السلة</Link>
            <Link to="/admin/login">دخول الأدمن</Link>
          </div>
        </div>

        <div>
          <h4>روابط التواصل</h4>
          <div className="footer-links">
            <a href={settings.facebook_group_url} target="_blank" rel="noreferrer">جروب الفيس</a>
            <a href={settings.facebook_page_url} target="_blank" rel="noreferrer">صفحة الفيس</a>
            <a href={`https://wa.me/2${settings.whatsapp_number}`} target="_blank" rel="noreferrer">
              واتساب: {settings.whatsapp_number}
            </a>
            <span>الدفع: كاش / إنستا باي / فودافون كاش</span>
          </div>
        </div>
      </div>

      <div className="container footer-bottom-bar">
        <span>© {new Date().getFullYear()} {settings.store_name}</span>
        <span>سلة وفاتورة الطلب: الصنف + السعر + الوزن فقط</span>
      </div>
    </footer>
  );
}
