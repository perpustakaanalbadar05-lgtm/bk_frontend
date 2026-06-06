import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'
import { useAuth } from './AuthContext'

const DataContext = createContext()

export function DataProvider({ children }) {
  const { isAuthenticated } = useAuth()

  const [siswa, setSiswa]         = useState([])
  const [sessions, setSessions]   = useState([])
  const [kasus, setKasus]         = useState([])
  const [schedules, setSchedules] = useState([])
  const [dataLoading, setDataLoading] = useState(false)

  const getLocal = (key) => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  }

  const [akpdResult, setAkpdResult] = useState(() => getLocal('simbk_data_akpd_result'))
  const [gayaBelajarResult, setGayaBelajarResult] = useState(() => getLocal('simbk_data_gaya-belajar_result'))
  const [kecerdasanResult, setKecerdasanResult] = useState(() => getLocal('simbk_data_kecerdasan_result'))
  const [kepribadianResult, setKepribadianResult] = useState(() => getLocal('simbk_data_kepribadian_result'))
  const [bakatMinatResult, setBakatMinatResult] = useState(() => getLocal('simbk_data_bakat-minat_result'))

  // Fetch all data from API when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setSiswa([]); setSessions([]); setKasus([]); setSchedules([])
      return
    }
    setDataLoading(true)
    Promise.all([
      api.get('/students'),
      api.get('/sessions'),
      api.get('/kasus'),
      api.get('/schedules'),
    ]).then(([s, ses, k, sc]) => {
      setSiswa(s.data)
      setSessions(ses.data)
      setKasus(k.data)
      setSchedules(sc.data)
    }).catch(console.error)
      .finally(() => setDataLoading(false))
  }, [isAuthenticated])

  // Cache siswa ke localStorage agar portal publik bisa akses tanpa auth
  useEffect(() => {
    if (siswa.length > 0) {
      localStorage.setItem('simbk_cache_siswa', JSON.stringify(siswa))
    }
  }, [siswa])

  // Persist akpdResult only (not API data)
  useEffect(() => {
    localStorage.setItem('simbk_data_akpd_result', JSON.stringify(akpdResult))
  }, [akpdResult])

  useEffect(() => {
    localStorage.setItem('simbk_data_gaya-belajar_result', JSON.stringify(gayaBelajarResult))
  }, [gayaBelajarResult])

  useEffect(() => {
    localStorage.setItem('simbk_data_kecerdasan_result', JSON.stringify(kecerdasanResult))
  }, [kecerdasanResult])

  useEffect(() => {
    localStorage.setItem('simbk_data_kepribadian_result', JSON.stringify(kepribadianResult))
  }, [kepribadianResult])

  useEffect(() => {
    localStorage.setItem('simbk_data_bakat-minat_result', JSON.stringify(bakatMinatResult))
  }, [bakatMinatResult])

  // ── STUDENT MUTATIONS ──────────────────────────────────────
  const addStudent = useCallback(async (form) => {
    const res = await api.post('/students', form)
    setSiswa(prev => [res.data, ...prev])
    return res.data
  }, [])

  const updateStudent = useCallback(async (id, form) => {
    const res = await api.put(`/students/${id}`, form)
    setSiswa(prev => prev.map(s => s.id === id ? res.data : s))
    return res.data
  }, [])

  const deleteStudent = useCallback(async (id) => {
    await api.delete(`/students/${id}`)
    setSiswa(prev => prev.filter(s => s.id !== id))
  }, [])

  const bulkDeleteStudents = useCallback(async (ids) => {
    await Promise.all(ids.map(id => api.delete(`/students/${id}`)))
    setSiswa(prev => prev.filter(s => !ids.includes(s.id)))
  }, [])

  // ── SESSION MUTATIONS ──────────────────────────────────────
  const addSession = useCallback(async (form) => {
    const res = await api.post('/sessions', form)
    setSessions(prev => [res.data, ...prev])
    return res.data
  }, [])

  const updateSession = useCallback(async (id, form) => {
    const res = await api.put(`/sessions/${id}`, form)
    setSessions(prev => prev.map(s => s.id === id ? res.data : s))
    return res.data
  }, [])

  const deleteSession = useCallback(async (id) => {
    await api.delete(`/sessions/${id}`)
    setSessions(prev => prev.filter(s => s.id !== id))
  }, [])

  // ── KASUS MUTATIONS ────────────────────────────────────────
  const addKasus = useCallback(async (form) => {
    const res = await api.post('/kasus', form)
    setKasus(prev => [res.data, ...prev])
    return res.data
  }, [])

  const updateKasus = useCallback(async (id, form) => {
    const res = await api.put(`/kasus/${id}`, form)
    setKasus(prev => prev.map(k => k.id === id ? res.data : k))
    return res.data
  }, [])

  const deleteKasus = useCallback(async (id) => {
    await api.delete(`/kasus/${id}`)
    setKasus(prev => prev.filter(k => k.id !== id))
  }, [])

  // ── SCHEDULE MUTATIONS ─────────────────────────────────────
  const addSchedule = useCallback(async (form) => {
    const res = await api.post('/schedules', form)
    setSchedules(prev => [res.data, ...prev])
    return res.data
  }, [])

  const updateSchedule = useCallback(async (id, form) => {
    const res = await api.put(`/schedules/${id}`, form)
    setSchedules(prev => prev.map(s => s.id === id ? res.data : s))
    return res.data
  }, [])

  const deleteSchedule = useCallback(async (id) => {
    await api.delete(`/schedules/${id}`)
    setSchedules(prev => prev.filter(s => s.id !== id))
  }, [])

  return (
    <DataContext.Provider value={{
      // State
      siswa, sessions, kasus, schedules, dataLoading,
      akpdResult, setAkpdResult,
      gayaBelajarResult, setGayaBelajarResult,
      kecerdasanResult, setKecerdasanResult,
      kepribadianResult, setKepribadianResult,
      bakatMinatResult, setBakatMinatResult,
      // Student
      addStudent, updateStudent, deleteStudent, bulkDeleteStudents,
      // Session
      addSession, updateSession, deleteSession,
      // Kasus
      addKasus, updateKasus, deleteKasus,
      // Schedule
      addSchedule, updateSchedule, deleteSchedule,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
