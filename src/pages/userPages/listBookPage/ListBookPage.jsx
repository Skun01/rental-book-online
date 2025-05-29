import { useLocation, useParams } from "react-router-dom"
import {TextSearch} from 'lucide-react'
import FilterSection from "../../../components/userComponents/filter/FilterSection"
import styles from "./ListBookPage.module.css"
import GridList from "../../../components/userComponents/gridList/GridList"
import Pagination from "../../../components/userComponents/pagination/Pagination"
import { useEffect, useState } from "react"
import axios from "axios"

const ListBookPage = ({pageTitle}) => {
  const [books, setBooks] = useState([])
  const [page, setPage] = useState(0)
  const [filterList, setFilterList] = useState(null)
  const [totalPage, setTotalPage] = useState(0)
  const {id} = useParams()
  const [title, setTitle] = useState('')
  const location = useLocation();
  
  // get data from backend
  useEffect(()=>{
    const getBooksData = async () => {
      try {
        const queryParams = new URLSearchParams(location.search)
        const search = queryParams.get("q") || ""
        let api = ""
        if(filterList){
          api = search ? `http://localhost:8080/api/v1/book/search?page=0&size=5&keyword=${search}` :  `http://localhost:8080/api/v1/book/search?page=0&size=5`
          if (filterList.categoryId) api += `&categoryId=${filterList.categoryId}`
          if (filterList.authorId) api += `&authorId=${filterList.authorId}`
          if (filterList.minPrice) api += `&minPrice=${filterList.minPrice}`
          if (filterList.maxPrice) api += `&maxPrice=${filterList.maxPrice}`
          if(filterList.sort) api += `&${filterList.sort}`
        }else if(search){
          api = `http://localhost:8080/api/v1/book/search?page=${page}&size=5&keyword=${search}`
        }else {
          api = `http://localhost:8080/api/v1/book?page=${page}&size=5`
        }
        const response = await axios.get(api);
        if(!filterList && !search){
          setBooks(response.data.data.content)
          setTotalPage(response.data.data.totalPages)
        }else{
          setBooks(response.data.data.result.content)
          setTotalPage(response.data.data.result.totalPages)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    async function getSpecificData(){
      try {
        if(pageTitle === "category") {
          await axios.get(`http://localhost:8080/api/v1/category/${id}`)
            .then(response=>{
              setTitle(response.data.data.name)
            })
          await axios.get(`http://localhost:8080/api/v1/book/search?page=${page}&size=5&categoryId=${id}`)
            .then(response=>{
              setBooks(response.data.data.result.content)
              setTotalPage(response.data.data.result.totalPages)
            })
        } else if(pageTitle === "author") {
          await axios.get(`http://localhost:8080/api/v1/author/${id}`)
            .then(response=>{
              setTitle(response.data.data.name)
            })
          await axios.get(`http://localhost:8080/api/v1/book/search?page=${page}&size=5&authorId=${id}`)
            .then(response=>{
              setBooks(response.data.data.result.content)
              setTotalPage(response.data.data.result.totalPages)
            })
        }
      } catch (error) {
        console.error("Error fetching specific data:", error);
      }
    }

    if(!pageTitle) {
      getBooksData();
    } else {
      getSpecificData()
    }
  }, [page, filterList, location, pageTitle, id]);

  const [searchQuery, setSearchQuery] = useState("");
  useEffect(()=>{
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("q") || "";
    setSearchQuery(search);
  }, [location])

  // scroll lên đầu:
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const getHeaderTitle = () => {
    if (location.pathname === "/books") {
      return "Tất cả sách"
    } else if (location.pathname === "/search") {
      return (
        <>
          <TextSearch />
          <span>Kết quả tìm kiếm của {`"${searchQuery}"`}</span>
        </>
      )
    } else if (pageTitle === "category") {
      return <span>Thể loại: {title}</span>
    } else if (pageTitle === "author") {
      return <span>Các sách của tác giả: {title}</span>
    }
    return (
      <>
        <TextSearch />
        <span>Kết quả tìm kiếm của {`"${searchQuery}"`}</span>
      </>
    )
  }

 return(
  <div className={styles.listBookPage}>
    <div className={styles.header}>
      <h2 className={styles.seartTitle}>
        {getHeaderTitle()}
      </h2>
    </div>

    {/* filter */}
    {(!pageTitle || location.pathname === "/search") && (
      <div className={styles.filterSection}>
        <FilterSection setFilterList={setFilterList}/>
      </div>)}

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
      <Pagination totalPages={totalPage} initialPage={page + 1} setPage={setPage}/> 
    </div>
  </div>
 )
}

export default ListBookPage;