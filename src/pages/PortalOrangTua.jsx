import { useNavigate } from 'react-router-dom'
import {
  RiParentLine, RiLogoutBoxLine, RiHeartLine, RiShieldStarLine,
  RiAlertLine, RiCheckDoubleLine, RiCalendarLine, RiUser3Line,
  RiPhoneLine, RiHomeLine
} from 'react-icons/ri'
import { useRole } from '../contexts/RoleContext'
import { useData } from '../contexts/DataContext'
import { useSettings } from '../contexts/SettingsContext'
import toast from 'react-hot-toast'

export default function PortalOrangTua() {
  const { portalUser, logoutPortal } = useRole()
  const { sessions, kasus, siswa } = useData()
  const { sekolah } = useSettings()
  const navigate = useNavigate()

  if (!portalUser || portalUser.role !== 'orang_tua') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center p-8">
          <RiAlertLine className="text-5xl text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Akses Ditolak</h2>
          <button onClick={() => navigate('/portal/login?role=orang_tua')} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold">Login</button>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logoutPortal()
    toast.success('Berhasil keluar dari portal')
    navigate('/portal/login')
  }

  // Filter data by linked student name
  const linkedStudentName = portalUser.siswa || ''
  const studentData = siswa.find(s => s.nama.toLowerCase() === linkedStudentName.toLowerCase())
  const studentSessions = sessions.filter(s => s.siswa?.toLowerCase() === linkedStudentName.toLowerCase())
  const studentKasus = kasus.filter(k => k.siswa?.toLowerCase() === linkedStudentName.toLowerCase())
  const totalPoin = studentKasus.reduce((sum, k) => sum + (k.poin || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Topbar */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-md">
              <RiParentLine className="text-white text-xl" />
            </div>
            <div>
              <h1 className="font-display font-black text-slate-800 leading-none">Portal Orang Tua</h1>
              <p className="text-slate-500 text-xs">{sekolah.nama || 'SIMBK'} · Pantau Perkembangan Anak</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-slate-800 font-semibold text-sm leading-none">{portalUser.name}</p>
              <p className="text-slate-400 text-xs mt-0.5">Orang Tua / Wali</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-semibold">
              <RiLogoutBoxLine /> Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Student Profile Card */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-xl">
          <p className="text-emerald-100 text-sm font-medium mb-2">Data Putra/Putri Anda</p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-3xl font-bold">
              {linkedStudentName?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-2xl font-display font-black">{linkedStudentName || 'Siswa tidak tertaut'}</h2>
              {studentData && (
                <div className="flex items-center gap-4 mt-1 text-sm text-emerald-100">
                  <span className="flex items-center gap-1"><RiUser3Line /> {studentData.kelas}</span>
                  <span className="flex items-center gap-1"><RiCalendarLine /> NIS: {studentData.nis}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 bg-white/10 rounded-2xl p-4">
            <div className="text-center">
              <p className="text-3xl font-display font-black">{studentSessions.length}</p>
              <p className="text-emerald-100 text-xs mt-1">Sesi Konseling</p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="text-3xl font-display font-black">{studentKasus.length}</p>
              <p className="text-emerald-100 text-xs mt-1">Catatan Kasus</p>
            </div>
            <div className="text-center">
              <p className={`text-3xl font-display font-black ${totalPoin > 50 ? 'text-red-300' : 'text-white'}`}>{totalPoin}</p>
              <p className="text-emerald-100 text-xs mt-1">Total Poin Pelanggaran</p>
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <RiHeartLine className="text-pink-500" /> Riwayat Konseling
          </h3>
          {studentSessions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <RiHeartLine className="text-4xl mx-auto mb-2 opacity-30" />
              <p className="text-sm">Belum ada riwayat konseling</p>
            </div>
          ) : (
            <div className="space-y-3">
              {studentSessions.map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {s.status === 'Selesai' ? <RiCheckDoubleLine /> : <RiCalendarLine />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-700 text-sm">{s.topik}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{s.tanggal} · {s.jenis} · {s.durasi || '-'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${s.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cases */}
        {studentKasus.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <RiShieldStarLine className="text-amber-500" /> Catatan Pelanggaran
            </h3>
            <div className="space-y-3">
              {studentKasus.map((k, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-amber-100 bg-amber-50">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <RiAlertLine />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-700 text-sm">{k.kasus}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{k.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-display font-black text-amber-600">+{k.poin}</span>
                    <p className="text-xs text-slate-400">poin</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
          <RiPhoneLine className="text-blue-500 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-800 text-sm">Butuh informasi lebih lanjut?</p>
            <p className="text-blue-600 text-xs mt-1">Hubungi Guru BK sekolah untuk mendapatkan penjelasan lebih detail tentang perkembangan putra/putri Anda.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
