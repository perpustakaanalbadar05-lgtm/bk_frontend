import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext()

const INIT_SISWA = [
  { id: 1, nama: 'Ahmad Fauzi', nis: '2024001', kelas: 'XI IPA 2', jk: 'L', status: 'Aktif', konseling: 3, hp: '081234567890', alamat: 'Jl. Merdeka No. 12, Jakarta' },
  { id: 2, nama: 'Siti Rahma', nis: '2024002', kelas: 'X IPS 1', jk: 'P', status: 'Aktif', konseling: 1, hp: '082345678901', alamat: 'Jl. Sudirman No. 45, Jakarta' },
  { id: 3, nama: 'Budi Santoso', nis: '2024003', kelas: 'XII IPA 1', jk: 'L', status: 'Aktif', konseling: 5, hp: '083456789012', alamat: 'Jl. Gatot Subroto No. 7, Jakarta' },
  { id: 4, nama: 'Dewi Lestari', nis: '2024004', kelas: 'XI IPS 3', jk: 'P', status: 'Perhatian', konseling: 7, hp: '084567890123', alamat: 'Jl. Thamrin No. 3, Jakarta' },
  { id: 5, nama: 'Riko Prasetyo', nis: '2024005', kelas: 'X IPA 1', jk: 'L', status: 'Aktif', konseling: 0, hp: '085678901234', alamat: 'Jl. Kebon Sirih No. 20, Jakarta' },
  { id: 6, nama: 'Fitri Handayani', nis: '2024006', kelas: 'XII IPS 2', jk: 'P', status: 'Perhatian', konseling: 4, hp: '086789012345', alamat: 'Jl. Diponegoro No. 15, Jakarta' },
  { id: 7, nama: 'Hendra Wijaya', nis: '2024007', kelas: 'X IPA 2', jk: 'L', status: 'Aktif', konseling: 2, hp: '087890123456', alamat: 'Jl. Hayam Wuruk No. 8, Jakarta' },
  { id: 8, nama: 'Rina Marlina', nis: '2024008', kelas: 'XI IPA 1', jk: 'P', status: 'Aktif', konseling: 0, hp: '088901234567', alamat: 'Jl. Mangga Dua No. 55, Jakarta' },
]

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
  const [siswa, setSiswa] = useState(() => {
    const saved = localStorage.getItem('simbk_data_siswa')
    return saved ? JSON.parse(saved) : INIT_SISWA
  })

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

  useEffect(() => {
    localStorage.setItem('simbk_data_siswa', JSON.stringify(siswa))
  }, [siswa])

  useEffect(() => {
    localStorage.setItem('simbk_data_sessions', JSON.stringify(sessions))
  }, [sessions])

  useEffect(() => {
    localStorage.setItem('simbk_data_kasus', JSON.stringify(kasus))
  }, [kasus])

  useEffect(() => {
    localStorage.setItem('simbk_data_schedules', JSON.stringify(schedules))
  }, [schedules])

  return (
    <DataContext.Provider value={{
      siswa, setSiswa,
      sessions, setSessions,
      kasus, setKasus,
      schedules, setSchedules
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
