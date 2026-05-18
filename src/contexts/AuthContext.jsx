import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('simbk_user')
      const savedToken = localStorage.getItem('simbk_token')
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser))
      }
    } catch (err) {
      console.warn("Gagal parse local storage data:", err)
      localStorage.removeItem('simbk_user')
      localStorage.removeItem('simbk_token')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    try {
      // Real backend attempt
      const response = await api.post('/auth/login', credentials)
      const { token, user } = response.data
      localStorage.setItem('simbk_token', token)
      localStorage.setItem('simbk_user', JSON.stringify(user))
      setUser(user)
      return user
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (_) {}
    localStorage.removeItem('simbk_token')
    localStorage.removeItem('simbk_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
