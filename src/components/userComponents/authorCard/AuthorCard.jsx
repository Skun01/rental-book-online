import styles from "./AuthorCard.module.css";

const AuthorCard = ({ author }) => {
  return (
    <div className = {styles.authorCard}>
      <div className={styles.imageContainer}>
        <img src="/author.jpg" alt="" className={styles.authorImg} />
      </div>
      <div className={styles.authorInfo}>
        <h3 className={styles.authorName}>{author.name}</h3>
      </div>
    </div>
  )
}

export default AuthorCard;