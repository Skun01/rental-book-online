import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/userComponents/productCard/ProductCard";
import { sampleProducts, sampleCategories } from "../../sampleData";
import "./ProductsPage.css";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    sort: searchParams.get("sort") || "newest",
  });

  useEffect(() => {
    // Simulate API call with sample data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      let filteredProducts = [...sampleProducts];
      
      // Apply category filter
      if (filters.category) {
        filteredProducts = filteredProducts.filter(
          (product) => product.category_id.toString() === filters.category
        );
      }
      
      // Apply price filters
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= parseFloat(filters.minPrice)
        );
      }
      
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price <= parseFloat(filters.maxPrice)
        );
      }
      
      // Apply sorting
      switch (filters.sort) {
        case "newest":
          filteredProducts.sort(
            (a, b) => new Date(b.create_at) - new Date(a.create_at)
          );
          break;
        case "price-low":
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case "discount":
          filteredProducts.sort((a, b) => b.discount - a.discount);
          break;
        default:
          break;
      }
      
      setProducts(filteredProducts);
      setCategories(sampleCategories);
      setIsLoading(false);
    };
    
    loadData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    
    // Update URL params
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
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    });
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Browse Products</h1>
        <p>Discover our collection of products</p>
      </div>

      <div className="products-container">
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="filter-options">
              <div className="filter-option">
                <input
                  type="radio"
                  id="all-categories"
                  name="category"
                  value=""
                  checked={filters.category === ""}
                  onChange={handleFilterChange}
                />
                <label htmlFor="all-categories">All Categories</label>
              </div>
              {categories.map((category) => (
                <div key={category.id} className="filter-option">
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

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
                min="0"
              />
              <span>to</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                min="0"
              />
            </div>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </aside>

        <div className="products-main">
          <div className="products-toolbar">
            <div className="products-count">
              {products.length} {products.length === 1 ? "product" : "products"} found
            </div>
            <div className="products-sort">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
              <button onClick={clearFilters}>Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
