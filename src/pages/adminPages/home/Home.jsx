import styles from './Home.module.css';
import {BookOpenCheck, MoreHorizontal, CircleDollarSign, 
  SquareLibrary, Users, Clock, Banknote,
  Book, User, AlertCircle, CheckCircle} from 'lucide-react';
import { useState } from 'react';
export default function Home() {
  return (
    <div className={styles.home}>
      <div className={styles.homeTitle}>Trang chủ</div>
      <div className={styles.homeContent}>
        <div className={styles.homeHeader}>
          <div className={styles.homeCard}>
            <div className={styles.cardRow}>
              <BodyCard
                title="Sách đang có"
                value="145"
              >
                <SquareLibrary size={30} color="#4154f1" />
              </BodyCard>
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
            </div>
            <div className={styles.cardRow}>
              <BodyCard
                title="Doanh thu"
                value='20000000'
                isMoney={true}
              >
                <CircleDollarSign size={30} color='#2eca6a'/>
              </BodyCard>
              <BodyCard
                title="Tiền đang cọc"
                value='9867300'
                isMoney={true}
              >
                <Banknote size={30} color='#f59e0b'/>
              </BodyCard>
            </div>
            <div className={styles.cardRow}>
              <BodyCard
                title="Người dùng"
                value="20"
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
        <CardHeader title="Sách được thuê nhiều nhất" />
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


// card hiển thị thông báo
function ActivityNode() {
  const activities = [
    {
      id: 1,
      type: 'rent',
      message: 'Nguyễn Văn A đã thuê sách "Lập trình React"',
      time: '2 phút trước',
      icon: <Book size={16} />,
      color: 'blue'
    },
    {
      id: 2,
      type: 'return',
      message: 'Trần Thị B đã trả sách "JavaScript cơ bản"',
      time: '15 phút trước',
      icon: <CheckCircle size={16} />,
      color: 'green'
    },
    {
      id: 3,
      type: 'overdue',
      message: 'Sách "Python cho người mới bắt đầu" đã quá hạn trả',
      time: '30 phút trước',
      icon: <AlertCircle size={16} />,
      color: 'red'
    },
    {
      id: 4,
      type: 'register',
      message: 'Người dùng mới Lê Văn C đã đăng ký tài khoản',
      time: '1 giờ trước',
      icon: <User size={16} />,
      color: 'orange'
    },
    {
      id: 5,
      type: 'rent',
      message: 'Phạm Thị D đã thuê sách "Node.js Advanced"',
      time: '2 giờ trước',
      icon: <Book size={16} />,
      color: 'blue'
    },
    {
      id: 6,
      type: 'return',
      message: 'Hoàng Văn E đã trả sách "Database Design"',
      time: '3 giờ trước',
      icon: <CheckCircle size={16} />,
      color: 'green'
    },
    {
      id: 7,
      type: 'overdue',
      message: 'Sách "HTML & CSS" của Nguyễn Thị F đã quá hạn 2 ngày',
      time: '1 ngày trước',
      icon: <AlertCircle size={16} />,
      color: 'red'
    }
  ];

  return (
    <div className={styles.card}>
      <div className={styles.activityListHeader}>
        <CardHeader title="Hoạt động gần đây" />
      </div>
      
      <div className={styles.activityList}>
        {activities.map((activity, index) => (
          <div key={activity.id} className={styles.activityItem}>
            {/* Timeline line */}
            <div className={styles.timeline}>
              <div className={`${styles.timelineIcon} ${styles[`icon${activity.color.charAt(0).toUpperCase() + activity.color.slice(1)}`]}`}>
                {activity.icon}
              </div>
              {index !== activities.length - 1 && (
                <div className={styles.timelineLine}></div>
              )}
            </div>
            
            {/* Activity content */}
            <div className={styles.activityContent}>
              <div className={styles.activityMessage}>
                {activity.message}
              </div>
              <div className={styles.activityTime}>
                <Clock size={12} />
                <span>{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.viewMore}>
        <button className={styles.viewMoreBtn}>
          Xem tất cả hoạt động
        </button>
      </div>
    </div>
  )
}

// card hiển thị thông tin tổng hợp
function BodyCard({ 
  title = "Sales", 
  value = "145", 
  isMoney = false,
  children,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeaderContainer}>
        <CardHeader title={title} />
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

function CardHeader({title = ""}){
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
          <span className={styles.subtitle}>| {filterValue}</span>
        </div>
        <button className={styles.moreButton}
          onClick={() => setFilterOpen(!filterOpen)}>
          <MoreHorizontal size={20} />
        </button>
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
