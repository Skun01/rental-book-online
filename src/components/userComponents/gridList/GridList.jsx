import styles from "./GridList.module.css";
import BookCard from '../bookCard/BookCard';
import AuthorCard from '../authorCard/AuthorCard';
import CategoryCard from '../categoryCard/CategoryCard';
import {Link} from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
const GridList = ({data, listData}) => {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
      if (listData === "categories") {
        const fetchData = async () => {
        await axios.get("http://localhost:8080/api/v1/category?page=0&size=10")
          .then(response => {
            setCategories(response.data.data.content);
          })
          .catch(error => {
            console.error("Error fetching data:", error);
          });
        }
        fetchData();
      }
    }, []);
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
        {categories.map((category, index) => (
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