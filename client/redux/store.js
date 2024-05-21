import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './features/auth/userReducer'

export default configureStore({
  reducer: {
    user : userReducer
  },
})

export const server = 'http://192.168.83.231:8080/api/v1'