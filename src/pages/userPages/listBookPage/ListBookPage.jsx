// import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {TextSearch} from 'lucide-react'
import FilterSection from "../../../components/userComponents/filter/FilterSection"
import styles from "./ListBookPage.module.css"
import GridList from "../../../components/userComponents/gridList/GridList"
import Pagination from "../../../components/userComponents/pagination/Pagination"
import {mockBooks} from "../../../mockData";
import { useEffect, useState } from "react"
const ListBookPage = () => {
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
      <GridList data={mockBooks} listData = {"books"}/>
    </div>

    {/* phân trang */}
    <div className={styles.pagination}>
      <Pagination totalPages={10} initialPage={1}/> 
    </div>
  </div>
 )
}

export default ListBookPage;