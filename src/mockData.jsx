import { BookOpen, BookText, Brain, Briefcase, Baby, Globe } from "lucide-react"
// Mock Categories
export const mockCategories = [
  {
    id: 1,
    name: "Văn học",
    icon: <BookOpen size={32} />,
    bookCount: 1250,
    description: "Sách văn học Việt Nam và thế giới",
  },
  {
    id: 2,
    name: "Kinh tế",
    icon: <Briefcase size={32} />,
    bookCount: 850,
    description: "Sách về kinh tế, kinh doanh, tài chính",
  },
  {
    id: 3,
    name: "Kỹ năng sống",
    icon: <Brain size={32} />,
    bookCount: 620,
    description: "Sách về phát triển bản thân và kỹ năng sống",
  },
  {
    id: 4,
    name: "Sách thiếu nhi",
    icon: <Baby size={32} />,
    bookCount: 780,
    description: "Sách dành cho trẻ em và thiếu niên",
  },
  {
    id: 5,
    name: "Sách ngoại ngữ",
    icon: <Globe size={32} />,
    bookCount: 450,
    description: "Sách học ngoại ngữ và sách bằng tiếng nước ngoài",
  },
  {
    id: 6,
    name: "Giáo khoa - Tham khảo",
    icon: <BookText size={32} />,
    bookCount: 920,
    description: "Sách giáo khoa và tài liệu tham khảo",
  },
]

