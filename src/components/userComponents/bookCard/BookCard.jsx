import { Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import { ShoppingCart } from "lucide-react";
import styles from "./BookCard.module.css";

const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `cart-${book.id}-${Date.now()}`, // Unique ID for cart item
      book,
      quantity: 1,
    });
  };

  const authorName =
    book.authors && book.authors.length > 0
      ? book.authors.map((author) => author.name).join(", ")
      : "Tác giả không xác định";

  const coverImage =
    book.images && book.images.length > 0
      ? book.images.find((img) => img.is_cover)?.url
      : "/placeholder.svg";

  const isOutOfStock = book.available_quantity === 0;

  return (
    <Link to={`/books/${book.id}`} className={styles.bookCard}>
      <div className={styles.bookImage}>
        <img src={coverImage} alt={book.title} />
        {isOutOfStock && (
          <div className={styles.outOfStockBadge}>Hết Hàng</div>
        )}
      </div>
      <div className={styles.bookInfo}>
        <h3 className={styles.bookTitle}>{book.title}</h3>
        <p className={styles.bookAuthor}>{authorName}</p>
        <div className={styles.bookPrice}>
          <span>Thuê: ₫{book.rental_price.toLocaleString()}</span>
          <span>Cọc: ₫{(book.deposit_price || book.deposit).toLocaleString()}</span>
        </div>
        <button
          className={styles.addToCartBtn}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <ShoppingCart />
          Thêm Vào Giỏ
        </button>
      </div>
    </Link>
  );
};

export default BookCard;