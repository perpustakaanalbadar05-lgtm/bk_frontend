import { useState, useRef } from 'react'
import {
  RiAddLine, RiHeartLine, RiUserLine, RiTimeLine, RiCheckboxCircleLine,
  RiFileLine, RiCloseLine, RiBallPenLine, RiEraserLine, RiCheckLine,
  RiArrowRightLine, RiFileTextLine, RiAccountCircleLine
} from 'react-icons/ri'
import SignatureCanvas from 'react-signature-canvas'
import toast from 'react-hot-toast'

const INITIAL_SESSIONS = [
  { id: 1, siswa: 'Ahmad Fauzi', kelas: 'XI IPA 2', tanggal: '11 Mei 2026', topik: 'Masalah Belajar', jenis: 'Individu', status: 'Selesai', durasi: '45 mnt', signature: true },
  { id: 2, siswa: 'Siti Rahma', kelas: 'X IPS 1', tanggal: '11 Mei 2026', topik: 'Karir & Studi Lanjut', jenis: 'Individu', status: 'Proses', durasi: '30 mnt', signature: false },
  { id: 3, siswa: 'Kelas X IPA 1', kelas: 'X IPA 1', tanggal: '10 Mei 2026', topik: 'Orientasi BK', jenis: 'Kelompok', status: 'Selesai', durasi: '60 mnt', signature: true },
  { id: 4, siswa: 'Dewi Lestari', kelas: 'XI IPS 3', tanggal: '12 Mei 2026', topik: 'Pribadi & Keluarga', jenis: 'Individu', status: 'Terjadwal', durasi: '-', signature: false },
  { id: 5, siswa: 'Riko Prasetyo', kelas: 'X IPA 1', tanggal: '09 Mei 2026', topik: 'Motivasi Belajar', jenis: 'Individu', status: 'Selesai', durasi: '40 mnt', signature: true },
]

const STATUS_CLS = {
  'Selesai': 'badge bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'Proses': 'badge bg-primary-500/20 text-primary-300 border border-primary-500/30',
  'Terjadwal': 'badge bg-amber-500/20 text-amber-300 border border-amber-500/30',
}

const JENIS_CLS = {
  'Individu': 'badge bg-accent-500/20 text-accent-300 border border-accent-500/30',
  'Kelompok': 'badge bg-teal-500/20 text-teal-300 border border-teal-500/30',
}

