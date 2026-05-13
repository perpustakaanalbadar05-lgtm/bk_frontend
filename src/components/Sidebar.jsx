import { NavLink, useNavigate } from 'react-router-dom'
import {
  RiDashboardLine, RiUserSearchLine, RiHeartLine,
  RiFileTextLine, RiBarChartLine, RiSettings3Line,
  RiClipboardLine, RiMenuFoldLine, RiMenuUnfoldLine,
  RiLogoutBoxLine, RiShieldStarLine, RiCloseLine,
  RiPresentationLine,
} from 'react-icons/ri'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard', end: true },
  { to: '/dashboard/siswa', icon: RiUserSearchLine, label: 'Data Siswa' },
  { to: '/dashboard/klasikal', icon: RiPresentationLine, label: 'Bim. Klasikal' },
  { to: '/dashboard/konseling', icon: RiHeartLine, label: 'Konseling' },
  { to: '/dashboard/kasus', icon: RiShieldStarLine, label: 'Penanganan Kasus' },
  { to: '/dashboard/asesmen', icon: RiClipboardLine, label: 'Asesmen & Psikotes' },
  { to: '/dashboard/program-bk', icon: RiFileTextLine, label: 'Program BK' },
  { to: '/dashboard/laporan', icon: RiBarChartLine, label: 'Laporan' },
  { to: '/dashboard/settings', icon: RiSettings3Line, label: 'Pengaturan' },
]

export default function Sidebar({ open, collapsed, onCollapse, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Berhasil keluar dari SIMBK')
    navigate('/login')
  }

  return (
    <aside
      className={`
        fixed top-0 left-0 z-30 h-full flex flex-col
        bg-dark-900/95 backdrop-blur-xl border-r border-white/20
        transition-all duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${collapsed ? 'lg:w-20' : 'w-72 lg:w-72'}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 p-5 border-b border-white/20 ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}>
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-glow-sm">
            <RiShieldStarLine className="text-white text-xl" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full border-2 border-dark-900" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-white text-lg leading-tight">SIMBK</h1>
            <p className="text-dark-200 text-[10px] truncate leading-tight">CV. Alifba Media</p>
          </div>
        )}
        {/* Close on mobile */}
        <button
          onClick={onClose}
          className="lg:hidden ml-auto p-1.5 rounded-lg text-dark-200 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RiCloseLine className="text-lg" />
        </button>
        {/* Collapse toggle on desktop */}
        <button
          onClick={onCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-dark-200 hover:text-white hover:bg-white/10 transition-colors ml-auto"
        >
          {collapsed ? <RiMenuUnfoldLine className="text-lg" /> : <RiMenuFoldLine className="text-lg" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-dark-300 text-[10px] font-semibold uppercase tracking-wider px-3 pb-2 pt-1">
            Menu Utama
          </p>
        )}
        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'lg:justify-center lg:px-2' : ''}`
            }
          >
            <Icon className="text-xl flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div className={`p-3 border-t border-white/20 ${collapsed ? 'lg:flex lg:justify-center' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 p-3 rounded-xl glass">
            <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">
                {user?.name?.[0]?.toUpperCase() || 'G'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name || 'Guru BK'}</p>
              <p className="text-dark-200 text-xs truncate">{user?.email || 'guru@sekolah.id'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-dark-200 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Keluar"
            >
              <RiLogoutBoxLine />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl text-dark-200 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Keluar"
          >
            <RiLogoutBoxLine className="text-xl" />
          </button>
        )}
      </div>
    </aside>
  )
}
