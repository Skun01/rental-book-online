// import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {TextSearch} from 'lucide-react'
import FilterSection from "../../../components/userComponents/filter/FilterSection"
import styles from "./ListBookPage.module.css"
import GridList from "../../../components/userComponents/gridList/GridList"
import Pagination from "../../../components/userComponents/pagination/Pagination"
import { useEffect, useState } from "react"
import axios from "axios"
const ListBookPage = () => {
  const [books, setBooks] = useState([]);
  
  // get data from backend
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/book?page=0&size=12");
        setBooks(response.data.data.content);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(()=>{
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("q") || "";
    setSearchQuery(search);
  }, [location])
 return(
  <div className={styles.listBookPage}>
    <div className={styles.header}>
      <h2 className={styles.seartTitle}>
        {location.pathname === "/books" ? "Tất cả sách" : (<><TextSearch /> <span>Kết quả tìm kiếm của {`"${searchQuery}"`}</span></>)}
      </h2>
    </div>

    {/* filter */}
    <div className={styles.filterSection}>
      <FilterSection/>
    </div>

    {/* list books */}
    <div className={styles.bookGrid}>
      <GridList data={books} listData = {"books"}/>
    </div>

    {/* phân trang */}
    <div className={styles.pagination}>
      <Pagination totalPages={10} initialPage={1}/> 
    </div>
  </div>
 )
}

export default ListBookPage;