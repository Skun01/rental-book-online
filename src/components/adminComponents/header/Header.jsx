import styles from './Header.module.css'
import {ChevronDown, LogOut} from 'lucide-react'
import { useState, useEffect } from 'react'
import {useAuth} from '../../../contexts/AuthContext'
export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState({})
  const {currentUser, logout} = useAuth()
  useEffect(()=>{
    if(currentUser) setUser(currentUser)
  }, [])
  return (
    <div className={styles.header}>
      <div className={styles.headerTitle}>Admin thuê sách</div>
      <div className={styles.headerUser}>
        <div className={styles.adminAvatar}>
          <img src="/author.jpg" alt="admin avatar" />
        </div>
        <div className={styles.adminName} onClick={() => setIsOpen(!isOpen)}>
          <span>{user.name || 'Hoài Nam'}</span>
          <ChevronDown size={16} />
        </div>

        {/* open menu when click */}
        {isOpen && (
          <div className={styles.userMenu}>
            <div className={styles.rowInfor}>
              <div className={styles.name}>{user.name || 'Hoài Nam'}</div>
              <div className={styles.role}>Admin</div>
            </div>
            <div className={styles.rowFunc} onClick={()=>logout()}>
              <LogOut size={20}/>
              <span>Sign Out</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}