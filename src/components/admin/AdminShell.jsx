import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../../services/auth";
import { useAuthStore } from "../../store/useAuthStore";

export default function AdminShell({ title, subtitle, actions, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);

  const navItems = [
    { to: "/admin", label: "الرئيسية" },
    { to: "/admin/products", label: "المنتجات" },
    { to: "/admin/categories", label: "الأقسام" },
    { to: "/admin/orders", label: "الطلبات" },
    { to: "/admin/create-order", label: "إضافة طلب" },
    { to: "/admin/reports", label: "التقارير" },
    { to: "/admin/coupons", label: "الكوبونات" },
    { to: "/admin/banners", label: "البانرات" },
    { to: "/admin/store-features", label: "المميزات" },
    { to: "/admin/settings", label: "الإعدادات" },
  ];

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (err) {
      console.error("LOGOUT ERROR:", err);
    } finally {
      logoutStore();
      navigate("/admin/login");
    }
  };

  return (
    <main className="admin-layout container">
      <aside className="admin-sidebar">
        <h2>لوحة التحكم</h2>

        <nav>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={location.pathname === item.to ? "admin-nav-active" : ""}
            >
              {item.label}
            </Link>
          ))}

          <Link to="/">العودة للمتجر</Link>

          <button type="button" className="logout-btn" onClick={handleLogout}>
            تسجيل الخروج
          </button>
        </nav>
      </aside>

      <section className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>

          {actions ? <div>{actions}</div> : null}
        </div>

        {children}
      </section>
    </main>
  );
}
