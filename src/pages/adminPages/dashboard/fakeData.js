// fakeData.js
export const demoCategories = [
    { id: 1, name: 'Tiểu thuyết', description: 'Sách tiểu thuyết' },
    { id: 2, name: 'Khoa học', description: 'Sách khoa học' },
    { id: 3, name: 'Lịch sử', description: 'Sách lịch sử' }
  ];
  
  export const demoBooks = [
    {
      id: 1,
      name: 'Đắc Nhân Tâm',
      description: 'Cuốn sách nổi tiếng về kỹ năng giao tiếp',
      publisher: 'NXB Tổng hợp',
      publication_year: 2018,
      pages: 320,
      language: 'Tiếng Việt',
      total_quantity: 10,
      available_quantity: 8,
      rental_price: 15000,
      deposit_price: 100000,
      status: 'Available',
      category_id: 1
    },
    {
      id: 2,
      name: 'Vũ trụ trong vỏ hạt dẻ',
      description: 'Sách khoa học về vũ trụ',
      publisher: 'NXB Trẻ',
      publication_year: 2017,
      pages: 250,
      language: 'Tiếng Việt',
      total_quantity: 5,
      available_quantity: 3,
      rental_price: 20000,
      deposit_price: 150000,
      status: 'Available',
      category_id: 2
    },
    {
      id: 3,
      name: 'Lịch sử Việt Nam',
      description: 'Sách về lịch sử Việt Nam từ thời kỳ đầu đến hiện đại',
      publisher: 'NXB Giáo dục',
      publication_year: 2019,
      pages: 400,
      language: 'Tiếng Việt',
      total_quantity: 7,
      available_quantity: 5,
      rental_price: 18000,
      deposit_price: 120000,
      status: 'Available',
      category_id: 3
    },
    {
      id: 4,
      name: 'Nhà giả kim',
      description: 'Cuốn tiểu thuyết nổi tiếng của Paulo Coelho',
      publisher: 'NXB Văn học',
      publication_year: 2016,
      pages: 228,
      language: 'Tiếng Việt',
      total_quantity: 12,
      available_quantity: 9,
      rental_price: 12000,
      deposit_price: 90000,
      status: 'Available',
      category_id: 1
    }
  ];