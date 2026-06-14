import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RiGraduationCapLine, RiLogoutBoxLine, RiHeartLine, RiClipboardLine,
  RiAlertLine, RiCheckDoubleLine, RiCalendarLine, RiArrowRightLine,
  RiStarLine, RiBarChartLine
} from 'react-icons/ri'
import { useRole } from '../contexts/RoleContext'
import { useData } from '../contexts/DataContext'
import { useSettings } from '../contexts/SettingsContext'
import toast from 'react-hot-toast'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

export default function PortalMurid() {
  const { portalUser, logoutPortal } = useRole()
  const { sessions, kasus, akpdResult } = useData()
  const { sekolah } = useSettings()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  if (!portalUser || portalUser.role !== 'murid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center p-8">
          <RiAlertLine className="text-5xl text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Akses Ditolak</h2>
          <button onClick={() => navigate('/portal/login?role=murid')} className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">Login</button>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logoutPortal()
    toast.success('Berhasil keluar dari portal')
    navigate('/portal/login')
  }

  const linkedName = portalUser.siswa || portalUser.name || ''
  const mySessions = sessions.filter(s => s.siswa?.toLowerCase() === linkedName.toLowerCase())
  const myKasus = kasus.filter(k => k.siswa?.toLowerCase() === linkedName.toLowerCase())

  // Find AKPD result for this student
  const myAkpdResult = akpdResult?.meta?.nama?.toLowerCase() === linkedName.toLowerCase() ? akpdResult : null

  const radarData = myAkpdResult
    ? myAkpdResult.bidangSummary?.map(b => ({ subject: b.bidang, A: b.persentase })) || []
    : [
        { subject: 'Pribadi', A: 72 },
        { subject: 'Sosial', A: 65 },
        { subject: 'Belajar', A: 80 },
        { subject: 'Karir', A: 58 },
      ]

  const TABS = [
    { id: 'overview', label: 'Ringkasan', icon: RiBarChartLine },
    { id: 'konseling', label: 'Riwayat Konseling', icon: RiHeartLine },
    { id: 'asesmen', label: 'Hasil Asesmen', icon: RiClipboardLine },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-700 flex items-center justify-center shadow-md">
              <RiGraduationCapLine className="text-white text-xl" />
            </div>
            <div>
              <h1 className="font-display font-black text-slate-800 leading-none">Portal Murid</h1>
              <p className="text-slate-500 text-xs">{sekolah.nama || 'Konselia'} · Ruang Bimbingan Digital</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-slate-800 font-semibold text-sm leading-none">{portalUser.name}</p>
              <p className="text-slate-400 text-xs mt-0.5">Murid / Siswa</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-semibold">
              <RiLogoutBoxLine /> Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Hero Card */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-3xl font-bold">
              {linkedName?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-purple-200 text-sm">Selamat datang kembali,</p>
              <h2 className="text-2xl font-display font-black">{linkedName}</h2>
              <p className="text-purple-200 text-sm mt-1">{portalUser.kelas || 'Siswa Konselia'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 bg-white/10 rounded-2xl p-4">
            <div className="text-center">
              <p className="text-3xl font-display font-black">{mySessions.length}</p>
              <p className="text-purple-200 text-xs mt-1">Sesi Konseling</p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="text-3xl font-display font-black">{mySessions.filter(s => s.status === 'Selesai').length}</p>
              <p className="text-purple-200 text-xs mt-1">Sudah Selesai</p>
            </div>
            <div className="text-center">
              <RiStarLine className="text-2xl mx-auto text-yellow-300" />
              <p className="text-purple-200 text-xs mt-1">Profil Lengkap</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 overflow-x-auto gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-1 justify-center
                ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-1">Profil Kebutuhan (AKPD)</h3>
              <p className="text-slate-400 text-xs mb-4">Visualisasi radar kebutuhan layanan BK</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Radar name="Skor" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm mb-3">Aktivitas Terakhir</h3>
                {mySessions.slice(0, 3).map((s, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                      <RiHeartLine className="text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-700 text-xs truncate">{s.topik}</p>
                      <p className="text-slate-400 text-[10px]">{s.tanggal}</p>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${s.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
                {mySessions.length === 0 && (
                  <p className="text-slate-400 text-sm text-center py-4">Belum ada riwayat</p>
                )}
              </div>

              {/* Quick action: isi kuesioner */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-4 text-white">
                <p className="font-bold text-sm">Isi Kuesioner AKPD</p>
                <p className="text-purple-200 text-xs mt-1">Bantu Guru BK memahami kebutuhan Anda</p>
                <button
                  onClick={() => navigate('/isi-asesmen')}
                  className="mt-3 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                >
                  Isi Sekarang <RiArrowRightLine />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'konseling' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Seluruh Riwayat Konseling</h3>
            {mySessions.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <RiHeartLine className="text-5xl mx-auto mb-3 opacity-30" />
                <p>Belum ada riwayat konseling untuk Anda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mySessions.map((s, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-purple-50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {s.status === 'Selesai' ? <RiCheckDoubleLine /> : <RiCalendarLine />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-700">{s.topik}</p>
                      <p className="text-slate-400 text-sm mt-0.5">{s.tanggal} · {s.jenis} · {s.durasi || '-'}</p>
                      {s.ringkasan && <p className="text-slate-500 text-xs mt-1 italic">"{s.ringkasan}"</p>}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold flex-shrink-0 ${s.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'asesmen' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Hasil Asesmen Anda</h3>
              <button
                onClick={() => navigate('/isi-asesmen')}
                className="text-sm bg-purple-600 text-white px-3 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-1"
              >
                <RiClipboardLine /> Isi Kuesioner Baru
              </button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
                <Radar name="Profil Kebutuhan" dataKey="A" stroke="#a855f7" fill="#a855f7" fillOpacity={0.25} />
                <Tooltip formatter={(val) => [`${val}%`, 'Skor']} />
              </RadarChart>
            </ResponsiveContainer>
            <p className="text-center text-slate-400 text-xs mt-2">Data berdasarkan hasil kuesioner AKPD terakhir</p>
          </div>
        )}
      </main>
    </div>
  )
}
