import axios from "axios";

const BASEURL = 'http://localhost:8080/api/v1'
export async function getTotalBook(){
  const res = await axios.get(`${BASEURL}/book/quantity/active`)
  return res.data.data
}
