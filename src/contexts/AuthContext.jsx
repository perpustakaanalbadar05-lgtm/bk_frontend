import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Validate token with server on every app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('simbk_token')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await api.get('/user')
        setUser(res.data)
      } catch {
        // Token invalid or expired — clean up
        localStorage.removeItem('simbk_token')
        localStorage.removeItem('simbk_user')
      } finally {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    const { token, user } = response.data
    localStorage.setItem('simbk_token', token)
    localStorage.setItem('simbk_user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (_) {}
    localStorage.removeItem('simbk_token')
    localStorage.removeItem('simbk_user')
    setUser(null)
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('simbk_user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
