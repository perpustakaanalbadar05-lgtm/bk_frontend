import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  RiShieldStarLine, RiUserLine, RiLockLine, RiEyeLine, RiEyeOffLine,
  RiArrowLeftLine, RiUserStarLine, RiTeamLine, RiGraduationCapLine
} from 'react-icons/ri'
import { useRole } from '../contexts/RoleContext'
import toast from 'react-hot-toast'

const ROLE_CONFIG = {
  kepala_sekolah: {
    label: 'Kepala Sekolah',
    icon: RiUserStarLine,
    color: 'from-blue-600 to-indigo-700',
    accent: 'text-blue-400',
    description: 'Portal monitoring & evaluasi BK sekolah',
    redirect: '/portal/kepala-sekolah',
  },
  pengawas: {
    label: 'Pengawas',
    icon: RiTeamLine,
    color: 'from-emerald-600 to-teal-700',
    accent: 'text-emerald-400',
    description: 'Portal pemantauan dan supervisi BK',
    redirect: '/portal/kepala-sekolah',
  },
}

export default function PortalLoginPage() {
  const [searchParams] = useSearchParams()
  const initialRole = searchParams.get('role') || ''
  const [selectedRole, setSelectedRole] = useState(initialRole)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { loginPortal } = useRole()
  const navigate = useNavigate()

  const config = ROLE_CONFIG[selectedRole]

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username || !password) return toast.error('Lengkapi username dan password!')
    setLoading(true)
    try {
      const result = await loginPortal(username, password)
      if (result.success) {
        if (selectedRole && result.account.role !== selectedRole) {
          toast.error('Role akun tidak sesuai dengan portal ini.')
          return
        }
        toast.success(`Selamat datang, ${result.account.name}!`)
        const role = result.account.role
        if (role === 'murid' || role === 'orang_tua') {
          navigate('/portal/murid')
        } else {
          navigate(ROLE_CONFIG[role]?.redirect || '/portal/kepala-sekolah')
        }
      } else {
        toast.error(result.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-indigo-950">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to main */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors group"
        >
          <RiArrowLeftLine className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Login Utama
        </button>

        {!selectedRole ? (
          /* Role Selection */
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <img src="/logo.svg" alt="Konselia Logo" className="w-16 h-16 rounded-2xl mx-auto mb-4 shadow-glow-sm" />
              <h1 className="text-2xl font-display font-black text-white">Portal Konselia</h1>
              <p className="text-slate-400 text-sm mt-1">Pilih portal sesuai peran Anda</p>
            </div>

            <div className="space-y-3">
              {Object.entries(ROLE_CONFIG).map(([role, cfg]) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all group text-left"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center text-white text-xl shadow-md flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <cfg.icon />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{cfg.label}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{cfg.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                <config.icon className="text-white text-3xl" />
              </div>
              <h1 className="text-2xl font-display font-black text-white">Login {config.label}</h1>
              <p className="text-slate-400 text-sm mt-1">{config.description}</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Username / Email</label>
                <div className="relative">
                  <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Masukkan username..."
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-primary-400 focus:bg-white/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <RiLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-primary-400 focus:bg-white/15 transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r ${config.color} hover:opacity-90 transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 mt-2`}
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <RiShieldStarLine />
                )}
                {loading ? 'Memverifikasi...' : `Masuk sebagai ${config.label}`}
              </button>
            </form>

            <button
              onClick={() => setSelectedRole('')}
              className="w-full mt-4 text-slate-400 hover:text-white text-sm text-center transition-colors"
            >
              ← Pilih peran lain
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
