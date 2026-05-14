import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  RiShieldStarLine, RiArrowRightLine, RiCheckLine,
  RiUserHeartLine, RiFileChartLine, RiRobot2Line,
  RiBarChart2Line, RiPhoneLine, RiMailLine,
  RiMenuLine, RiCloseLine, RiSparklingLine,
  RiGraduationCapLine, RiHeartPulseLine, RiAwardLine,
  RiMoonLine, RiSunLine
} from 'react-icons/ri'

const NAV_LINKS = ['Fitur', 'Manfaat', 'Cara Kerja', 'Kontak']

const FEATURES = [
  {
    icon: RiUserHeartLine,
    title: 'Manajemen Siswa Binaan',
    desc: 'Kelola profil lengkap siswa, riwayat konseling, dan perkembangan dari satu dashboard terintegrasi.',
  },
  {
    icon: RiFileChartLine,
    title: 'Asesmen AKPD Otomatis',
    desc: 'Analisis Kebutuhan Peserta Didik secara digital dengan laporan yang terstruktur dan dapat diunduh.',
  },
  {
    icon: RiRobot2Line,
    title: 'Program BK & RPL Cerdas',
    desc: 'Susun Program Tahunan, Semesteran, dan RPL secara efisien dengan panduan terstruktur.',
  },
  {
    icon: RiHeartPulseLine,
    title: 'Jurnal Konseling Digital',
    desc: 'Catat dan pantau setiap sesi konseling individu maupun kelompok dengan rapi dan terorganisir.',
  },
  {
    icon: RiBarChart2Line,
    title: 'Laporan & Analitik',
    desc: 'Hasilkan laporan berkala otomatis dengan visualisasi data yang informatif dan siap cetak.',
  },
  {
    icon: RiGraduationCapLine,
    title: 'Pemetaan Karawanan Siswa',
    desc: 'Deteksi dini siswa bermasalah berdasarkan data asesmen untuk intervensi yang tepat sasaran.',
  },
]

const STATS = [
  { value: '500+', label: 'Sekolah Pengguna', icon: RiAwardLine },
  { value: '50K+', label: 'Siswa Terlayani', icon: RiUserHeartLine },
  { value: '98%', label: 'Tingkat Kepuasan', icon: RiSparklingLine },
  { value: '24/7', label: 'Dukungan Teknis', icon: RiShieldStarLine },
]

