import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './BookSlider.module.css'; // Import CSS Module

export default function BookSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  // Danh sách ảnh và mô tả sách với link ảnh thực từ internet
  const slides = [
  {
    image: "/banner/slider1.jpg",
    title: "Sách Việt Nam",
    description: "Khám phá văn học Việt Nam qua từng trang sách"
  },
  {
    image: "/banner/slider2.jpg",
    title: "Không gian đọc sách",
    description: "Tận hưởng từng phút giây thư giãn cùng sách"
  },
  {
    image: "/banner/slider3.jpg",
    title: "Đam mê đọc sách",
    description: "Khơi dậy niềm đam mê đọc sách mỗi ngày"
  },
  {
    image: "/banner/slider4.jpg",
    title: "Tri thức từ sách",
    description: "Kho tàng tri thức vô tận từ những cuốn sách giá trị"
  }
];

  // chuyển slide tiếp theo
  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
      // Reset timer khi người dùng tương tác
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      startAutoSlide();
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // quay lại slide trước
  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
      
      // Reset timer khi người dùng tương tác
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Khởi động lại timer
      startAutoSlide();
      
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // chuyển đến slide cụ thể
  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      
      // Reset timer khi người dùng tương tác
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Khởi động lại timer
      startAutoSlide();
      
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // bắt đầu auto slide
  const startAutoSlide = () => {
    timerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex(prevIndex => (prevIndex + 1) % slides.length);
      setTimeout(() => setIsTransitioning(false), 500);
    }, 4000);
  };

  // Tự động chuyển slide khi component mount
  useEffect(() => {
    startAutoSlide();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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