// Thay đổi cấu trúc mockBooks để phù hợp với schema database
export const mockBooks = [
  {
    id: 1,
    title: "Nhà Giả Kim",
    description:
      "Nhà giả kim là cuốn sách được xuất bản lần đầu ở Brasil năm 1988, và trở thành một trong những cuốn sách bán chạy nhất mọi thời đại. Tác phẩm kể về Santiago, một cậu bé chăn cừu người Tây Ban Nha, đã thực hiện một cuộc hành trình đến Kim tự tháp Ai Cập sau khi có một giấc mơ lặp đi lặp lại về việc tìm thấy kho báu ở đó.",
    deposit_price: 150000,
    rental_price: 25000,
    discount: 0,
    stock: 15,
    total_quantity: 20,
    pages: 228,
    language: "Tiếng Việt",
    publisher: "NXB Hội Nhà Văn",
    publish_date: "2020-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: 1,
    category_id: 1,
    cover_image: "/Book.jpg", // Sẽ được chuyển sang bảng images
  },
  {
    id: 2,
    title: "Đắc Nhân Tâm",
    description:
      "Đắc Nhân Tâm là một trong những cuốn sách nổi tiếng nhất về phát triển bản thân. Cuốn sách cung cấp những lời khuyên về cách thức cư xử, ứng xử và giao tiếp với mọi người để đạt được thành công trong cuộc sống.",
    deposit_price: 180000,
    rental_price: 30000,
    discount: 5,
    stock: 10,
    total_quantity: 15,
    pages: 320,
    language: "Tiếng Việt",
    publisher: "NXB Tổng hợp TP.HCM",
    publish_date: "2019-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: 2,
    category_id: 3,
    cover_image: "https://salt.tikicdn.com/cache/w1200/ts/product/df/7d/da/d340edda2b0eacb7ddc47537cddb5e08.jpg",
  },
  {
    id: 3,
    title: "Tôi Tài Giỏi, Bạn Cũng Thế",
    description:
      "Tôi Tài Giỏi, Bạn Cũng Thế là cuốn sách bán chạy nhất của Adam Khoo, một doanh nhân thành đạt người Singapore. Cuốn sách chia sẻ những phương pháp học tập hiệu quả giúp bạn phát huy tối đa tiềm năng của bản thân.",
    deposit_price: 160000,
    rental_price: 28000,
    discount: 0,
    stock: 8,
    total_quantity: 12,
    pages: 285,
    language: "Tiếng Việt",
    publisher: "NXB Phụ Nữ",
    publish_date: "2018-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: 3,
    category_id: 3,
    cover_image: "/Book.jpg",
  },
  {
    id: 4,
    title: "Sapiens: Lược Sử Loài Người",
    description:
      "Sapiens là một cuốn sách về lịch sử loài người từ thời kỳ đồ đá cũ đến thế kỷ 21. Tác giả Yuval Noah Harari đã mô tả sự phát triển của loài người qua bốn cuộc cách mạng lớn: nhận thức, nông nghiệp, thống nhất và khoa học.",
    deposit_price: 200000,
    rental_price: 35000,
    discount: 10,
    stock: 5,
    total_quantity: 8,
    pages: 560,
    language: "Tiếng Việt",
    publisher: "NXB Thế Giới",
    publish_date: "2019-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: 4,
    category_id: 1,
    cover_image: "/Book.jpg",
  },
  {
    id: 5,
    title: "Người Giàu Có Nhất Thành Babylon",
    description:
      "Người Giàu Có Nhất Thành Babylon là một cuốn sách kinh điển về tài chính cá nhân. Thông qua những câu chuyện từ thành Babylon cổ đại, cuốn sách đưa ra những bài học quý giá về cách làm giàu và quản lý tài chính.",
    deposit_price: 150000,
    rental_price: 25000,
    discount: 0,
    stock: 12,
    total_quantity: 15,
    pages: 208,
    language: "Tiếng Việt",
    publisher: "NXB Lao Động",
    publish_date: "2020-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: 5,
    category_id: 2,
    cover_image: "/Book.jpg",
  },
  {
    id: 6,
    title: "Dám Nghĩ Lớn",
    description:
      "Dám Nghĩ Lớn là cuốn sách kinh điển về phát triển bản thân. Tác giả David J. Schwartz đưa ra những phương pháp thực tế giúp bạn phát triển tư duy tích cực và đạt được thành công trong cuộc sống.",
    deposit_price: 160000,
    rental_price: 28000,
    discount: 0,
    stock: 7,
    total_quantity: 10,
    pages: 320,
    language: "Tiếng Việt",
    publisher: "NXB Lao Động - Xã Hội",
    publish_date: "2017-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: null,
    category_id: 3,
    cover_image: "/Book.jpg",
  },
  {
    id: 7,
    title: "Bí Mật Của May Mắn",
    description:
      "Bí Mật Của May Mắn là cuốn sách nổi tiếng về luật hấp dẫn. Cuốn sách giải thích cách thức vũ trụ hoạt động và làm thế nào để bạn có thể sử dụng luật hấp dẫn để đạt được những điều mình mong muốn.",
    deposit_price: 150000,
    rental_price: 26000,
    discount: 0,
    stock: 9,
    total_quantity: 12,
    pages: 198,
    language: "Tiếng Việt",
    publisher: "NXB Lao Động",
    publish_date: "2018-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: null,
    category_id: 3,
    cover_image: "/Book.jpg",
  },
  {
    id: 8,
    title: "Hành Trình Về Phương Đông",
    description:
      "Hành Trình Về Phương Đông là câu chuyện về chuyến đi của một đoàn khoa học gồm các giáo sư đại học Hoa Kỳ đến Ấn Độ và Tây Tạng để tìm hiểu về những hiện tượng kỳ bí và triết lý phương Đông.",
    deposit_price: 160000,
    rental_price: 27000,
    discount: 0,
    stock: 6,
    total_quantity: 8,
    pages: 256,
    language: "Tiếng Việt",
    publisher: "NXB Hồng Đức",
    publish_date: "2019-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: null,
    category_id: 1,
    cover_image: "/Book.jpg",
  },
  {
    id: 9,
    title: "Đời Ngắn Đừng Ngủ Dài",
    description:
      "Đời Ngắn Đừng Ngủ Dài là cuốn sách truyền cảm hứng của Robin Sharma. Cuốn sách đưa ra 101 bài học giúp bạn sống một cuộc đời đáng sống và đạt được thành công trong công việc và cuộc sống.",
    deposit_price: 150000,
    rental_price: 25000,
    discount: 0,
    stock: 10,
    total_quantity: 15,
    pages: 228,
    language: "Tiếng Việt",
    publisher: "NXB Trẻ",
    publish_date: "2018-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: 6,
    category_id: 3,
    cover_image: "/Book.jpg",
  },
  {
    id: 10,
    title: "Cà Phê Cùng Tony",
    description:
      "Cà Phê Cùng Tony là tập hợp những bài viết của tác giả Tony Buổi Sáng về nhiều chủ đề khác nhau trong cuộc sống. Cuốn sách mang đến những góc nhìn mới mẻ và thú vị về cuộc sống, công việc và các mối quan hệ.",
    deposit_price: 150000,
    rental_price: 26000,
    discount: 0,
    stock: 8,
    total_quantity: 10,
    pages: 268,
    language: "Tiếng Việt",
    publisher: "NXB Trẻ",
    publish_date: "2017-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: 8,
    category_id: 3,
    cover_image: "/Book.jpg",
  },
  {
    id: 11,
    title: "Tư Duy Phản Biện",
    description:
      "Tư Duy Phản Biện là cuốn sách giúp bạn phát triển kỹ năng tư duy phản biện - một kỹ năng quan trọng trong thời đại thông tin hiện nay. Cuốn sách cung cấp các công cụ và phương pháp để phân tích, đánh giá và đưa ra quyết định một cách hợp lý.",
    deposit_price: 160000,
    rental_price: 28000,
    discount: 0,
    stock: 7,
    total_quantity: 10,
    pages: 240,
    language: "Tiếng Việt",
    publisher: "NXB Lao Động",
    publish_date: "2020-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: null,
    category_id: 3,
    cover_image: "/Book.jpg",
  },
  {
    id: 12,
    title: "Khéo Ăn Nói Sẽ Có Được Thiên Hạ",
    description:
      "Khéo Ăn Nói Sẽ Có Được Thiên Hạ là cuốn sách về nghệ thuật giao tiếp. Cuốn sách cung cấp những kỹ năng và phương pháp giúp bạn giao tiếp hiệu quả trong các tình huống khác nhau của cuộc sống.",
    deposit_price: 160000,
    rental_price: 27000,
    discount: 0,
    stock: 9,
    total_quantity: 12,
    pages: 320,
    language: "Tiếng Việt",
    publisher: "NXB Văn Học",
    publish_date: "2018-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: null,
    category_id: 3,
    cover_image: "/Book.jpg",
  },
  {
    id: 13,
    title: "Đừng Bao Giờ Đi Ăn Một Mình",
    description:
      "Đừng Bao Giờ Đi Ăn Một Mình là cuốn sách về nghệ thuật xây dựng mối quan hệ trong kinh doanh. Tác giả Keith Ferrazzi chia sẻ những bí quyết để xây dựng mạng lưới quan hệ rộng lớn và bền vững.",
    deposit_price: 170000,
    rental_price: 29000,
    discount: 0,
    stock: 6,
    total_quantity: 8,
    pages: 312,
    language: "Tiếng Việt",
    publisher: "NXB Lao Động",
    publish_date: "2019-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: null,
    category_id: 2,
    cover_image: "/Book.jpg",
  },
  {
    id: 14,
    title: "Điểm Đến Của Cuộc Đời",
    description:
      "Điểm Đến Của Cuộc Đời là cuốn sách về hành trình tìm kiếm ý nghĩa cuộc sống. Cuốn sách kể về hành trình của một người đàn ông trẻ đi tìm câu trả lời cho những câu hỏi lớn về cuộc sống và vũ trụ.",
    deposit_price: 150000,
    rental_price: 26000,
    discount: 0,
    stock: 8,
    total_quantity: 10,
    pages: 280,
    language: "Tiếng Việt",
    publisher: "NXB Hồng Đức",
    publish_date: "2018-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: 9,
    category_id: 1,
    cover_image: "/Book.jpg",
  },
  {
    id: 15,
    title: "Bí Mật Tư Duy Triệu Phú",
    description:
      "Bí Mật Tư Duy Triệu Phú là cuốn sách về tư duy làm giàu. Tác giả T. Harv Eker chỉ ra những khác biệt trong tư duy giữa người giàu và người nghèo, từ đó giúp bạn phát triển tư duy của người giàu.",
    deposit_price: 160000,
    rental_price: 28000,
    discount: 0,
    stock: 7,
    total_quantity: 10,
    pages: 240,
    language: "Tiếng Việt",
    publisher: "NXB Lao Động",
    publish_date: "2019-01-01T00:00:00.000000",
    status: "AVAILABLE",
    author_id: 10,
    category_id: 2,
    cover_image: "/Book.jpg",
  },
  {
    id: 16,
    title: "Dạy Con Làm Giàu",
    description:
      "Dạy Con Làm Giàu là cuốn sách kinh điển về tài chính cá nhân. Tác giả Robert Kiyosaki chia sẻ những bài học về tài chính mà ông học được từ 'người cha giàu' và 'người cha nghèo', giúp bạn hiểu rõ hơn về cách quản lý tiền bạc và đầu tư.",
    deposit_price: 180000,
    rental_price: 30000,
    discount: 0,
    stock: 0,
    total_quantity: 5,
    pages: 320,
    language: "Tiếng Việt",
    publisher: "NXB Trẻ",
    publish_date: "2020-01-01T00:00:00.000000",
    status: "UNAVAILABLE",
    author_id: 7,
    category_id: 2,
    cover_image: "/Book.jpg",
  },
]