const STEPS = [
  { step: '01', title: 'Daftar & Setup', desc: 'Buat akun sekolah dan konfigurasi data awal guru BK dan kelas dalam hitungan menit.' },
  { step: '02', title: 'Input Data Siswa', desc: 'Impor atau input data siswa dan lakukan asesmen kebutuhan secara digital.' },
  { step: '03', title: 'Susun Program BK', desc: 'Buat Program Tahunan, RPL, dan jadwal layanan BK otomatis berdasarkan hasil asesmen.' },
  { step: '04', title: 'Pantau & Laporan', desc: 'Monitor perkembangan siswa secara real-time dan cetak laporan profesional kapan saja.' },
]

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'))

  const toggleTheme = () => {
    const isDarkNow = document.documentElement.classList.toggle('dark')
    setIsDark(isDarkNow)
    localStorage.setItem('theme', isDarkNow ? 'dark' : 'light')
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="min-h-screen text-white bg-[rgb(var(--bg-main))]">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/10 backdrop-blur-xl border-b border-white/10 py-3' : 'py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center shadow-glow-sm">
              <RiShieldStarLine className="text-white text-lg" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-lg">SIMBK</span>
              <span className="hidden sm:block text-[10px] text-dark-200 leading-none">CV. Alifba Media</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="px-4 py-2 rounded-lg text-dark-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-all">
                {link}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-dark-300 hover:text-white transition-colors" title={isDark ? "Ubah ke Light Mode" : "Ubah ke Dark Mode"}>
              {isDark ? <RiSunLine className="text-lg text-amber-400" /> : <RiMoonLine className="text-lg text-primary-400" />}
            </button>
            <Link to="/login" className="btn-ghost text-sm">Masuk</Link>
            <Link to="/login" className="btn-primary text-sm py-2.5">
              Coba Gratis <RiArrowRightLine />
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-dark-300 hover:text-white transition-colors">
              {isDark ? <RiSunLine className="text-lg text-amber-400" /> : <RiMoonLine className="text-lg text-primary-400" />}
            </button>
            <button className="p-2 rounded-lg glass" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <RiCloseLine className="text-xl" /> : <RiMenuLine className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden mt-2 mx-4 p-4 rounded-2xl glass border border-white/20 space-y-1">
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                className="block px-4 py-2.5 rounded-xl text-dark-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-all"
                onClick={() => setMenuOpen(false)}>
                {link}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" className="btn-secondary text-sm justify-center" onClick={() => setMenuOpen(false)}>Masuk</Link>
              <Link to="/login" className="btn-primary text-sm justify-center" onClick={() => setMenuOpen(false)}>Coba Gratis</Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/30 text-primary-300 text-sm font-medium mb-8 animate-in">
              <RiSparklingLine className="text-primary-400 animate-glow-pulse" />
              Platform Digital BK untuk Sekolah
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6 animate-in delay-100">
              <span className="text-white">Sistem Informasi</span>
              <br />
              <span className="gradient-text">Manajemen BK</span>
              <br />
              <span className="text-white text-4xl sm:text-5xl md:text-6xl">yang Cerdas & Modern</span>
            </h1>

            <p className="text-dark-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto animate-in delay-200">
              SIMBK membantu Guru BK mengelola layanan konseling secara otomatis — mulai dari{' '}
              <span className="text-primary-300 font-medium">asesmen siswa</span> hingga{' '}
              <span className="text-accent-300 font-medium">penyusunan program BK</span>{' '}
              secara efisien dan profesional.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in delay-300">
              <Link to="/login" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
                <RiSparklingLine />
                Mulai Gratis Sekarang
                <RiArrowRightLine />
              </Link>
              <a href="#fitur" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
                Lihat Fitur Lengkap
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10 animate-in delay-400">
              {['Tanpa Biaya Setup', 'Data Aman & Terenkripsi', 'Dukungan Penuh'].map(item => (
                <div key={item} className="flex items-center gap-1.5 text-dark-200 text-sm">
                  <RiCheckLine className="text-teal-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual - stats floating cards */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto animate-in delay-500">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="card-feature text-center p-4">
                <Icon className="text-2xl text-primary-400 mx-auto mb-2" />
                <div className="font-display font-black text-2xl gradient-text">{value}</div>
                <div className="text-dark-200 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="badge badge-primary mb-4 inline-flex">✦ Fitur Unggulan</span>
            <h2 className="section-title mb-4">
              Semua yang Dibutuhkan
              <br />
              <span className="gradient-text">Guru BK Modern</span>
            </h2>
            <p className="section-subtitle">
              Dari asesmen hingga laporan, SIMBK mengintegrasikan seluruh alur kerja bimbingan konseling dalam satu platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-feature group">
                <div className="absolute inset-0 rounded-2xl bg-primary-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-white text-xl" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-dark-200 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="cara-kerja" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="badge badge-accent mb-4 inline-flex">✦ Cara Kerja</span>
            <h2 className="section-title mb-4">
              Mulai dalam <span className="gradient-text">4 Langkah</span>
            </h2>
            <p className="section-subtitle">Onboarding mudah, langsung produktif tanpa pelatihan panjang.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary-500/50 to-transparent z-10" />
                )}
                <div className="card-feature h-full">
                  <div className="text-5xl font-black gradient-text opacity-30 mb-4 font-display">{step}</div>
                  <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
                  <p className="text-dark-200 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="kontak" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="orb orb-1 opacity-20" />
          <div className="orb orb-2 opacity-20" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="card-feature p-12 md:p-16">
            <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center mx-auto mb-6 shadow-glow animate-float">
              <RiShieldStarLine className="text-white text-3xl" />
            </div>
            <h2 className="section-title mb-4">
              Siap Transformasi Layanan BK<br />
              <span className="gradient-text">Sekolah Anda?</span>
            </h2>
            <p className="text-dark-200 text-lg mb-8 max-w-xl mx-auto">
              Bergabung bersama ratusan sekolah yang telah meningkatkan kualitas layanan bimbingan konseling dengan SIMBK dari CV. Alifba Media.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link to="/login" className="btn-primary text-base px-8 py-4">
                <RiSparklingLine /> Daftar Sekarang — Gratis
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-dark-200 text-sm">
              <a href="tel:+62" className="flex items-center gap-2 hover:text-primary-300 transition-colors">
                <RiPhoneLine /> +62 xxx-xxxx-xxxx
              </a>
              <a href="mailto:info@alifbamedia.id" className="flex items-center gap-2 hover:text-primary-300 transition-colors">
                <RiMailLine /> info@alifbamedia.id
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
              <RiShieldStarLine className="text-white text-sm" />
            </div>
            <div>
              <span className="font-display font-bold text-white">SIMBK</span>
              <span className="text-dark-300 text-xs ml-2">by CV. Alifba Media</span>
            </div>
          </div>
          <p className="text-dark-300 text-sm">
            © {new Date().getFullYear()} CV. Alifba Media. Solusi Digital BK yang Cepat, Cerdas, dan Terintegrasi.
          </p>
          <div className="flex gap-4 text-dark-300 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privasi</a>
            <a href="#" className="hover:text-white transition-colors">Syarat</a>
            <a href="#" className="hover:text-white transition-colors">Bantuan</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
