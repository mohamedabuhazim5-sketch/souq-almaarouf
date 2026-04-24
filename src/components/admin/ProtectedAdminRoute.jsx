import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useAdminSession } from "../../hooks/useAdminSession";
import PageLoader from "../common/PageLoader";

export default function ProtectedAdminRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { checking } = useAdminSession();

  if (checking) return <PageLoader text="جاري التحقق من جلسة الأدمن" />;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}