// Thêm bảng images để lưu trữ hình ảnh sách
export const mockImages = [
  {
    id: 1,
    url: "/Book.jpg",
    is_cover: true,
    product_id: 1,
    user_id: null,
    create_at: "2023-01-01T00:00:00.000000",
    create_by: "admin",
    update_at: null,
    update_by: null,
  },
  {
    id: 2,
    url: "https://salt.tikicdn.com/cache/w1200/ts/product/df/7d/da/d340edda2b0eacb7ddc47537cddb5e08.jpg",
    is_cover: true,
    product_id: 2,
    user_id: null,
    create_at: "2023-01-01T00:00:00.000000",
    create_by: "admin",
    update_at: null,
    update_by: null,
  },
  {
    id: 3,
    url: "/Book.jpg",
    is_cover: true,
    product_id: 3,
    user_id: null,
    create_at: "2023-01-01T00:00:00.000000",
    create_by: "admin",
    update_at: null,
    update_by: null,
  },
  {
    id: 4,
    url: "https://m.media-amazon.com/images/I/51Z0nLAfLmL.jpg",
    is_cover: false,
    product_id: 1,
    user_id: null,
    create_at: "2023-01-01T00:00:00.000000",
    create_by: "admin",
    update_at: null,
    update_by: null,
  },
  {
    id: 5,
    url: "https://m.media-amazon.com/images/I/71VJP6rAEOL._AC_UF1000,1000_QL80_.jpg",
    is_cover: false,
    product_id: 1,
    user_id: null,
    create_at: "2023-01-01T00:00:00.000000",
    create_by: "admin",
    update_at: null,
    update_by: null,
  },
  {
    id: 6,
    url: "https://m.media-amazon.com/images/I/71vK0WVQ4rL._AC_UF1000,1000_QL80_.jpg",
    is_cover: false,
    product_id: 2,
    user_id: null,
    create_at: "2023-01-01T00:00:00.000000",
    create_by: "admin",
    update_at: null,
    update_by: null,
  },
  {
    id: 7,
    url: "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9780/6717/9780671723651.jpg",
    is_cover: false,
    product_id: 2,
    user_id: null,
    create_at: "2023-01-01T00:00:00.000000",
    create_by: "admin",
    update_at: null,
    update_by: null,
  },
  {
    id: 8,
    url: "https://m.media-amazon.com/images/I/71gZSB3RmoL._AC_UF1000,1000_QL80_.jpg",
    is_cover: true,
    product_id: 4,
    user_id: null,
    create_at: "2023-01-01T00:00:00.000000",
    create_by: "admin",
    update_at: null,
    update_by: null,
  },
  {
    id: 9,
    url: "https://m.media-amazon.com/images/I/61-+2SsAFBL._AC_UF1000,1000_QL80_.jpg",
    is_cover: false,
    product_id: 4,
    user_id: null,
    create_at: "2023-01-01T00:00:00.000000",
    create_by: "admin",
    update_at: null,
    update_by: null,
  },
  {
    id: 10,
    url: "https://m.media-amazon.com/images/I/61Iz2yy2CKL.jpg",
    is_cover: true,
    product_id: 5,
    user_id: null,
    create_at: "2023-01-01T00:00:00.000000",
    create_by: "admin",
    update_at: null,
    update_by: null,
  },
]

