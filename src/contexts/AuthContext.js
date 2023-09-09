import { createContext } from 'react'
export const AuthContext = createContext('')
export const initialAuthState = {
  isAutheticated: localStorage.getItem('platform_token') !== null,
  user: JSON.parse(localStorage.getItem('user')),
  platform_token: localStorage.getItem('platform_token'),
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload.data.object))
      localStorage.setItem('platform_token', action.payload.data.token)
      return {
        ...state,
        isAutheticated: true,
        user: action.payload.user,
        platform_token: action.payload.platform_token,
      }
    case 'LOGOUT':
      localStorage.clear()
      return { ...state, isAutheticated: false, user: null, platform_token: null }
    default:
      return state
  }
}
