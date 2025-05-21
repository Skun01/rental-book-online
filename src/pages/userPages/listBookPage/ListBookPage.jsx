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
  const [books, setBooks] = useState([])
  const [page, setPage] = useState(0)
  const [filterList, setFilterList] = useState(null)
  // get data from backend
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams(location.search)
        const search = queryParams.get("q") || ""
        let api = ""
        if(filterList){
          api = `http://localhost:8080/api/v1/user/search?page=0&size=3&sortDir=asc`
          if (filterList.categoryId) api += `&categoryId=${filterList.categoryId}`
          if (filterList.authorId) api += `&authorId=${filterList.authorId}`
          if (filterList.minPrice) api += `&minPrice=${filterList.minPrice}`
          if (filterList.maxPrice) api += `&maxPrice=${filterList.maxPrice}`
        }else if(search){
          api = `http://localhost:8080/api/v1/user/search?page=${page}&size=3&sortDir=asc&keyword=${search}`
        }else {
          api = `http://localhost:8080/api/v1/book?page=${page}&size=3`
        }
        const response = await axios.get(api);
        console.log(api, response)
        console.log(!filterList && !search ? response.data.data.content : response.data.data.result.content);
        setBooks(!filterList && !search ? response.data.data.content : response.data.data.result.content);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [page, filterList]);
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
      <FilterSection setFilterList={setFilterList}/>
    </div>

    {/* list books */}
    {books.length !== 0 ? (
      <div className={styles.bookGrid}>
        <GridList data={books} listData = {"books"}/>
      </div>
    ) : (
      <div className={styles.notFoundBook}>
        Không tìm thấy sách nào
      </div>
    )}
    

    {/* phân trang */}
    <div className={styles.pagination}>
      <Pagination totalPages={10} initialPage={page + 1} setPage={setPage}/> 
    </div>
  </div>
 )
}

export default ListBookPage;