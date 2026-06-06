import { useState } from 'react'
import {
  RiShieldStarLine, RiUserLine, RiLockLine, RiBellLine,
  RiPaletteLine, RiSaveLine, RiBuildingLine, RiGroupLine,
  RiUploadCloud2Line, RiDeleteBinLine, RiAddLine, RiLoader4Line,
  RiEyeLine, RiEyeOffLine, RiUserStarLine, RiParentLine,
  RiGraduationCapLine, RiSunLine, RiMoonLine,
  RiEditLine, RiCheckLine, RiCloseLine, RiFileCopyLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useSettings } from '../contexts/SettingsContext'
import { useRole } from '../contexts/RoleContext'
import api from '../lib/axios'

const ROLE_ICONS = { kepala_sekolah: RiUserStarLine, orang_tua: RiParentLine, murid: RiGraduationCapLine }
const ROLE_COLORS = { kepala_sekolah: 'from-blue-500 to-indigo-600', orang_tua: 'from-emerald-500 to-teal-600', murid: 'from-purple-500 to-pink-600' }
const ROLE_LABELS = { kepala_sekolah: 'Kepala Sekolah', orang_tua: 'Orang Tua', murid: 'Murid' }
const ALL_MENUS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'siswa', label: 'Data Siswa' },
  { id: 'klasikal', label: 'Bim. Klasikal' },
  { id: 'konseling', label: 'Konseling' },
  { id: 'kasus', label: 'Penanganan Kasus' },
  { id: 'asesmen', label: 'Asesmen & Psikotes' },
  { id: 'program-bk', label: 'Program BK' },
  { id: 'laporan', label: 'Laporan' },
]

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const { classes, setClasses, sekolah, setSekolah, theme, toggleTheme } = useSettings()
  const { accounts, createAccount, deleteAccount, updateRoleMenus, getVisibleMenus } = useRole()
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

  // Akun modal state
  const [showAkunModal, setShowAkunModal] = useState(false)
  const [editMenuRole, setEditMenuRole] = useState(null)
  const [akunForm, setAkunForm] = useState({ name: '', username: '', password: '', role: 'kepala_sekolah', siswa: '', kelas: '' })

  const handleCreateAkun = () => {
    if (!akunForm.name || !akunForm.username || !akunForm.password) return toast.error('Nama, username, dan password wajib diisi!')
    createAccount(akunForm)
    setAkunForm({ name: '', username: '', password: '', role: 'kepala_sekolah', siswa: '', kelas: '' })
    setShowAkunModal(false)
    toast.success(`Akun ${ROLE_LABELS[akunForm.role]} berhasil dibuat!`)
  }

  const copyPortalLink = (role) => {
    const url = `${window.location.origin}/portal/login?role=${role}`
    navigator.clipboard.writeText(url).then(() => toast.success('Link portal disalin!')).catch(() => toast.error('Gagal menyalin link'))
  }

  const tabs = [
    { id: 'profil', label: 'Profil Guru BK', icon: RiUserLine },
    { id: 'sekolah', label: 'Profil Sekolah', icon: RiBuildingLine },
    { id: 'kelas', label: 'Manajemen Kelas', icon: RiGroupLine },
    { id: 'akun', label: 'Manajemen Akun', icon: RiShieldStarLine },
    { id: 'tampilan', label: 'Tampilan', icon: RiPaletteLine },
    { id: 'keamanan', label: 'Keamanan', icon: RiLockLine },
    { id: 'notifikasi', label: 'Notifikasi', icon: RiBellLine },
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

          {/* MANAJEMEN AKUN */}
          {activeTab === 'akun' && (
            <div className="animate-in space-y-6">
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Manajemen Akun Portal</h2>
                <p className="text-dark-200 text-sm">Kelola akun untuk Kepala Sekolah, Orang Tua, dan Murid.</p>
              </div>

              {/* Portal Link Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(ROLE_LABELS).map(([role, label]) => {
                  const Icon = ROLE_ICONS[role]
                  return (
                    <div key={role} className="glass rounded-xl p-4 flex flex-col gap-3 border border-white/10">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${ROLE_COLORS[role]} flex items-center justify-center text-white text-sm`}><Icon /></div>
                        <span className="text-white font-bold text-sm">{label}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => copyPortalLink(role)} className="flex-1 flex items-center justify-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white py-1.5 rounded-lg transition-colors font-semibold">
                          <RiFileCopyLine /> Salin Link
                        </button>
                        <button onClick={() => setEditMenuRole(role)} className="text-xs bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 py-1.5 px-2 rounded-lg transition-colors">
                          <RiEditLine />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Menu Visibility Editor */}
              {editMenuRole && (
                <div className="glass rounded-xl p-5 border border-primary-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">Atur Menu: {ROLE_LABELS[editMenuRole]}</h3>
                    <button onClick={() => setEditMenuRole(null)} className="text-dark-300 hover:text-white"><RiCloseLine /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {ALL_MENUS.map(menu => {
                      const visible = getVisibleMenus(editMenuRole).includes(menu.id)
                      return (
                        <label key={menu.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer">
                          <input type="checkbox" checked={visible} onChange={e => {
                            const cur = getVisibleMenus(editMenuRole)
                            const next = e.target.checked ? [...cur, menu.id] : cur.filter(m => m !== menu.id)
                            updateRoleMenus(editMenuRole, next)
                          }} className="w-4 h-4 rounded accent-primary-500" />
                          <span className="text-dark-200 text-sm">{menu.label}</span>
                        </label>
                      )
                    })}
                  </div>
                  <button onClick={() => { setEditMenuRole(null); toast.success('Pengaturan menu disimpan!') }} className="btn-primary py-2 text-sm w-full">
                    <RiCheckLine /> Simpan Pengaturan Menu
                  </button>
                </div>
              )}

              {/* Account List */}
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-sm">Daftar Akun ({accounts.length})</h3>
                <button onClick={() => setShowAkunModal(true)} className="btn-primary py-2 text-sm gap-1">
                  <RiAddLine /> Tambah Akun
                </button>
              </div>

              {accounts.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                  <RiShieldStarLine className="text-4xl text-dark-400 mx-auto mb-2" />
                  <p className="text-dark-300 text-sm">Belum ada akun tambahan</p>
                  <button onClick={() => setShowAkunModal(true)} className="mt-3 text-primary-400 text-sm hover:underline">+ Buat akun pertama</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {accounts.map(acc => {
                    const Icon = ROLE_ICONS[acc.role] || RiUserLine
                    return (
                      <div key={acc.id} className="flex items-center gap-3 p-4 glass rounded-xl border border-white/5 group">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ROLE_COLORS[acc.role]} flex items-center justify-center text-white flex-shrink-0`}><Icon /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold text-sm truncate">{acc.name}</p>
                          <p className="text-dark-300 text-xs">@{acc.username} · {ROLE_LABELS[acc.role]}{acc.siswa ? ` · Siswa: ${acc.siswa}` : ''}</p>
                        </div>
                        <button onClick={() => { deleteAccount(acc.id); toast.success('Akun dihapus') }} className="opacity-0 group-hover:opacity-100 p-2 text-dark-300 hover:text-red-400 transition-all">
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Create Account Modal */}
              {showAkunModal && (
                <div className="fixed inset-0 z-[999] bg-dark-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white">Buat Akun Baru</h3>
                      <button onClick={() => setShowAkunModal(false)} className="text-dark-300 hover:text-white"><RiCloseLine className="text-xl" /></button>
                    </div>
                    <div>
                      <label className="text-dark-300 text-xs font-medium block mb-1">Role</label>
                      <select value={akunForm.role} onChange={e => setAkunForm({...akunForm, role: e.target.value})} className="input-field">
                        {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-dark-300 text-xs font-medium block mb-1">Nama Lengkap *</label>
                      <input type="text" placeholder="Nama lengkap..." value={akunForm.name} onChange={e => setAkunForm({...akunForm, name: e.target.value})} className="input-field" />
                    </div>
                    <div>
                      <label className="text-dark-300 text-xs font-medium block mb-1">Username *</label>
                      <input type="text" placeholder="username_unik" value={akunForm.username} onChange={e => setAkunForm({...akunForm, username: e.target.value})} className="input-field" />
                    </div>
                    <div>
                      <label className="text-dark-300 text-xs font-medium block mb-1">Password *</label>
                      <input type="password" placeholder="Min. 6 karakter" value={akunForm.password} onChange={e => setAkunForm({...akunForm, password: e.target.value})} className="input-field" />
                    </div>
                    {(akunForm.role === 'orang_tua' || akunForm.role === 'murid') && (
                      <div>
                        <label className="text-dark-300 text-xs font-medium block mb-1">Nama Siswa (Tautkan ke data siswa)</label>
                        <input type="text" placeholder="Nama siswa yang terkait..." value={akunForm.siswa} onChange={e => setAkunForm({...akunForm, siswa: e.target.value})} className="input-field" />
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setShowAkunModal(false)} className="btn-secondary flex-1 py-2 text-sm">Batal</button>
                      <button onClick={handleCreateAkun} className="btn-primary flex-1 py-2 text-sm"><RiCheckLine /> Buat Akun</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAMPILAN */}
          {activeTab === 'tampilan' && (
            <div className="animate-in space-y-6">
              <div>
                <h2 className="font-display font-bold text-white text-lg mb-1">Pengaturan Tampilan</h2>
                <p className="text-dark-200 text-sm">Sesuaikan tema dan gaya antarmuka SIMBK</p>
              </div>
              <div className="glass rounded-xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <RiMoonLine className="text-2xl text-indigo-400" /> : <RiSunLine className="text-2xl text-amber-400" />}
                    <div>
                      <p className="text-white font-bold text-sm">{theme === 'dark' ? 'Mode Gelap' : 'Mode Terang'}</p>
                      <p className="text-dark-300 text-xs">{theme === 'dark' ? 'Tampilan gelap, cocok untuk malam hari' : 'Tampilan cerah, nyaman siang hari'}</p>
                    </div>
                  </div>
                  <button onClick={toggleTheme} className={`w-14 h-7 rounded-full relative transition-colors duration-300 ${theme === 'dark' ? 'bg-indigo-600' : 'bg-amber-400'}`}>
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${theme === 'dark' ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
              <div className="glass rounded-xl p-4 flex items-center gap-3 border border-white/10">
                <RiShieldStarLine className="text-primary-400 text-2xl" />
                <div>
                  <p className="font-semibold text-white text-sm">SIMBK v1.0.0</p>
                  <p className="text-dark-200 text-xs">Sistem Informasi Manajemen Bimbingan dan Konseling</p>
                  <p className="text-dark-300 text-xs">CV. Alifba Media © {new Date().getFullYear()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
