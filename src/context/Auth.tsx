import jwtDecode from 'jwt-decode'
import { createContext, useContext, useEffect, useReducer } from 'react'
import { User } from '../types'

interface State {
  authenticated: boolean
  user: User | undefined
}

interface Action {
  type: string
  payload: any
}

const initialState: State = {
  user: null,
  authenticated: false,
}

if (localStorage.getItem('token')) {
  const decodeToken: any = jwtDecode(localStorage.getItem('token'))

  if (decodeToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('token')
  } else {
    initialState.user = decodeToken
    initialState.authenticated = true
  }
}

const StateContext = createContext<State>(initialState)

const DispatchContext = createContext(null)

const authReducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        user: null,
      }
    case 'AUTH_CHECK':
      return {
        ...state,
        authenticated: true,
      }
    default:
      throw new Error(`Unknow action type: ${type}`)
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(authReducer, {
    user: null,
    authenticated: false,
  })

  useEffect(() => {
    const decodeToken: any = jwtDecode(localStorage.getItem('token'))
    if (decodeToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('token')
      dispatch('LOGOUT')
    } else {
      dispatch('AUTH_CHECK')
    }
  }, [])

  const dispatch = (type: string, payload?: any) =>
    defaultDispatch({ type, payload })

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export const useAuthState = () => useContext(StateContext)
export const useAuthDispatch = () => useContext(DispatchContext)
