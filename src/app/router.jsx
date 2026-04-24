import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import ProductPage from "../pages/ProductPage";
import CategoryPage from "../pages/CategoryPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import TrackOrderPage from "../pages/TrackOrderPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminCategoriesPage from "../pages/admin/AdminCategoriesPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminCreateOrderPage from "../pages/admin/AdminCreateOrderPage";
import AdminReportsPage from "../pages/admin/AdminReportsPage";
import AdminCouponsPage from "../pages/admin/AdminCouponsPage";
import AdminBannersPage from "../pages/admin/AdminBannersPage";
import AdminStoreFeaturesPage from "../pages/admin/AdminStoreFeaturesPage";
import ProtectedAdminRoute from "../components/admin/ProtectedAdminRoute";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "product/:slug", element: <ProductPage /> },
      { path: "category/:slug", element: <CategoryPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "track-order", element: <TrackOrderPage /> },
      { path: "admin/login", element: <AdminLoginPage /> },
      { path: "admin", element: <ProtectedAdminRoute><AdminDashboardPage /></ProtectedAdminRoute> },
      { path: "admin/products", element: <ProtectedAdminRoute><AdminProductsPage /></ProtectedAdminRoute> },
      { path: "admin/categories", element: <ProtectedAdminRoute><AdminCategoriesPage /></ProtectedAdminRoute> },
      { path: "admin/orders", element: <ProtectedAdminRoute><AdminOrdersPage /></ProtectedAdminRoute> },
      { path: "admin/create-order", element: <ProtectedAdminRoute><AdminCreateOrderPage /></ProtectedAdminRoute> },
      { path: "admin/reports", element: <ProtectedAdminRoute><AdminReportsPage /></ProtectedAdminRoute> },
      { path: "admin/coupons", element: <ProtectedAdminRoute><AdminCouponsPage /></ProtectedAdminRoute> },
      { path: "admin/banners", element: <ProtectedAdminRoute><AdminBannersPage /></ProtectedAdminRoute> },
      { path: "admin/store-features", element: <ProtectedAdminRoute><AdminStoreFeaturesPage /></ProtectedAdminRoute> },
      { path: "admin/settings", element: <ProtectedAdminRoute><AdminSettingsPage /></ProtectedAdminRoute> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
