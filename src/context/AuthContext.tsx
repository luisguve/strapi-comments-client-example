import { createContext, useState, useEffect } from "react"

interface IUser {
  username: string,
  email: string,
  id: string,
  token: string
}

interface IAuthContext {
  user: IUser | null,
  loginUser: (user: IUser) => void,
  logoutUser: () => void
}

const defaultContext = {
  user: null,
  loginUser: (user: IUser) => {},
  logoutUser: () => {}
}

const AuthContext = createContext<IAuthContext>(defaultContext)

export interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = (props: AuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null)

  const loginUser = (user: IUser) => {
    setUser(user)
    saveSession(user)
  }
  const logoutUser = () => {
    cleanupSession()
    setUser(null)
  }
  /**
  * Try to get user data from local storage
  */
  const checkIsLoggedIn = () => {
    const { user } = getSession()
    if (user) {
      setUser(user)
    }
  }
  useEffect(() => {
    checkIsLoggedIn()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        logoutUser
      }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext

const getSession = () => {
  if (typeof(Storage) !== undefined) {
    const rawData = localStorage.getItem("sessionData")
    if (rawData) {
      const parsedData: IUser = JSON.parse(rawData)
      return {
        user: parsedData
      }
    }
  }
  return {}
}
const saveSession = (user: IUser) => {
  if (typeof(Storage) !== undefined) {
    localStorage.setItem("sessionData", JSON.stringify(user))
  }
}
const cleanupSession = () => {
  if (typeof(Storage) !== undefined) {
    localStorage.removeItem("sessionData")
  }
}
