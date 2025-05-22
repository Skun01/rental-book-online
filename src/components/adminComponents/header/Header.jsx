import styles from './Header.module.css'
import {ChevronDown, LogOut} from 'lucide-react'
import { useState } from 'react'
export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>Admin thuê sách</div>
      <div className={styles.headerUser}>
        <div className={styles.adminAvatar}>
          <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="admin avatar" />
        </div>
        <div className={styles.adminName} onClick={() => setIsOpen(!isOpen)}>
          <span>Thái Văn Trường</span>
          <ChevronDown size={16} />
        </div>

        {/* open menu when click */}
        {isOpen && (
          <div className={styles.userMenu}>
            <div className={styles.rowInfor}>
              <div className={styles.name}>Thái Văn Trường</div>
              <div className={styles.role}>Admin</div>
            </div>

            <div className={styles.rowFunc}>
              <LogOut size={20}/>
              <span>Sign Out</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}