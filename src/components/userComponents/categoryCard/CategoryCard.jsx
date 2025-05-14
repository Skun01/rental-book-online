import styles from "./CategoryCard.module.css";
import {ChevronsRight} from "lucide-react";
const CategoryCard = ({ categoryName, categoryOrder }) => {
  const categoryColors = ["#3E60DF", "#C83BDF", "#2BA788", "#9489E8", "#B68CF4", "#3CB3A2", "#C08C72", "#49C34B", "#B43835", "#D94F8B", "#F89BC4", "#BE4F8A"];
  return(
    <div className={styles.categoryCard} style={{ backgroundColor: categoryColors[categoryOrder % categoryColors.length] }}>
      <p className={styles.categoryName}>{categoryName}</p>
      <div className={styles.descText}>
        <span>Xem toàn bộ</span>
        <ChevronsRight />
      </div>
    </div>
  )
}

export default CategoryCard;