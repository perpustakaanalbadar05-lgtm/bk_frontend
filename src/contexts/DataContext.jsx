import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/axios'
import { useAuth } from './AuthContext'

const DataContext = createContext()

const INITIAL_SESSIONS = [
  { id: 1, siswa: 'Ahmad Fauzi', kelas: 'XI IPA 2', tanggal: '11 Mei 2026', topik: 'Masalah Belajar', jenis: 'Individu', status: 'Selesai', durasi: '45 mnt', signature: true },
  { id: 2, siswa: 'Siti Rahma', kelas: 'X IPS 1', tanggal: '11 Mei 2026', topik: 'Karir & Studi Lanjut', jenis: 'Individu', status: 'Proses', durasi: '30 mnt', signature: false },
  { id: 3, siswa: 'Kelas X IPA 1', kelas: 'X IPA 1', tanggal: '10 Mei 2026', topik: 'Orientasi BK', jenis: 'Kelompok', status: 'Selesai', durasi: '60 mnt', signature: true },
  { id: 4, siswa: 'Dewi Lestari', kelas: 'XI IPS 3', tanggal: '12 Mei 2026', topik: 'Pribadi & Keluarga', jenis: 'Individu', status: 'Terjadwal', durasi: '-', signature: false },
  { id: 5, siswa: 'Riko Prasetyo', kelas: 'X IPA 1', tanggal: '09 Mei 2026', topik: 'Motivasi Belajar', jenis: 'Individu', status: 'Selesai', durasi: '40 mnt', signature: true },
]

const INITIAL_KASUS = [
  { id: 1, siswa: 'Ahmad Fauzi', kelas: 'XI IPA 2', kasus: 'Sering membolos (Alpa > 3x)', poin: 20, status: 'Selesai', visit: true, date: '11 Mei 2026' },
  { id: 2, siswa: 'Budi Santoso', kelas: 'XII IPA 1', kasus: 'Berkelahi di lingkungan sekolah', poin: 50, status: 'Proses', visit: false, date: '10 Mei 2026' },
  { id: 3, siswa: 'Riko Prasetyo', kelas: 'X IPA 1', kasus: 'Merokok di kantin', poin: 30, status: 'Proses', visit: true, date: '08 Mei 2026' },
  { id: 4, siswa: 'Dewi Lestari', kelas: 'XI IPS 3', kasus: 'Terlambat lebih dari 5 kali', poin: 10, status: 'Terjadwal', visit: true, date: '12 Mei 2026' },
]

const INITIAL_SCHEDULES = [
  { id: 1, class: 'XI IPA 2', topic: 'Strategi Sukses Ujian', time: 'Senin, 08:00', status: 'Selesai', attended: 32, total: 34 },
  { id: 2, class: 'X IPS 1', topic: 'Bahaya Bullying', time: 'Selasa, 10:30', status: 'Berlangsung', attended: 0, total: 36 },
  { id: 3, class: 'XII IPA 1', topic: 'Orientasi Perguruan Tinggi', time: 'Rabu, 13:00', status: 'Terjadwal', attended: 0, total: 35 },
]

export function DataProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [siswa, setSiswa] = useState([])

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('simbk_data_sessions')
    return saved ? JSON.parse(saved) : INITIAL_SESSIONS
  })

  const [kasus, setKasus] = useState(() => {
    const saved = localStorage.getItem('simbk_data_kasus')
    return saved ? JSON.parse(saved) : INITIAL_KASUS
  })

  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('simbk_data_schedules')
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES
  })

  const [akpdResult, setAkpdResult] = useState(() => {
    const saved = localStorage.getItem('simbk_data_akpd_result')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/students').then(res => setSiswa(res.data)).catch(console.error)
      api.get('/sessions').then(res => setSessions(res.data)).catch(console.error)
      api.get('/kasus').then(res => setKasus(res.data)).catch(console.error)
      api.get('/schedules').then(res => setSchedules(res.data)).catch(console.error)
    }
  }, [isAuthenticated])

  useEffect(() => {
    localStorage.setItem('simbk_data_sessions', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    localStorage.setItem('simbk_data_kasus', JSON.stringify(kasus))
  }, [kasus])

  useEffect(() => {
    localStorage.setItem('simbk_data_schedules', JSON.stringify(schedules))
  }, [schedules])

  useEffect(() => {
    localStorage.setItem('simbk_data_akpd_result', JSON.stringify(akpdResult))
  }, [akpdResult])

  return (
    <DataContext.Provider value={{
      siswa, setSiswa,
      sessions, setSessions,
      kasus, setKasus,
      schedules, setSchedules,
      akpdResult, setAkpdResult
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
