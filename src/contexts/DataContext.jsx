import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'
import { useAuth } from './AuthContext'

const DataContext = createContext()

export function DataProvider({ children }) {
  const { isAuthenticated } = useAuth()

  const getLocal = (key) => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  }

  const [siswa, setSiswa]         = useState(() => getLocal('simbk_cache_siswa') || [])
  const [sessions, setSessions]   = useState(() => getLocal('simbk_cache_sessions') || [])
  const [kasus, setKasus]         = useState(() => getLocal('simbk_cache_kasus') || [])
  const [schedules, setSchedules] = useState(() => getLocal('simbk_cache_schedules') || [])
  const [dataLoading, setDataLoading] = useState(false)

  // Assessment results — now loaded from DB, with localStorage as fallback cache
  const [akpdResult, setAkpdResultState]           = useState(() => getLocal('simbk_data_akpd_result'))
  const [gayaBelajarResult, setGayaBelajarResultState] = useState(() => getLocal('simbk_data_gaya-belajar_result'))
  const [kecerdasanResult, setKecerdasanResultState]   = useState(() => getLocal('simbk_data_kecerdasan_result'))
  const [kepribadianResult, setKepribadianResultState] = useState(() => getLocal('simbk_data_kepribadian_result'))
  const [bakatMinatResult, setBakatMinatResultState]   = useState(() => getLocal('simbk_data_bakat-minat_result'))

  // Saved reports — now from DB
  const [savedReports, setSavedReports] = useState([])

  // Previous-month stats for dashboard change calculation
  const [prevMonthStats, setPrevMonthStats] = useState(getLocal('simbk_prev_stats') || null)

  // ── Fetch all data from API when authenticated ───────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return

    setDataLoading(true)
    Promise.allSettled([
      api.get('/students'),
      api.get('/sessions'),
      api.get('/kasus'),
      api.get('/schedules'),
      api.get('/assessment-results'),
      api.get('/saved-reports'),
    ]).then((results) => {
      const [sRes, sesRes, kRes, scRes, asRes, rpRes] = results

      if (sRes.status === 'fulfilled') setSiswa(sRes.value.data)
      if (sesRes.status === 'fulfilled') setSessions(sesRes.value.data.map(s => ({...s, siswa: s.student?.nama || s.siswa})))
      if (kRes.status === 'fulfilled') setKasus(kRes.value.data.map(k => ({...k, siswa: k.student?.nama || k.siswa})))
      if (scRes.status === 'fulfilled') setSchedules(scRes.value.data)

      // Load assessment results from DB
      if (asRes.status === 'fulfilled' && asRes.value.data) {
        const d = asRes.value.data
        if (d['akpd'])        { setAkpdResultState(d['akpd']); localStorage.setItem('simbk_data_akpd_result', JSON.stringify(d['akpd'])) }
        if (d['gaya-belajar']){ setGayaBelajarResultState(d['gaya-belajar']); localStorage.setItem('simbk_data_gaya-belajar_result', JSON.stringify(d['gaya-belajar'])) }
        if (d['kecerdasan'])  { setKecerdasanResultState(d['kecerdasan']); localStorage.setItem('simbk_data_kecerdasan_result', JSON.stringify(d['kecerdasan'])) }
        if (d['kepribadian']) { setKepribadianResultState(d['kepribadian']); localStorage.setItem('simbk_data_kepribadian_result', JSON.stringify(d['kepribadian'])) }
        if (d['bakat-minat']) { setBakatMinatResultState(d['bakat-minat']); localStorage.setItem('simbk_data_bakat-minat_result', JSON.stringify(d['bakat-minat'])) }
      }

      // Load saved reports from DB
      if (rpRes.status === 'fulfilled') setSavedReports(rpRes.value.data)

    }).finally(() => setDataLoading(false))
  }, [isAuthenticated])

  // Cache core API data in localStorage for offline/reload speed
  useEffect(() => {
    if (siswa.length > 0) localStorage.setItem('simbk_cache_siswa', JSON.stringify(siswa))
    if (sessions.length > 0) localStorage.setItem('simbk_cache_sessions', JSON.stringify(sessions))
    if (kasus.length > 0) localStorage.setItem('simbk_cache_kasus', JSON.stringify(kasus))
    if (schedules.length > 0) localStorage.setItem('simbk_cache_schedules', JSON.stringify(schedules))
  }, [siswa, sessions, kasus, schedules])

  // ── Assessment setters — persist to DB + localStorage ───────────────────
  const saveAssessmentResult = useCallback(async (type, data) => {
    try {
      await api.post(`/assessment-results/${type}`, { result_data: data })
    } catch (e) {
      console.warn('Gagal simpan asesmen ke server, tersimpan lokal saja.', e)
    }
    localStorage.setItem(`simbk_data_${type}_result`, JSON.stringify(data))
  }, [])

  const setAkpdResult = useCallback(async (data) => {
    setAkpdResultState(data)
    await saveAssessmentResult('akpd', data)
  }, [saveAssessmentResult])

  const setGayaBelajarResult = useCallback(async (data) => {
    setGayaBelajarResultState(data)
    await saveAssessmentResult('gaya-belajar', data)
  }, [saveAssessmentResult])

  const setKecerdasanResult = useCallback(async (data) => {
    setKecerdasanResultState(data)
    await saveAssessmentResult('kecerdasan', data)
  }, [saveAssessmentResult])

  const setKepribadianResult = useCallback(async (data) => {
    setKepribadianResultState(data)
    await saveAssessmentResult('kepribadian', data)
  }, [saveAssessmentResult])

  const setBakatMinatResult = useCallback(async (data) => {
    setBakatMinatResultState(data)
    await saveAssessmentResult('bakat-minat', data)
  }, [saveAssessmentResult])

  // ── STUDENT MUTATIONS ────────────────────────────────────────────────────
  const addStudent = useCallback(async (form) => {
    const res = await api.post('/students', form)
    setSiswa(prev => [res.data, ...prev])
    return res.data
  }, [])

  const bulkAddStudents = useCallback(async (studentsArr) => {
    await api.post('/students/bulk', { students: studentsArr })
    const res = await api.get('/students')
    setSiswa(res.data)
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
    const results = await Promise.allSettled(ids.map(id => api.delete(`/students/${id}`)))
    const successfulIds = ids.filter((_, index) => results[index].status === 'fulfilled')
    setSiswa(prev => prev.filter(s => !successfulIds.includes(s.id)))
    if (successfulIds.length !== ids.length) {
      throw new Error('Beberapa data gagal dihapus')
    }
  }, [])

  // ── SESSION MUTATIONS ────────────────────────────────────────────────────
  const addSession = useCallback(async (form) => {
    const res = await api.post('/sessions', form)
    const newSession = {...res.data, siswa: form.siswa || res.data.student?.nama}
    setSessions(prev => [newSession, ...prev])
    return newSession
  }, [])

  const updateSession = useCallback(async (id, form) => {
    const res = await api.put(`/sessions/${id}`, form)
    const updated = {...res.data, siswa: form.siswa || res.data.student?.nama}
    setSessions(prev => prev.map(s => s.id === id ? updated : s))
    return updated
  }, [])

  const deleteSession = useCallback(async (id) => {
    await api.delete(`/sessions/${id}`)
    setSessions(prev => prev.filter(s => s.id !== id))
  }, [])

  // ── KASUS MUTATIONS ──────────────────────────────────────────────────────
  const addKasus = useCallback(async (form) => {
    const res = await api.post('/kasus', form)
    const newKasus = {...res.data, siswa: form.siswa || res.data.student?.nama}
    setKasus(prev => [newKasus, ...prev])
    return newKasus
  }, [])

  const updateKasus = useCallback(async (id, form) => {
    const res = await api.put(`/kasus/${id}`, form)
    const updated = {...res.data, siswa: form.siswa || res.data.student?.nama}
    setKasus(prev => prev.map(k => k.id === id ? updated : k))
    return updated
  }, [])

  const deleteKasus = useCallback(async (id) => {
    await api.delete(`/kasus/${id}`)
    setKasus(prev => prev.filter(k => k.id !== id))
  }, [])

  // ── SCHEDULE MUTATIONS ───────────────────────────────────────────────────
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

  // ── SAVED REPORTS MUTATIONS ──────────────────────────────────────────────
  const saveReport = useCallback(async (reportData) => {
    const res = await api.post('/saved-reports', reportData)
    setSavedReports(prev => [res.data, ...prev])
    return res.data
  }, [])

  const deleteReport = useCallback(async (id) => {
    await api.delete(`/saved-reports/${id}`)
    setSavedReports(prev => prev.filter(r => r.id !== id))
  }, [])

  return (
    <DataContext.Provider value={{
      // State
      siswa, sessions, kasus, schedules, dataLoading,
      savedReports,
      akpdResult, setAkpdResult,
      gayaBelajarResult, setGayaBelajarResult,
      kecerdasanResult, setKecerdasanResult,
      kepribadianResult, setKepribadianResult,
      bakatMinatResult, setBakatMinatResult,
      // Student
      addStudent, bulkAddStudents, updateStudent, deleteStudent, bulkDeleteStudents,
      // Session
      addSession, updateSession, deleteSession,
      // Kasus
      addKasus, updateKasus, deleteKasus,
      // Schedule
      addSchedule, updateSchedule, deleteSchedule,
      // Reports
      saveReport, deleteReport,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
