import { useState, useRef } from 'react'
import {
  RiAddLine, RiHeartLine, RiUserLine, RiTimeLine, RiCheckboxCircleLine,
  RiFileLine, RiCloseLine, RiBallPenLine, RiEraserLine, RiCheckLine,
  RiFileTextLine, RiAccountCircleLine, RiPrinterLine, RiDeleteBinLine,
  RiLoader4Line
} from 'react-icons/ri'
import SignatureCanvas from 'react-signature-canvas'
import toast from 'react-hot-toast'
import { useSettings } from '../contexts/SettingsContext'
import { useData } from '../contexts/DataContext'
import ConfirmDialog from '../components/ConfirmDialog'
import StudentSelector from '../components/StudentSelector'

const STATUS_CLS = {
  'Selesai': 'badge bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'Proses': 'badge bg-primary-500/20 text-primary-300 border border-primary-500/30',
  'Terjadwal': 'badge bg-amber-500/20 text-amber-300 border border-amber-500/30',
}

const JENIS_CLS = {
  'Individu': 'badge bg-accent-500/20 text-accent-300 border border-accent-500/30',
  'Kelompok': 'badge bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'Klasikal': 'badge bg-blue-500/20 text-blue-300 border border-blue-500/30',
}

export default function KonselingPage() {
  const [activeTab, setActiveTab] = useState('semua')
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving] = useState(false)
  const { sessions, addSession, deleteSession, siswa } = useData()
  const tabs = ['semua', 'terjadwal', 'proses', 'selesai']

  const sigCanvas = useRef(null)
  const { classes } = useSettings()

  const defaultForm = { student_id: '', siswa: '', kelas: classes?.[0] || '', topik: '', jenis: 'Individu', ringkasan: '', durasi: '30' }
  const [formData, setFormData] = useState(defaultForm)
  const [skipSignature, setSkipSignature] = useState(false)

  const handleClearSignature = () => {
    if (sigCanvas.current) sigCanvas.current.clear()
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!formData.siswa.trim() || !formData.topik.trim()) {
      return toast.error('Nama siswa dan topik wajib diisi!')
    }
    if (!skipSignature && sigCanvas.current?.isEmpty()) {
      return toast.error("Harap masukkan tanda tangan atau centang 'Lewati'.")
    }
    let sid = formData.student_id
    if (!sid) {
      const matched = siswa.find(s => s.nama.toLowerCase() === formData.siswa.toLowerCase())
      if (matched) sid = matched.id
      else return toast.error('Siswa tidak valid. Silakan pilih dari dropdown.')
    }

    setSaving(true)
    try {
      const payload = {
        student_id: sid,
        kelas: formData.kelas || classes?.[0] || '',
        tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
        topik: formData.topik,
        jenis: formData.jenis,
        ringkasan: formData.ringkasan || '',
        status: 'Selesai',
        durasi: formData.durasi ? `${formData.durasi} mnt` : '30 mnt',
        signature: !skipSignature,
      }
      await addSession(payload)
      setShowForm(false)
      setFormData(defaultForm)
      if (sigCanvas.current) sigCanvas.current.clear()
      toast.success('Jurnal Konseling berhasil disimpan!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal menyimpan sesi.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteSession(deleteTarget.id)
      toast.success('Sesi konseling dihapus.')
    } catch {
      toast.error('Gagal menghapus sesi.')
    }
  }

  const filtered = activeTab === 'semua'
    ? sessions
    : sessions.filter(s => s.status.toLowerCase() === activeTab)

  return (
    <div className="space-y-6 relative">
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Sesi Konseling?"
        message={`Sesi "${deleteTarget?.topik}" akan dihapus permanen.`}
        confirmLabel="Hapus"
      />

      {/* DRAWER FORM */}
      {showForm && (
        <div className="fixed inset-0 z-[999] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-xl h-full card-feature border-r-0 border-t-0 border-b-0 rounded-none rounded-l-2xl shadow-2xl flex flex-col p-0 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-dark-900/80 backdrop-blur z-10 flex-shrink-0">
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

            <form onSubmit={handleSubmit} className="p-6 space-y-5 flex-1 min-h-0 overflow-y-auto">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-dark-200 block mb-2">Informasi Subjek</label>
                <div className="space-y-3">
                  {/* StudentSelector — autocomplete dari database */}
                  <StudentSelector
                    siswa={siswa}
                    value={formData.siswa}
                    kelas={formData.kelas}
                    onSelect={(s) => setFormData({...formData, siswa: s.nama, student_id: s.id, kelas: s.kelas || formData.kelas})}
                    onChange={(val) => setFormData({...formData, siswa: val})}
                    placeholder="Cari nama / NIS siswa..."
                  />
                  {formData.siswa && !siswa.find(s => s.nama === formData.siswa) && (
                    <p className="text-amber-400 text-[10px] flex items-center gap-1">⚠️ Nama ini tidak ada di database siswa. Pastikan ejaan benar.</p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <select className="input-field text-sm" value={formData.kelas} onChange={e => setFormData({...formData, kelas: e.target.value})}>
                      <option value="" disabled>Pilih Kelas</option>
                      {classes?.length ? classes.map(c => <option key={c} value={c}>{c}</option>) : <option value="" disabled>Belum ada kelas di Pengaturan</option>}
                    </select>
                    <select className="input-field text-sm" value={formData.jenis} onChange={e => setFormData({...formData, jenis: e.target.value})}>
                      <option value="Individu">Individu</option>
                      <option value="Kelompok">Kelompok</option>
                      <option value="Klasikal">Klasikal</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-dark-200 block mb-2">Detail Layanan</label>
                <input
                  type="text" placeholder="Topik Permasalahan" required
                  className="input-field text-sm mb-3"
                  value={formData.topik} onChange={e => setFormData({...formData, topik: e.target.value})}
                />
                <div className="flex gap-3 mb-3">
                  <div className="flex-1">
                    <label className="text-xs text-dark-300 block mb-1">Durasi (menit)</label>
                    <input
                      type="number" min="5" max="180" placeholder="30"
                      className="input-field text-sm"
                      value={formData.durasi} onChange={e => setFormData({...formData, durasi: e.target.value})}
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Ringkasan solusi / kesimpulan sesi..."
                  className="input-field text-sm min-h-[100px] resize-none"
                  value={formData.ringkasan} onChange={e => setFormData({...formData, ringkasan: e.target.value})}
                />
              </div>

              {/* SIGNATURE */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <RiAccountCircleLine className="text-base" /> Tanda Tangan Siswa
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1 text-xs text-white cursor-pointer select-none">
                      <input type="checkbox" className="accent-primary-500 cursor-pointer w-3.5 h-3.5 rounded" checked={skipSignature} onChange={e => setSkipSignature(e.target.checked)} />
                      Lewati
                    </label>
                    <button type="button" onClick={handleClearSignature} className="text-xs text-dark-200 hover:text-red-400 flex items-center gap-1 transition-colors">
                      <RiEraserLine /> Bersihkan
                    </button>
                  </div>
                </div>
                {!skipSignature ? (
                  <div className="relative rounded-xl overflow-hidden h-[160px] shadow-inner group" style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
                      <span className="font-display font-black text-4xl" style={{ color: '#ffffff' }}>TTD DI SINI</span>
                    </div>
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor='#ffffff'
                      canvasProps={{ className: 'sigCanvas w-full h-full relative z-10', style: { width: '100%', height: '100%', cursor: 'crosshair' } }}
                    />
                  </div>
                ) : (
                  <div className="h-[160px] border border-dashed border-white/10 rounded-xl flex items-center justify-center bg-black/20">
                    <span className="text-dark-300 text-sm italic">Sesi disimpan tanpa digital signature.</span>
                  </div>
                )}
              </div>
            </form>

            <div className="p-6 border-t border-white/10 bg-dark-900/50 flex gap-3 flex-shrink-0">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 py-3 text-sm">Batal</button>
              <button type="button" onClick={handleSubmit} disabled={saving} className="btn-primary flex-1 bg-primary-500 py-3 gap-2 text-sm disabled:opacity-60">
                {saving ? <RiLoader4Line className="animate-spin" /> : <RiCheckLine className="text-lg" />}
                {saving ? 'Menyimpan...' : 'Simpan Jurnal'}
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
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary-500/20 text-primary-300 border border-primary-500/30">Realtime</span>
          </h1>
          <p className="text-dark-200 text-sm">Arsip & pencatatan sesi layanan bimbingan lengkap dengan digital signature.</p>
        </div>
        <button id="konseling-add-btn" onClick={() => setShowForm(true)} className="btn-primary text-sm py-2.5 shadow-glow-teal bg-primary-500">
          <RiBallPenLine className="text-lg" /> Catat Sesi Baru
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Sesi', value: sessions.length, icon: RiHeartLine, color: 'text-primary-400' },
          { label: 'Bulan Ini', value: sessions.filter(s => s.tanggal?.includes(new Date().toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }))).length, icon: RiTimeLine, color: 'text-accent-400' },
          { label: 'Tervalidasi', value: sessions.filter(s => s.signature).length, icon: RiCheckLine, color: 'text-teal-400' },
          { label: 'Siswa Unik', value: new Set(sessions.map(s => s.siswa)).size, icon: RiUserLine, color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card-feature flex items-center gap-4 py-5 px-6 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-6xl"><Icon /></div>
            <div className={`p-3 rounded-xl bg-white/10 border border-white/20 ${color}`}><Icon className="text-2xl" /></div>
            <div>
              <div className="font-display font-black text-2xl text-white">{value}</div>
              <div className="text-dark-200 text-xs">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card-feature p-0 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-white/20 bg-white/5 hide-on-print">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-primary-600/20 border border-primary-500/50 text-white' : 'text-dark-300 hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="text-xs text-dark-300 hidden md:block">Menampilkan {filtered.length} arsip</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="table-header text-left py-4 px-6 bg-transparent">Subjek / Siswa</th>
                <th className="table-header text-left py-4 px-4 bg-transparent">Topik</th>
                <th className="table-header text-left py-4 px-4 hidden md:table-cell bg-transparent">Jenis</th>
                <th className="table-header text-left py-4 px-4 hidden sm:table-cell bg-transparent">Durasi</th>
                <th className="table-header text-center py-4 px-4 bg-transparent">TTD</th>
                <th className="table-header text-left py-4 px-4 bg-transparent">Status</th>
                <th className="table-header text-center py-4 px-6 bg-transparent hide-on-print">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-white/5 transition-all group cursor-pointer">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center font-bold text-dark-300 border border-white/10 group-hover:border-primary-500/50 group-hover:text-white transition-colors">
                        {s.siswa?.[0]}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm group-hover:text-primary-300 transition-colors">{s.siswa}</div>
                        <div className="text-dark-300 text-xs mt-0.5">{s.kelas} • {s.tanggal}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell font-medium text-dark-200">{s.topik}</td>
                  <td className="table-cell hidden md:table-cell"><span className={JENIS_CLS[s.jenis]}>{s.jenis}</span></td>
                  <td className="table-cell hidden sm:table-cell text-dark-300 text-xs">{s.durasi || '-'}</td>
                  <td className="py-4 px-4 text-center">
                    {s.signature ? (
                      <div className="inline-flex p-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="TTD terekam"><RiBallPenLine /></div>
                    ) : (
                      <div className="inline-flex p-1.5 rounded-full bg-white/10 text-dark-600" title="Belum TTD"><RiBallPenLine /></div>
                    )}
                  </td>
                  <td className="table-cell"><span className={STATUS_CLS[s.status]}>{s.status}</span></td>
                  <td className="py-4 px-6 text-center hide-on-print">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => window.print()} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white hover:bg-dark-700 transition-all" title="Cetak">
                        <RiPrinterLine className="text-sm" />
                      </button>
                      <button onClick={() => setDeleteTarget(s)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500 hover:text-white transition-all" title="Hapus">
                        <RiDeleteBinLine className="text-sm" />
                      </button>
                    </div>
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
