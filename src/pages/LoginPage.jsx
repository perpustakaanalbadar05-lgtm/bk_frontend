import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiShieldStarLine, RiEyeLine, RiEyeOffLine, RiArrowRightLine, RiSparklingLine, RiMoonLine, RiSunLine } from 'react-icons/ri'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))
  const { login } = useAuth()
  const navigate = useNavigate()

  const toggleTheme = () => {
    const isDarkNow = document.documentElement.classList.toggle('dark')
    setIsDark(isDarkNow)
    localStorage.setItem('theme', isDarkNow ? 'dark' : 'light')
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form)
      toast.success('Selamat datang di SIMBK!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Email atau password salah.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[rgb(var(--bg-main))] relative">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-2.5 rounded-xl border border-white/10 bg-white/5 text-dark-300 hover:text-white transition-colors"
        title={isDark ? "Ubah ke Light Mode" : "Ubah ke Dark Mode"}
      >
        {isDark ? <RiSunLine className="text-xl text-amber-400" /> : <RiMoonLine className="text-xl text-primary-400" />}
      </button>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="orb orb-1 opacity-30" />
        <div className="orb orb-2 opacity-20" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        <div className="relative text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-8 shadow-glow animate-float">
            <RiShieldStarLine className="text-white text-4xl" />
          </div>
          <h1 className="font-display font-black text-5xl text-white mb-4">SIMBK</h1>
          <p className="text-primary-300 font-medium text-lg mb-3">Sistem Informasi Manajemen<br />Bimbingan dan Konseling</p>
          <p className="text-dark-300 text-sm leading-relaxed">
            Platform digital BK yang membantu Guru BK mengelola layanan konseling secara otomatis, efisien, dan profesional.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {['Asesmen Digital', 'Program BK Otomatis', 'Laporan Instan', 'Data Terintegrasi'].map(tag => (
              <span key={tag} className="badge badge-primary text-xs">{tag}</span>
            ))}
          </div>
          <p className="mt-10 text-dark-300 text-sm">CV. Alifba Media — Solusi Digital BK</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-10">
            <div className="w-11 h-11 rounded-xl bg-primary-500 flex items-center justify-center shadow-glow-sm">
              <RiShieldStarLine className="text-white text-2xl" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-2xl">SIMBK</div>
              <div className="text-dark-200 text-xs">CV. Alifba Media</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-display font-bold text-3xl text-white mb-2">Selamat Datang</h2>
            <p className="text-dark-200">Masuk untuk mengakses dashboard layanan BK Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2" htmlFor="email">
                Email / Username
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="guru@sekolah.id"
                className="input-field"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-dark-300" htmlFor="password">Password</label>
                <a href="#" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">Lupa password?</a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pr-12"
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-dark-200 hover:text-white transition-colors">
                  {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  <RiSparklingLine />
                  Masuk ke SIMBK
                  <RiArrowRightLine />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <p className="text-dark-200 text-sm">
              Belum memiliki akun?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Hubungi Admin Sekolah
              </Link>
            </p>
          </div>

          <p className="text-center text-dark-600 text-xs mt-6">
            © {new Date().getFullYear()} CV. Alifba Media. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
