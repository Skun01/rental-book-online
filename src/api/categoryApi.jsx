import axios from "axios";

const BASEURL = 'http://localhost:8080/api/v1'

export async function allCategoryGet(){
  const res = await axios.get(`${BASEURL}/category/all?page=0&size=100&sortDir=asc`)
  return res.data.data.content
}

export async function updateCategoryPut(categoryId, categoryName, token){
  await axios.put(`${BASEURL}/category/update/${categoryId}`,
    {
      id: +categoryId,
      name: categoryName
    },
    {
      headers: {
        Authorization: token
      }
    }
  )
}

export async function createCategoryPost(categoryName, token){
  await axios.post(`${BASEURL}/category/create`,
    {
      name: categoryName
    },
    {
      headers: {
        Authorization: token
      }
    }
  )
}

export async function deleteCategoryPut(categoryId, token){
  await axios.delete(`${BASEURL}/category/delete`,
    {
      idList: [categoryId]
    },
    {
      headers: {
        Authorization: token
      }
    }
  )
}
