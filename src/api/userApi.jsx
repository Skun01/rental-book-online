import axios from "axios"

const BASEURL = 'http://localhost:8080/api/v1'
export async function AllUserGet(apiUrl, token) {
  const res = await axios.get(`${BASEURL}${apiUrl}`,
    {
      headers: {
        Authorization: `${token}`
      }
    }
  )
  return res.data.data.content
}

export async function updateUserRolePut(userId, roleId, token){
  await axios.put(`${BASEURL}/user/update/role`,
    {
      userId: userId,
      roleId: roleId,
    },
    {
      headers: {
        Authorization: `${token}`
      }
    }
  )
}

export async function deleteUserDelete(userId, token){
  await axios.delete(`${BASEURL}/user/delete/${userId}`,
    {
      userId: userId,
    },
    {
      headers: {
        Authorization: `${token}`
      }
    }
  )
}

export async function createUserPost(userData, token){
  const res = await axios.post(`${BASEURL}/user/create`,
    userData,
    {
      headers: {
        Authorization: `${token}`
      }
    }
  )
  return res.data.data
}