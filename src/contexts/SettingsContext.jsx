import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const SettingsContext = createContext()

const DEFAULT_CLASSES = ['X IPA 1', 'X IPA 2', 'X IPS 1', 'XI IPA 1', 'XI IPA 2', 'XI IPS 3', 'XII IPA 1', 'XII IPS 2']

const DEFAULT_SEKOLAH = {
  nama: '',
  npsn: '',
  alamat: '',
  kepsek: '',
  nip_kepsek: '',
  yayasan: '',
  tahun: '',
  logo: null,
  ttd: null,
}

export function SettingsProvider({ children }) {
  const { user } = useAuth()
  
  const [classes, setClasses] = useState(DEFAULT_CLASSES)
  const [sekolah, setSekolah] = useState(DEFAULT_SEKOLAH)
  
  // Theme is still local (device specific)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('simbk_theme') || 'light'
  })

  // Sync state when user profile changes
  useEffect(() => {
    if (user?.settings) {
      if (user.settings.classes) setClasses(user.settings.classes)
      if (user.settings.sekolah) setSekolah({ ...DEFAULT_SEKOLAH, ...user.settings.sekolah })
    }
  }, [user])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  useEffect(() => {
    localStorage.setItem('simbk_theme', theme)
    const html = document.documentElement
    if (theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [theme])

  return (
    <SettingsContext.Provider value={{ classes, setClasses, sekolah, setSekolah, theme, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