// Mock Authors
export const mockAuthors = [
  {
    id: 1,
    name: "Paulo Coelho",
    country: "Brazil",
    bio: "Paulo Coelho là một nhà văn người Brazil nổi tiếng với cuốn tiểu thuyết Nhà Giả Kim.",
  },
  {
    id: 2,
    name: "Dale Carnegie",
    country: "Mỹ",
    bio: "Dale Carnegie là một nhà văn và nhà thuyết trình người Mỹ, nổi tiếng với cuốn sách Đắc Nhân Tâm.",
  },
  {
    id: 3,
    name: "Adam Khoo",
    country: "Singapore",
    bio: "Adam Khoo là một doanh nhân, nhà đầu tư và tác giả người Singapore.",
  },
  {
    id: 4,
    name: "Yuval Noah Harari",
    country: "Israel",
    bio: "Yuval Noah Harari là một nhà sử học và giáo sư tại Đại học Hebrew ở Jerusalem.",
  },
  {
    id: 5,
    name: "George S. Clason",
    country: "Mỹ",
    bio: "George Samuel Clason là một nhà văn người Mỹ, nổi tiếng với cuốn sách Người Giàu Có Nhất Thành Babylon.",
  },
  {
    id: 6,
    name: "Robin Sharma",
    country: "Canada",
    bio: "Robin Sharma là một nhà văn người Canada gốc Ấn Độ, nổi tiếng với cuốn sách Nhà Lãnh Đạo Không Chức Danh.",
  },
  {
    id: 7,
    name: "Robert Kiyosaki",
    country: "Mỹ",
    bio: "Robert Kiyosaki là một doanh nhân, nhà đầu tư và tác giả người Mỹ, nổi tiếng với cuốn sách Dạy Con Làm Giàu.",
  },
  {
    id: 8,
    name: "Tony Buổi Sáng",
    country: "Việt Nam",
    bio: "Tony Buổi Sáng là bút danh của một tác giả người Việt Nam, nổi tiếng với cuốn sách Cà Phê Cùng Tony.",
  },
  {
    id: 9,
    name: "Nguyên Phong",
    country: "Việt Nam",
    bio: "Nguyên Phong là bút danh của một tác giả người Việt Nam, nổi tiếng với nhiều cuốn sách về tâm linh và phát triển bản thân.",
  },
  {
    id: 10,
    name: "T. Harv Eker",
    country: "Mỹ",
    bio: "T. Harv Eker là một doanh nhân, nhà đầu tư và tác giả người Mỹ, nổi tiếng với cuốn sách Bí Mật Tư Duy Triệu Phú.",
  },
]

