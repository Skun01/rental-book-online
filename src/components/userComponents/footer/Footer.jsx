import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>BookRental</h3>
          <p className={styles.footerDescription}>
            Your online destination for book rentals. Discover, read, and return with ease.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Quick Links</h4>
          <ul className={styles.footerLinks}>
            <li>
              <Link to="/dashboard">Home</Link>
            </li>
            <li>
              <Link to="/books">Browse Books</Link>
            </li>
            <li>
              <Link to="/categories">Categories</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Customer Service</h4>
          <ul className={styles.footerLinks}>
            <li>
              <Link to="/help">Help Center</Link>
            </li>
            <li>
              <Link to="/returns">Returns</Link>
            </li>
            <li>
              <Link to="/shipping">Shipping Info</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerHeading}>Connect With Us</h4>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>
              <Facebook size={20} />
            </a>
            <a href="#" className={styles.socialLink}>
              <Instagram size={20} />
            </a>
            <a href="#" className={styles.socialLink}>
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>© {new Date().getFullYear()} BookRental. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;