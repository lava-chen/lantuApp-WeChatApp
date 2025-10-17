import { createSlice } from '@reduxjs/toolkit'

interface UserState {
  isLoggedIn: boolean
  openId: string
  unionId?: string
  nickname: string
  avatar: string
  city: string
}

const initialState: UserState = {
  isLoggedIn: false,
  openId: '',
  unionId: '',
  nickname: '澜图用户',
  avatar: 'https://dummyimage.com/120x120/1677ff/ffffff&text=LT',
  city: '成都',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCity(state, action) {
      state.city = action.payload
    },
    login(state, action) {
      state.isLoggedIn = true
      state.openId = action.payload.openId
      state.unionId = action.payload.unionId
      state.nickname = action.payload.nickname || state.nickname
      state.avatar = action.payload.avatar || state.avatar
    },
    updateUserInfo(state, action) {
      if (action.payload.nickname) {
        state.nickname = action.payload.nickname
      }
      if (action.payload.avatar) {
        state.avatar = action.payload.avatar
      }
    },
    logout(state) {
      return initialState
    }
  }
})

export const { setCity, login, updateUserInfo, logout } = userSlice.actions
export default userSlice.reducer
