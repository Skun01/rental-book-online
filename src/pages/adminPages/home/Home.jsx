import styles from './Home.module.css';
import {BookOpenCheck, MoreHorizontal, CircleDollarSign, 
  SquareLibrary, Users, Clock, Banknote,
  Book, User, AlertCircle, CheckCircle, Bell} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTotalBook } from '../../../api/bookApi';
import { numberUserGet } from '../../../api/userApi';
import { getRevenueGet } from '../../../api/revenueApi';
import axios from 'axios';

export default function Home() {
  const [totalBook, setTotalBook] = useState(0)
  const [totalUser, setTotalUser] = useState(0)
  const [revenue, setRevenue] = useState({})
  
  useEffect(()=>{
    async function getData(){
      try{
        const data = await getTotalBook()
        setTotalBook(data)
        const allRevenueData = await getRevenueGet()
        setRevenue(allRevenueData)
        const dataNumberUser = await numberUserGet()
        setTotalUser(dataNumberUser)
      }catch(err){
        console.error(`can't get revenue data: `, err)
      }
    }
    getData()
  }, [])

  return (
    <div className="adminTabPage">
      <div className="adminPageTitle">Trang chủ</div>
      <div className={styles.homeContent}>
        <div className={styles.homeHeader}>
          <div className={styles.homeCard}>
            <div className={styles.cardRow}>
              <BodyCard
                title="Sách đang cho thuê"
                value="20"
              >
                <BookOpenCheck size={30} color="#4154f1" />
              </BodyCard>
              <BodyCard
                title="Sách quá hạn trả"
                value="6"
              >
                <Clock size={30} color="#dc2626" />
              </BodyCard>

              <BodyCard
                title="Sách đang có"
                value={totalBook}
              >
                <SquareLibrary size={30} color="#4154f1" />
              </BodyCard>
            </div>
            <div className={styles.cardRow}>
              <BodyCard
                title="Doanh thu"
                value={revenue.totalRental || 0}
                isMoney={true}
              >
                <CircleDollarSign size={30} color='#2eca6a'/>
              </BodyCard>
              <BodyCard
                title="Tiền đang cọc"
                value={revenue.totalDeposit || 0}
                isMoney={true}
              >
                <Banknote size={30} color='#f59e0b'/>
              </BodyCard>
            </div>
            <div className={styles.cardRow}>
              <BodyCard
                title="Người dùng"
                value={totalUser}
              >
                <Users size={30} color='#ff771d'/>
              </BodyCard>
            </div>
            <div className={styles.topBookCardSection}>
              <TopBookCard />
            </div>
          </div>
          <div className={styles.note}>
            <ActivityNode />
          </div>
        </div>
      </div>
    </div>
  )
}

