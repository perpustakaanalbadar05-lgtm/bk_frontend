import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

const DEFAULT_CLASSES = ['X IPA 1', 'X IPA 2', 'X IPS 1', 'XI IPA 1', 'XI IPA 2', 'XI IPS 3', 'XII IPA 1', 'XII IPS 2']

export function SettingsProvider({ children }) {
  const [classes, setClasses] = useState(() => {
    const saved = localStorage.getItem('simbk_classes')
    return saved ? JSON.parse(saved) : DEFAULT_CLASSES
  })

  const [sekolah, setSekolah] = useState(() => {
    const saved = localStorage.getItem('simbk_sekolah')
    return saved ? JSON.parse(saved) : {
      nama: '',
      npsn: '',
      alamat: '',
      kepsek: '',
      nip_kepsek: '',
      logo: null,
      ttd: null,
    }
  })

  useEffect(() => {
    localStorage.setItem('simbk_classes', JSON.stringify(classes))
  }, [classes])

  useEffect(() => {
    localStorage.setItem('simbk_sekolah', JSON.stringify(sekolah))
  }, [sekolah])

  return (
    <SettingsContext.Provider value={{ classes, setClasses, sekolah, setSekolah }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
