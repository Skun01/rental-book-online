import styles from "./ListPage.module.css";
import GridList from "../../../components/userComponents/gridList/GridList";
import Pagination from "../../../components/userComponents/pagination/Pagination";
import {mockAuthors} from "../../../mockData";
import {mockCategories} from "../../../mockData";
import CategoryCard from "../../../components/userComponents/categoryCard/CategoryCard";
const ListPage = ({pageData}) => {
  
  window.scrollTo({ top: 0, behavior: "smooth" }) // hoặc "auto"
  if(pageData === "authors"){
    return (
      <div className={styles.listPage}>
        <h1> Các tác giả</h1>

        {/* list cac tac gia */}
        <div className={styles.list}>
          <GridList data={mockAuthors} listData={"authors"}/>
        </div>

        {/* chuyen sang cac trang */}
        <div className={styles.pagination}>
          <Pagination
            totalPage={10}
            currentPage={1}
          />
        </div>
      </div>
    );
  }else if(pageData === "categories"){
    return (
      <div className={styles.listPage}>
        <h1> Các thể loại</h1>

        {/* list cac category */}
        <div className={styles.list}>
          <GridList data={mockCategories} listData={"categories"}/>
        </div>

        {/* chuyen sang cac trang */}
        <div className={styles.pagination}>
          <Pagination
            totalPage={10}
            currentPage={1}
          />
        </div>
      </div>
    );
  }
  
}

export default ListPage;