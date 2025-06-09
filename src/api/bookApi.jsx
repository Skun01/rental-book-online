import axios from "axios";

const BASEURL = 'http://localhost:8080/api/v1'
export async function getTotalBook(){
  const res = await axios.get(`${BASEURL}/book/quantity/active`)
  return res.data.data
}

export async function allBookGet(apiUrl){
  const res = await axios.get(`${BASEURL}${apiUrl}`)
  return res.data.data.result.content
}

export async function bookDelete(bookId){
  await axios.put(`${BASEURL}/book/delete?booksId=${bookId}`)
}

export async function updateBookPut(bookData, bookId){
  await axios.put(`${BASEURL}/book/update/${bookId}`,
    bookData
  )
}

export async function createBookPost(bookData){
  await axios.post(`${BASEURL}/book/create`,
    bookData
  )
}

export async function booksByCategoryIdGet(categoryId){
  const res = await axios.get(`${BASEURL}/book/all?page=0&size=100&sortDir=asc&categoryId=${categoryId}`)
  return res.data.data.result.content
}
