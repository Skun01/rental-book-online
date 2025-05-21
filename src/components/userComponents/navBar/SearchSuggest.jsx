import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import styles from "./SearchSuggest.module.css";
import axios from "axios";


function SearchSuggest({ searchTerm, setSearchTerm, setShowSuggest }) {
  const navigate = useNavigate();
  const [filtered, setFiltered] = useState([]);
  useEffect(()=>{
    async function getSearchingByKeyword(){
      await axios.get(`http://localhost:8080/api/v1/book/search?page=0&size=5&keyword=${searchTerm}`)
        .then(response=>{
          const suggestList = response.data.data.result.content.map(item=>item.name)
          setFiltered(suggestList)
        })
    }
    getSearchingByKeyword()
  }, [searchTerm])
    
  
  const handleSuggestionClick = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setSearchTerm(term);
    setShowSuggest(false);
  };

  if (!searchTerm) return null;

  return (
    <div className={styles.suggestBox}>
      {filtered.length > 0 ? (
        filtered.map((suggestion, index) => (
          <div 
            key={index} 
            className={styles.suggestItem} 
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <Search size={14} />
            <span>{suggestion}</span>
          </div>
        ))
      ) : (
        <div className={styles.noResult}>
          Không tìm thấy kết quả phù hợp
        </div>
      )}
    </div>
  );
}

export default SearchSuggest;