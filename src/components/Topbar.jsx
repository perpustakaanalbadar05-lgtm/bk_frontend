import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  RiMenuLine, RiBellLine, RiSearchLine, RiCheckDoubleLine,
  RiShieldStarLine, RiUser3Line, RiMoonLine, RiSunLine, RiCloseLine
} from 'react-icons/ri'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import api from '../lib/axios'

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', sub: 'Ringkasan layanan BK hari ini' },
  '/dashboard/siswa': { title: 'Data Siswa', sub: 'Kelola data siswa binaan' },
  '/dashboard/klasikal': { title: 'Bim. Klasikal', sub: 'Daftar hadir & jadwal masuk kelas' },
  '/dashboard/konseling': { title: 'Konseling', sub: 'Rekam dan pantau sesi konseling' },
  '/dashboard/kasus': { title: 'Penanganan Kasus', sub: 'Kasus siswa & agenda Home Visit' },
  '/dashboard/asesmen': { title: 'Asesmen & Psikotes', sub: 'Analisis AKPD & tes psikologis' },
  '/dashboard/program-bk': { title: 'Program BK', sub: 'Susun program tahunan dan RPL' },
  '/dashboard/laporan': { title: 'Laporan', sub: 'Rekap dan unduh laporan BK' },
  '/dashboard/settings': { title: 'Pengaturan', sub: 'Konfigurasi sistem Konselia' },
}

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const page = PAGE_TITLES[pathname] || { title: 'Konselia', sub: '' }

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggleTheme = () => {
    const isDarkNow = document.documentElement.classList.toggle('dark')
    setIsDark(isDarkNow)
    localStorage.setItem('simbk_theme', isDarkNow ? 'dark' : 'light')
  }

  // Notifikasi State
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications')
        setNotifications(res.data)
      } catch (err) {
        console.error('Failed to fetch notifications', err)
      }
    }

    if (user?.role === 'guru_bk') {
      fetchNotifications()
    }
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4 bg-black/10 backdrop-blur-xl border-b border-white/10">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl glass text-dark-300 hover:text-white transition-colors"
        id="topbar-menu-btn"
      >
        <RiMenuLine className="text-xl" />
      </button>

      {/* Page title */}
      <div className="flex-1">
        <h2 className="font-display font-bold text-white text-xl leading-tight">{page.title}</h2>
        <p className="text-dark-200 text-xs">{page.sub}</p>
      </div>

      {/* Search */}
      <div className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 transition-all duration-300 ${searchOpen ? 'w-64' : 'w-40 cursor-pointer'}`}>
        <RiSearchLine className="text-dark-200 flex-shrink-0" />
        <input
          type="text"
          placeholder="Cari siswa, laporan..."
          className="bg-transparent text-sm text-white placeholder-dark-500 outline-none w-full"
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setSearchOpen(false)}
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-dark-300 hover:text-white transition-colors"
        title={isDark ? "Ubah ke Light Mode" : "Ubah ke Dark Mode"}
      >
        {isDark ? <RiSunLine className="text-lg text-amber-400" /> : <RiMoonLine className="text-lg text-primary-400" />}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          id="topbar-notif-btn"
          className="relative p-2.5 rounded-xl border border-white/10 bg-white/5 text-dark-300 hover:text-white transition-colors"
        >
          <RiBellLine className="text-lg" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
          )}
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-dark-900 border border-white/10 rounded-2xl shadow-2xl z-40 overflow-hidden animate-in">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="font-display font-bold text-white text-sm">Pemberitahuan</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
                    <RiCheckDoubleLine /> Tandai dibaca
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-dark-400 text-sm">Tidak ada pemberitahuan.</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-primary-500/5' : ''}`}>
                      <div className="flex gap-3">
                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!n.read ? 'bg-accent-500' : 'bg-transparent border border-dark-400'}`} />
                        <div>
                          <h4 className={`text-sm font-semibold ${!n.read ? 'text-white' : 'text-dark-200'}`}>{n.title}</h4>
                          <p className="text-xs text-dark-300 mt-1 leading-relaxed">{n.text}</p>
                          <span className="text-[10px] text-dark-400 font-mono mt-2 block">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-3 border-t border-white/10 text-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer text-xs font-bold text-dark-200">
                Lihat Semua Notifikasi
              </div>
            </div>
          </>
        )}
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5">
        <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() || 'G'}
          </span>
        </div>
        <span className="hidden sm:block text-sm text-dark-200 font-medium">
          {user?.name || 'Guru BK'}
        </span>
      </div>
    </header>
  )
}
