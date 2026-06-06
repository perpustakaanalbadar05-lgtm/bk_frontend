import { useNavigate } from 'react-router-dom'
import {
  RiUserStarLine, RiLogoutBoxLine, RiGroupLine, RiHeartLine,
  RiShieldStarLine, RiBarChartLine, RiCalendarLine, RiFileTextLine,
  RiArrowRightLine, RiCheckDoubleLine, RiAlertLine
} from 'react-icons/ri'
import { useRole } from '../contexts/RoleContext'
import { useData } from '../contexts/DataContext'
import { useSettings } from '../contexts/SettingsContext'
import toast from 'react-hot-toast'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const MONTHS = ['Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']

export default function PortalKepalaSekolah() {
  const { portalUser, logoutPortal } = useRole()
  const { siswa, sessions, kasus, schedules, akpdResult } = useData()
  const { sekolah } = useSettings()
  const navigate = useNavigate()

  if (!portalUser || (portalUser.role !== 'kepala_sekolah' && portalUser.role !== 'pengawas')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center p-8">
          <RiAlertLine className="text-5xl text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Akses Ditolak</h2>
          <p className="text-slate-500 mt-2">Anda tidak memiliki akses ke halaman ini.</p>
          <button onClick={() => navigate('/portal/login')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">Login Portal</button>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logoutPortal()
    toast.success('Berhasil keluar dari portal')
    navigate('/portal/login')
  }

  const completedSessions = sessions.filter(s => s.status === 'Selesai').length
  const activeKasus = kasus.filter(k => k.status !== 'Selesai').length

  const monthlyData = MONTHS.map((m, i) => {
    const monthTarget = i + 6; // 6 = July
    const konselingCount = sessions.filter(s => {
      if (!s.tanggal) return false;
      const d = new Date(s.tanggal);
      return !isNaN(d) && d.getMonth() === monthTarget;
    }).length;

    const kasusCount = kasus.filter(k => {
      if (!k.date) return false;
      const d = new Date(k.date);
      return !isNaN(d) && d.getMonth() === monthTarget;
    }).length;

    return {
      month: m,
      konseling: konselingCount,
      kasus: kasusCount,
    }
  })

  const radarData = [
    { subject: 'Konseling', A: Math.min(100, sessions.length * 15) },
    { subject: 'Kasus', A: kasus.length === 0 ? 100 : Math.round((kasus.filter(k => k.status === 'Selesai').length / kasus.length) * 100) },
    { subject: 'Klasikal', A: Math.min(100, (schedules?.length || 0) * 20) },
    { subject: 'Asesmen', A: akpdResult ? 100 : 0 },
    { subject: 'Program', A: akpdResult ? 100 : 0 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
              <RiUserStarLine className="text-white text-xl" />
            </div>
            <div>
              <h1 className="font-display font-black text-slate-800 leading-none">Portal {portalUser.role === 'pengawas' ? 'Pengawas' : 'Kepala Sekolah'}</h1>
              <p className="text-slate-500 text-xs">{sekolah.nama || 'Konseli'} · Monitoring BK</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-slate-800 font-semibold text-sm leading-none">{portalUser.name}</p>
              <p className="text-slate-400 text-xs mt-0.5">{portalUser.role === 'pengawas' ? 'Pengawas Sekolah' : 'Kepala Sekolah'}</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-semibold">
              <RiLogoutBoxLine /> Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Siswa', val: siswa.length, icon: RiGroupLine, color: 'from-blue-500 to-blue-600', light: 'bg-blue-50 text-blue-600' },
            { label: 'Sesi Konseling', val: sessions.length, icon: RiHeartLine, color: 'from-pink-500 to-rose-600', light: 'bg-pink-50 text-pink-600' },
            { label: 'Kasus Aktif', val: activeKasus, icon: RiAlertLine, color: 'from-amber-500 to-orange-600', light: 'bg-amber-50 text-amber-600' },
            { label: 'Sesi Selesai', val: completedSessions, icon: RiCheckDoubleLine, color: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50 text-emerald-600' },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${card.light} flex items-center justify-center text-xl flex-shrink-0`}>
                <card.icon />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{card.label}</p>
                <p className="text-3xl font-display font-black text-slate-800">{card.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-1">Aktivitas Bulanan</h3>
            <p className="text-slate-400 text-xs mb-4">Tren konseling & kasus per bulan</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="konseling" name="Konseling" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="kasus" name="Kasus" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-1">Cakupan Layanan BK</h3>
            <p className="text-slate-400 text-xs mb-4">Radar ketercapaian program semester</p>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Radar name="BK" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Sessions Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800">Riwayat Konseling Terbaru</h3>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-semibold">Read Only</span>
          </div>
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <RiHeartLine className="text-4xl mx-auto mb-2 opacity-40" />
              <p className="text-sm">Belum ada data konseling</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs uppercase">Siswa</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs uppercase">Kelas</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs uppercase">Topik</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-semibold text-xs uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.slice(0, 6).map((s, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-700">{s.siswa}</td>
                      <td className="py-3 px-3 text-slate-500">{s.kelas}</td>
                      <td className="py-3 px-3 text-slate-600">{s.topik}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
