import { NavLink, useNavigate } from 'react-router-dom'
import {
  RiDashboardLine, RiUserSearchLine, RiHeartLine,
  RiFileTextLine, RiBarChartLine, RiSettings3Line,
  RiClipboardLine, RiLogoutBoxLine, RiShieldStarLine, RiCloseLine,
  RiPresentationLine, RiArrowRightSLine, RiArrowLeftSLine
} from 'react-icons/ri'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import ConfirmDialog from './ConfirmDialog'
import { useState } from 'react'

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
  const [confirmLogout, setConfirmLogout] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success('Berhasil keluar dari Konselia')
    navigate('/login')
  }

  return (
    <>
      <ConfirmDialog
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
        title="Keluar dari Konselia?"
        message="Sesi Anda akan diakhiri. Pastikan semua data sudah tersimpan."
        confirmLabel="Ya, Keluar"
        confirmClass="bg-red-600 hover:bg-red-500 text-white"
      />
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full flex flex-col
          bg-black/10 backdrop-blur-xl border-r border-white/10
          transition-all duration-500 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${collapsed ? 'lg:w-20' : 'w-72 lg:w-72'}
        `}
      >
      {/* Floating Border Toggle Pill for Desktop (Highly Smooth) */}
      <button
        onClick={onCollapse}
        className="hidden lg:flex absolute -right-3.5 top-8 z-50 w-7 h-7 bg-primary-600 hover:bg-primary-500 border-2 border-[rgb(var(--bg-main))] text-white rounded-full shadow-lg items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 group active:scale-95"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed 
          ? <RiArrowRightSLine className="text-lg transition-transform group-hover:translate-x-0.5" /> 
          : <RiArrowLeftSLine className="text-lg transition-transform group-hover:-translate-x-0.5" />
        }
      </button>

      {/* Header: Logo & Text */}
      <div className="flex items-center p-5 border-b border-white/10 h-20 overflow-hidden relative">
        <div className="relative flex-shrink-0 flex justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-glow-sm transition-transform duration-500">
            <RiShieldStarLine className="text-white text-xl" />
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full border-2 border-dark-950 animate-pulse" />
        </div>
        
        {/* Smooth Fade & Slide For Title */}
        <div className={`ml-3 min-w-[160px] transition-all duration-500 ease-out ${collapsed ? 'opacity-0 -translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'}`}>
          <h1 className="font-display font-black text-white text-xl tracking-wider leading-none">Konselia</h1>
          <p className="text-dark-300 text-[9px] uppercase tracking-widest mt-1 truncate">by Alifba Media.</p>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden ml-auto p-2 rounded-lg text-dark-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RiCloseLine className="text-xl" />
        </button>
      </div>

      {/* Navigation Container */}
      <nav className="flex-1 p-3 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {/* Subtle Section Label */}
        <div className={`h-5 overflow-hidden transition-all duration-500 ${collapsed ? 'opacity-0 max-h-0' : 'opacity-100 max-h-8'}`}>
          <p className="text-dark-400 text-[9px] font-bold uppercase tracking-widest px-3 mb-2">
            Menu Utama
          </p>
        </div>

        {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `group relative flex items-center p-3 rounded-xl transition-all duration-300 select-none overflow-hidden
               ${isActive 
                 ? 'bg-primary-600 text-white shadow-glow-sm font-bold' 
                 : 'text-dark-300 hover:text-white hover:bg-white/5'}
              `
            }
          >
            <Icon className={`text-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${collapsed ? 'mx-auto' : ''}`} />
            
            {/* Smooth Slide & Scale Label Text */}
            <span className={`whitespace-nowrap transition-all duration-500 ease-out ml-3 ${collapsed ? 'opacity-0 w-0 max-w-0 -translate-x-4 pointer-events-none' : 'opacity-100 max-w-[200px] translate-x-0'}`}>
              {label}
            </span>

            {/* Hover Tooltip for Collapsed Mode */}
            {collapsed && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-dark-950 text-white text-xs rounded border border-white/10 opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 pointer-events-none transition-all duration-300 whitespace-nowrap z-50">
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer: User Profile & Session Actions */}
      <div className="p-3 border-t border-white/10 bg-dark-950/20">
        <div className={`flex items-center p-2 rounded-xl transition-all duration-500 ${collapsed ? 'justify-center bg-transparent' : 'bg-white/5 backdrop-blur-sm gap-3'}`}>
          {/* User Avatar Box */}
          <div 
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center flex-shrink-0 relative group cursor-pointer transition-transform hover:scale-105 border border-white/10"
            title={collapsed ? `Keluar dari ${user?.name || 'Akun'}` : undefined}
          >
            <span className="text-white font-bold font-display text-sm">
              {user?.name?.[0]?.toUpperCase() || 'G'}
            </span>
            
            {/* Micro-interaction Logout Trigger when collapsed */}
            {collapsed && (
              <div
                onClick={() => setConfirmLogout(true)}
                className="absolute inset-0 bg-red-600 hover:bg-red-500 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-white"
              >
                <RiLogoutBoxLine className="text-lg" />
              </div>
            )}
          </div>

          {/* Smooth User Text */}
          <div className={`flex-1 min-w-0 transition-all duration-500 ease-out ${collapsed ? 'opacity-0 max-w-0 -translate-x-4 pointer-events-none' : 'opacity-100 max-w-[180px] translate-x-0'}`}>
            <p className="text-white text-sm font-bold truncate leading-none">{user?.name || 'Guru BK'}</p>
            <p className="text-dark-400 text-[10px] mt-1 truncate font-mono">{user?.email || 'guru@sekolah.id'}</p>
          </div>

          {/* Expanded Standard Logout Button */}
          {!collapsed && (
            <button
              onClick={() => setConfirmLogout(true)}
              className="p-2 rounded-lg text-dark-300 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-95 flex-shrink-0"
              title="Keluar Akun"
            >
              <RiLogoutBoxLine className="text-lg" />
            </button>
          )}
        </div>
      </div>
    </aside>
    </>
  )
}