// Điều chỉnh cấu trúc mockUser để phù hợp với schema database
export const mockUser = {
  id: 1,
  full_name: "Nguyễn Văn A",
  email: "user@example.com",
  password: "hashed_password", // Thêm trường password
  avatar: null,
  gender: "MALE",
  age: 30,
  active: true,
  status: "ACTIVE",
  refresh_token: null,
  role_id: 2, // Regular user role
  create_at: "2023-01-01T00:00:00.000000",
  create_by: "system",
  update_at: null,
  update_by: null,
}

// Điều chỉnh cấu trúc địa chỉ để phù hợp với schema database
export const mockAddresses = [
  {
    id: 1,
    user_id: 1,
    city: "TP.HCM",
    district: "Quận 1",
    province: "Hồ Chí Minh",
    is_default: true,
    create_at: "2023-01-01T00:00:00.000000",
    create_by: "user",
    update_at: null,
    update_by: null,
  },
  {
    id: 2,
    user_id: 1,
    city: "TP.HCM",
    district: "Quận 1",
    province: "Hồ Chí Minh",
    is_default: false,
    create_at: "2023-02-01T00:00:00.000000",
    create_by: "user",
    update_at: null,
    update_by: null,
  },
  {
    id: 3,
    user_id: 2,
    city: "TP.HCM",
    district: "Quận 1",
    province: "Hồ Chí Minh",
    is_default: true,
    create_at: "2023-01-15T00:00:00.000000",
    create_by: "user",
    update_at: null,
    update_by: null,
  },
]

// Banned user for overdue books
export const mockBannedUser = {
  id: 2,
  email: "banned@example.com",
  full_name: "Trần Văn B",
  phone: "0987654321",
  gender: "MALE",
  age: 25,
  role_id: 2, // Regular user role
  status: "INACTIVE", // Banned status
  addresses: mockAddresses.filter((address) => address.user_id === 2),
}

