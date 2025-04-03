// Sample user data
export const sampleUser = {
    id: 1,
    create_at: "2023-01-15T10:30:00",
    create_by: "system",
    email: "user@example.com",
    full_name: "John Doe",
    gender: "Male",
    password: "hashed_password",
    refresh_token: "sample_refresh_token",
    update_at: "2023-05-20T14:45:00",
    update_by: "user",
    role_id: 2,
    address: {
      id: 1,
      city: "Ho Chi Minh City",
      district: "District 1",
      ward: "Ben Nghe",
      create_at: "2023-01-15T10:35:00",
      create_by: "system",
      update_at: null,
      update_by: null,
      user_id: 1,
    },
  }
  
  // Sample categories data
  export const sampleCategories = [
    {
      id: 1,
      name: "Fiction",
      bookCount: 42,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
    },
    {
      id: 2,
      name: "Non-Fiction",
      bookCount: 35,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
    },
    {
      id: 3,
      name: "Science",
      bookCount: 28,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      ),
    },
    {
      id: 4,
      name: "History",
      bookCount: 22,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
    },
    {
      id: 5,
      name: "Biography",
      bookCount: 18,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
    {
      id: 6,
      name: "Self-Help",
      bookCount: 15,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
      ),
    },
  ]
  
  // Sample books data
  export const sampleBooks = [
    {
      id: 1,
      name: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description:
        "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
      price: 12.99,
      discount: 15,
      stock: 25,
      category_id: 1,
      categoryName: "Fiction",
      create_at: "2023-01-10T08:30:00",
      image: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
      publisher: "Scribner",
      publicationDate: "April 10, 1925",
      language: "English",
      pages: 180,
      isbn: "978-0743273565",
      reviews: [
        {
          user: "Alice Johnson",
          rating: 5,
          date: "2023-03-15",
          comment: "A timeless classic that never gets old. The prose is beautiful and the story is captivating.",
        },
        {
          user: "Bob Smith",
          rating: 4,
          date: "2023-02-22",
          comment: "Great book, but I found some parts a bit slow. Still a must-read for any literature fan.",
        },
      ],
    },
    {
      id: 2,
      name: "To Kill a Mockingbird",
      author: "Harper Lee",
      description:
        "To Kill a Mockingbird is a novel by the American author Harper Lee. It was published in 1960 and has become a classic of modern American literature. The plot and characters are loosely based on the author's observations of her family, her neighbors and an event that occurred near her hometown of Monroeville, Alabama, in 1936, when she was ten.",
      price: 14.99,
      discount: 0,
      stock: 30,
      category_id: 1,
      categoryName: "Fiction",
      create_at: "2023-01-15T10:45:00",
      image: "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg",
      publisher: "HarperCollins",
      publicationDate: "July 11, 1960",
      language: "English",
      pages: 336,
      isbn: "978-0061120084",
      reviews: [
        {
          user: "Carol Davis",
          rating: 5,
          date: "2023-04-10",
          comment: "One of the best books ever written. The themes are still relevant today.",
        },
      ],
    },
    {
      id: 3,
      name: "1984",
      author: "George Orwell",
      description:
        "1984 is a dystopian novel by George Orwell published in 1949. The novel is set in Airstrip One, a province of the superstate Oceania in a world of perpetual war, omnipresent government surveillance, and public manipulation.",
      price: 11.99,
      discount: 10,
      stock: 15,
      category_id: 1,
      categoryName: "Fiction",
      create_at: "2023-02-20T14:20:00",
      image: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
      publisher: "Signet Classic",
      publicationDate: "June 8, 1949",
      language: "English",
      pages: 328,
      isbn: "978-0451524935",
      reviews: [],
    },
    {
      id: 4,
      name: "The Hobbit",
      author: "J.R.R. Tolkien",
      description:
        "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction.",
      price: 13.99,
      discount: 5,
      stock: 20,
      category_id: 1,
      categoryName: "Fiction",
      create_at: "2023-03-05T09:15:00",
      image: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg",
      publisher: "Houghton Mifflin Harcourt",
      publicationDate: "September 21, 1937",
      language: "English",
      pages: 304,
      isbn: "978-0547928227",
      reviews: [
        {
          user: "David Wilson",
          rating: 5,
          date: "2023-01-30",
          comment: "A fantastic adventure that's perfect for all ages. Tolkien's world-building is unmatched.",
        },
        {
          user: "Emma Brown",
          rating: 4,
          date: "2023-02-15",
          comment: "Great introduction to fantasy literature. The characters are memorable and the story is engaging.",
        },
      ],
    },
    {
      id: 5,
      name: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      description:
        "Sapiens: A Brief History of Humankind is a book by Yuval Noah Harari, first published in Hebrew in Israel in 2011 based on a series of lectures Harari taught at The Hebrew University of Jerusalem, and in English in 2014.",
      price: 16.99,
      discount: 0,
      stock: 18,
      category_id: 2,
      categoryName: "Non-Fiction",
      create_at: "2023-03-10T11:30:00",
      image: "https://m.media-amazon.com/images/I/71N3-FFSDxL._AC_UF1000,1000_QL80_.jpg",
      publisher: "Harper",
      publicationDate: "February 10, 2015",
      language: "English",
      pages: 464,
      isbn: "978-0062316097",
      reviews: [],
    },
    {
      id: 6,
      name: "A Brief History of Time",
      author: "Stephen Hawking",
      description:
        "A Brief History of Time: From the Big Bang to Black Holes is a popular-science book on cosmology by English physicist Stephen Hawking. It was first published in 1988. Hawking wrote the book for readers without prior knowledge of the universe and people who are just interested in learning something new.",
      price: 15.99,
      discount: 20,
      stock: 12,
      category_id: 3,
      categoryName: "Science",
      create_at: "2023-03-15T13:45:00",
      image: "https://m.media-amazon.com/images/I/A1xkFZX5k-L._AC_UF1000,1000_QL80_.jpg",
      publisher: "Bantam",
      publicationDate: "September 1, 1998",
      language: "English",
      pages: 256,
      isbn: "978-0553380163",
      reviews: [
        {
          user: "Frank Miller",
          rating: 5,
          date: "2023-03-20",
          comment:
            "Hawking explains complex concepts in a way that's accessible to everyone. A must-read for anyone interested in cosmology.",
        },
      ],
    },
    {
      id: 7,
      name: "The Diary of a Young Girl",
      author: "Anne Frank",
      description:
        "The Diary of a Young Girl, also known as The Diary of Anne Frank, is a book of the writings from the Dutch-language diary kept by Anne Frank while she was in hiding for two years with her family during the Nazi occupation of the Netherlands.",
      price: 9.99,
      discount: 0,
      stock: 22,
      category_id: 4,
      categoryName: "History",
      create_at: "2023-03-20T15:10:00",
      image: "https://m.media-amazon.com/images/I/81xT2mdyL7L._AC_UF1000,1000_QL80_.jpg",
      publisher: "Bantam",
      publicationDate: "June 25, 1947",
      language: "English",
      pages: 283,
      isbn: "978-0553577129",
      reviews: [],
    },
    {
      id: 8,
      name: "Steve Jobs",
      author: "Walter Isaacson",
      description:
        "Steve Jobs is the authorized biography of Steve Jobs. Based on more than forty interviews with Jobs conducted over two years—as well as interviews with more than 100 family members, friends, adversaries, competitors, and colleagues—Walter Isaacson has written a riveting story of the roller-coaster life and searingly intense personality of a creative entrepreneur whose passion for perfection and ferocious drive revolutionized six industries: personal computers, animated movies, music, phones, tablet computing, and digital publishing.",
      price: 18.99,
      discount: 15,
      stock: 10,
      category_id: 5,
      categoryName: "Biography",
      create_at: "2023-03-25T16:30:00",
      image: "https://m.media-amazon.com/images/I/41dKkez-1rL._AC_UF1000,1000_QL80_.jpg",
      publisher: "Simon & Schuster",
      publicationDate: "October 24, 2011",
      language: "English",
      pages: 656,
      isbn: "978-1451648539",
      reviews: [
        {
          user: "Grace Lee",
          rating: 4,
          date: "2023-04-05",
          comment:
            "Fascinating insight into the life of one of the most influential figures in technology. Well-researched and engaging.",
        },
        {
          user: "Henry Clark",
          rating: 5,
          date: "2023-03-28",
          comment: "Isaacson does a great job of showing both the genius and the flaws of Jobs. Couldn't put it down.",
        },
      ],
    },
  ]
  
  // Sample orders data
  export const sampleOrders = [
    {
      id: 1001,
      create_at: "2023-04-15T09:30:00",
      create_by: "user",
      status: "Completed",
      total_price: 38.97,
      update_at: "2023-04-16T14:20:00",
      update_by: "system",
      user_id: 1,
      items: [
        {
          id: 1,
          name: "The Great Gatsby",
          price: 12.99,
          quantity: 1,
          image: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
        },
        {
          id: 2,
          name: "To Kill a Mockingbird",
          price: 14.99,
          quantity: 1,
          image: "https://m.media-amazon.com/images/I/71FxgtFKcQL._AC_UF1000,1000_QL80_.jpg",
        },
        {
          id: 3,
          name: "1984",
          price: 10.99,
          quantity: 1,
          image: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
        },
      ],
    },
    {
      id: 1002,
      create_at: "2023-05-10T11:45:00",
      create_by: "user",
      status: "Pending",
      total_price: 16.99,
      update_at: null,
      update_by: null,
      user_id: 1,
      items: [
        {
          id: 5,
          name: "Sapiens: A Brief History of Humankind",
          price: 16.99,
          quantity: 1,
          image: "https://m.media-amazon.com/images/I/71N3-FFSDxL._AC_UF1000,1000_QL80_.jpg",
        },
      ],
    },
  ]
  
  