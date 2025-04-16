"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../../components/userComponents/bookCard/BookCard";
import { sampleBooks, sampleCategories, sampleAuthors } from "../../sampleData";
import styles from "./BooksPage.module.css";

const BooksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    author: searchParams.get("author") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    availability: searchParams.get("availability") || "all",
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "newest",
  });

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredBooks = [...sampleBooks];

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredBooks = filteredBooks.filter(
          (book) =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.authors.some((author) => author.name.toLowerCase().includes(searchTerm))
        );
      }

      // Category filter
      if (filters.category) {
        filteredBooks = filteredBooks.filter(
          (book) => book.category_id.toString() === filters.category
        );
      }

      // Author filter
      if (filters.author) {
        filteredBooks = filteredBooks.filter((book) =>
          book.authors.some((author) => author.id.toString() === filters.author)
        );
      }

      // Price filters
      if (filters.minPrice) {
        filteredBooks = filteredBooks.filter(
          (book) => book.rental_price >= Number.parseFloat(filters.minPrice)
        );
      }
      if (filters.maxPrice) {
        filteredBooks = filteredBooks.filter(
          (book) => book.rental_price <= Number.parseFloat(filters.maxPrice)
        );
      }

      // Availability filter
      if (filters.availability === "available") {
        filteredBooks = filteredBooks.filter((book) => book.available_quantity > 0);
      }

      // Sorting
      switch (filters.sort) {
        case "newest":
          filteredBooks.sort((a, b) => new Date(b.create_at) - new Date(a.create_at));
          break;
        case "price-low":
          filteredBooks.sort((a, b) => a.rental_price - b.rental_price);
          break;
        case "price-high":
          filteredBooks.sort((a, b) => b.rental_price - a.rental_price);
          break;
        case "title-asc":
          filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "title-desc":
          filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }

      setBooks(filteredBooks);
      setCategories(sampleCategories);
      setAuthors(sampleAuthors);
      setIsLoading(false);
    };

    loadData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    // Update URL search params
    if (value) {
      searchParams.set(name, value);
    } else {
      searchParams.delete(name);
    }
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      author: "",
      minPrice: "",
      maxPrice: "",
      availability: "all",
      search: "",
      sort: "newest",
    });
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Đang tải sách...</p>
      </div>
    );
  }

  return (
    <div className={styles.booksPage}>
      <div className={styles.booksHeader}>
        <h1>Duyệt Sách</h1>
        <p>Khám phá bộ sưu tập sách có sẵn để thuê</p>
      </div>

      <div className={styles.booksContainer}>
        <aside className={styles.filtersSidebar}>
          <div className={styles.filterSection}>
            <h3>Thể Loại</h3>
            <div className={styles.filterOptions}>
              <div className={styles.filterOption}>
                <input
                  type="radio"
                  id="all-categories"
                  name="category"
                  value=""
                  checked={filters.category === ""}
                  onChange={handleFilterChange}
                />
                <label htmlFor="all-categories">Tất Cả Thể Loại</label>
              </div>
              {categories.map((category) => (
                <div key={category.id} className={styles.filterOption}>
                  <input
                    type="radio"
                    id={`category-${category.id}`}
                    name="category"
                    value={category.id}
                    checked={filters.category === category.id.toString()}
                    onChange={handleFilterChange}
                  />
                  <label htmlFor={`category-${category.id}`}>{category.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3>Tác Giả</h3>
            <div className={styles.filterOptions}>
              <div className={styles.filterOption}>
                <input
                  type="radio"
                  id="all-authors"
                  name="author"
                  value=""
                  checked={filters.author === ""}
                  onChange={handleFilterChange}
                />
                <label htmlFor="all-authors">Tất Cả Tác Giả</label>
              </div>
              {authors.map((author) => (
                <div key={author.id} className={styles.filterOption}>
                  <input
                    type="radio"
                    id={`author-${author.id}`}
                    name="author"
                    value={author.id}
                    checked={filters.author === author.id.toString()}
                    onChange={handleFilterChange}
                  />
                  <label htmlFor={`author-${author.id}`}>{author.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3>Khoảng Giá Thuê</h3>
            <div className={styles.priceInputs}>
              <input
                type="number"
                name="minPrice"
                placeholder="Tối thiểu"
                value={filters.minPrice}
                onChange={handleFilterChange}
                min="0"
              />
              <span>đến</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Tối đa"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                min="0"
              />
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3>Tình Trạng</h3>
            <div className={styles.filterOptions}>
              <div className={styles.filterOption}>
                <input
                  type="radio"
                  id="all-availability"
                  name="availability"
                  value="all"
                  checked={filters.availability === "all"}
                  onChange={handleFilterChange}
                />
                <label htmlFor="all-availability">Tất Cả Sách</label>
              </div>
              <div className={styles.filterOption}>
                <input
                  type="radio"
                  id="available-only"
                  name="availability"
                  value="available"
                  checked={filters.availability === "available"}
                  onChange={handleFilterChange}
                />
                <label htmlFor="available-only">Chỉ Còn Sẵn</label>
              </div>
            </div>
          </div>

          <button className={styles.clearFiltersBtn} onClick={clearFilters}>
            Xóa Bộ Lọc
          </button>
        </aside>

        <div className={styles.booksMain}>
          <div className={styles.booksToolbar}>
            <div className={styles.booksCount}>
              {books.length} {books.length === 1 ? "cuốn sách" : "cuốn sách"} được tìm thấy
            </div>
            <div className={styles.booksSortSec}>
              <div className={styles.booksSort}>
                <label htmlFor="sort">Sắp xếp:</label>
                <select id="sort" name="sort" value={filters.sort} onChange={handleFilterChange}>
                  <option value="newest">Mới Nhất</option>
                  <option value="price-low">Giá: Thấp đến Cao</option>
                  <option value="price-high">Giá: Cao đến Thấp</option>
                  <option value="title-asc">Tiêu Đề: A-Z</option>
                  <option value="title-desc">Tiêu Đề: Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {books.length > 0 ? (
            <div className={styles.booksGrid}>
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className={styles.noBooks}>
              <p>Không tìm thấy sách nào phù hợp với tiêu chí của bạn.</p>
              <button onClick={clearFilters}>Xóa bộ lọc</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BooksPage;