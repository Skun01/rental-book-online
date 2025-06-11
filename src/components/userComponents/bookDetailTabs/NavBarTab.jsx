import GridList from '../gridList/GridList'
import styles from './NavBarTab.module.css';
import { useEffect, useState } from 'react';
import {Star, Reply, ChevronUp, Trash2} from 'lucide-react'
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

const NavBarTab = ({book, navList = ['Mô tả sản phẩm', 'Bình luận', 'Sản phẩm liên quan']}) => {
  const [tabNumber, setTabNumber] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  
  function handleTabClick(index){
    if(tabNumber !== index) setTabNumber(index);
  }

  const updatedNavList = navList.map((item, index) => {
    if (index === 1) {
      return `Bình luận${reviewCount === 0 ? '' : ` (${reviewCount})`}`;
    }
    return item;
  });

  return (
    <div className={styles.navBarContainer}>
      <nav className={styles.navBar}>
        {updatedNavList.map((navName, index)=>{
          return (<div className={`${styles.navItem} ${tabNumber === index ? styles.active : ''}`} key={index}
            onClick={()=>handleTabClick(index)}>
                  {navName}
                </div>)
        })}
      </nav>
      <hr className={styles.horizonLine}/>

      {/* tab display */}
      {tabNumber ==  0 ? <BookDescription bookDescript={book && book.description}/> :
        tabNumber == 1 ? <BookReviewInput book={book} setReviewCount={setReviewCount}/> : 
        <BookRelatedList categoryId={book && book.category.id}/>}
    </div>
  );
};

