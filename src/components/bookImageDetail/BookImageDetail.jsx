import styles from './BookImageDetail.module.css';
import { useState } from 'react';

const BookImageDetail = ({images}) => {
  const [mainImage, setMainImage] = useState(0);
  const subImage = images.map(image=>image.url)
  function handleChangeMainImage(index) {
    if(index !== mainImage) {
      setMainImage(index);
    }
  }
  return (
    <div className={styles.bookImageSection}>
      <div className={styles.subImageContainer}>
        {subImage.map((item, index)=>{
          return (
            <div key={index} className={`${styles.subImageItem} ${mainImage === index ? styles.active : ''}`}
              onClick={()=>handleChangeMainImage(index)}
            >
              <img src={item} alt="book" className={styles.subImage}/>
            </div>
          )
        })}
      </div>
      <div className={styles.mainImageContainer}>
        <img src={subImage[mainImage]} alt="book" className={styles.mainImage}/>
      </div>
    </div>
  )
}

export default BookImageDetail;