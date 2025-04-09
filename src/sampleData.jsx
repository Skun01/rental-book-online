// Sample user data
export const sampleUser = {
  id: 1,
  create_at: "2023-01-15T10:30:00",
  create_by: "system",
  email: "user@example.com",
  full_name: "John Doe",
  gender: "Male",
  phone: "0901234567",
  refresh_token: "sample_refresh_token",
  update_at: "2023-05-20T14:45:00",
  update_by: "user",
  role_id: 2,
  status: "Active",
}

// Sample address data
export const sampleAddresses = [
  {
    id: 1,
    create_at: "2023-01-15T10:35:00",
    create_by: "system",
    update_at: null,
    update_by: null,
    user_id: 1,
    province: "Ho Chi Minh",
    city: "Ho Chi Minh City",
    district: "District 1",
    ward: "Ben Nghe",
    street: "123 Nguyen Hue Boulevard",
    is_default: true,
  },
  {
    id: 2,
    create_at: "2023-03-10T14:20:00",
    create_by: "user",
    update_at: null,
    update_by: null,
    user_id: 1,
    province: "Ho Chi Minh",
    city: "Ho Chi Minh City",
    district: "District 7",
    ward: "Tan Phong",
    street: "456 Nguyen Thi Thap Street",
    is_default: false,
  },
]

// Sample categories data
export const sampleCategories = [
  {
    id: 1,
    name: "Fiction",
    description: "Fictional literature and stories",
    parent_id: null,
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
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
    bookCount: 45,
  },
  {
    id: 2,
    name: "Non-Fiction",
    description: "Factual and informative literature",
    parent_id: null,
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
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
    bookCount: 38,
  },
  {
    id: 3,
    name: "Science Fiction",
    description: "Fiction based on scientific discoveries or advanced technology",
    parent_id: 1,
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
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
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path>
      </svg>
    ),
    bookCount: 22,
  },
  {
    id: 4,
    name: "Fantasy",
    description: "Fiction featuring magical and supernatural elements",
    parent_id: 1,
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
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
        <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
      </svg>
    ),
    bookCount: 18,
  },
  {
    id: 5,
    name: "Biography",
    description: "Non-fictional accounts of people's lives",
    parent_id: 2,
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
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
    bookCount: 15,
  },
  {
    id: 6,
    name: "History",
    description: "Books about historical events and periods",
    parent_id: 2,
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
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
    bookCount: 20,
  },
]

// Sample authors data
export const sampleAuthors = [
  {
    id: 1,
    name: "J.K. Rowling",
    biography: "British author best known for the Harry Potter series",
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
  },
  {
    id: 2,
    name: "George Orwell",
    biography: "English novelist, essayist, and critic, famous for '1984' and 'Animal Farm'",
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
  },
  {
    id: 3,
    name: "Yuval Noah Harari",
    biography: "Israeli historian and author of 'Sapiens' and 'Homo Deus'",
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
  },
  {
    id: 4,
    name: "J.R.R. Tolkien",
    biography: "English writer, poet, and academic, best known for 'The Lord of the Rings'",
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
  },
  {
    id: 5,
    name: "F. Scott Fitzgerald",
    biography: "American novelist and short story writer, known for 'The Great Gatsby'",
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
  },
]