//tab lien quan
const BookRelatedList = ({categoryId})=>{
  const [books, setBooks] = useState([])
  useEffect(()=>{
    async function getBookRelatedList(){
      try{
        await axios.get(`http://localhost:8080/api/v1/book/all?page=0&size=100&categoryId=${categoryId}`)
        .then(response=>{
          setBooks(response.data.data.result.content)
        })
      }catch(err){
        console.error(`can't get related book: `, err)
      }
      
    }
    if(categoryId) {
      getBookRelatedList()
    }
  }, [categoryId]) 
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
const BookReviewInput = ({book, setReviewCount}) => {
  const [rating, setRating] = useState(0);
  const [allReviews, setAllReviews] = useState([]);
  const [parentReviews, setParentReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const {currentUser} = useAuth()
  const [user] = useState({
    id: currentUser.id,
    name: currentUser.name,
    avatar: currentUser.avatar || '/author.jpg'
  });

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const organizeReviews = (reviews) => {
    const parentReviews = reviews.filter(review => review.parentId === null);
    const childReviews = reviews.filter(review => review.parentId !== null);
    
    const reviewsWithReplies = parentReviews.map(parent => {
      const replies = childReviews.filter(child => child.parentId === parent.id);
      return {
        ...parent,
        replies: replies
      };
    });
    
    return reviewsWithReplies;
  };

  const fetchReviews = async () => {
    if (!book?.id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/review/by/book/${book.id}?page=0&size=100`);
      if (response.data.code === 200) {
        const reviews = response.data.data.content;
        setAllReviews(reviews);
        
        // Organize reviews
        const organized = organizeReviews(reviews);
        setParentReviews(organized);
        
        // Set total count (only parent reviews for the counter)
        const parentCount = reviews.filter(review => review.parentId === null).length;
        setReviewCount(parentCount);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [book?.id]);

  const handleReviewSubmitted = () => {
    fetchReviews(); // Refresh reviews after submission
    setRating(0); // Reset rating
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
        <InputReviewBox 
          rating={rating} 
          setRating={setRating}
          haveRating={true}
          bookId={book?.id}
          userId={user.id}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>
      
      <div className={styles.commentsSection}>
        {loading ? (
          <div style={{color: '#fff', textAlign: 'center'}}>Đang tải bình luận...</div>
        ) : (
          parentReviews.map((review) => (
            <BookReviewCard 
              key={review.id} 
              review={review}
              currentUserId={user.id}
              onReviewDeleted={fetchReviews}
              onReplySubmitted={fetchReviews}
            />
          ))
        )}
      </div>
    </div>
  );
};

const InputReviewBox = ({haveRating = false, rating, setRating, bookId, userId, parentId = null, onReviewSubmitted})=>{
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const maxLength = 1000;

  const handleCommentChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setComment(value);
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim() || (haveRating && rating === 0)) return;

    setSubmitting(true);
    try {
      const reviewData = {
        comment: comment.trim(),
        bookId: bookId,
        userId: userId,
        ...(haveRating && { rate: rating }),
        ...(parentId && { parentId: parentId })
      };

      const response = await axios.post('http://localhost:8080/api/v1/review/create', reviewData);
      
      if (response.data.code === 200) {
        console.log('Review submitted successfully');
        setComment('');
        if (haveRating) setRating(0);
        if (onReviewSubmitted) onReviewSubmitted();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
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
          disabled={submitting}
        />
        <div className={styles.commentFooter}>
          <div className={styles.actionContainer}>
            <span className={styles.charCount}>
              {comment.length} / {maxLength}
            </span>
            <button 
              className={styles.sendButton} 
              onClick={handleSubmit}
              disabled={!comment.trim() || (haveRating && rating === 0) || submitting}
            >
              {submitting ? 'Đang gửi...' : 'Gửi'}
              <span className={styles.sendIcon}>➤</span>
            </button>
          </div>
        </div>
      </div>
  )
}

// book review card
const BookReviewCard = ({review, currentUserId, onReviewDeleted, onReplySubmitted})=>{
  const [viewReplies, setViewReplies] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);

  // Delete review
  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
    
    try {
      await axios.delete(`http://localhost:8080/api/v1/review/delete/${review.id}`);
      if (onReviewDeleted) onReviewDeleted();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Có lỗi xảy ra khi xóa đánh giá.');
    }
  };

  const handleViewReplies = () => {
    setViewReplies(!viewReplies);
  };

  const handleReplyClick = () => {
    setShowReplyBox(!showReplyBox);
  };

  const handleReplySubmitted = () => {
    setShowReplyBox(false);
    if (onReplySubmitted) onReplySubmitted();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Vừa xong';
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return(
    <div className={styles.bookReviewCard}>
      <div className={styles.userInfo}>
        <img 
          src={review.user?.avatar || '/author.jpg'} 
          alt={`${review.user?.fullName || 'User'}'s avatar`} 
          className={styles.avatar}
        />
        <div className={styles.userCommentHeader}>
          <div className={styles.userCommentInfor}>
            {review.rate && review.rate > 0 && !review.parentId && (
              <div className={styles.rated}>
                {review.rate} <Star className={styles.ratedIcon}/>
              </div>
            )}
            
            <span className={styles.username}>{review.user?.fullName || 'Người dùng'}</span>
            <span className={styles.commentTime}>
              {review.createAt ? formatDate(review.createAt) : '1 giờ trước'}
            </span>
            
            {/* Delete button for review owner */}
            {review.user?.userId === currentUserId && (
              <div className={styles.deleteButton} onClick={handleDelete}>
                <Trash2 size={16} />
              </div>
            )}
          </div>
          
          <div className={styles.userCommentText}>
            {review.comment}
          </div>

          {/* actions */}
          <div className={styles.actionList}>
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
              <InputReviewBox
                bookId={review.bookId}
                userId={currentUserId}
                parentId={review.id}
                onReviewSubmitted={handleReplySubmitted}
              />
            </div>
          )}

          {/* View replies button - only show if there are replies */}
          {review.replies && review.replies.length > 0 && (
            <div className={styles.viewReply}>
              <div className={`${styles.viewReplyIcon} ${viewReplies ? styles.replyActive : ""}`}>
                <ChevronUp size={14}/>
              </div>
              <span className={styles.replyText} onClick={handleViewReplies}>
                {viewReplies ? 'Ẩn phản hồi' : `Xem ${review.replies.length} phản hồi`}
              </span>
            </div>
          )}

          {/* Display replies */}
          {viewReplies && review.replies && review.replies.length > 0 && (
            <div className={styles.repliesContainer}>
              {review.replies.map((reply) => (
                <BookReviewCard 
                  key={reply.id}
                  review={reply}
                  currentUserId={currentUserId}
                  onReviewDeleted={onReviewDeleted}
                  onReplySubmitted={onReplySubmitted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NavBarTab;