// Điều chỉnh cấu trúc mockOrders để phù hợp với schema database
export const mockOrders = [
  {
    id: 100001,
    user_id: 1,
    address_id: 1,
    deposit_price: 460000,
    total_price: 80000,
    due_date: "2023-06-29T10:30:00.000000",
    return_date: "2023-06-28T14:45:00.000000",
    rental_date: "2023-06-15T10:30:00.000000",
    late_fee: 0,
    notes: "Tôi sẽ đến lấy sách vào buổi chiều.",
    order_status: "RETURNED", // Thay đổi từ "Returned" sang "RETURNED"
    payment_method: "CASH", // Thay đổi từ "Cash" sang "CASH"
    payment_status: "PAID", // Thay đổi từ "Paid" sang "PAID"
    create_at: "2023-06-15T10:30:00.000000",
    create_by: "user",
    update_at: "2023-06-28T14:45:00.000000",
    update_by: "user",
    items: [
      {
        id: 1,
        order_id: 100001,
        product_detail_id: 1,
        quantity: 1,
        discount: 0,
        total_price: 25000,
        book_title: "Nhà Giả Kim", // Thêm để hiển thị UI
        status: "RETURNED", // Thêm để hiển thị UI
      },
      {
        id: 2,
        order_id: 100001,
        product_detail_id: 5,
        quantity: 1,
        discount: 0,
        total_price: 25000,
        book_title: "Người Giàu Có Nhất Thành Babylon", // Thêm để hiển thị UI
        status: "RETURNED", // Thêm để hiển thị UI
      },
      {
        id: 3,
        order_id: 100001,
        product_detail_id: 9,
        quantity: 1,
        discount: 0,
        total_price: 30000,
        book_title: "Đời Ngắn Đừng Ngủ Dài", // Thêm để hiển thị UI
        status: "RETURNED", // Thêm để hiển thị UI
      },
    ],
  },
  {
    id: 100002,
    user_id: 1,
    address_id: 2,
    deposit_price: 490000,
    total_price: 86000,
    due_date: "2023-07-24T09:15:00.000000",
    return_date: null,
    rental_date: "2023-07-10T09:15:00.000000",
    late_fee: 0,
    notes: "",
    order_status: "APPROVED", // Thay đổi từ "Active" sang "APPROVED"
    payment_method: "CARD", // Thay đổi từ "BankTransfer" sang "CARD"
    payment_status: "PAID",
    create_at: "2023-07-10T09:15:00.000000",
    create_by: "user",
    update_at: null,
    update_by: null,
    items: [
      {
        id: 4,
        order_id: 100002,
        product_detail_id: 2,
        quantity: 1,
        discount: 5,
        total_price: 30000,
        book_title: "Đắc Nhân Tâm", // Thêm để hiển thị UI
        status: "APPROVED", // Thêm để hiển thị UI
      },
      {
        id: 5,
        order_id: 100002,
        product_detail_id: 7,
        quantity: 1,
        discount: 0,
        total_price: 26000,
        book_title: "Bí Mật Của May Mắn", // Thêm để hiển thị UI
        status: "APPROVED", // Thêm để hiển thị UI
      },
      {
        id: 6,
        order_id: 100002,
        product_detail_id: 12,
        quantity: 1,
        discount: 0,
        total_price: 30000,
        book_title: "Khéo Ăn Nói Sẽ Có Được Thiên Hạ", // Thêm để hiển thị UI
        status: "APPROVED", // Thêm để hiển thị UI
      },
    ],
  },
  {
    id: 100003,
    user_id: 1,
    address_id: 1,
    deposit_price: 310000,
    total_price: 55000,
    due_date: "2023-06-03T14:00:00.000000",
    return_date: "2023-06-05T11:30:00.000000",
    rental_date: "2023-05-20T14:00:00.000000",
    late_fee: 10000,
    notes: "",
    order_status: "RETURNED",
    payment_method: "MOMO", // Thay đổi từ "EWallet" sang "MOMO"
    payment_status: "PAID",
    create_at: "2023-05-20T14:00:00.000000",
    create_by: "user",
    update_at: "2023-06-05T11:30:00.000000",
    update_by: "user",
    items: [
      {
        id: 7,
        order_id: 100003,
        product_detail_id: 3,
        quantity: 1,
        discount: 0,
        total_price: 28000,
        book_title: "Tôi Tài Giỏi, Bạn Cũng Thế", // Thêm để hiển thị UI
        status: "RETURNED", // Thêm để hiển thị UI
      },
      {
        id: 8,
        order_id: 100003,
        product_detail_id: 10,
        quantity: 1,
        discount: 0,
        total_price: 27000,
        book_title: "Cà Phê Cùng Tony", // Thêm để hiển thị UI
        status: "RETURNED", // Thêm để hiển thị UI
      },
    ],
  },
  {
    id: 100004,
    user_id: 1,
    address_id: 2,
    deposit_price: 350000,
    total_price: 65000,
    due_date: "2023-08-19T16:45:00.000000",
    return_date: null,
    rental_date: "2023-08-05T16:45:00.000000",
    late_fee: 0,
    notes: "Hủy đơn hàng do không thể nhận sách vào thời gian này.",
    order_status: "REJECTED", // Thay đổi từ "Cancelled" sang "REJECTED"
    payment_method: "CASH",
    payment_status: "UNPAID", // Thay đổi từ "Refunded" sang "UNPAID"
    create_at: "2023-08-05T16:45:00.000000",
    create_by: "user",
    update_at: "2023-08-06T10:00:00.000000",
    update_by: "admin",
    items: [
      {
        id: 9,
        order_id: 100004,
        product_detail_id: 4,
        quantity: 1,
        discount: 10,
        total_price: 35000,
        book_title: "Sapiens: Lược Sử Loài Người", // Thêm để hiển thị UI
        status: "REJECTED", // Thêm để hiển thị UI
      },
      {
        id: 10,
        order_id: 100004,
        product_detail_id: 14,
        quantity: 1,
        discount: 0,
        total_price: 30000,
        book_title: "Điểm Đến Của Cuộc Đời", // Thêm để hiển thị UI
        status: "REJECTED", // Thêm để hiển thị UI
      },
    ],
  },
  // Đơn hàng quá hạn
  {
    id: 100005,
    user_id: 2,
    address_id: 3,
    deposit_price: 340000,
    total_price: 58000,
    due_date: "2023-04-24T11:30:00.000000",
    return_date: null,
    rental_date: "2023-04-10T11:30:00.000000",
    late_fee: 120000,
    notes: "",
    order_status: "APPROVED", // Đơn hàng đã được xác nhận nhưng chưa trả
    payment_method: "CASH",
    payment_status: "PAID",
    create_at: "2023-04-10T11:30:00.000000",
    create_by: "user",
    update_at: null,
    update_by: null,
    items: [
      {
        id: 11,
        order_id: 100005,
        product_detail_id: 6,
        quantity: 1,
        discount: 0,
        total_price: 28000,
        book_title: "Dám Nghĩ Lớn", // Thêm để hiển thị UI
        status: "APPROVED", // Thêm để hiển thị UI
      },
      {
        id: 12,
        order_id: 100005,
        product_detail_id: 11,
        quantity: 1,
        discount: 0,
        total_price: 30000,
        book_title: "Tư Duy Phản Biện", // Thêm để hiển thị UI
        status: "APPROVED", // Thêm để hiển thị UI
      },
    ],
  },
]

