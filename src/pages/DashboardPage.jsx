import { useState, useEffect } from 'react'
import {
  RiUserHeartLine, RiHeartLine, RiFileTextLine,
  RiBarChart2Line, RiArrowUpLine, RiArrowDownLine,
  RiCalendarLine, RiAlertLine, RiCheckboxCircleLine,
  RiTimeLine, RiUserAddLine, RiEyeLine,
} from 'react-icons/ri'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend,
} from 'recharts'
import { useData } from '../contexts/DataContext'
import { useNavigate } from 'react-router-dom'
import api from '../lib/axios'


const ALERTS = [
  { text: '5 siswa belum mengisi asesmen AKPD', type: 'warning' },
  { text: 'Program BK Semester 2 hampir berakhir', type: 'info' },
  { text: 'Laporan bulan April siap diunduh', type: 'success' },
]

const STATUS_STYLE = {
  'Selesai': 'badge bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'Proses': 'badge bg-primary-500/20 text-primary-300 border border-primary-500/30',
  'Terjadwal': 'badge bg-amber-500/20 text-amber-300 border border-amber-500/30',
}

const ALERT_STYLE = {
  warning: { cls: 'border-amber-500/30 bg-amber-500/10', icon: RiAlertLine, color: 'text-amber-400' },
  info: { cls: 'border-primary-500/30 bg-primary-500/10', icon: RiTimeLine, color: 'text-primary-400' },
  success: { cls: 'border-teal-500/30 bg-teal-500/10', icon: RiCheckboxCircleLine, color: 'text-teal-400' },
}

