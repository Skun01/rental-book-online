import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, Book, ShoppingCart } from 'lucide-react';
import './HireBook.css';

// Dữ liệu mẫu
const initialOrders = [
  { id: 1, bookTitle: 'Đắc Nhân Tâm', customer: 'Nguyễn Văn A', rentDate: '2025-04-01', returnDate: '2025-04-15', status: 'Đang thuê', price: 50000 },
  { id: 2, bookTitle: 'Nhà Giả Kim', customer: 'Trần Thị B', rentDate: '2025-04-05', returnDate: '2025-04-20', status: 'Đang thuê', price: 45000 },
  { id: 3, bookTitle: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', customer: 'Lê Văn C', rentDate: '2025-03-28', returnDate: '2025-04-10', status: 'Còn sách', price: 40000 },
  { id: 4, bookTitle: 'Cây Cam Ngọt Của Tôi', customer: 'Phạm Thị D', rentDate: '2025-04-03', returnDate: '2025-04-18', status: 'Còn sách', price: 55000 },
  { id: 5, bookTitle: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', customer: 'Hoàng Văn E', rentDate: '2025-04-07', returnDate: '2025-04-22', status: 'Tạm hết', price: 35000 },
  { id: 6, bookTitle: 'Số Đỏ', customer: 'Mai Thị F', rentDate: '2025-03-25', returnDate: '2025-04-08', status: 'Còn sách', price: 30000 },
  { id: 7, bookTitle: 'Đắc Nhân Tâm', customer: 'Lý Văn G', rentDate: '2025-04-10', returnDate: '2025-04-25', status: 'Đang thuê', price: 50000 },
  { id: 8, bookTitle: 'Nhà Giả Kim', customer: 'Vũ Thị H', rentDate: '2025-03-30', returnDate: '2025-04-14', status: 'Tạm hết', price: 45000 },
];

const revenueData = [
  { month: '1/2025', amount: 1250000 },
  { month: '2/2025', amount: 1350000 },
  { month: '3/2025', amount: 1750000 },
  { month: '4/2025', amount: 900000 },
];

const BookRentalManagement = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);
  const [popularBooks, setPopularBooks] = useState([]);

  // Xử lý lọc đơn hàng theo trạng thái
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  // Tính toán sách phổ biến
  useEffect(() => {
    const bookRentCount = {};
    orders.forEach(order => {
      if (bookRentCount[order.bookTitle]) {
        bookRentCount[order.bookTitle]++;
      } else {
        bookRentCount[order.bookTitle] = 1;
      }
    });

    const popularBooksArray = Object.keys(bookRentCount).map(title => ({
      title,
      count: bookRentCount[title]
    })).sort((a, b) => b.count - a.count);

    setPopularBooks(popularBooksArray);
  }, [orders]);

  // Hàm xuất báo cáo
  const exportRevenueReport = () => {
    // Trong thực tế, đây sẽ là chức năng xuất file
    alert('Báo cáo doanh thu đã được xuất thành công!');
  };

  // Tính tổng doanh thu
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <header className="app-header">
          <h1>Quản Lý Thuê Sách Thư Viện</h1>
          <p>Hệ thống quản lý thuê sách và theo dõi doanh thu</p>
        </header>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart className="tab-icon" />
            Đơn Hàng
          </button>
          <button 
            className={`tab-button ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            <TrendingUp className="tab-icon" />
            Doanh Thu
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="panel">
            <div className="panel-header">
              <h2>Danh Sách Đơn Hàng</h2>
              <div className="filter-buttons">
                <button 
                  className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  Tất cả
                </button>
                <button 
                  className={`filter-button ${statusFilter === 'Đang thuê' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('Đang thuê')}
                >
                  Đang thuê
                </button>
                <button 
                  className={`filter-button ${statusFilter === 'Còn sách' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('Còn sách')}
                >
                  Còn sách
                </button>
                <button 
                  className={`filter-button ${statusFilter === 'Tạm hết' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('Tạm hết')}
                >
                  Tạm hết
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên Sách</th>
                    <th>Khách Hàng</th>
                    <th>Ngày Thuê</th>
                    <th>Ngày Trả</th>
                    <th>Giá Thuê</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.bookTitle}</td>
                      <td>{order.customer}</td>
                      <td>{order.rentDate}</td>
                      <td>{order.returnDate}</td>
                      <td>{order.price.toLocaleString('vi-VN')} VNĐ</td>
                      <td>
                        <span className={`status-badge ${order.status === 'Đang thuê' ? 'renting' : 
                          order.status === 'Còn sách' ? 'available' : 'unavailable'}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="revenue-container">
            {/* Monthly Revenue */}
            <div className="panel">
              <div className="panel-header">
                <h2>Doanh Thu Theo Tháng</h2>
                <button 
                  className="export-button"
                  onClick={exportRevenueReport}
                >
                  <Download className="button-icon" />
                  Xuất Báo Cáo
                </button>
              </div>
              
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tháng</th>
                      <th>Doanh Thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.month}</td>
                        <td>{item.amount.toLocaleString('vi-VN')} VNĐ</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td>Tổng cộng</td>
                      <td>{totalRevenue.toLocaleString('vi-VN')} VNĐ</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Revenue Chart */}
              <div className="chart-container">
                <h3>Biểu Đồ Doanh Thu</h3>
                <div className="bar-chart">
                  {revenueData.map((item, index) => {
                    const height = Math.round((item.amount / Math.max(...revenueData.map(d => d.amount))) * 100);
                    return (
                      <div key={index} className="chart-column">
                        <div 
                          className="chart-bar" 
                          style={{height: `${height}%`}}
                        ></div>
                        <div className="chart-label">{item.month}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Popular Books */}
            <div className="panel">
              <h2 className="panel-title">
                <Book className="panel-icon" />
                Sách Được Thuê Nhiều Nhất
              </h2>
              
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tên Sách</th>
                      <th>Số Lượt Thuê</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularBooks.map((book, index) => (
                      <tr key={index} className={index < 3 ? "highlighted-row" : ""}>
                        <td>
                          {index < 3 && <span className="star-icon">★</span>}
                          {book.title}
                        </td>
                        <td>{book.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Popular Books Chart */}
              <div className="chart-container">
                <h3>Thống Kê Sách Phổ Biến</h3>
                <div className="bar-list">
                  {popularBooks.slice(0, 5).map((book, index) => (
                    <div key={index} className="bar-item">
                      <div className="bar-label">
                        <span>{book.title}</span>
                        <span>{book.count} lượt</span>
                      </div>
                      <div className="bar-track">
                        <div 
                          className="bar-fill" 
                          style={{width: `${(book.count / popularBooks[0].count) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRentalManagement;