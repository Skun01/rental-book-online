import axios from "axios";

const BASEURL = 'http://localhost:8080/api/v1'

export async function allAuthorGet(){
  const res = await axios.get(`${BASEURL}/author/all?page=0&size=100&sortDir=asc`)
  return res.data.data.content
}