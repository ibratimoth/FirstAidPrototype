import { server } from "../../store"
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
//action login
export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: "loginRequest",
        })
        //hitting login api request
        const { data } = await axios.post(`${server}/user/login`, {email, password}, {
            headers: {
                "Content-Type" : "application/json",
            },
        })
        dispatch({
            type: "loginSuccess",
            payload: data,
        })
        await AsyncStorage.setItem("@auth", data?.token)
    } catch (error) {
        dispatch({
            type: "loginFail",
            payload: error.response.data.message
        })
    }
}

// GET USER DATA ACTIONS
export const getUserData = () => async (dispatch) => {
    try {
        dispatch({
            type: 'getUserDataRequest'
        })
        //hitting login api request
        const { data } = await axios.post(`${server}/user/profile`)
        dispatch({
            type: 'getUserDataSuccess',
            payload: data?.user,
        })
    } catch (error) {
        dispatch({
            type: "getUserDataFail",
            payload: error.response.data.message
        })
    }
}

// LOGOUT ACTIONS
export const logout = () => async (dispatch) => {
    try {
        dispatch({
            type: 'logoutRequest'
        })
        //hitting login api request
        const { data } = await axios.get(`${server}/user/logout`)
        dispatch({
            type: 'logoutSuccess',
            payload: data?.message,
        })
    } catch (error) {
        dispatch({
            type: "logoutFail",
            payload: error.response.data?.message
        })
    }
}