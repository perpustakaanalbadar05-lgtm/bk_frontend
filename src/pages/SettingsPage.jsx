import { useState } from 'react'
import {
  RiShieldStarLine, RiUserLine, RiLockLine, RiBellLine,
  RiPaletteLine, RiSaveLine, RiBuildingLine, RiGroupLine,
  RiUploadCloud2Line, RiDeleteBinLine, RiAddLine, RiLoader4Line,
  RiEyeLine, RiEyeOffLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import api from '../lib/axios'

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const { classes, setClasses, sekolah, setSekolah } = useSettings()
  const [activeTab, setActiveTab] = useState('profil')
  const [newClass, setNewClass] = useState('')
  const [saving, setSaving] = useState(false)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    nip: user?.nip || '',
    hp: user?.hp || '',
  })

  // Password form state
  const [passForm, setPassForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false })

  const tabs = [
    { id: 'profil', label: 'Profil Guru BK', icon: RiUserLine },
    { id: 'sekolah', label: 'Profil Sekolah', icon: RiBuildingLine },
    { id: 'kelas', label: 'Manajemen Kelas', icon: RiGroupLine },
    { id: 'keamanan', label: 'Keamanan', icon: RiLockLine },
    { id: 'notifikasi', label: 'Notifikasi', icon: RiBellLine },
    { id: 'aplikasi', label: 'Aplikasi', icon: RiPaletteLine },
  ]

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      return toast.error('Nama dan email wajib diisi!')
    }
    setSaving(true)
    try {
      const res = await api.put('/user', profileForm)
      updateUser(res.data.user)
      toast.success('Profil berhasil diperbarui!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal memperbarui profil.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSekolah = () => {
    toast.success('Profil sekolah berhasil disimpan!')
  }

  const handleChangePassword = async () => {
    if (!passForm.current_password || !passForm.new_password) {
      return toast.error('Semua kolom password wajib diisi!')
    }
    if (passForm.new_password !== passForm.new_password_confirmation) {
      return toast.error('Konfirmasi password baru tidak cocok!')
    }
    if (passForm.new_password.length < 8) {
      return toast.error('Password baru minimal 8 karakter!')
    }
    setSaving(true)
    try {
      await api.post('/auth/change-password', passForm)
      setPassForm({ current_password: '', new_password: '', new_password_confirmation: '' })
      toast.success('Password berhasil diubah!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal mengubah password.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddClass = () => {
    if (newClass.trim() && !classes.includes(newClass.trim())) {
      setClasses([...classes, newClass.trim()])
      setNewClass('')
      toast.success('Kelas berhasil ditambahkan!')
    }
  }

  const removeClass = (c) => {
    setClasses(classes.filter(x => x !== c))
    toast.success('Kelas dihapus!')
  }

  const handleLogoUpload = (e, field) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) return toast.error('Ukuran file maksimal 2MB!')
    const reader = new FileReader()
    reader.onload = (evt) => {
      setSekolah({ ...sekolah, [field]: evt.target.result })
      toast.success(`${field === 'logo' ? 'Logo' : 'Tanda tangan'} berhasil diunggah!`)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Pengaturan</h1>
        <p className="text-dark-200 text-sm">Kelola profil dan konfigurasi sistem SIMBK</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="card-feature p-2 space-y-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === id ? 'bg-primary-500 text-white shadow-glow-sm' : 'text-dark-200 hover:text-white hover:bg-white/10'}`}>
                <Icon className="text-lg" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 card-feature space-y-6">

          {/* PROFIL */}
          {activeTab === 'profil' && (
            <>
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Profil Pengguna</h2>
                <p className="text-dark-200 text-sm">Perbarui informasi akun Guru BK</p>
              </div>
              <div className="flex items-center gap-4 p-4 glass rounded-xl">
                <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center text-2xl font-bold text-white shadow-glow-sm">
                  {profileForm.name?.[0]?.toUpperCase() || 'G'}
                </div>
                <div>
                  <p className="font-semibold text-white">{profileForm.name || 'Guru BK'}</p>
                  <p className="text-dark-200 text-sm">{profileForm.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Nama Lengkap *</label>
                  <input type="text" className="input-field" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">NIP / NIK</label>
                  <input type="text" placeholder="1234567890" className="input-field" value={profileForm.nip} onChange={e => setProfileForm({...profileForm, nip: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Email *</label>
                  <input type="email" className="input-field" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Nomor HP</label>
                  <input type="tel" placeholder="+62 8xx-xxxx-xxxx" className="input-field" value={profileForm.hp} onChange={e => setProfileForm({...profileForm, hp: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t border-white/10">
                <button onClick={handleSaveProfile} disabled={saving} className="btn-primary py-2.5 disabled:opacity-60">
                  {saving ? <RiLoader4Line className="animate-spin" /> : <RiSaveLine />}
                  {saving ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </div>
            </>
          )}

          {/* SEKOLAH */}
          {activeTab === 'sekolah' && (
            <div className="animate-in">
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Profil Sekolah & Identitas</h2>
                <p className="text-dark-200 text-sm">Data digunakan otomatis untuk kop surat dan laporan BK.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Nama Sekolah</label>
                  <input type="text" placeholder="SMA Negeri 1 ..." className="input-field" value={sekolah.nama || ''} onChange={e => setSekolah({...sekolah, nama: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">NPSN</label>
                  <input type="text" placeholder="12345678" className="input-field" value={sekolah.npsn || ''} onChange={e => setSekolah({...sekolah, npsn: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Tahun Ajaran</label>
                  <input type="text" placeholder="2025/2026" className="input-field" value={sekolah.tahun || ''} onChange={e => setSekolah({...sekolah, tahun: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Yayasan / Dinas</label>
                  <input type="text" placeholder="Dinas Pendidikan Kab. ..." className="input-field" value={sekolah.yayasan || ''} onChange={e => setSekolah({...sekolah, yayasan: e.target.value})} />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-dark-300 mb-2">Alamat Lengkap</label>
                  <input type="text" placeholder="Jl. Pendidikan No.1" className="input-field" value={sekolah.alamat || ''} onChange={e => setSekolah({...sekolah, alamat: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Nama Kepala Sekolah</label>
                  <input type="text" placeholder="Nama Kepala Sekolah, M.Pd." className="input-field" value={sekolah.kepsek || ''} onChange={e => setSekolah({...sekolah, kepsek: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">NIP Kepala Sekolah</label>
                  <input type="text" placeholder="19800101 200501 1 001" className="input-field" value={sekolah.nip_kepsek || ''} onChange={e => setSekolah({...sekolah, nip_kepsek: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Logo / Kop Surat</label>
                  <label className="border-2 border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer bg-white/5 group relative overflow-hidden">
                    {sekolah.logo ? (
                      <img src={sekolah.logo} alt="Logo" className="h-16 object-contain mb-2" />
                    ) : (
                      <RiUploadCloud2Line className="text-3xl text-primary-400 mb-2" />
                    )}
                    <span className="text-sm text-white font-medium">{sekolah.logo ? 'Ganti Logo' : 'Upload Logo Sekolah'}</span>
                    <span className="text-xs text-dark-300 mt-1">PNG/JPG (Maks 2MB)</span>
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleLogoUpload(e, 'logo')} />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">Tanda Tangan Kepala Sekolah</label>
                  <label className="border-2 border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors cursor-pointer bg-white/5">
                    {sekolah.ttd ? (
                      <img src={sekolah.ttd} alt="TTD" className="h-16 object-contain mb-2" />
                    ) : (
                      <RiUploadCloud2Line className="text-3xl text-primary-400 mb-2" />
                    )}
                    <span className="text-sm text-white font-medium">{sekolah.ttd ? 'Ganti TTD' : 'Upload File Tanda Tangan'}</span>
                    <span className="text-xs text-dark-300 mt-1">PNG Transparan disarankan</span>
                    <input type="file" className="hidden" accept="image/*" onChange={e => handleLogoUpload(e, 'ttd')} />
                  </label>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-white/20">
                <button onClick={handleSaveSekolah} className="btn-primary py-2.5">
                  <RiSaveLine /> Simpan Profil Sekolah
                </button>
              </div>
            </div>
          )}

          {/* KELAS */}
          {activeTab === 'kelas' && (
            <div className="animate-in">
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Manajemen Kelas</h2>
                <p className="text-dark-200 text-sm">Daftar kelas yang tersedia di sistem untuk penjurusan siswa.</p>
              </div>
              <div className="flex gap-2 mt-6">
                <input type="text" placeholder="Nama kelas baru (cth: X IPA 3)" className="input-field flex-1"
                  value={newClass} onChange={e => setNewClass(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddClass()} />
                <button onClick={handleAddClass} className="btn-primary py-2 px-4 whitespace-nowrap">
                  <RiAddLine /> Tambah Kelas
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
                {classes.map(c => (
                  <div key={c} className="flex items-center justify-between p-3 rounded-xl glass border-white/10 group bg-white/5">
                    <span className="text-sm font-semibold text-white">{c}</span>
                    <button onClick={() => removeClass(c)} className="text-dark-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1" title="Hapus Kelas">
                      <RiDeleteBinLine />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* KEAMANAN */}
          {activeTab === 'keamanan' && (
            <div className="animate-in">
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Keamanan Akun</h2>
                <p className="text-dark-200 text-sm">Perbarui password akun Anda</p>
              </div>
              <div className="space-y-4 max-w-md mt-6">
                {[
                  { label: 'Password Lama', key: 'current_password', showKey: 'current' },
                  { label: 'Password Baru (min. 8 karakter)', key: 'new_password', showKey: 'new' },
                  { label: 'Konfirmasi Password Baru', key: 'new_password_confirmation', showKey: 'confirm' },
                ].map(({ label, key, showKey }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-dark-300 mb-2">{label}</label>
                    <div className="relative">
                      <input
                        type={showPass[showKey] ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="input-field pr-10"
                        value={passForm[key]}
                        onChange={e => setPassForm({...passForm, [key]: e.target.value})}
                      />
                      <button type="button" onClick={() => setShowPass(p => ({...p, [showKey]: !p[showKey]}))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-300 hover:text-white transition-colors">
                        {showPass[showKey] ? <RiEyeOffLine /> : <RiEyeLine />}
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={handleChangePassword} disabled={saving} className="btn-primary py-2.5 w-full disabled:opacity-60">
                  {saving ? <RiLoader4Line className="animate-spin" /> : <RiLockLine />}
                  {saving ? 'Mengubah...' : 'Ubah Password'}
                </button>
              </div>
            </div>
          )}

          {/* NOTIFIKASI */}
          {activeTab === 'notifikasi' && (
            <div className="animate-in">
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Notifikasi</h2>
                <p className="text-dark-200 text-sm">Atur preferensi notifikasi sistem</p>
              </div>
              <div className="space-y-3 mt-6">
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
                      <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-primary-500 transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* APLIKASI */}
          {activeTab === 'aplikasi' && (
            <div className="animate-in">
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Pengaturan Aplikasi</h2>
                <p className="text-dark-200 text-sm">Konfigurasi tampilan dan perilaku SIMBK</p>
              </div>
              <div className="p-4 glass rounded-xl mt-6">
                <div className="flex items-center gap-3">
                  <RiShieldStarLine className="text-primary-400 text-2xl" />
                  <div>
                    <p className="font-semibold text-white text-sm">SIMBK v1.0.0</p>
                    <p className="text-dark-200 text-xs">Sistem Informasi Manajemen Bimbingan dan Konseling</p>
                    <p className="text-dark-300 text-xs">CV. Alifba Media © {new Date().getFullYear()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
