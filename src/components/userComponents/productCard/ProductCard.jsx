import { Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import styles from "./styles.module.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const discountedPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : null;

  return (
    <Link to={`/product/${product.id}`} className={styles.productCard}>
      <div className={styles.productImage}>
        <img src={product.image || "/placeholder.svg"} alt={product.name} />
        {product.discount > 0 && (
          <div className={styles.discountBadge}>Giảm {product.discount}%</div>
        )}
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{product.name}</h3>
        <p className={styles.productAuthor}>
          {product.authors && product.authors.length > 0
            ? product.authors.map((author) => author.name).join(", ")
            : product.author || "Tác giả không xác định"}
        </p>
        <div className={styles.productPrice}>
          {discountedPrice ? (
            <>
              <span className={styles.discountedPrice}>
                ₫{discountedPrice.toLocaleString()}
              </span>
              <span className={styles.originalPrice}>
                ₫{product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span>₫{product.price.toLocaleString()}</span>
          )}
        </div>
        <button className={styles.addToCartBtn} onClick={handleAddToCart}>
          <ShoppingCart />
          Thêm vào giỏ
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;