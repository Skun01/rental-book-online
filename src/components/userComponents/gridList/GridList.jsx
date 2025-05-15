import styles from "./GridList.module.css";
import BookCard from '../bookCard/BookCard';
import AuthorCard from '../authorCard/AuthorCard';
import CategoryCard from '../categoryCard/CategoryCard';
import {Link} from 'react-router-dom';

const GridList = ({data, listData}) => {
  if(listData === "books") {
    return(
      <div className={styles.gridList}>
        {data.map((book) => (
          <div key={book.id} className={styles.bookCardContainer}>
            <BookCard book={book} smaller = {true} />
          </div>
        ))}
      </div>
    )
  }else if(listData === "authors"){
    return(
      <div className={styles.gridList}>
        {data.map((author) => (
          <div key={author.id} className={styles.authorCardContainer}>
            <Link to ={`/author/${author.id}`} className={styles.authorCardLink}>
              <AuthorCard author={author} />
            </Link>
          </div>
        ))}
      </div>
    )
  }else if(listData === "categories"){
    return(
      <div className={styles.gridList}>
        {data.map((category, index) => (
          <div key={category.id} className={styles.categoryCardContainer}>
            <Link to ={`/category/${category.id}`} className={styles.categoryCardLink}>
              <CategoryCard categoryName = {category.name} categoryOrder={index} />
            </Link>
          </div>
        ))}
      </div>
    )
  }
};

export default GridList;