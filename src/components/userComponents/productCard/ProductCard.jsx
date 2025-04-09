import { Link } from "react-router-dom";
import { useCart } from "../../../contexts/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
//   const { addToCart } = useCart();
    function addToCart(product){
        console.log('add to card complete', product);
    }
    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    // Calculate discount price if applicable
    const discountedPrice = product.discount > 0 
        ? product.price - (product.price * product.discount) / 100 
        : null;

    return (
        <Link to={`/product/${product.id}`} className="product-card">
        <div className="product-image">
            <img src={product.image || "/placeholder.svg?height=300&width=200"} alt={product.name} />
            {product.discount > 0 && <div className="discount-badge">-{product.discount}%</div>}
        </div>
        <div className="product-info">
            <h3 className="product-title">{product.name}</h3>
            <p className="product-author">{product.author}</p>
            <div className="product-price">
            {discountedPrice ? (
                <>
                <span className="discounted-price">${discountedPrice.toFixed(2)}</span>
                <span className="original-price">${product.price.toFixed(2)}</span>
                </>
            ) : (
                <span>${product.price.toFixed(2)}</span>
            )}
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
            Add to Cart
            </button>
        </div>
        </Link>
    );
};

export default ProductCard;
