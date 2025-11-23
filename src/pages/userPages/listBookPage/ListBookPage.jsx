import { useEffect, useState, useCallback } from "react"
import { useLocation, useParams } from "react-router-dom"
import axios from "axios"
import { TextSearch } from "lucide-react"

import FilterSection from "../../../components/userComponents/filter/FilterSection"
import GridList from "../../../components/userComponents/gridList/GridList"
import Pagination from "../../../components/userComponents/pagination/Pagination"
import styles from "./ListBookPage.module.css"

const ListBookPage = ({ pageTitle }) => {
  const { id } = useParams()
  const location = useLocation()

  const [page, setPage] = useState(1)
  const [books, setBooks] = useState([])
  const [totalPage, setTotalPage] = useState(0)
  const [loading, setLoading] = useState(false)
  
  const [filterList, setFilterList] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  
  const [dynamicTitle, setDynamicTitle] = useState("")

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const q = queryParams.get("q") || ""
    setSearchQuery(q)
    setPage(1) 
  }, [location.search])

  useEffect(() => {
    setPage(1)
  }, [filterList, pageTitle, id])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [page])

  useEffect(() => {
    const fetchTitleInfo = async () => {
      try {
        if (pageTitle === "category") {
          const res = await axios.get(`http://localhost:8080/api/v1/category/by/${id}`)
          setDynamicTitle(res.data.data.name)
        } else if (pageTitle === "author") {
          const res = await axios.get(`http://localhost:8080/api/v1/author/by/${id}`)
          setDynamicTitle(res.data.data.name)
        }
      } catch (error) {
        console.error("Error fetching info:", error)
      }
    }

    if (pageTitle && id) fetchTitleInfo()
  }, [pageTitle, id])

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      try {
        const params = {
          page: page - 1,
          size: 5,
          ...filterList,
        }

        if (searchQuery) params.keyword = searchQuery
        if (pageTitle === "category") params.categoryId = id
        if (pageTitle === "author") params.authorId = id

        const response = await axios.get(`http://localhost:8080/api/v1/book/all`, { params })
        const dataSource = response.data.data.result || response.data.data
        
        if (dataSource) {
          setBooks(dataSource.content || [])
          setTotalPage(dataSource.totalPages || 0)
        }
      } catch (error) {
        console.error("Error fetching books:", error)
        setBooks([])
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [page, filterList, searchQuery, pageTitle, id])

  const getHeaderTitle = () => {
    if (pageTitle === "category") return <span>Thể loại: {dynamicTitle}</span>
    if (pageTitle === "author") return <span>Tác giả: {dynamicTitle}</span>
    if (searchQuery) {
      return (
        <>
          <TextSearch />
          <span>Kết quả tìm kiếm của "{searchQuery}"</span>
        </>
      )
    }
    return "Tất cả sách"
  }

  return (
    <div className={styles.listBookPage}>
      <div className={styles.header}>
        <h2 className={styles.seartTitle}>{getHeaderTitle()}</h2>
      </div>

      {(!pageTitle || location.pathname === "/search") && (
        <div className={styles.filterSection}>
          <FilterSection setFilterList={setFilterList} />
        </div>
      )}

      {loading ? (
        <div style={{textAlign: "center", padding: "20px"}}>Đang tải sách...</div>
      ) : books.length > 0 ? (
        <div className={styles.bookGrid}>
          <div key={page} className={styles.contentFadeIn}> 
             <GridList data={books} listData={"books"} />
          </div>
        </div>
      ) : (
        <div className={styles.notFoundBook}>Không tìm thấy sách nào</div>
      )}

      {totalPage > 1 && (
        <div className={styles.pagination}>
          <Pagination 
            totalPages={totalPage} 
            currentPage={page}
            setPage={setPage} 
          />
        </div>
      )}
    </div>
  )
}

export default ListBookPage