import axios from 'axios'

const BASEURL = 'http://localhost:8080/api/v1'

export async function allReturnOrderGet(){
  const res = await axios.get(`${BASEURL}/order/rented/all?page=0&size=1000&sortDir=asc`)
  return res.data.data.content
}

export async function updateOrderStatusPut(orderId, newStatus){
  await axios.put(`${BASEURL}/order/rented/update/${orderId}?newStatus=${newStatus}`)
}