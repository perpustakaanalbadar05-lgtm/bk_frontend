import { useState } from 'react'
import { RiShieldStarLine, RiUserLine, RiLockLine, RiBellLine, RiPaletteLine, RiSaveLine } from 'react-icons/ri'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profil')

  const tabs = [
    { id: 'profil', label: 'Profil', icon: RiUserLine },
    { id: 'keamanan', label: 'Keamanan', icon: RiLockLine },
    { id: 'notifikasi', label: 'Notifikasi', icon: RiBellLine },
    { id: 'aplikasi', label: 'Aplikasi', icon: RiPaletteLine },
  ]

  const handleSave = () => toast.success('Pengaturan berhasil disimpan!')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Pengaturan</h1>
        <p className="text-dark-400 text-sm">Kelola profil dan konfigurasi sistem SIMBK</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="card-feature p-2 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id ? 'bg-primary-600/40 text-white border border-primary-500/30' : 'text-dark-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="text-lg" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 card-feature space-y-6">
          {activeTab === 'profil' && (
            <>
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Profil Pengguna</h2>
                <p className="text-dark-400 text-sm">Perbarui informasi akun Guru BK</p>
              </div>
              <div className="flex items-center gap-4 p-4 glass rounded-xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white">
                  {user?.name?.[0]?.toUpperCase() || 'G'}
                </div>
                <div>
                  <p className="font-semibold text-white">{user?.name || 'Guru BK'}</p>
                  <p className="text-dark-400 text-sm">{user?.email || 'guru@sekolah.id'}</p>
                  <button className="text-primary-400 text-xs mt-1 hover:text-primary-300 transition-colors">Ganti Foto</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Nama Lengkap', placeholder: user?.name || 'Nama Guru BK', type: 'text' },
                  { label: 'NIP / NIK', placeholder: '1234567890', type: 'text' },
                  { label: 'Email', placeholder: user?.email || 'guru@sekolah.id', type: 'email' },
                  { label: 'Nomor HP', placeholder: '+62 8xx-xxxx-xxxx', type: 'tel' },
                  { label: 'Nama Sekolah', placeholder: 'SMA Negeri 1 ...', type: 'text' },
                  { label: 'NPSN', placeholder: '12345678', type: 'text' },
                ].map(({ label, placeholder, type }) => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-dark-300 mb-2">{label}</label>
                    <input type={type} placeholder={placeholder} className="input-field" />
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'keamanan' && (
            <>
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Keamanan Akun</h2>
                <p className="text-dark-400 text-sm">Perbarui password akun Anda</p>
              </div>
              <div className="space-y-4 max-w-md">
                {['Password Lama', 'Password Baru', 'Konfirmasi Password Baru'].map(label => (
                  <div key={label}>
                    <label className="block text-sm font-medium text-dark-300 mb-2">{label}</label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'notifikasi' && (
            <>
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Notifikasi</h2>
                <p className="text-dark-400 text-sm">Atur preferensi notifikasi sistem</p>
              </div>
              <div className="space-y-3">
                {[
                  'Pengingat jadwal konseling',
                  'Laporan bulanan otomatis',
                  'Notifikasi siswa baru',
                  'Alert siswa bermasalah',
                  'Update sistem SIMBK',
                ].map(item => (
                  <label key={item} className="flex items-center justify-between p-4 glass rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
                    <span className="text-dark-200 text-sm">{item}</span>
                    <div className="relative">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-dark-700 rounded-full peer peer-checked:bg-primary-600 transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}

          {activeTab === 'aplikasi' && (
            <>
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Pengaturan Aplikasi</h2>
                <p className="text-dark-400 text-sm">Konfigurasi tampilan dan perilaku SIMBK</p>
              </div>
              <div className="p-4 glass rounded-xl">
                <div className="flex items-center gap-3">
                  <RiShieldStarLine className="text-primary-400 text-2xl" />
                  <div>
                    <p className="font-semibold text-white text-sm">SIMBK v1.0.0</p>
                    <p className="text-dark-400 text-xs">Sistem Informasi Manajemen Bimbingan dan Konseling</p>
                    <p className="text-dark-500 text-xs">CV. Alifba Media © {new Date().getFullYear()}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button id="settings-save-btn" onClick={handleSave} className="btn-primary py-2.5">
              <RiSaveLine /> Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
