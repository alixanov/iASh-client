import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Admin, Salesman,Seller} from "../"


const Main = () => {
  const token = localStorage.getItem("token")
  const [role, setRole] = useState("")
  useEffect(() => {
    axios.get("http://localhost:3006/api/getRole", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setRole(res.data.role)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])
  return (
    <>
      {
        role === "admin" ? (<Admin />) : <Salesman/>
      }
    </>
  )
}

export default Main
