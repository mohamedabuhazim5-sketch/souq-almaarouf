import { Link } from "react-router-dom";
import { useStoreSettings } from "../../hooks/useStoreSettings";

export default function Header({ categories = [], searchValue = "", onSearchChange }) {
  const { settings } = useStoreSettings();

  return (
    <header className="header">
      <div className="container header-content header-content-extended">
        <Link to="/" className="logo">{settings.store_name}</Link>

        <div className="header-search-wrap">
          <input
            type="text"
            className="header-search-input"
            placeholder="ابحث عن منتج..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        <nav className="nav-links">
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.slug}`}>
              {category.name_ar}
            </Link>
          ))}
          <Link to="/track-order">تتبع الطلب</Link>
        </nav>
      </div>
    </header>
  );
}
