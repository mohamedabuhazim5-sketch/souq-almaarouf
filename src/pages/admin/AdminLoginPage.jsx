import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/common/Footer";
import { loginAdmin } from "../../services/auth";
import { useAuthStore } from "../../store/useAuthStore";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginAdmin(email, password);
      login(data.user);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "بيانات الدخول غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="container admin-login-page">
        <form className="checkout-form admin-login-form" onSubmit={handleSubmit}>
          <h1>تسجيل دخول الأدمن</h1>
          {error ? <div className="error-box">{error}</div> : null}
          <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="primary-btn" disabled={loading}>{loading ? "جاري الدخول..." : "دخول"}</button>
        </form>
      </main>
      <Footer />
    </>
  );
}
