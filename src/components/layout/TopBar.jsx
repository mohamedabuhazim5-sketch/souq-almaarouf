import { Link } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";
import { useStoreSettings } from "../../hooks/useStoreSettings";

export default function TopBar() {
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const { settings } = useStoreSettings();

  return (
    <div className="topbar">
      <div className="container topbar-content">
        <div className="topbar-right">
          <a href={settings.facebook_group_url} target="_blank" rel="noreferrer">جروب الفيس</a>
          <a href={settings.facebook_page_url} target="_blank" rel="noreferrer">صفحة الفيس</a>
          <a href={`https://wa.me/2${settings.whatsapp_number}`}>واتساب: {settings.whatsapp_number}</a>
        </div>

        <div className="topbar-left">
          <Link to="/track-order">تتبع الطلب</Link>
          <Link to="/cart">السلة ({cartCount})</Link>
          <Link to="/admin">لوحة التحكم</Link>
        </div>
      </div>
    </div>
  );
}
