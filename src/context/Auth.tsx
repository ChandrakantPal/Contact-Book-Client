import jwt_decode, { JwtPayload } from 'jwt-decode'
import { createContext, useContext, useReducer } from 'react'
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
const token = localStorage.getItem('token')
if (token) {
  const decodeToken = jwt_decode<JwtPayload>(token)

  if (decodeToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('token')
  } else {
    initialState.user = decodeToken as User
    initialState.authenticated = true
  }
} else console.log('no token found')

const StateContext = createContext<State>({
  user: null,
  authenticated: false,
})

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
      localStorage.removeItem('token')
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
  const [state, defaultDispatch] = useReducer(authReducer, initialState)

  // useEffect(() => {
  //   const decodeToken = jwt_decode<JwtPayload>(localStorage.getItem('token'))
  //   // console.log(decodeToken)

  //   if (decodeToken.exp * 1000 < Date.now()) {
  //     localStorage.removeItem('token')
  //     dispatch('LOGOUT')
  //   } else if (localStorage.getItem('token')) {
  //     dispatch('AUTH_CHECK')
  //   } else {
  //     dispatch('LOGOUT')
  //   }
  // }, [])

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
