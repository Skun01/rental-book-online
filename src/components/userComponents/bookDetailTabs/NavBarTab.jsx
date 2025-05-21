import GridList from '../gridList/GridList'
import styles from './NavBarTab.module.css';
import { useEffect, useState } from 'react';
import {Star, ThumbsUp, ThumbsDown, Reply, ChevronUp} from 'lucide-react'
import axios from 'axios';
const NavBarTab = ({book, navList = ['Mô tả sản phẩm', 'Bình luận (10)', 'Sản phẩm liên quan']}) => {
  const [tabNumber, setTabNumber] = useState(0);
  function handleTabClick(index){
    if(tabNumber !== index) setTabNumber(index);
  }
  return (
    <div className={styles.navBarContainer}>
      <nav className={styles.navBar}>
        {navList.map((navName, index)=>{
          return (<div className={`${styles.navItem} ${tabNumber === index ? styles.active : ''}`} key={index}
            onClick={()=>handleTabClick(index)}>
                  {navName}
                </div>)
        })}
      </nav>
      <hr className={styles.horizonLine}/>

      {/* tab display */}
      {tabNumber ==  0 ? <BookDescription bookDescript={book && book.description}/> :
        tabNumber == 1 ? <BookReviewInput/> : <BookRelatedList categoryId={book && book.category.id}/>}
    </div>
  );
};

//tab lien quan
const BookRelatedList = ({categoryId})=>{
  const [books, setBooks] = useState([])
  useEffect(()=>{
    async function getBookRelatedList(){
      await axios.get(`http://localhost:8080/api/v1/book/search?page=0&size=100&categoryId=${categoryId}`)
        .then(response=>{
          setBooks(response.data.data.result.content)
          console.log(response)
        })
    }
    getBookRelatedList()
  }, []) 
  return (
    <div className={styles.relatedListBook}>
      <GridList data={books} listData={'books'}/>
    </div>
  )
}


// tab mo ta book
const BookDescription = ({bookDescript})=>{
  return (
    <div className={styles.bookDescription}>
      {bookDescript ? bookDescript : 'Đang cập nhật'}
    </div>
  )
}

// BookReviewInput
const BookReviewInput = () => {
  const [rating, setRating] = useState(0);
  const user = {
    name: 'truongg',
    avatar: '/author.jpg'
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };
  return (
    <div className={styles.commentContainer}>
      <div className={styles.userInfo}>
        <img 
          src={user.avatar} 
          alt={`${user.name}'s avatar`} 
          className={styles.avatar}
        />
        <div className={styles.nameContainer}>
          <span className={styles.commentText}>Đánh giá sách với tên</span>
          <span className={styles.username}>{user.name}</span>
        </div>
      </div>

      <div className={styles.ratingContainer}>
        <span className={styles.ratingText}>Đánh giá của bạn:</span>
        <div className={styles.starRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`${styles.star} ${star <= rating ? styles.starActive : ''}`}
              onClick={() => handleRatingChange(star)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      <div className={styles.inputBox}>
        <InputReviewBox rating={rating} setRating={setRating}/>
      </div>
      <div className={styles.commentsSection}>
        <BookReviewCard/>
      </div>
    </div>
  );
};

const InputReviewBox = ({haveRating = false, rating, setRating})=>{
  const [comment, setComment] = useState('');
  const maxLength = 1000;

  // xu ly thay doi comment
  const handleCommentChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setComment(value);
    }
  };

  
  const handleSubmit = () => {
    if (comment.trim()) {
      console.log('Review submitted:', { comment, rating });
      setComment('');
      if(haveRating) setRating(0);
    }
  };
  return(
    <div className={styles.inputContainer}>
        <textarea
          className={styles.commentInput}
          placeholder="Viết bình luận.."
          value={comment}
          onChange={handleCommentChange}
          rows={3}
        />
        <div className={styles.commentFooter}>
          <div className={styles.actionContainer}>
            <span className={styles.charCount}>
              {comment.length} / {maxLength}
            </span>
            <button 
              className={styles.sendButton} 
              onClick={handleSubmit}
              disabled={!comment.trim() ||(haveRating && rating === 0)}
            >
              Gửi
              <span className={styles.sendIcon}>➤</span>
            </button>
          </div>
        </div>
      </div>
  )
}

