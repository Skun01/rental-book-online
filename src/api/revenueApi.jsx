import axios from 'axios'

const BASEURL = 'http://localhost:8080/api/v1'

export async function getRevenueGet(){
  const res = await axios.get(`${BASEURL}/revenue/all`)
  return res.data.data[0]
}