// Sample books data - Used in BookDetailPage, BooksPage, etc.
export const sampleBooks = [
  {
    id: 1,
    title: "Harry Potter and the Philosopher's Stone",
    description:
      "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry.",
    isbn: "9780747532743",
    publisher: "Bloomsbury",
    publish_year: "1997",
    language: "English",
    pages: 223,
    rental_price: 10000,
    deposit_price: 50000,
    available_quantity: 50,
    category_id: 4,
    categoryName: "Fantasy",
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
    authors: [{ id: 1, name: "J.K. Rowling" }],
    images: [
      { id: 1, url: "https://m.media-amazon.com/images/I/81m1s4wIPML._AC_UF1000,1000_QL80_.jpg", is_cover: true },
    ],
    reviews: [
      {
        user: "Alice",
        date: "2023-07-01",
        rating: 5,
        comment: "A magical start to a wonderful series!",
      },
      {
        user: "Bob",
        date: "2023-07-05",
        rating: 4,
        comment: "Great book for kids and adults alike.",
      },
    ],
  },
  {
    id: 2,
    title: "1984",
    description:
      "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real. Published in 1949, the book offers political satirist George Orwell's nightmarish vision of a totalitarian, bureaucratic world and one poor stiff's attempt to find individuality.",
    isbn: "9780451524935",
    publisher: "Signet Classics",
    publish_year: "1949",
    language: "English",
    pages: 328,
    rental_price: 8000,
    deposit_price: 40000,
    available_quantity: 30,
    category_id: 3,
    categoryName: "Science Fiction",
    create_at: "2023-02-15T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
    authors: [{ id: 2, name: "George Orwell" }],
    images: [
      { id: 2, url: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg", is_cover: true },
    ],
    reviews: [
      {
        user: "Charlie",
        date: "2023-06-20",
        rating: 4,
        comment: "A classic that everyone should read.",
      },
      {
        user: "Diana",
        date: "2023-06-25",
        rating: 5,
        comment: "Disturbingly relevant even today.",
      },
    ],
  },
  {
    id: 3,
    title: "The Great Gatsby",
    description:
      "The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, This is an exquisitely crafted tale of dreams, love, and tragedy.",
    isbn: "9780743273565",
    publisher: "Scribner",
    publish_year: "1925",
    language: "English",
    pages: 180,
    rental_price: 12000,
    deposit_price: 60000,
    available_quantity: 20,
    category_id: 1,
    categoryName: "Fiction",
    create_at: "2023-03-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
    authors: [{ id: 5, name: "F. Scott Fitzgerald" }],
    images: [
      { id: 3, url: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg", is_cover: true },
    ],
    reviews: [],
  },
  {
    id: 4,
    title: "To Kill a Mockingbird",
    description:
      "A gripping, heart-wrenching, and wholly remarkable tale of coming-of-age in a South poisoned by virulent prejudice, it views a world of great beauty and savage inequities through the eyes of a young girl, as her father—a crusading local lawyer—risks everything to defend a black man unjustly accused of a terrible crime.",
    isbn: "9780061120084",
    publisher: "Harper Perennial",
    publish_year: "1960",
    language: "English",
    pages: 336,
    rental_price: 9000,
    deposit_price: 45000,
    available_quantity: 25,
    category_id: 1,
    categoryName: "Fiction",
    create_at: "2023-03-15T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
    authors: [{ id: 6, name: "Harper Lee" }],
    images: [
      {
        id: 4,
        url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
        is_cover: true,
      },
    ],
    reviews: [],
  },
  {
    id: 5,
    title: "The Hobbit",
    description:
      "Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep one day to whisk him away on an adventure.",
    isbn: "9780547928227",
    publisher: "Houghton Mifflin Harcourt",
    publish_year: "1937",
    language: "English",
    pages: 310,
    rental_price: 11000,
    deposit_price: 55000,
    available_quantity: 15,
    category_id: 4,
    categoryName: "Fantasy",
    create_at: "2023-04-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
    authors: [{ id: 4, name: "J.R.R. Tolkien" }],
    images: [
      { id: 5, url: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg", is_cover: true },
    ],
    reviews: [],
  },
  {
    id: 6,
    title: "Sapiens: A Brief History of Humankind",
    description:
      "In Sapiens, Dr. Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical – and sometimes devastating – breakthroughs of the Cognitive, Agricultural and Scientific Revolutions.",
    isbn: "9780062316097",
    publisher: "Harper",
    publish_year: "2014",
    language: "English",
    pages: 464,
    rental_price: 15000,
    deposit_price: 75000,
    available_quantity: 10,
    category_id: 2,
    categoryName: "Non-Fiction",
    create_at: "2023-04-15T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
    authors: [{ id: 3, name: "Yuval Noah Harari" }],
    images: [
      { id: 6, url: "https://m.media-amazon.com/images/I/71LMXL8DTjL._AC_UF1000,1000_QL80_.jpg", is_cover: true },
    ],
    reviews: [],
  },
]

// Sample products data - Used in ProductsPage, ProductDetailPage, etc.
export const sampleProducts = [
  {
    id: 1,
    name: "Harry Potter and the Philosopher's Stone",
    description:
      "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry.",
    isbn: "9780747532743",
    publisher: "Bloomsbury",
    publish_year: "1997",
    publicationDate: "1997-06-26",
    pages: 223,
    language: "English",
    price: 10000,
    discount: 0.1,
    stock: 50,
    category_id: 4,
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
    author: "J.K. Rowling",
    image: "https://m.media-amazon.com/images/I/81m1s4wIPML._AC_UF1000,1000_QL80_.jpg",
    categoryName: "Fantasy",
    reviews: [
      {
        user: "Alice",
        date: "2023-07-01",
        rating: 5,
        comment: "A magical start to a wonderful series!",
      },
      {
        user: "Bob",
        date: "2023-07-05",
        rating: 4,
        comment: "Great book for kids and adults alike.",
      },
    ],
  },
  {
    id: 2,
    name: "1984",
    description:
      "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real. Published in 1949, the book offers political satirist George Orwell's nightmarish vision of a totalitarian, bureaucratic world and one poor stiff's attempt to find individuality.",
    isbn: "9780451524935",
    publisher: "Signet Classics",
    publish_year: "1949",
    publicationDate: "1949-06-08",
    pages: 328,
    language: "English",
    price: 8000,
    discount: 0,
    stock: 30,
    category_id: 3,
    create_at: "2023-02-15T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
    author: "George Orwell",
    image: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
    categoryName: "Science Fiction",
    reviews: [
      {
        user: "Charlie",
        date: "2023-06-20",
        rating: 4,
        comment: "A classic that everyone should read.",
      },
      {
        user: "Diana",
        date: "2023-06-25",
        rating: 5,
        comment: "Disturbingly relevant even today.",
      },
    ],
  },
  {
    id: 3,
    name: "The Great Gatsby",
    description:
      "The story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, This is an exquisitely crafted tale of dreams, love, and tragedy.",
    isbn: "9780743273565",
    publisher: "Scribner",
    publish_year: "1925",
    publicationDate: "1925-04-10",
    pages: 180,
    language: "English",
    price: 12000,
    discount: 0.2,
    stock: 20,
    category_id: 1,
    create_at: "2023-03-01T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
    author: "F. Scott Fitzgerald",
    image: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
    categoryName: "Fiction",
    reviews: [],
  },
]

// Sample book recommendations data
export const sampleRecommendations = [
  {
    id: 1,
    user_id: 1,
    book_id: 6,
    score: 0.95,
    recommendation_type: "History",
    is_viewed: false,
    create_at: "2023-06-15T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
    book: {
      id: 6,
      title: "Sapiens: A Brief History of Humankind",
      authors: [{ id: 3, name: "Yuval Noah Harari" }],
      rental_price: 15000,
      deposit_price: 75000,
      available_quantity: 10,
      images: [
        { id: 6, url: "https://m.media-amazon.com/images/I/71LMXL8DTjL._AC_UF1000,1000_QL80_.jpg", is_cover: true },
      ],
    },
  },
  {
    id: 2,
    user_id: 1,
    book_id: 5,
    score: 0.92,
    recommendation_type: "Category",
    is_viewed: false,
    create_at: "2023-06-15T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
    book: {
      id: 5,
      title: "The Hobbit",
      authors: [{ id: 4, name: "J.R.R. Tolkien" }],
      rental_price: 11000,
      deposit_price: 55000,
      available_quantity: 15,
      images: [
        { id: 5, url: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg", is_cover: true },
      ],
    },
  },
  {
    id: 3,
    user_id: 1,
    book_id: 4,
    score: 0.88,
    recommendation_type: "AI",
    is_viewed: false,
    create_at: "2023-06-15T00:00:00",
    create_by: "system",
    update_at: null,
    update_by: null,
    book: {
      id: 4,
      title: "To Kill a Mockingbird",
      authors: [{ id: 6, name: "Harper Lee" }],
      rental_price: 9000,
      deposit_price: 45000,
      available_quantity: 25,
      images: [
        {
          id: 4,
          url: "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
          is_cover: true,
        },
      ],
    },
  },
]

// Sample orders data
export const sampleOrders = [
  {
    id: "1001",
    orderNumber: "ORD-1001",
    date: "2023-04-01",
    status: "Active",
    dueDate: "2023-04-15",
    items: [
      {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        coverImage: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF1000,1000_QL80_.jpg",
      },
    ],
    totalDeposit: 20000,
    deliveryMethod: "Library Pickup",
    pickupLocation: "Main Library",
    estimatedReadyDate: "2023-04-03",
  },
  {
    id: "1002",
    orderNumber: "ORD-1002",
    date: "2023-03-15",
    status: "Completed",
    returnDate: "2023-03-29",
    items: [
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        coverImage:
          "https://upload.wikimedia.org/wikipedia/commons/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
      },
      {
        id: 3,
        title: "1984",
        author: "George Orwell",
        coverImage: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
      },
    ],
    totalDeposit: 50000,
    deliveryMethod: "Home Delivery",
    address: "123 Main St, District 1, Ho Chi Minh City",
    estimatedDeliveryDate: "2023-03-17",
  },
  {
    id: "1003",
    orderNumber: "ORD-1003",
    date: "2023-02-20",
    status: "Overdue",
    dueDate: "2023-03-06",
    items: [
      {
        id: 4,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        coverImage: "https://m.media-amazon.com/images/I/91HPG31dTwL._AC_UF1000,1000_QL80_.jpg",
      },
    ],
    totalDeposit: 25000,
    lateFee: 5000,
    deliveryMethod: "Library Pickup",
    pickupLocation: "Branch Library",
    estimatedReadyDate: "2023-02-22",
  },
  {
    id: "1004",
    orderNumber: "ORD-1004",
    date: "2023-01-10",
    status: "Cancelled",
    cancellationDate: "2023-01-11",
    items: [
      {
        id: 5,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        coverImage: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg",
      },
    ],
    totalDeposit: 30000,
    refundAmount: 30000,
    deliveryMethod: "Home Delivery",
    address: "456 Oak St, District 2, Ho Chi Minh City",
    estimatedDeliveryDate: "2023-01-13",
  },
]

// Sample roles data
export const sampleRoles = [
  {
    id: 1,
    name: "Admin",
    description: "Full access to all system features",
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
  },
  {
    id: 2,
    name: "User",
    description: "Standard user with book rental privileges",
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
  },
]

// Sample permissions data
export const samplePermissions = [
  {
    id: 1,
    name: "View Books",
    api_path: "/api/books",
    method: "GET",
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
  },
  {
    id: 2,
    name: "Add Book",
    api_path: "/api/books",
    method: "POST",
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
  },
  {
    id: 3,
    name: "Edit Book",
    api_path: "/api/books/:id",
    method: "PUT",
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
  },
  {
    id: 4,
    name: "Delete Book",
    api_path: "/api/books/:id",
    method: "DELETE",
    create_at: "2023-01-01T00:00:00",
    create_by: "system",
  },
]

// Sample tracking events data
export const sampleTrackingEvents = [
  {
    id: 1,
    order_id: "1001",
    status: "Order Placed",
    location: "Online",
    timestamp: "2023-04-01T10:30:00",
    description: "Your order has been received and is being processed.",
  },
  {
    id: 2,
    order_id: "1001",
    status: "Payment Confirmed",
    location: "Online",
    timestamp: "2023-04-01T10:35:00",
    description: "Your payment has been confirmed.",
  },
  {
    id: 3,
    order_id: "1001",
    status: "Books Prepared",
    location: "Main Warehouse",
    timestamp: "2023-04-02T14:20:00",
    description: "Your books have been prepared for pickup.",
  },
  {
    id: 4,
    order_id: "1001",
    status: "Ready for Pickup",
    location: "Main Library",
    timestamp: "2023-04-03T09:15:00",
    description: "Your books are ready for pickup at the library.",
  },
]

