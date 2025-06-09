import axios from "axios";

const BASEURL = 'http://localhost:8080/api/v1'

export async function allAuthorGet(){
  const res = await axios.get(`${BASEURL}/author/all?page=0&size=100&sortDir=asc`)
  return res.data.data.content
}

export async function updateAuthorPut(authorId, authorData, token) {
  await axios.put(`${BASEURL}/author/update/${authorId}`,
    authorData,
    {
      headers: {
        Authorization: token
      }
    }
  )
}

export async function createAuthorPost(authorData, token) {
  await axios.post(`${BASEURL}/author/create`,
    authorData,
    {
      headers: {
        Authorization: token
      }
    }
  )
}

export async function deleteAuthorPut(authorId, token) {
  await axios.put(`${BASEURL}/author/delete`,
    {
      idList: [authorId]
    },
    {
      headers: {
        Authorization: token
      }
    }
  )
}
