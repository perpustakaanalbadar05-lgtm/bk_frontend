import { useState } from 'react'
import {
  RiHomeHeartLine, RiMapPinLine, RiCalendarCheckLine,
  RiAddLine, RiSearchLine, RiCheckDoubleLine, RiFileList3Line,
  RiScales3Line, RiPrinterLine, RiCloseLine, RiSaveLine,
  RiLoader4Line, RiDeleteBinLine, RiChatVoiceLine, RiPhoneLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'
import { useData } from '../contexts/DataContext'
import { useSettings } from '../contexts/SettingsContext'
import ConfirmDialog from '../components/ConfirmDialog'
import StudentSelector from '../components/StudentSelector'

function KasusModal({ isOpen, onClose, onSave, classes, siswa = [], defaultVisit = false }) {
  const [form, setForm] = useState({
    siswa: '', kelas: classes?.[0] || '', kasus: '', poin: 10, status: 'Proses', visit: defaultVisit, konseling: false, panggilan: false
  })
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!form.siswa || !form.kasus) return toast.error('Nama siswa dan deskripsi kasus wajib diisi!')
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md card-feature p-0 flex flex-col overflow-hidden animate-in">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h2 className="font-display font-bold text-white text-lg">Catat Kasus / Pelanggaran</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-dark-200 hover:text-white"><RiCloseLine /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1.5">Nama Siswa *</label>
            <StudentSelector
              siswa={siswa}
              value={form.siswa}
              kelas={form.kelas}
              onSelect={(s) => setForm({...form, siswa: s.nama, kelas: s.kelas || form.kelas})}
              onChange={(val) => setForm({...form, siswa: val})}
              placeholder="Cari nama / NIS siswa..."
            />
            {form.siswa && !siswa.find(s => s.nama === form.siswa) && (
              <p className="text-amber-400 text-[10px] mt-1 flex items-center gap-1">⚠️ Nama tidak ditemukan di database siswa.</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1">Kelas</label>
              <select className="input-field text-sm" value={form.kelas} onChange={e => setForm({...form, kelas: e.target.value})}>
                <option value="" disabled>Pilih Kelas</option>
                {classes?.length ? classes.map(k => <option key={k} value={k}>{k}</option>) : <option value="" disabled>Belum ada kelas di Pengaturan</option>}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1">Poin Pelanggaran</label>
              <input type="number" min="0" max="100" className="input-field" value={form.poin} onChange={e => setForm({...form, poin: parseInt(e.target.value) || 0})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1">Status</label>
            <select className="input-field text-sm" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              <option value="Proses">Proses</option>
              <option value="Selesai">Selesai</option>
              <option value="Terjadwal">Terjadwal</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1">Kasus / Bentuk Pelanggaran</label>
            <textarea rows="3" placeholder="Jelaskan secara singkat..." required className="input-field resize-none" value={form.kasus} onChange={e => setForm({...form, kasus: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-2">Tindakan Lanjutan (Opsional)</label>
            <div className="flex items-center justify-between p-3 rounded-xl glass border border-amber-500/20">
              <div>
                <label className="font-semibold text-white text-sm flex items-center gap-1.5"><RiHomeHeartLine className="text-amber-400"/> Home Visit</label>
                <p className="text-dark-200 text-[10px] mt-0.5">Jadwalkan kunjungan rumah orang tua.</p>
              </div>
              <input type="checkbox" className="accent-amber-500 w-4 h-4 cursor-pointer" checked={form.visit} onChange={e => setForm({...form, visit: e.target.checked})} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl glass border border-blue-500/20">
              <div>
                <label className="font-semibold text-white text-sm flex items-center gap-1.5"><RiChatVoiceLine className="text-blue-400"/> Konseling</label>
                <p className="text-dark-200 text-[10px] mt-0.5">Jadwalkan sesi konseling khusus.</p>
              </div>
              <input type="checkbox" className="accent-blue-500 w-4 h-4 cursor-pointer" checked={form.konseling} onChange={e => setForm({...form, konseling: e.target.checked})} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl glass border border-purple-500/20">
              <div>
                <label className="font-semibold text-white text-sm flex items-center gap-1.5"><RiPhoneLine className="text-purple-400"/> Panggilan Orang Tua</label>
                <p className="text-dark-200 text-[10px] mt-0.5">Undang orang tua wali ke sekolah.</p>
              </div>
              <input type="checkbox" className="accent-purple-500 w-4 h-4 cursor-pointer" checked={form.panggilan} onChange={e => setForm({...form, panggilan: e.target.checked})} />
            </div>
          </div>
        </form>
        <div className="p-4 border-t border-white/10 bg-dark-950/50 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 btn-secondary text-sm py-2">Batal</button>
          <button type="button" onClick={handleSubmit} disabled={saving} className="flex-1 btn-primary text-sm py-2 gap-2 bg-primary-500 disabled:opacity-60">
            {saving ? <RiLoader4Line className="animate-spin" /> : <RiSaveLine />}
            {saving ? 'Menyimpan...' : 'Simpan Kasus'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function KasusPage() {
  const { classes } = useSettings()
  const { kasus, siswa, addKasus, updateKasus, deleteKasus } = useData()
  const [activeTab, setActiveTab] = useState('kasus')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [defaultVisitCheck, setDefaultVisitCheck] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const getStudentAddress = (namaStr) => {
    const found = siswa.find(s => s.nama?.toLowerCase() === namaStr?.toLowerCase())
    return found?.alamat || 'Alamat belum tercatat di data siswa.'
  }

  const handleSaveKasus = async (form) => {
    try {
      const payload = {
        ...form,
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      }
      await addKasus(payload)
      setModalOpen(false)
      toast.success('Data Kasus Kedisiplinan berhasil disimpan!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal menyimpan kasus.')
      throw err
    }
  }

  const handleMarkDone = async (k) => {
    try {
      await updateKasus(k.id, { status: 'Selesai' })
      toast.success('Status kunjungan diperbarui!')
    } catch {
      toast.error('Gagal memperbarui status.')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteKasus(deleteTarget.id)
      toast.success('Kasus berhasil dihapus.')
    } catch {
      toast.error('Gagal menghapus kasus.')
    }
  }

  const openAddModal = (withVisit = false) => {
    setDefaultVisitCheck(withVisit)
    setModalOpen(true)
  }

  const filteredKasus = kasus.filter(k =>
    k.siswa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.kasus?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in">
      <KasusModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveKasus}
        classes={classes}
        siswa={siswa}
        defaultVisit={defaultVisitCheck}
      />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Kasus?"
        message={`Kasus "${deleteTarget?.siswa}" akan dihapus permanen.`}
        confirmLabel="Hapus"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Buku Kasus & Poin Kedisiplinan</h1>
          <p className="text-dark-200 text-sm">Pencatatan pelanggaran, akumulasi poin, dan agenda Home Visit.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openAddModal(false)} className="btn-secondary text-sm py-2"><RiAddLine /> Catat Kasus</button>
          <button onClick={() => openAddModal(true)} className="btn-primary text-sm py-2 bg-primary-500"><RiCalendarCheckLine /> Catat Tindakan Lanjutan</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-white/20 hide-on-print">
        <div className="flex gap-6 w-max">
          <button onClick={() => setActiveTab('kasus')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'kasus' ? 'border-primary-500 text-white' : 'border-transparent text-dark-300 hover:text-white'}`}>
            <RiScales3Line className="text-lg" /> Poin & Pelanggaran
          </button>
          <button onClick={() => setActiveTab('tindakan')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'tindakan' ? 'border-amber-500 text-white' : 'border-transparent text-dark-300 hover:text-white'}`}>
            <RiCalendarCheckLine className="text-lg" /> Agenda Tindakan
          </button>
        </div>
      </div>

      {activeTab === 'kasus' ? (
        <div className="card-feature p-0 overflow-hidden animate-in">
          <div className="p-5 border-b border-white/20 flex justify-between items-center bg-white/5 hide-on-print">
            <div className="relative w-full max-w-xs">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-200" />
              <input type="text" placeholder="Cari nama siswa atau kasus..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-primary-500" />
            </div>
            <div className="text-xs text-dark-300 hidden sm:block">Total {kasus.length} Kasus</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-black/20 border-b border-white/10 text-dark-200 font-semibold text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 bg-transparent">Siswa</th>
                  <th className="px-4 py-4 bg-transparent">Kasus</th>
                  <th className="px-4 py-4 bg-transparent">Poin</th>
                  <th className="px-4 py-4 bg-transparent">Tindak Lanjut</th>
                  <th className="px-4 py-4 bg-transparent">Status</th>
                  <th className="px-6 py-4 text-center bg-transparent hide-on-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredKasus.map((k) => (
                  <tr key={k.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{k.siswa}</div>
                      <div className="text-xs text-dark-300">{k.kelas} • {k.date}</div>
                    </td>
                    <td className="px-4 py-4 text-dark-300 max-w-xs">{k.kasus}</td>
                    <td className="px-4 py-4">
                      <span className={`font-bold ${k.poin >= 50 ? 'text-red-400' : 'text-amber-400'}`}>+{k.poin} Poin</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        {k.visit && (
                          <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded w-max border border-amber-500/20">
                            <RiHomeHeartLine /> Home Visit
                          </span>
                        )}
                        {k.konseling && (
                          <span className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded w-max border border-blue-500/20">
                            <RiChatVoiceLine /> Konseling
                          </span>
                        )}
                        {k.panggilan && (
                          <span className="flex items-center gap-1 text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded w-max border border-purple-500/20">
                            <RiPhoneLine /> Panggilan Ortu
                          </span>
                        )}
                        {k.poin >= 20 && (
                          <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded w-max border border-red-500/20">
                            SP Orang Tua
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`badge ${k.status === 'Selesai' ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' : k.status === 'Proses' ? 'bg-primary-500/20 text-primary-400 border-primary-500/30' : 'bg-dark-600/30 text-dark-200 border-white/20'}`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center hide-on-print">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => window.print()} className="text-dark-200 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors" title="Cetak SP"><RiPrinterLine /></button>
                        <button onClick={() => setDeleteTarget(k)} className="text-red-400 hover:text-white hover:bg-red-500/20 p-1.5 rounded-lg transition-colors" title="Hapus"><RiDeleteBinLine /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredKasus.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-12 text-dark-300">Tidak ada kasus ditemukan.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in">
          {kasus.filter(k => k.visit || k.konseling || k.panggilan).map(k => (
            <div key={k.id} className="card-feature group border-amber-500/20 hover:border-amber-500/50 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  {k.visit && <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center text-sm" title="Home Visit"><RiHomeHeartLine /></div>}
                  {k.konseling && <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center text-sm" title="Konseling"><RiChatVoiceLine /></div>}
                  {k.panggilan && <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center text-sm" title="Panggilan Orang Tua"><RiPhoneLine /></div>}
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${k.status === 'Selesai' ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'text-dark-200 bg-black/20 border-white/10'}`}>
                  {k.status === 'Selesai' ? '✅ Selesai' : k.date}
                </span>
              </div>
              <h4 className="font-bold text-white text-lg">{k.siswa}</h4>
              <p className="text-dark-300 text-xs mt-1 mb-3 flex items-center gap-1">
                <RiMapPinLine /> {getStudentAddress(k.siswa)}
              </p>
              <div className="p-3 bg-black/40 rounded-xl border border-white/10 shadow-inner mb-4">
                <div className="text-[10px] text-dark-300 uppercase font-bold tracking-wider mb-1">Terkait Kasus</div>
                <div className="text-sm text-amber-700 dark:text-amber-100 font-medium">{k.kasus}</div>
              </div>
              <div className="flex gap-2">
                {k.status !== 'Selesai' && (
                  <button className="flex-1 btn-primary bg-amber-600 hover:bg-amber-500 border-none py-2 text-xs" onClick={() => handleMarkDone(k)}>
                    <RiCheckDoubleLine /> Tandai Selesai
                  </button>
                )}
                <button onClick={() => setDeleteTarget(k)} className="btn-secondary py-2 px-3 text-red-400 hover:text-white hover:bg-red-500/20 text-xs">
                  <RiDeleteBinLine />
                </button>
              </div>
            </div>
          ))}
          {kasus.filter(k => k.visit || k.konseling || k.panggilan).length === 0 && (
            <div className="col-span-full py-16 text-center text-dark-300">
              <RiCalendarCheckLine className="text-5xl mx-auto mb-3 opacity-30" />
              <p>Belum ada agenda tindakan lanjutan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
