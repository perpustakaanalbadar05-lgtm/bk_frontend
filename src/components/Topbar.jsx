import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  RiMenuLine, RiBellLine, RiSearchLine,
  RiShieldStarLine, RiUser3Line, RiMoonLine, RiSunLine
} from 'react-icons/ri'
import { useAuth } from '../contexts/AuthContext'

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', sub: 'Ringkasan layanan BK hari ini' },
  '/dashboard/siswa': { title: 'Data Siswa', sub: 'Kelola data siswa binaan' },
  '/dashboard/klasikal': { title: 'Bim. Klasikal', sub: 'Daftar hadir & jadwal masuk kelas' },
  '/dashboard/konseling': { title: 'Konseling', sub: 'Rekam dan pantau sesi konseling' },
  '/dashboard/kasus': { title: 'Penanganan Kasus', sub: 'Kasus siswa & agenda Home Visit' },
  '/dashboard/asesmen': { title: 'Asesmen & Psikotes', sub: 'Analisis AKPD & tes psikologis' },
  '/dashboard/program-bk': { title: 'Program BK', sub: 'Susun program tahunan dan RPL' },
  '/dashboard/laporan': { title: 'Laporan', sub: 'Rekap dan unduh laporan BK' },
  '/dashboard/settings': { title: 'Pengaturan', sub: 'Konfigurasi sistem Konseli' },
}

export default function Topbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const page = PAGE_TITLES[pathname] || { title: 'Konseli', sub: '' }

  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggleTheme = () => {
    const isDarkNow = document.documentElement.classList.toggle('dark')
    setIsDark(isDarkNow)
    // Optional: save to localStorage if user wants
    localStorage.setItem('theme', isDarkNow ? 'dark' : 'light')
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
      <button
        id="topbar-notif-btn"
        className="relative p-2.5 rounded-xl border border-white/10 bg-white/5 text-dark-300 hover:text-white transition-colors"
      >
        <RiBellLine className="text-lg" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full" />
      </button>

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
