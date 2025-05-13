import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './BookSlider.module.css'; // Import CSS Module

export default function BookSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Danh sách ảnh và mô tả sách với link ảnh thực từ internet
  const slides = [
  {
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    title: "Sách Việt Nam",
    description: "Khám phá văn học Việt Nam qua từng trang sách"
  },
  {
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    title: "Không gian đọc sách",
    description: "Tận hưởng từng phút giây thư giãn cùng sách"
  },
  {
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    title: "Đam mê đọc sách",
    description: "Khơi dậy niềm đam mê đọc sách mỗi ngày"
  },
  {
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    title: "Tri thức từ sách",
    description: "Kho tàng tri thức vô tận từ những cuốn sách giá trị"
  }
];

  // Tự động chuyển slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Hàm chuyển slide tiếp theo
  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Hàm quay lại slide trước
  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Hàm chuyển đến slide cụ thể
  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  return (
    <div className={styles.container}>
      {/* Slides container */}
      <div className={styles.wrapper}>
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`${styles.slide} ${index === currentIndex ? styles.active : ""}`}
          >
            <img 
              src={slide.image} 
              alt={slide.title}
              className={styles.image}
            />
            <div className={styles.content}>
              <h3 className={styles.title}>{slide.title}</h3>
              <p className={styles.description}>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Điều hướng */}
      <button 
        onClick={prevSlide}
        className={`${styles.navButton} ${styles.prevButton}`}
        aria-label="Slide trước"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={nextSlide}
        className={`${styles.navButton} ${styles.nextButton}`}
        aria-label="Slide sau"
      >
        <ChevronRight size={24} />
      </button>

      {/* Chỉ báo slide */}
      <div className={styles.indicators}>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`${styles.indicator} ${index === currentIndex ? styles.activeIndicator : ""}`}
            aria-label={`Chuyển đến slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}