// card top sách được thuê nhiều nhất
function TopBookCard() {
  const books = [
    {
      id: 1, 
      name: 'Lập trình React',
      rentNumber: 10,
      image: '/auth.jpg',
      totalRentPrice: 2000000
    }, 
    {
      id: 2, 
      name: 'Lập trình React',
      rentNumber: 30,
      image: '/auth.jpg',
      totalRentPrice: 2000000
    }, 
    {
      id: 3, 
      name: 'Lập trình React',
      rentNumber: 20,
      image: '/auth.jpg',
      totalRentPrice: 2000000
    }, 
    {
      id: 4, 
      name: 'Lập trình React',
      rentNumber: 15,
      image: '/auth.jpg',
      totalRentPrice: 2000000
    }, 
    {
      id: 5, 
      name: 'Lập trình React',
      rentNumber: 25,
      image: '/auth.jpg',
      totalRentPrice: 2000000
    }
  ]
  const sortedBooks = books.sort((a, b) => b.rentNumber - a.rentNumber);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeaderContainer}>
        <CardHeader title="Sách được thuê nhiều nhất" filter={false} />
      </div>
      
      <div className={styles.cardBody}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Thứ hạng</th>
              <th className={styles.tableHeader}>Sách</th>
              <th className={styles.tableHeader}>Lượt thuê</th>
              <th className={styles.tableHeader}>Tổng thu</th>
            </tr>
          </thead>
          <tbody>
            {sortedBooks.map((book, index) => (
              <tr key={book.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <div className={`${styles.rank} ${styles[`rank${index + 1}`]}`}>
                    #{index + 1}
                  </div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.bookInfo}>
                    <img 
                      src={book.image} 
                      alt={book.name}
                      className={styles.bookImage}
                    />
                    <span className={styles.bookName}>{book.name}</span>
                  </div>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.rentCount}>{book.rentNumber} lần</span>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.totalRent}>{book.totalRentPrice.toLocaleString('vi-VI')} VNĐ</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// card hiển thị thông báo từ API
function ActivityNode() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        'http://localhost:8080/api/v1/notification/all?page=0&size=10&active=CREATE'
      );
      
      if (response.data && response.data.data && response.data.data.content) {
        // Sort notifications by createAt (newest first) and take only first 10
        const sortedNotifications = response.data.data.content
          .sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
          .slice(0, 10);
        setNotifications(sortedNotifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  // Get notification type and icon based on description
  const getNotificationTypeAndIcon = (description) => {
    if (description.includes("được thêm") || description.includes("đăng ký")) {
      return { 
        icon: <User size={16} />, 
        color: 'blue',
        type: 'add'
      };
    }
    if (description.includes("được cập nhật")) {
      return { 
        icon: <CheckCircle size={16} />, 
        color: 'green',
        type: 'update'
      };
    }
    if (description.includes("được xóa") || description.includes("quá hạn")) {
      return { 
        icon: <AlertCircle size={16} />, 
        color: 'red',
        type: 'delete'
      };
    }
    if (description.includes("thuê")) {
      return { 
        icon: <Book size={16} />, 
        color: 'blue',
        type: 'rent'
      };
    }
    if (description.includes("trả")) {
      return { 
        icon: <CheckCircle size={16} />, 
        color: 'green',
        type: 'return'
      };
    }
    return { 
      icon: <Bell size={16} />, 
      color: 'blue',
      type: 'default'
    };
  };

  return (
    <div className={styles.card}>
      <div className={styles.activityListHeader}>
        <CardHeader title="Hoạt động gần đây" filter={false} />
      </div>
      
      <div className={styles.activityList}>
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Đang tải thông báo...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={fetchNotifications}
            >
              Thử lại
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <Bell size={48} className={styles.emptyIcon} />
            <p>Không có thông báo nào</p>
          </div>
        ) : (
          notifications.map((notification, index) => {
            const { icon, color } = getNotificationTypeAndIcon(notification.description);
            
            return (
              <div key={notification.id} className={styles.activityItem}>
                {/* Timeline line */}
                <div className={styles.timeline}>
                  <div className={`${styles.timelineIcon} ${styles[`icon${color.charAt(0).toUpperCase() + color.slice(1)}`]}`}>
                    {icon}
                  </div>
                  {index !== notifications.length - 1 && (
                    <div className={styles.timelineLine}></div>
                  )}
                </div>
                
                {/* Activity content */}
                <div className={styles.activityContent}>
                  <div className={styles.activityMessage}>
                    {notification.description}
                  </div>
                  <div className={styles.activityTime}>
                    <Clock size={12} />
                    <span>{formatDate(notification.createAt)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      <div className={styles.viewMore}>
        <button className={styles.viewMoreBtn}>
          Xem tất cả hoạt động
        </button>
      </div>
    </div>
  )
}

// card hiển thị thông tin tổng hợp (đã xóa filter)
function BodyCard({ 
  title = "Sales", 
  value = "145", 
  isMoney = false,
  children,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeaderContainer}>
        <CardHeader title={title} filter={false}/>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.iconWrapper}>
          {children}
        </div>
        <div className={styles.valueSection}>
          <div className={styles.value}>
            {isMoney ? (+value).toLocaleString('vi-VN') + " VNĐ" : value}
          </div>
        </div>
      </div>
    </div>
  )
}

function CardHeader({title = "", filter = false}){
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState("Hôm nay");
  const filterList = [
    { id: 1, name: "Hôm nay" },
    { id: 2, name: "Tháng này" },
    { id: 3, name: "Năm nay" },
    { id: 4, name: "Từ trước tới nay" }
  ]
  
  return (
    <div className={styles.cardHeader}>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{title}</h3>
          {filter && <span className={styles.subtitle}>| {filterValue}</span>}
        </div>
        {filter && (
          <button className={styles.moreButton}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <MoreHorizontal size={20} />
          </button>
        )}
        {filterOpen && (
          <div className={styles.filterContainer}>
            {filterList.map((item)=>(
              <div className={styles.filterRow}
                key={item.id}
                onClick={() => {
                  setFilterValue(item.name);
                  setFilterOpen(false);
                  setFilterValue(item.name);
                }}>
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
  )
}