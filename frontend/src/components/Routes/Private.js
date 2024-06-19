import {useState, useEffect}  from "react"
import { useAuth } from "../../context/auth"
import { Outlet } from 'react-router-dom'
import axios from 'axios'
import Spinner from "../Spinner"

export default function PrivateRoute(){
    const [ok , setOk] = useState(false)
    const [auth] = useAuth()

    useEffect(() => {
        const authChek = async() => {
            const res = await axios.get('http://localhost:8082/api/v1/auth/user-auth')
            if (res.data.ok){
                setOk(true)
            }else{
                setOk(false)
            }
        }
        if(auth?.token) authChek();
    }, [auth?.token])

    return ok ? <Outlet/> : <Spinner/>
}