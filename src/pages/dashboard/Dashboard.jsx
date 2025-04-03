"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { sampleBooks, sampleCategories } from "../../data/data";
import BookCard from "../../components/userComponents/bookCard/BookCard";
import "./Dashboard.css"

const Dashboard = () => {
  const [featuredBooks, setFeaturedBooks] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [popularCategories, setPopularCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with sample data
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Get featured books (books with discount)
      const featured = sampleBooks.filter((book) => book.discount > 0).slice(0, 4)

      // Get new arrivals (sort by create_at date)
      const arrivals = [...sampleBooks].sort((a, b) => new Date(b.create_at) - new Date(a.create_at)).slice(0, 4)

      // Get popular categories
      const categories = sampleCategories.slice(0, 6)

      setFeaturedBooks(featured)
      setNewArrivals(arrivals)
      setPopularCategories(categories)
      setIsLoading(false)
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading books...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <h1>Discover Your Next Favorite Book</h1>
          <p>Rent from thousands of titles with affordable prices</p>
          <Link to="/books" className="browse-button">
            Browse Collection
          </Link>
        </div>
      </section>

      {/* Featured Books */}
      <section className="book-section">
        <div className="section-header">
          <h2>Featured Books</h2>
          <Link to="/books?featured=true" className="view-all">
            View All
          </Link>
        </div>
        <div className="book-grid">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Popular Categories</h2>
          <Link to="/categories" className="view-all">
            View All
          </Link>
        </div>
        <div className="categories-grid">
          {popularCategories.map((category) => (
            <Link to={`/books?category=${category.id}`} key={category.id} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.bookCount} Books</p>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="book-section">
        <div className="section-header">
          <h2>New Arrivals</h2>
          <Link to="/books?sort=newest" className="view-all">
            View All
          </Link>
        </div>
        <div className="book-grid">
          {newArrivals.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* Subscription Banner */}
      <section className="subscription-banner">
        <div className="subscription-content">
          <h2>Join Our Book Club</h2>
          <p>Get exclusive access to new releases and special discounts</p>
          <form className="subscription-form">
            <input type="email" placeholder="Your email address" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Dashboard

