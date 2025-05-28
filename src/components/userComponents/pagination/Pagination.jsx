import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./Pagination.module.css"

export default function Pagination({ totalPages = 2, initialPage = 1, setPage }) {
  const [currentPage, setCurrentPage] = useState(initialPage)

  useEffect(() => {
    setCurrentPage(initialPage)
  }, [initialPage])

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      setPage(newPage)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      setPage(newPage)
    }
  }

  return (
    <div className={styles.paginationContainer}>
      <button
        className={`${styles.navButton} ${currentPage === 1 ? styles.disabled : ""}`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={20} />
      </button>

      <div className={styles.pageInfo}>
        <span className={styles.pageLabel}>Trang</span>
        <span className={styles.currentPage}>{currentPage}</span>
        <span className={styles.separator}>/</span>
        <span className={styles.totalPages}>{totalPages}</span>
      </div>

      <button
        className={`${styles.navButton} ${currentPage === totalPages ? styles.disabled : ""}`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
