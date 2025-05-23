import styles from './SideBar.module.css'
import { Link } from 'react-router-dom'
import { LayoutGrid, BookOpen, Users, Library, ShoppingCart, 
  RotateCcw, ChartBarStacked, Book, BookA, ChevronUp} from 'lucide-react'
import { useState } from 'react'

export default function SideBar(){
  const [activeTab, setActiveTab] = useState('home') 
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false)
  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }
  return (
    <div className={styles.sidebar}>
      <ul className={styles.tabList}>
        <li className={`${styles.navRow} ${activeTab === 'home' ? styles.active : ''}`} 
            onClick={() => handleTabClick('home')}>
          <Link className={styles.navLink} to="/admin">
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

        {/* have sub menu */}
        <li>
          <div onClick={()=>setIsSubMenuOpen(!isSubMenuOpen)}
            className={`${styles.navRow} ${styles.navLink} ${isSubMenuOpen ? styles.active : ''}`}>
            <Library strokeWidth={1}/>
            <span>Quản lý sách</span>
            <ChevronUp className={`${styles.chevronUp} ${isSubMenuOpen ? styles.chevronDown : ''}`}/>
          </div>
          {isSubMenuOpen && (
            <ul className={styles.subMenuContainer}>
              <li className={`${styles.subRow} ${activeTab === 'books' ? styles.subActive : ''}`} 
                  onClick={() => handleTabClick('books')}>
                <Link className={styles.navLink} to="/admin/books-manage">
                  <Book strokeWidth={1}/>
                  <span>Sách</span>
                </Link>
              </li>
              <li className={`${styles.subRow} ${activeTab === 'categories' ? styles.subActive : ''}`} 
                onClick={() => handleTabClick('categories')}>
              <Link className={styles.navLink}>
                <ChartBarStacked strokeWidth={1}/>
                <span>Danh mục</span>
              </Link>
              </li>
              <li className={`${styles.subRow} ${activeTab === 'authors' ? styles.subActive : ''}`} 
                  onClick={() => handleTabClick('authors')}>
                <Link className={styles.navLink}>
                  <BookA strokeWidth={1}/>
                  <span>Tác giả</span>
                </Link>
              </li>
            </ul>
          )}
          
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

        
      </ul>
    </div>
  )
}