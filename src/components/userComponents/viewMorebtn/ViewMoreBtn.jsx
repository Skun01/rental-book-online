// XemThemButton.jsx
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import styles from './ViewMoreBtn.module.css';

export default function ViewMoreBtn() {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      className={styles.button}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`${styles.text} ${isHovered ? styles.hovering : ""}`}>Xem thêm</span>
      <ChevronRight className={styles.icon} />
    </button>
  );
}