import { Outlet, Navigate, Link, useLocation } from 'react-router-dom'
import { RiDashboardLine, RiTeamLine, RiLogoutBoxRLine } from 'react-icons/ri'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function SuperAdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  if (!user || user.role !== 'super_admin') {
    return <Navigate to="/login" replace />
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Berhasil logout')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen flex bg-[rgb(var(--bg-main))] dark:bg-dark-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-dark-950 border-r border-gray-200 dark:border-white/10 flex flex-col hidden md:flex z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-white/10">
          <span className="font-display font-bold text-xl text-primary-500">Super Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/super-admin/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/super-admin/dashboard') ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' : 'text-gray-600 dark:text-dark-200 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
            <RiDashboardLine className="text-lg" />
            <span className="font-medium text-sm">Dashboard Utama</span>
          </Link>
          <Link to="/super-admin/guru-bk" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/super-admin/guru-bk') ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' : 'text-gray-600 dark:text-dark-200 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
            <RiTeamLine className="text-lg" />
            <span className="font-medium text-sm">Manajemen Guru BK</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <div className="px-4 py-3 mb-2 flex flex-col">
            <span className="text-sm font-bold text-gray-800 dark:text-white truncate">{user.name}</span>
            <span className="text-xs text-gray-500 dark:text-dark-300 truncate">{user.email}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 w-full transition-colors">
            <RiLogoutBoxRLine className="text-lg" />
            <span className="font-medium text-sm">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-auto relative">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
