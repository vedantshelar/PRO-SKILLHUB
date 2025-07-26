import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './slices/userSlice'

const store = configureStore({
    reducer:{
        userState: userReducer,
    }
})

export default store;