export default function KonselingPage() {
  const [activeTab, setActiveTab] = useState('semua')
  const [showForm, setShowForm] = useState(false)
  const [sessions, setSessions] = useState(INITIAL_SESSIONS)
  const tabs = ['semua', 'terjadwal', 'proses', 'selesai']
  
  // Signature ref
  const sigCanvas = useRef(null)

  // Form state
  const [formData, setFormData] = useState({
    siswa: '', kelas: '', topik: '', jenis: 'Individu', ringkasan: ''
  })

  const handleClearSignature = () => {
    if (sigCanvas.current) sigCanvas.current.clear()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (sigCanvas.current.isEmpty()) {
      return toast.error("Harap masukkan tanda tangan siswa sebagai validasi jurnal.");
    }

    const newSession = {
      id: sessions.length + 1,
      siswa: formData.siswa,
      kelas: formData.kelas || 'XII',
      tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      topik: formData.topik,
      jenis: formData.jenis,
      status: 'Selesai',
      durasi: '30 mnt',
      signature: true
    }

    setSessions([newSession, ...sessions])
    setShowForm(false)
    setFormData({ siswa: '', kelas: '', topik: '', jenis: 'Individu', ringkasan: '' })
    toast.success("Jurnal Konseling Berhasil Disimpan! Digital signature terekam.");
  }

  const filtered = activeTab === 'semua'
    ? sessions
    : sessions.filter(s => s.status.toLowerCase() === activeTab)

  return (
    <div className="space-y-6 relative">
      {/* OVERLAY FORM DRAWER */}
      {showForm && (
        <div className="fixed inset-0 z-[999] flex justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-xl h-full bg-dark-950 border-l border-white/20 shadow-2xl overflow-y-auto animate-in flex flex-col" style={{animationDuration: '0.3s'}}>
            <div className="p-6 border-b border-white/20 flex items-center justify-between sticky top-0 bg-dark-950/90 backdrop-blur z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                  <RiBallPenLine className="text-xl text-white" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-white text-lg">Pencatatan Jurnal Digital</h2>
                  <p className="text-dark-200 text-xs">Rekam sesi layanan bimbingan konseling</p>
                </div>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-white/10 text-dark-200 hover:text-white transition-colors">
                <RiCloseLine className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-dark-200 block mb-2">Informasi Subjek</label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" placeholder="Nama Siswa / Kelompok" required 
                    className="input-field text-sm col-span-2"
                    value={formData.siswa} onChange={e => setFormData({...formData, siswa: e.target.value})}
                  />
                  <input 
                    type="text" placeholder="Kelas (cth: X IPA 1)" required 
                    className="input-field text-sm"
                    value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value})}
                  />
                  <select 
                    className="input-field text-sm"
                    value={formData.jenis} onChange={e => setFormData({...formData, jenis: e.target.value})}
                  >
                    <option value="Individu">Individu</option>
                    <option value="Kelompok">Kelompok</option>
                    <option value="Klasikal">Klasikal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-dark-200 block mb-2">Detail Layanan</label>
                <input 
                  type="text" placeholder="Topik Permasalahan" required 
                  className="input-field text-sm mb-3"
                  value={formData.topik} onChange={e => setFormData({...formData, topik: e.target.value})}
                />
                <textarea 
                  placeholder="Tulis ringkasan solusi/kesimpulan sesi konseling di sini..." 
                  className="input-field text-sm min-h-[120px] resize-none"
                  value={formData.ringkasan} onChange={e => setFormData({...formData, ringkasan: e.target.value})}
                ></textarea>
              </div>

              {/* SIGNATURE AREA */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <RiAccountCircleLine className="text-base" /> Tanda Tangan Siswa (Validasi)
                  </label>
                  <button type="button" onClick={handleClearSignature} className="text-xs text-dark-200 hover:text-red-400 flex items-center gap-1 transition-colors">
                    <RiEraserLine /> Bersihkan
                  </button>
                </div>
                <div className="border-2 border-dashed border-white/20 rounded-xl bg-white overflow-hidden h-[180px]">
                  <SignatureCanvas 
                    ref={sigCanvas}
                    penColor='black'
                    canvasProps={{
                      className: 'sigCanvas w-full h-full',
                      style: { width: '100%', height: '100%', cursor: 'crosshair' }
                    }} 
                  />
                </div>
                <p className="text-[10px] text-dark-300 mt-2 italic text-center">Silakan minta siswa/konseli untuk menandatangani kotak di atas.</p>
              </div>
            </form>

            <div className="p-6 border-t border-white/20 bg-white/5 flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">Batal</button>
              <button type="button" onClick={handleSubmit} className="btn-primary flex-1 bg-primary-500 gap-2">
                <RiCheckLine /> Simpan Jurnal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN UI */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            Jurnal Konseling Digital
            <span className="badge-primary text-[10px] py-0.5">Realtime</span>
          </h1>
          <p className="text-dark-200 text-sm">Arsip & pencatatan sesi layanan bimbingan lengkap dengan digital signature.</p>
        </div>
        <button 
          id="konseling-add-btn" 
          onClick={() => setShowForm(true)}
          className="btn-primary text-sm py-2.5 shadow-glow-teal bg-primary-500 animate-pulse-slow"
        >
          <RiBallPenLine className="text-lg" /> Catat Sesi Baru
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Sesi', value: sessions.length, icon: RiHeartLine, color: 'text-primary-400' },
          { label: 'Bulan Ini', value: '12', icon: RiTimeLine, color: 'text-accent-400' },
          { label: 'Tervalidasi', value: sessions.filter(s => s.signature).length, icon: RiCheckLine, color: 'text-teal-400' },
          { label: 'Siswa Unik', value: '38', icon: RiUserLine, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card-feature flex items-center gap-4 py-5 px-6 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-6xl"><Icon /></div>
            <div className={`p-3 rounded-xl bg-white/10 border border-white/20 ${color}`}>
              <Icon className="text-2xl" />
            </div>
            <div>
              <div className={`font-display font-black text-2xl text-white`}>{value}</div>
              <div className="text-dark-200 text-xs">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + List View */}
      <div className="card-feature p-0 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/20 bg-white/5">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab ? 'bg-primary-600/20 border border-primary-500/50 text-white' : 'text-dark-300 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="text-xs text-dark-300 hidden md:block">Menampilkan {filtered.length} arsip</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20 bg-dark-900/30">
                <th className="table-header text-left py-4 px-6">Subjek / Siswa</th>
                <th className="table-header text-left py-4 px-4">Topik Utama</th>
                <th className="table-header text-left py-4 px-4 hidden md:table-cell">Klasifikasi</th>
                <th className="table-header text-center py-4 px-4">Ttd</th>
                <th className="table-header text-left py-4 px-4">Status</th>
                <th className="table-header text-center py-4 px-6">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-white/5 transition-all group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center font-bold text-dark-300 border border-white/20 group-hover:border-primary-500/50 group-hover:text-white transition-colors">
                        {s.siswa[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-primary-300 transition-colors">{s.siswa}</div>
                        <div className="text-dark-300 text-xs flex items-center gap-1.5 mt-0.5">
                          <span className="font-medium">{s.kelas}</span> • <span className="opacity-70">{s.tanggal}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-medium text-dark-200">{s.topik}</td>
                  <td className="table-cell hidden md:table-cell"><span className={JENIS_CLS[s.jenis]}>{s.jenis}</span></td>
                  <td className="py-4 px-4 text-center">
                    {s.signature ? (
                      <div className="inline-flex p-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Tanda tangan terekam">
                        <RiBallPenLine />
                      </div>
                    ) : (
                      <div className="inline-flex p-1.5 rounded-full bg-white/10 text-dark-600" title="Belum ditanda tangani">
                        <RiBallPenLine />
                      </div>
                    )}
                  </td>
                  <td className="table-cell"><span className={STATUS_CLS[s.status]}>{s.status}</span></td>
                  <td className="py-4 px-6 text-center">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white hover:bg-primary-600 hover:border-primary-500 transition-all">
                      <RiFileTextLine className="text-sm" /> Buka Jurnal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <RiFileTextLine className="text-5xl text-dark-700 mx-auto mb-3" />
              <p className="text-dark-300">Tidak ada data konseling untuk filter "{activeTab}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
