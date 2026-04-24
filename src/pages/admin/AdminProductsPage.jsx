import { useEffect, useMemo, useState } from "react";
import AdminShell from "../../components/admin/AdminShell";
import PageLoader from "../../components/common/PageLoader";
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../../services/products";
import { getAllCategories } from "../../services/categories";
import { uploadProductImage } from "../../services/storage";

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([getAllProducts(), getAllCategories()]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message || "تعذر تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const categoriesMap = useMemo(() => categories.reduce((acc, category) => {
    acc[category.id] = category.name_ar;
    return acc;
  }, {}), [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name_ar?.toLowerCase().includes(search.trim().toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category_id === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const handleQuickAdd = async () => {
    try {
      const firstCategory = categories[0];
      if (!firstCategory) return;
      await createProduct({
        category_id: firstCategory.id,
        name_ar: `منتج جديد ${Date.now()}`,
        slug: `product-${Date.now()}`,
        unit_label: "كجم",
        weight_value: 1,
        price: 10,
        min_order_qty: 1,
        stock_qty: 10,
        is_active: true,
      });
      await loadData();
    } catch (err) {
      setError(err.message || "تعذر إضافة المنتج");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف المنتج؟")) return;
    await deleteProduct(id);
    await loadData();
  };

  const handleToggle = async (product) => {
    await updateProduct(product.id, { is_active: !product.is_active });
    await loadData();
  };

  const handleUpload = async (productId, file) => {
    if (!file) return;
    const imageUrl = await uploadProductImage(file);
    await updateProduct(productId, { image_url: imageUrl });
    await loadData();
  };

  if (loading) {
    return <AdminShell title="إدارة المنتجات" subtitle="جاري تحميل المنتجات"><PageLoader text="جاري تحميل المنتجات" /></AdminShell>;
  }

  return (
    <AdminShell title="إدارة المنتجات" subtitle="إدارة سريعة للمنتجات" actions={<button className="primary-btn" onClick={handleQuickAdd}>إضافة سريعة</button>}>
      {error ? <div className="error-box">{error}</div> : null}

      <div className="admin-toolbar">
        <input type="text" placeholder="ابحث باسم المنتج" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="all">كل الأقسام</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name_ar}</option>)}
        </select>
      </div>

      <div className="admin-card">
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>المنتج</th><th>القسم</th><th>السعر</th><th>الصورة</th><th>الحالة</th><th>إجراءات</th></tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name_ar}</td>
                  <td>{categoriesMap[product.category_id] || "—"}</td>
                  <td>{product.sale_price || product.price} ج</td>
                  <td>
                    <label className="file-upload-chip">
                      رفع صورة
                      <input type="file" accept="image/*" hidden onChange={(e) => handleUpload(product.id, e.target.files?.[0])} />
                    </label>
                  </td>
                  <td>{product.is_active ? "ظاهر" : "مخفي"}</td>
                  <td>
                    <div className="table-actions">
                      <button className="secondary-btn small-btn" onClick={() => handleToggle(product)}>تبديل الظهور</button>
                      <button className="danger-btn small-btn" onClick={() => handleDelete(product.id)}>حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
