import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import styles from "./SearchSuggest.module.css";

function SearchSuggest({ searchTerm, data = [], setSearchTerm, setShowSuggest }) {
  const navigate = useNavigate();
  
  // Filter suggestions based on search term
  const filtered = searchTerm 
    ? data
        .filter((term) => term.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 5) // Limit to 5 suggestions
    : [];
  
  // Handle suggestion click
  const handleSuggestionClick = (term) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setSearchTerm(term);
    setShowSuggest(false);
  };

  // Không hiển thị nếu không có searchTerm
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