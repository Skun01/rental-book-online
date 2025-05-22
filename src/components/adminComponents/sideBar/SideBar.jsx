import styles from './SideBar.module.css'
import { Link } from 'react-router-dom'
import { LayoutGrid, BookOpen, Users, Library, ShoppingCart, 
  RotateCcw, ChartBarStacked, BookA
} from 'lucide-react'
import { useState } from 'react'

export default function SideBar(){
  const [activeTab, setActiveTab] = useState('home')
  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }
  return (
    <div className={styles.sidebar}>
      <ul className={styles.tabList}>
        <li className={`${styles.navRow} ${activeTab === 'home' ? styles.active : ''}`} 
            onClick={() => handleTabClick('home')}>
          <Link className={styles.navLink}>
            <LayoutGrid strokeWidth={1}/>
            <span>Trang chủ</span>
          </Link>
        </li>

        <li className={`${styles.navRow} ${activeTab === 'rentingBooks' ? styles.active : ''}`} 
            onClick={() => handleTabClick('rentingBooks')}>
          <Link className={styles.navLink}>
            <BookOpen strokeWidth={1}/>
            <span>Sách đang thuê</span>
          </Link>
        </li>

        <li className={`${styles.navRow} ${activeTab === 'users' ? styles.active : ''}`} 
            onClick={() => handleTabClick('users')}>
          <Link className={styles.navLink}>
            <Users strokeWidth={1}/>
            <span>Người dùng</span>
          </Link>
        </li>

        <li className={`${styles.navRow} ${activeTab === 'books' ? styles.active : ''}`} 
            onClick={() => handleTabClick('books')}>
          <Link className={styles.navLink}>
            <Library strokeWidth={1}/>
            <span>Quản lý sách</span>
          </Link>
        </li>

        <li className={`${styles.navRow} ${activeTab === 'rentOrders' ? styles.active : ''}`} 
            onClick={() => handleTabClick('rentOrders')}>
          <Link className={styles.navLink}>
            <ShoppingCart strokeWidth={1}/>
            <span>Đơn thuê sách</span>
          </Link>
        </li>

        <li className={`${styles.navRow} ${activeTab === 'returnOrders' ? styles.active : ''}`} 
            onClick={() => handleTabClick('returnOrders')}>
          <Link className={styles.navLink}>
            <RotateCcw strokeWidth={1}/>
            <span>Đơn trả sách</span>
          </Link>
        </li>

        <li className={`${styles.navRow} ${activeTab === 'categories' ? styles.active : ''}`} 
            onClick={() => handleTabClick('categories')}>
          <Link className={styles.navLink}>
            <ChartBarStacked strokeWidth={1}/>
            <span>Danh mục</span>
          </Link>
        </li>

        <li className={`${styles.navRow} ${activeTab === 'authors' ? styles.active : ''}`} 
            onClick={() => handleTabClick('authors')}>
          <Link className={styles.navLink}>
            <BookA strokeWidth={1}/>
            <span>Tác giả</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}