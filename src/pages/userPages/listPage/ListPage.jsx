import { useState, useEffect } from "react"
import axios from "axios"
import styles from "./ListPage.module.css"
import GridList from "../../../components/userComponents/gridList/GridList"
import Pagination from "../../../components/userComponents/pagination/Pagination"

const ListPage = ({ pageData }) => {
  const [dataList, setDataList] = useState([])
  const [totalPage, setTotalPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        let response
        if (pageData === "authors") {
          response = await axios.get(`http://localhost:8080/api/v1/author?page=${currentPage - 1}&size=10&sortDir=asc`)
        } else if (pageData === "categories") {
          response = await axios.get(
            `http://localhost:8080/api/v1/category?page=${currentPage - 1}&size=10&sortDir=asc`,
          )
        }

        if (response) {
          setDataList(response.data.data.content)
          setTotalPage(response.data.data.totalPages)
          console.log(response.data)
        }
      } catch (error) {
        console.error(`Error fetching ${pageData}:`, error)
      } finally {
        setLoading(false)
      }
    }

    if (pageData === "authors" || pageData === "categories") {
      fetchData()
    }
  }, [currentPage, pageData])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  if (pageData === "authors") {
    return (
      <div className={styles.listPage}>
        <h1>Các tác giả</h1>

        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <div className={styles.list}>
            <GridList data={dataList} listData={"authors"} />
          </div>
        )}

        <div className={styles.pagination}>
          <Pagination totalPages={totalPage} initialPage={currentPage} setPage={handlePageChange} />
        </div>
      </div>
    )
  } else if (pageData === "categories") {
    return (
      <div className={styles.listPage}>
        <h1>Các thể loại</h1>

        {loading ? (
          <div>Đang tải...</div>
        ) : (
          <div className={styles.list}>
            <GridList data={dataList} listData={"categories"} />
          </div>
        )}

        <div className={styles.pagination}>
          <Pagination totalPages={totalPage} initialPage={currentPage} setPage={handlePageChange} />
        </div>
      </div>
    )
  }

  return null
}

export default ListPage