export default function DashboardPage() {
  const { siswa, sessions, kasus, schedules, akpdResult, gayaBelajarResult, kecerdasanResult, kepribadianResult, bakatMinatResult } = useData()
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState(false)
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Selamat Pagi' : now.getHours() < 17 ? 'Selamat Siang' : 'Selamat Sore'

  useEffect(() => {
    api.get('/user')
      .then(() => setIsConnected(true))
      .catch(() => setIsConnected(false))
  }, [])

  const dynamicStats = [
    { label: 'Total Siswa Binaan', value: siswa.length, change: '+1', up: true, icon: RiUserHeartLine, color: 'from-primary-500 to-primary-700', bg: 'primary' },
    { label: 'Sesi Konseling', value: sessions.length, change: '+2', up: true, icon: RiHeartLine, color: 'from-accent-500 to-accent-700', bg: 'accent' },
    { label: 'Jadwal Klasikal', value: schedules.length, change: '+0', up: true, icon: RiFileTextLine, color: 'from-teal-500 to-teal-700', bg: 'teal' },
    { label: 'Kasus Aktif', value: kasus.filter(k => k.status !== 'Selesai').length, change: '+1', up: true, icon: RiBarChart2Line, color: 'from-amber-500 to-orange-600', bg: 'amber' },
  ]

  // ── Hitung chart data dari data nyata ──────────────────────
  const BULAN_ID = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
  const tahunIni = now.getFullYear()

  // Jumlah responden asesmen per bulan: gabungkan semua asesmen dari localStorage
  const allAsesmenStudents = [
    ...(akpdResult?.students || []),
    ...(gayaBelajarResult?.students || []),
    ...(kecerdasanResult?.students || []),
    ...(kepribadianResult?.students || []),
    ...(bakatMinatResult?.students || []),
  ]

  // Hitung konseling per bulan (dari field tanggal: '06 Jun 2025')
  const konselingPerBulan = {}
  sessions.forEach(s => {
    if (!s.tanggal) return
    // Format tanggal: '06 Jun 2025' atau ISO
    let bln = -1
    try {
      const d = new Date(s.tanggal)
      if (!isNaN(d)) { bln = d.getMonth() }
      else {
        const parts = s.tanggal.split(' ')
        if (parts.length >= 2) {
          bln = BULAN_ID.findIndex(b => parts[1].startsWith(b))
        }
      }
    } catch {}
    if (bln >= 0) konselingPerBulan[bln] = (konselingPerBulan[bln] || 0) + 1
  })

  // Jumlah sesi klasikal per bulan (dari field date)
  const klasikalPerBulan = {}
  schedules.forEach(s => {
    if (!s.date) return
    try {
      const d = new Date(s.date)
      if (!isNaN(d)) klasikalPerBulan[d.getMonth()] = (klasikalPerBulan[d.getMonth()] || 0) + 1
    } catch {}
  })

  // Tampilkan 6 bulan terakhir
  const bulanAktif = []
  for (let i = 5; i >= 0; i--) {
    const idx = (now.getMonth() - i + 12) % 12
    bulanAktif.push(idx)
  }

  const chartData = bulanAktif.map(blnIdx => ({
    month: BULAN_ID[blnIdx],
    konseling: konselingPerBulan[blnIdx] || 0,
    klasikal: klasikalPerBulan[blnIdx] || 0,
  }))

  const recentSessions = sessions.slice(0, 4).map(s => ({
    name: s.siswa,
    kelas: s.kelas,
    topik: s.topik,
    status: s.status,
    date: s.tanggal
  }))

  // Calculate dynamic alerts
  const [alerts, setAlerts] = useState([])
  useEffect(() => {
    const newAlerts = []
    
    if (siswa.length > 0) {
      const filledAkpdSiswaNames = (akpdResult?.students || []).map(s => s.nama.toLowerCase())
      const missingCount = siswa.filter(s => !filledAkpdSiswaNames.includes(s.nama.toLowerCase())).length
      if (missingCount > 0) {
        newAlerts.push({ text: `${missingCount} siswa belum mengisi asesmen AKPD`, type: 'warning' })
      }
    } else {
      newAlerts.push({ text: 'Belum ada data siswa binaan. Silakan tambahkan siswa.', type: 'info' })
    }

    const pendingSessions = sessions.filter(s => s.status !== 'Selesai').length
    if (pendingSessions > 0) {
      newAlerts.push({ text: `${pendingSessions} sesi konseling masih berjalan / belum selesai`, type: 'warning' })
    }

    const currentMonthSchedules = schedules.filter(s => {
      if (!s.date) return false;
      try { return new Date(s.date).getMonth() === now.getMonth() } catch { return false }
    }).length
    if (currentMonthSchedules > 0) {
      newAlerts.push({ text: `Terdapat ${currentMonthSchedules} jadwal Bimbingan Klasikal bulan ini`, type: 'info' })
    }

    if (newAlerts.length === 0) {
      newAlerts.push({ text: 'Semua program BK dan asesmen berjalan dengan baik dan lancar', type: 'success' })
    }
    setAlerts(newAlerts)
  }, [siswa, sessions, schedules, akpdResult])

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">{greeting}, Guru BK 👋</h1>
          <p className="text-dark-200 text-sm mt-1">
            <RiCalendarLine className="inline mr-1" />
            {now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        {isConnected && (
            <div className="mt-2 text-xs text-teal-400 bg-teal-500/10 px-2 py-1 rounded-md border border-teal-500/20 inline-block">
              <RiCheckboxCircleLine className="inline mr-1" />
              Terhubung ke server
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button id="dashboard-add-siswa" onClick={() => navigate('/dashboard/siswa')} className="btn-secondary text-sm py-2">
            <RiUserAddLine /> Tambah Siswa
          </button>
          <button id="dashboard-new-konseling" onClick={() => navigate('/dashboard/konseling')} className="btn-primary text-sm py-2">
            <RiHeartLine /> Sesi Baru
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        {alerts.map(({ text, type }) => {
          const { cls, icon: Icon, color } = ALERT_STYLE[type]
          return (
            <div key={text} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${cls}`}>
              <Icon className={`${color} flex-shrink-0`} />
              <span className="text-dark-200 text-sm">{text}</span>
            </div>
          )
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {dynamicStats.map(({ label, value, change, up, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <Icon className="text-white text-xl" />
              </div>
              <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${up ? 'bg-teal-500/20 text-teal-400' : 'bg-red-500/20 text-red-400'}`}>
                {up ? <RiArrowUpLine /> : <RiArrowDownLine />}{change}
              </span>
            </div>
            <div className="font-display font-black text-3xl text-white mb-1">{value}</div>
            <div className="text-dark-200 text-sm">{label}</div>
          </div>
        ))}
      </div>

        {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart */}
        <div className="card-feature">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-bold text-white">Tren Layanan BK</h3>
            {sessions.length === 0 && schedules.length === 0 && (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Belum ada data</span>
            )}
          </div>
          <p className="text-dark-200 text-xs mb-5">Konseling & bim. klasikal per bulan (6 bulan terakhir)</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorKonseling" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorKlasikal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#f1f5f9' }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <Area type="monotone" dataKey="konseling" name="Konseling" stroke="#6366f1" strokeWidth={2} fill="url(#colorKonseling)" />
              <Area type="monotone" dataKey="klasikal" name="Bim. Klasikal" stroke="#14b8a6" strokeWidth={2} fill="url(#colorKlasikal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="card-feature">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-bold text-white">Sesi per Bulan</h3>
          </div>
          <p className="text-dark-200 text-xs mb-5">Perbandingan layanan 6 bulan terakhir</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#f1f5f9' }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <Bar dataKey="konseling" name="Konseling" fill="#6366f1" radius={[4,4,0,0]} />
              <Bar dataKey="klasikal" name="Bim. Klasikal" fill="#14b8a6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Konseling */}
      <div className="card-feature">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-bold text-white">Konseling Terbaru</h3>
            <p className="text-dark-200 text-xs mt-0.5">5 sesi terakhir yang dicatat</p>
          </div>
          <button className="btn-ghost text-xs gap-1.5"><RiEyeLine />Lihat Semua</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="table-header text-left py-4 px-4 bg-transparent">Nama Siswa</th>
                <th className="table-header text-left py-4 px-4 bg-transparent">Kelas</th>
                <th className="table-header text-left py-4 px-4 hidden md:table-cell bg-transparent">Topik</th>
                <th className="table-header text-left py-4 px-4 bg-transparent">Status</th>
                <th className="table-header text-left py-4 px-4 hidden sm:table-cell bg-transparent">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentSessions.map(({ name, kelas, topik, status, date }, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors cursor-pointer group">
                  <td className="table-cell px-4 py-4 font-medium text-white group-hover:text-primary-300 transition-colors">{name}</td>
                  <td className="table-cell px-4 py-4">{kelas}</td>
                  <td className="table-cell px-4 py-4 hidden md:table-cell">{topik}</td>
                  <td className="table-cell px-4 py-4"><span className={STATUS_STYLE[status]}>{status}</span></td>
                  <td className="table-cell px-4 py-4 hidden sm:table-cell text-dark-300">{date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