// book review card

const BookReviewCard = ({rated = true, replyComment = true})=>{
  const [viewReply, setViewReply] = useState(false);
  const [like, setLike] = useState({state: false, number: 0});
  const [dislike, setDislike] = useState({state: false, number: 0});
  const [showReplyBox, setShowReplyBox] = useState(false);
  const user = {
    name: 'truongg',
    avatar: '/author.jpg'
  };
  // xu ly click view reply
  function handleClickViewReply(){
    setViewReply(!viewReply);
  }

  // xu ly click dislike va like va reply
  function handleLikeClick(){
    const newLike = {
      state: !like.state,
      number: !like.state ? like.number + 1 : like.number <= 0 ? 0 : like.number - 1
    }
    setLike(newLike)
    if(!like.state){
      setDislike({
        ...dislike, 
        state: false,
        number: dislike.number <= 0 ? 0 : dislike.number - 1
      })
    }
  }

  function handleDislikeClick(){
    const newDislike = {
      state: !dislike.state,
      number: !dislike.state ? dislike.number + 1 : dislike.number <= 0 ? 0 : dislike.number - 1
    }
    setDislike(newDislike);
    if(!dislike.state){
      setLike({
        ...like, 
        state: false,
        number: like.number <= 0 ? 0 : like.number - 1
      })
    }
  }

  function handleReplyClick(){
    setShowReplyBox(!showReplyBox);
  }
  return(
    <div className={styles.bookReviewCard}>

      {/* basic user infor */}
      <div className={styles.userInfo}>
        <img 
          src={user.avatar} 
          alt={`${user.name}'s avatar`} 
          className={styles.avatar}
        />
        <div className={styles.userCommentHeader}>
          <div className={styles.userCommentInfor}>

            {rated && (
              <div className={styles.rated}>
                4.5 <Star className={styles.ratedIcon}/>
              </div>
            )}
            
            <span className={styles.username}>{user.name}</span>
            <span className={styles.commentTime}>1 giờ trước</span>
          </div>
          <div className={styles.userCommentText}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tenetur ipsum minus accusantium ratione optio qui beatae doloribus deleniti, eaque reprehenderit, aliquam quas est omnis veritatis placeat dignissimos officiis quibusdam quam?
          </div>

          {/* action */}
          <div className={styles.actionList}>

            {/* like action */}
            <div className={styles.commentAction}>
              <div className={`${styles.actionIcon} ${like.state ? styles.likeActive : ''}`}
                onClick={handleLikeClick}>
                <ThumbsUp size={18}/>
              </div>
              {like.number !== 0 &&(
                <span className={styles.actionText}>{like.number}</span>
              )}
            </div>

            {/* dislike action */}
            <div className={styles.commentAction}>
              <div className={`${styles.actionIcon} ${dislike.state ? styles.dislikeActive : ''}`}
                onClick={handleDislikeClick}>
                <ThumbsDown size={18}/>
              </div>
              {dislike.number !== 0 &&(
                <span className={styles.actionText}>{dislike.number}</span>
              )}
            </div>

            {/* reply */}
            <div className={`${styles.commentAction} ${styles.reply} ${showReplyBox ? styles.replyActive : ''}`}
              onClick={handleReplyClick}>
              <div className={styles.actionIcon}>
                <Reply size={18}/>
              </div>
              <span className={styles.actionText}>Trả lời</span>
            </div>

          </div>
          {/* input replybox */}
          {showReplyBox && (
            <div className={styles.replyBox}>
              <InputReviewBox/>
            </div>
          )}


          {replyComment &&(
            <div className={styles.viewReply}>
              <div className={`${styles.viewReplyIcon } ${viewReply ? styles.replyActive : ""}`}>
                <ChevronUp size={14}/>
              </div>
              <span className={styles.replyText} onClick={handleClickViewReply}>
                Xem bình luận
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavBarTab;