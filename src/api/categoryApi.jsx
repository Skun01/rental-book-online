import axios from "axios";

const BASEURL = 'http://localhost:8080/api/v1'

export async function allCategoryGet(){
  const res = await axios.get(`${BASEURL}/category/all?page=0&size=10&sortDir=asc`)
  return res.data.data.content
}