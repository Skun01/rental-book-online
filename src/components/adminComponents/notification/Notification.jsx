import styles from './Notification.module.css'
export default Notification = ({type, content, handleConfirm, handleCancel})=>{
    return (
        <div className={styles.notificationContainer}>
            <div className={styles.notification}>
                <div className={styles.header}>
                    <div className={styles.title}>Thông báo</div>
                    <div className={styles.content}>{content}</div>
                </div>
                <div className={styles.btnSection}>
                    <button className={`${styles.Btn} ${styles.confirmBtn}`}
                     onClick={handleConfirm}>Có</button>
                    <button className={`${styles.Btn} ${styles.cancelBtn}`}
                     onClick={handleCancel}>Không</button>
                </div>
            </div>
        </div>
    )
}