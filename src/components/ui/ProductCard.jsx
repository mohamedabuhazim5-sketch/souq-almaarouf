import { Link } from "react-router-dom";
import { useCartStore } from "../../store/useCartStore";

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      weightLabel: product.weightLabel,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <article className="product-card product-card-upgraded">
      <div className="product-card-media">
        <Link to={`/product/${product.slug}`} className="product-image-link">
          <img src={product.image} alt={product.name} className="product-image" />
        </Link>
        <span className="product-floating-badge">{product.weightLabel}</span>
      </div>

      <div className="product-body">
        <div className="product-headline-row">
          <h3>{product.name}</h3>
          <span className="product-availability">متاح</span>
        </div>

        <div className="product-price-row product-price-row-upgraded">
          <strong>{product.price} ج</strong>
          {product.oldPrice ? <span>{product.oldPrice} ج</span> : null}
        </div>

        <div className="product-actions product-actions-stack">
          <button onClick={handleAdd} className="add-btn full-width-btn">أضف للسلة</button>
          <Link to={`/product/${product.slug}`} className="details-btn full-width-btn">عرض التفاصيل</Link>
        </div>
      </div>
    </article>
  );
}
