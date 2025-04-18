import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { sampleBooks } from "../../sampleData";
import styles from "./BookDetailPage.module.css"; // Import the CSS module

const BookDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedBooks, setRelatedBooks] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const foundBook = sampleBooks.find((b) => b.id.toString() === id);

      if (foundBook) {
        setBook(foundBook);
        const related = sampleBooks
          .filter((b) => b.category_id === foundBook.category_id && b.id !== foundBook.id)
          .slice(0, 4);
        setRelatedBooks(related);
      }
      setIsLoading(false);
    };

    loadData();
    setQuantity(1);
    setActiveTab("description");
    window.scrollTo(0, 0);
  }, [id]);
  console.log('hello ');
  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value);
    if (value > 0 && value <= book.available_quantity) {
      setQuantity(value);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < book.available_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(book, quantity);
  };

  const getCoverImage = (book) => {
    return book.images?.find((img) => img.is_cover)?.url || "/placeholder.svg?height=300&width=200";
  };

  const getAuthorNames = (book) => {
    return book.authors?.map((author) => author.name).join(", ") || "Tác giả không xác định";
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải thông tin chi tiết sách...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className={styles.bookNotFound}>
        <h2>Không Tìm Thấy Sách</h2>
        <p>Sách bạn đang tìm không tồn tại.</p>
        <Link to="/books" className={styles.backToBooks}>
          Quay Lại Danh Sách Sách
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.bookDetailPage}>
      <div className={styles.bookDetailContainer}>
        <div className={styles.bookBreadcrumb}>
          <Link to="/">Trang Chủ</Link> /<Link to="/books"> Sách</Link> /
          <Link to={`/books?category=${book.category_id}`}> {book.categoryName}</Link> /
          <span> {book.title}</span>
        </div>

        <div className={styles.bookDetailMain}>
          <div className={styles.bookDetailImage}>
            <img src={getCoverImage(book) || "/placeholder.svg"} alt={book.title} />
            {book.available_quantity <= 0 && (
              <div className={styles.bookDetailOutOfStock}>Hết Hàng</div>
            )}
          </div>

          <div className={styles.bookDetailInfo}>
            <h1 className={styles.bookDetailTitle}>{book.title}</h1>
            <p className={styles.bookDetailAuthor}>Tác giả: {getAuthorNames(book)}</p>

            <div className={styles.bookDetailPrice}>
              <div className={styles.rentalPrice}>
                <span className={styles.priceLabel}>Giá Thuê:</span>
                <span className={styles.priceValue}>
                  ₫{book.rental_price.toLocaleString()}/tháng
                </span>
              </div>
              <div className={styles.depositPrice}>
                <span className={styles.priceLabel}>Tiền Cọc (Hoàn Lại):</span>
                <span className={styles.priceValue}>
                  ₫{book.deposit_price.toLocaleString()}
                </span>
              </div>
            </div>

            <div className={styles.bookDetailStock}>
              <span
                className={book.available_quantity > 0 ? styles.inStock : styles.outOfStock}
              >
                {book.available_quantity > 0
                  ? `Còn Hàng (${book.available_quantity} cuốn)`
                  : "Hết Hàng"}
              </span>
            </div>

            <div className={styles.bookDetailActions}>
              <div className={styles.quantitySelector}>
                <button
                  className={styles.quantityBtn}
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1 || book.available_quantity <= 0}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={book.available_quantity}
                  disabled={book.available_quantity <= 0}
                />
                <button
                  className={styles.quantityBtn}
                  onClick={increaseQuantity}
                  disabled={quantity >= book.available_quantity || book.available_quantity <= 0}
                >
                  +
                </button>
              </div>

              <button
                className={styles.addToCartButton}
                onClick={handleAddToCart}
                disabled={book.available_quantity <= 0}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Thêm Vào Giỏ Hàng
              </button>
            </div>

            <div className={styles.bookDetailMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Nhà Xuất Bản:</span>
                <span className={styles.metaValue}>{book.publisher}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Năm Xuất Bản:</span>
                <span className={styles.metaValue}>{book.publish_year}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Ngôn Ngữ:</span>
                <span className={styles.metaValue}>{book.language}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Số Trang:</span>
                <span className={styles.metaValue}>{book.pages}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>ISBN:</span>
                <span className={styles.metaValue}>{book.isbn}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bookDetailTabs}>
          <div className={styles.tabsHeader}>
            <button
              className={activeTab === "description" ? styles.active : ""}
              onClick={() => setActiveTab("description")}
            >
              Mô Tả
            </button>
            <button
              className={activeTab === "reviews" ? styles.active : ""}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh Giá
            </button>
            <button
              className={activeTab === "rental-terms" ? styles.active : ""}
              onClick={() => setActiveTab("rental-terms")}
            >
              Điều Khoản Thuê
            </button>
          </div>

          <div className={styles.tabsContent}>
            {activeTab === "description" && (
              <div className={styles.tabDescription}>
                <p>{book.description}</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className={styles.tabReviews}>
                <p className={styles.noReviews}>
                  Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá cuốn sách này!
                </p>
              </div>
            )}

            {activeTab === "rental-terms" && (
              <div className={styles.tabRentalTerms}>
                <h3>Điều Khoản và Điều Kiện Thuê Sách</h3>
                <ul>
                  <li>Thời gian thuê tiêu chuẩn là 30 ngày.</li>
                  <li>Yêu cầu đặt cọc (có thể hoàn lại) cho tất cả các lần thuê.</li>
                  <li>Tiền cọc sẽ được hoàn lại khi sách được trả trong tình trạng tốt.</li>
                  <li>Trả sách muộn sẽ bị phạt 10% giá thuê mỗi ngày.</li>
                  <li>Sách bị hư hỏng hoặc mất sẽ bị tịch thu tiền cọc.</li>
                  <li>Có thể gia hạn thuê bằng cách liên hệ dịch vụ khách hàng trước ngày đến hạn.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <div className={styles.relatedBooks}>
            <h2>Bạn Có Thể Thích</h2>
            <div className={styles.relatedBooksGrid}>
              {relatedBooks.map((relatedBook) => (
                <Link
                  key={relatedBook.id}
                  to={`/book/${relatedBook.id}`}
                  className={styles.relatedBookCard}
                >
                  <div className={styles.relatedBookImage}>
                    <img
                      src={getCoverImage(relatedBook) || "/placeholder.svg"}
                      alt={relatedBook.title}
                    />
                  </div>
                  <div className={styles.relatedBookInfo}>
                    <h3>{relatedBook.title}</h3>
                    <p>{getAuthorNames(relatedBook)}</p>
                    <span>₫{relatedBook.rental_price.toLocaleString()}/tháng</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;