// Thêm bảng subscribes để lưu thông tin đăng ký nhận thông báo
export const mockSubscribes = [
  {
    id: 1,
    email: "subscriber@example.com",
    full_name: "Người Đăng Ký",
    name_authors: "Paulo Coelho",
    name_category: "Văn học",
    hot_books: true,
    promotions: true,
  },
]

// Popular search terms for search recommendations
export const popularSearchTerms = [
  "Đắc nhân tâm",
  "Nhà giả kim",
  "Tư duy phản biện",
  "Kỹ năng sống",
  "Paulo Coelho",
  "Dale Carnegie",
  "Sách kinh tế",
  "Sách văn học",
  "Sách thiếu nhi",
  "Sách ngoại ngữ",
  "Sách mới nhất",
  "Sách bán chạy",
  "Sách giảm giá",
  "Sách tâm lý",
  "Sách phát triển bản thân",
]

// AI Book Recommendations based on user behavior
export const aiRecommendations = {
  // For users interested in self-help books
  selfHelp: [2, 3, 6, 7, 11, 12],
  // For users interested in fiction
  fiction: [1, 8, 14],
  // For users interested in business/economics
  business: [5, 13, 15, 16],
  // For users interested in history/science
  science: [4],
  // For new users (general recommendations)
  general: [1, 2, 5, 9, 10],
}

// Thêm dữ liệu mockUsers để hỗ trợ lịch sử thuê sách
export const mockUsers = [
  {
    id: 1,
    full_name: "Nguyễn Văn A",
    email: "user@example.com",
    password: "hashed_password",
    avatar: null,
    gender: "MALE",
    age: 30,
    active: true,
    status: "ACTIVE",
    refresh_token: null,
    role_id: 2,
    create_at: "2023-01-01T00:00:00.000000",
    create_by: "system",
    update_at: null,
    update_by: null,
  },
  {
    id: 2,
    full_name: "Trần Văn B",
    email: "banned@example.com",
    password: "hashed_password",
    avatar: null,
    gender: "MALE",
    age: 25,
    active: false,
    status: "INACTIVE",
    refresh_token: null,
    role_id: 2,
    create_at: "2023-01-01T00:00:00.000000",
    create_by: "system",
    update_at: null,
    update_by: null,
  }
]

// Thêm mockRentalOrders để hỗ trợ chức năng lịch sử thuê sách
export const mockRentalOrders = [
  {
    id: 100001,
    user_id: 1,
    address_id: 1,
    deposit_price: 460000,
    total_price: 80000,
    due_date: "2023-06-29T10:30:00.000000",
    return_date: "2023-06-28T14:45:00.000000",
    rental_date: "2023-06-15T10:30:00.000000",
    late_fee: 0,
    notes: "Tôi sẽ đến lấy sách vào buổi chiều.",
    order_status: "RETURNED",
    payment_method: "CASH",
    payment_status: "PAID",
    create_at: "2023-06-15T10:30:00.000000",
    create_by: "user",
    update_at: "2023-06-28T14:45:00.000000",
    update_by: "user",
  },
  {
    id: 100002,
    user_id: 1,
    address_id: 2,
    deposit_price: 490000,
    total_price: 86000,
    due_date: "2023-07-24T09:15:00.000000",
    return_date: null,
    rental_date: "2023-07-10T09:15:00.000000",
    late_fee: 0,
    notes: "",
    order_status: "APPROVED",
    payment_method: "CARD",
    payment_status: "PAID",
    create_at: "2023-07-10T09:15:00.000000",
    create_by: "user",
    update_at: null,
    update_by: null,
  },
  {
    id: 100003,
    user_id: 1,
    address_id: 1,
    deposit_price: 310000,
    total_price: 55000,
    due_date: "2023-06-03T14:00:00.000000",
    return_date: "2023-06-05T11:30:00.000000",
    rental_date: "2023-05-20T14:00:00.000000",
    late_fee: 10000,
    notes: "",
    order_status: "RETURNED",
    payment_method: "MOMO",
    payment_status: "PAID",
    create_at: "2023-05-20T14:00:00.000000",
    create_by: "user",
    update_at: "2023-06-05T11:30:00.000000",
    update_by: "user",
  },
]

