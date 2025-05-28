import styles from "./BookDetailsPage.module.css";
import BookImageDetail from "../../../components/bookImageDetail/BookImageDetail";
import { useState,useRef, useEffect } from "react";
import NavBarTab from "../../../components/userComponents/bookDetailTabs/NavBarTab";
import {useCart} from '../../../contexts/CartContext'
import { useParams } from "react-router-dom";
import axios from "axios";
const BookDetailsPage = () => {
  const [rentNumber, setRentNumber] = useState(1);
  const [rentDate, setRentDate] = useState(7);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [otherDate, setOtherDate] = useState(-1);
  const inputOtherDate = useRef(null);
  const [totalDepositPrice, setTotalDepositPrice] = useState(0);
  const [totalRentalPrice, setTotalRentalPrice] = useState(0)
  const {id} = useParams()
  const [book, setBook] = useState(null)
  const {addToCart} = useCart()
  useEffect(()=>{
    async function getBookById(){
      await axios.get(`http://localhost:8080/api/v1/book/${id}`)
        .then(response=>{
          setBook(response.data.data)
        })
    }
    getBookById()
  }, [])
  useEffect(()=>{
    if(book){
      setTotalRentalPrice(book['depositPrice']*rentDate*rentNumber)
      setTotalDepositPrice(book.rentalPrice*rentNumber)
    }
  }, [book, rentDate, rentNumber])

  // handle click choose rent date
  function handleClickRentDate(date){
    if(rentDate !== date) setRentDate(date);
    if(showCustomDate && date === 7 || date === 14 || date === 30 || date === otherDate) setShowCustomDate(false);
  }

  function handleClickRentOtherDate(){
    setShowCustomDate(!showCustomDate);
  }

  // ham xu ly ngay thang
  function addDays(days) {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today.toLocaleDateString('vi-VN');
  }

  // xu ly lay ngay khi chon ngay khac
  function handleGetOtherDay(){
    const selectedDateMs = Date.parse(inputOtherDate.current.value); 

    if(!selectedDateMs){
      alert('vui lòng chọn số ngày');
      return;
    }
    const todayMs = Date.parse(new Date().toISOString().slice(0, 10));
    const diffDays = Math.round((selectedDateMs - todayMs) / (1000 * 60 * 60 * 24));
    if(diffDays < 7){
      alert('Bạn phải thuê ít nhất 7 ngày!');
      setRentDate(7);
      return;
    }
    setRentDate(diffDays);
    setOtherDate(diffDays);
    setShowCustomDate(!showCustomDate);
  }

  // handle click them vao gio hang
  function handleAddToCart(){
    addToCart(book, rentDate, rentNumber)
    // clearCart()
  }

  return (
    <div className={styles.bookDetailPage}>

      <div className={styles.bookDetailHeader}>
        {/* book images */}
        <div className={styles.bookImageDetailContainer}>
          <BookImageDetail images = {book && book.imageList ? book.imageList : []} />
        </div>
        {/* book details */}
        <div className={styles.bookInforSection}>
          <div className={styles.bookName}>{book && book.name ? book.name : 'Đang cập nhật'}</div>

          {/* thong tin chi tiet sach */}
          <div className={styles.detailContainer}>
            <div className={styles.bookInforCol}>
              <div className={styles.inforRow}>
                <span className={styles.inforTitle}>Tác giả: </span> {book && book.author ? book.author.name : 'Đang cập nhật'}
              </div>
              <div className={styles.inforRow}>
                <span className={styles.inforTitle}>Nhà xuất bản: </span>{book && book.publisher ? book.publisher : 'Đang cập nhật'}
              </div>
              <div className={styles.inforRow}>
                <span className={styles.inforTitle}>Số trang: </span>{book && book.pages ? book.pages : 'Đang cập nhật'}
              </div>
            </div>
            <div className={styles.bookInforCol}>
              <div className={styles.inforRow}>
                <span className={styles.inforTitle}>Thể loại: </span>{book && book.category.name ? book.category.name : 'Đang cập nhật'}
              </div>
              <div className={styles.inforRow}>
                <span className={styles.inforTitle}>Ngôn ngữ: </span>{book && book.language ? book.language : 'Đang cập nhật'}
              </div>
              <div className={styles.inforRow}>
                <span className={styles.inforTitle}>Ngày phát hành: </span>{book && book.publish_date ? book.publish_date : 'Đang cập nhật'}
              </div>
            </div>
          </div>
          {/* cac lua chon thue va thong tin thue */}
          <div className={styles.bookStock}>
            <span className={styles.inforTitle}>Số lượng sách còn: </span>
            <span className={styles.stockText}>{book && book.stock ? book.stock : 0} Quyển</span>
          </div>
          <div className={styles.bookPrice}>
            <span className={styles.inforTitle}>Tiền đặt cọc sách: </span>
            <span className={styles.priceText}>{ (book && book.rentalPrice? book.rentalPrice : 0).toLocaleString('vi-VI')}đ/quyển</span>
          </div>

          <div className={styles.bookPrice}>
            <span className={styles.inforTitle}>Giá cho thuê: </span>
            <span className={styles.priceText}>{ (book && book.depositPrice ? book.depositPrice : 0).toLocaleString('vi-VI')}đ/Ngày</span>
          </div>
          {/* lua chuon ngay thue, so luong thue */}
          <div className={styles.rentOption}>
              <div className={styles.rentNumber}>
                <p className={styles.rentOptionTitle}>Số lượng thuê</p>
                <div className={styles.rentNumberInput}>
                  <button className={styles.rentNumberBtn}
                    onClick={()=>{if(rentNumber > 1) setRentNumber(rentNumber - 1)}}
                  >
                    -
                  </button>
                  <span className={styles.rentNumber}>{rentNumber}</span>
                  <button className={styles.rentNumberBtn}
                    onClick={()=>{if(rentNumber < 10) setRentNumber(rentNumber + 1)}}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className={styles.rentDate}>
                <div className={styles.rentOptionTitle}>Số ngày thuê</div>
                <div className={styles.rentDateList}>
                  <div className={`${styles.rentDateOption} ${rentDate === 7? styles.active : ''}`}
                    onClick = {()=>handleClickRentDate(7)}>
                    7 ngày
                  </div>
                  <div className={`${styles.rentDateOption} ${rentDate === 14? styles.active : ''}`}
                    onClick = {()=>handleClickRentDate(14)}>
                    14 ngày
                  </div>
                  <div className={`${styles.rentDateOption} ${rentDate === 30? styles.active : ''}`}
                    onClick = {()=>handleClickRentDate(30)}>
                    30 ngày
                  </div>

                  {otherDate == -1 ? '' : (
                    <div className={`${styles.rentDateOption} ${rentDate === otherDate? styles.active : ''}`}
                      onClick = {()=>handleClickRentDate(30)}>
                      {otherDate} ngày
                    </div>
                  )}

                  <div className={`${styles.rentDateOption}`}
                    onClick={handleClickRentOtherDate}>
                    khác
                  </div>
                  {/* Container chọn ngày tùy chỉnh - mặc định ẩn */}
                  <div className={`${styles.customDateContainer} ${showCustomDate ? '' : styles.hidden}`}>
                      <label className={styles.customDateLabel}>Chọn ngày trả</label>
                      <div className={styles.customDatePicker}>
                        <input
                          type="date"
                          className={styles.customDateInput}
                          placeholder="Chọn ngày trả"
                          ref={inputOtherDate}
                          min={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split("T")[0]}
                        />
                      </div>
                      <button className={styles.customDateConfirm}
                        onClick={handleGetOtherDay}>Xác nhận</button>
                    </div>
        
                </div>
              </div>
            </div>
            <div className={styles.rentDateResult}>Ngày trả sách dự kiến: {addDays(rentDate)}</div>
        
            {/* Phần tổng giá và nút hành động */}
            <div className={styles.rentAction}>
              <div className={styles.totalPrice}>
                Tổng tiền đặt cọc:
                <span className={styles.totalPriceText}>{totalDepositPrice.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className={styles.totalPrice}>
                Tổng tiền thuê sách:
                <span className={styles.totalPriceText}>{totalRentalPrice.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className={styles.actionBtn}>
                <button className={styles.addCartBtn}
                  onClick={handleAddToCart}>
                  Thêm vào giỏ hàng
                </button>
                <button className={styles.rentButton}>
                  Thuê ngay
                </button>
              </div>
            </div>
        </div>
      </div>
      <div className={styles.navBarTabContainer}>
        <NavBarTab book={book}/>            
      </div>
    
    </div>
  )
}



export default BookDetailsPage;