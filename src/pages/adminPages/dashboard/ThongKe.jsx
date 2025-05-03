import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, Download, BookOpen, TrendingUp } from 'lucide-react';
import styles from './ThongKe.module.css';

// Mock data for demonstration
const mockRevenueData = [
  { 
    id: 1, 
    report_date: '2025-04-01', 
    report_type: 'Monthly', 
    total_rentals: 325, 
    total_revenue: 9750000, 
    deposit_amount: 3250000, 
    late_fees: 875000, 
    refund_amount: 250000 
  },
  { 
    id: 2, 
    report_date: '2025-03-01', 
    report_type: 'Monthly', 
    total_rentals: 298, 
    total_revenue: 8940000, 
    deposit_amount: 2980000, 
    late_fees: 720000, 
    refund_amount: 180000 
  },
  { 
    id: 3, 
    report_date: '2025-02-01', 
    report_type: 'Monthly', 
    total_rentals: 276, 
    total_revenue: 8280000, 
    deposit_amount: 2760000, 
    late_fees: 650000, 
    refund_amount: 210000 
  }
];

const mockPopularBooks = [
  { id: 1, title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', rentals: 42 },
  { id: 2, title: 'Tội Ác Và Hình Phạt', author: 'Fyodor Dostoevsky', rentals: 38 },
  { id: 3, title: 'Nhà Giả Kim', author: 'Paulo Coelho', rentals: 35 },
  { id: 4, title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', author: 'Rosie Nguyễn', rentals: 31 },
  { id: 5, title: 'Bố Già', author: 'Mario Puzo', rentals: 29 }
];

export default function LibraryRevenueManagement() {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [activeTab, setActiveTab] = useState('revenue');
  const [currentReport, setCurrentReport] = useState(mockRevenueData[0]);
  
  // Format currency for Vietnamese Dong
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date to Vietnamese format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };
  
  const handleMonthChange = (index) => {
    setSelectedMonth(index);
    setCurrentReport(mockRevenueData[index]);
  };
  
  const handleExportReport = () => {
    alert(`Đang xuất báo cáo tháng ${formatDate(currentReport.report_date)}`);
    // In a real implementation, this would generate and download a PDF
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản Lý Doanh Thu Thư Viện</h1>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'revenue' ? styles.active : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            <TrendingUp size={18} />
            <span>Báo Cáo Doanh Thu</span>
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'popular' ? styles.active : ''}`}
            onClick={() => setActiveTab('popular')}
          >
            <BookOpen size={18} />
            <span>Sách Phổ Biến</span>
          </button>
        </div>
      </div>
      
      {activeTab === 'revenue' && (
        <div className={styles.revenueSection}>
          <div className={styles.filterBar}>
            <div className={styles.dropdown}>
              <button className={styles.dropdownToggle}>
                <Calendar size={16} />
                <span>{formatDate(currentReport.report_date)}</span>
                <ChevronDown size={16} />
              </button>
              <div className={styles.dropdownMenu}>
                {mockRevenueData.map((report, index) => (
                  <button 
                    key={report.id} 
                    className={selectedMonth === index ? styles.selected : ''}
                    onClick={() => handleMonthChange(index)}
                  >
                    {formatDate(report.report_date)}
                  </button>
                ))}
              </div>
            </div>
            <button className={styles.exportButton} onClick={handleExportReport}>
              <Download size={16} />
              <span>Xuất Báo Cáo</span>
            </button>
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Tổng Số Lượt Thuê</h3>
              <p className={styles.statValue}>{currentReport.total_rentals}</p>
              <span className={styles.statLabel}>lượt</span>
            </div>
            <div className={`${styles.statCard} ${styles.primary}`}>
              <h3>Tổng Doanh Thu</h3>
              <p className={styles.statValue}>{formatCurrency(currentReport.total_revenue)}</p>
              <span className={styles.statLabel}>VNĐ</span>
            </div>
            <div className={styles.statCard}>
              <h3>Tiền Đặt Cọc</h3>
              <p className={styles.statValue}>{formatCurrency(currentReport.deposit_amount)}</p>
              <span className={styles.statLabel}>VNĐ</span>
            </div>
            <div className={styles.statCard}>
              <h3>Phí Trả Muộn</h3>
              <p className={styles.statValue}>{formatCurrency(currentReport.late_fees)}</p>
              <span className={styles.statLabel}>VNĐ</span>
            </div>
          </div>
          
          <div className={styles.detailsPanel}>
            <h2>Chi Tiết Báo Cáo - {formatDate(currentReport.report_date)}</h2>
            <table className={styles.revenueTable}>
              <thead>
                <tr>
                  <th>Chỉ Số</th>
                  <th>Giá Trị</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Thời Gian Báo Cáo</td>
                  <td>{formatDate(currentReport.report_date)}</td>
                </tr>
                <tr>
                  <td>Loại Báo Cáo</td>
                  <td>{currentReport.report_type === 'Monthly' ? 'Tháng' : currentReport.report_type}</td>
                </tr>
                <tr>
                  <td>Tổng Số Lượt Thuê</td>
                  <td>{currentReport.total_rentals} lượt</td>
                </tr>
                <tr>
                  <td>Tổng Doanh Thu</td>
                  <td>{formatCurrency(currentReport.total_revenue)}</td>
                </tr>
                <tr>
                  <td>Tiền Đặt Cọc</td>
                  <td>{formatCurrency(currentReport.deposit_amount)}</td>
                </tr>
                <tr>
                  <td>Phí Trả Muộn</td>
                  <td>{formatCurrency(currentReport.late_fees)}</td>
                </tr>
                <tr>
                  <td>Tiền Hoàn Trả</td>
                  <td>{formatCurrency(currentReport.refund_amount)}</td>
                </tr>
                <tr className={styles.totalRow}>
                  <td>Lợi Nhuận Thực</td>
                  <td>{formatCurrency(currentReport.total_revenue - currentReport.refund_amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'popular' && (
        <div className={styles.popularBooksSection}>
          <h2>Danh Sách Sách Được Thuê Nhiều Nhất</h2>
          <table className={styles.booksTable}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên Sách</th>
                <th>Tác Giả</th>
                <th>Số Lượt Thuê</th>
              </tr>
            </thead>
            <tbody>
              {mockPopularBooks.map((book, index) => (
                <tr key={book.id}>
                  <td>{index + 1}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.rentals} lượt</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}