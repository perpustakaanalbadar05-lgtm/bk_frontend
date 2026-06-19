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
        clearAuthAndCache()
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

  const clearAuthAndCache = () => {
    localStorage.removeItem('simbk_token')
    localStorage.removeItem('simbk_user')
    
    // Clear all application cache to prevent data leaks between accounts
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.startsWith('simbk_cache_') || key.startsWith('simbk_data_') || key === 'simbk_prev_stats')) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k))
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (_) {}
    clearAuthAndCache()
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
