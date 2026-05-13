import { useState } from 'react'
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

const STATS = [
  { label: 'Total Siswa Binaan', value: '312', change: '+12', up: true, icon: RiUserHeartLine, color: 'from-primary-500 to-primary-700', bg: 'primary' },
  { label: 'Sesi Konseling Bulan Ini', value: '47', change: '+8', up: true, icon: RiHeartLine, color: 'from-accent-500 to-accent-700', bg: 'accent' },
  { label: 'Program BK Aktif', value: '6', change: '-1', up: false, icon: RiFileTextLine, color: 'from-teal-500 to-teal-700', bg: 'teal' },
  { label: 'Laporan Tersedia', value: '23', change: '+5', up: true, icon: RiBarChart2Line, color: 'from-amber-500 to-orange-600', bg: 'amber' },
]

const CHART_DATA = [
  { month: 'Jan', konseling: 30, asesmen: 18 },
  { month: 'Feb', konseling: 42, asesmen: 25 },
  { month: 'Mar', konseling: 38, asesmen: 30 },
  { month: 'Apr', konseling: 55, asesmen: 40 },
  { month: 'Mei', konseling: 47, asesmen: 35 },
  { month: 'Jun', konseling: 60, asesmen: 48 },
]

const RECENT_KONSELING = [
  { name: 'Ahmad Fauzi', kelas: 'XI IPA 2', topik: 'Masalah Belajar', status: 'Selesai', date: '11 Mei 2026' },
  { name: 'Siti Rahma', kelas: 'X IPS 1', topik: 'Karir & Studi', status: 'Proses', date: '11 Mei 2026' },
  { name: 'Budi Santoso', kelas: 'XII IPA 1', topik: 'Sosial & Pergaulan', status: 'Selesai', date: '10 Mei 2026' },
  { name: 'Dewi Lestari', kelas: 'XI IPS 3', topik: 'Pribadi & Keluarga', status: 'Terjadwal', date: '12 Mei 2026' },
]

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
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Selamat Pagi' : now.getHours() < 17 ? 'Selamat Siang' : 'Selamat Sore'

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
        </div>
        <div className="flex gap-2">
          <button id="dashboard-add-siswa" className="btn-secondary text-sm py-2">
            <RiUserAddLine /> Tambah Siswa
          </button>
          <button id="dashboard-new-konseling" className="btn-primary text-sm py-2">
            <RiHeartLine /> Sesi Baru
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        {ALERTS.map(({ text, type }) => {
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
        {STATS.map(({ label, value, change, up, icon: Icon, color }) => (
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
          <h3 className="font-display font-bold text-white mb-1">Tren Layanan BK</h3>
          <p className="text-dark-200 text-xs mb-5">Konseling & asesmen per bulan</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="colorKonseling" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAsesmen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#f1f5f9' }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <Area type="monotone" dataKey="konseling" name="Konseling" stroke="#6366f1" strokeWidth={2} fill="url(#colorKonseling)" />
              <Area type="monotone" dataKey="asesmen" name="Asesmen" stroke="#d946ef" strokeWidth={2} fill="url(#colorAsesmen)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="card-feature">
          <h3 className="font-display font-bold text-white mb-1">Sesi per Bulan</h3>
          <p className="text-dark-200 text-xs mb-5">Perbandingan layanan tahunan</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CHART_DATA} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#f1f5f9' }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
              <Bar dataKey="konseling" name="Konseling" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="asesmen" name="Asesmen" fill="#d946ef" radius={[4, 4, 0, 0]} />
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
              {RECENT_KONSELING.map(({ name, kelas, topik, status, date }) => (
                <tr key={name} className="hover:bg-white/5 transition-colors cursor-pointer group">
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