// Thêm mockRentalItems để hỗ trợ chức năng lịch sử thuê sách
export const mockRentalItems = [
  {
    id: 1,
    order_id: 100001,
    product_detail_id: 1, // Nhà Giả Kim
    quantity: 1,
    discount: 0,
    total_price: 25000,
    create_at: "2023-06-15T10:30:00.000000",
    create_by: "user",
    update_at: null,
    update_by: null,
  },
  {
    id: 2,
    order_id: 100001,
    product_detail_id: 5, // Người Giàu Có Nhất Thành Babylon
    quantity: 1,
    discount: 0,
    total_price: 25000,
    create_at: "2023-06-15T10:30:00.000000",
    create_by: "user",
    update_at: null,
    update_by: null,
  },
  {
    id: 3,
    order_id: 100001,
    product_detail_id: 9, // Đời Ngắn Đừng Ngủ Dài
    quantity: 1,
    discount: 0,
    total_price: 30000,
    create_at: "2023-06-15T10:30:00.000000",
    create_by: "user",
    update_at: null,
    update_by: null,
  },
  {
    id: 4,
    order_id: 100002,
    product_detail_id: 2, // Đắc Nhân Tâm
    quantity: 1,
    discount: 5,
    total_price: 30000,
    create_at: "2023-07-10T09:15:00.000000",
    create_by: "user",
    update_at: null,
    update_by: null,
  },
  {
    id: 5,
    order_id: 100002,
    product_detail_id: 7, // Bí Mật Của May Mắn
    quantity: 1,
    discount: 0,
    total_price: 26000,
    create_at: "2023-07-10T09:15:00.000000",
    create_by: "user",
    update_at: null,
    update_by: null,
  },
  {
    id: 6,
    order_id: 100003,
    product_detail_id: 3, // Tôi Tài Giỏi, Bạn Cũng Thế
    quantity: 1,
    discount: 0,
    total_price: 28000,
    create_at: "2023-05-20T14:00:00.000000",
    create_by: "user",
    update_at: null,
    update_by: null,
  },
  {
    id: 7,
    order_id: 100003,
    product_detail_id: 10, // Cà Phê Cùng Tony
    quantity: 1,
    discount: 0,
    total_price: 27000,
    create_at: "2023-05-20T14:00:00.000000",
    create_by: "user",
    update_at: null,
    update_by: null,
  },
]

// Thêm dữ liệu đánh giá sách
export const mockReviews = [
  {
    id: 1,
    book_id: 1, // Nhà Giả Kim
    user_id: 1,
    rating: 5,
    comment: "Một cuốn sách tuyệt vời, đã thay đổi cách nhìn của tôi về cuộc sống.",
    created_at: "2023-06-30T15:45:00.000000",
  },
  {
    id: 2,
    book_id: 1,
    user_id: 2,
    rating: 4,
    comment: "Sách hay, đáng để đọc nhiều lần.",
    created_at: "2023-07-05T10:20:00.000000",
  },
  {
    id: 3,
    book_id: 2, // Đắc Nhân Tâm
    user_id: 1,
    rating: 5,
    comment: "Sách rất giá trị, đã giúp tôi cải thiện kỹ năng giao tiếp.",
    created_at: "2023-07-15T14:30:00.000000",
  },
]

// Thêm dữ liệu trains để hỗ trợ gợi ý sách
export const mockTrains = [
  {
    id: 1,
    age: "18-25",
    category: "Kinh tế",
    name_authors: "Robert Kiyosaki",
    gender: "MALE"
  },
  {
    id: 2,
    age: "26-35",
    category: "Văn học",
    name_authors: "Paulo Coelho",
    gender: "FEMALE"
  },
  {
    id: 3,
    age: "18-25",
    category: "Kỹ năng sống",
    name_authors: "Dale Carnegie",
    gender: "MALE"
  },
  {
    id: 4,
    age: "36-45",
    category: "Kinh tế",
    name_authors: "T. Harv Eker",
    gender: "FEMALE"
  },
]
