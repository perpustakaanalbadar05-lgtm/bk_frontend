import { useState, useMemo } from 'react'
import {
  RiUserAddLine, RiSearchLine, RiFilterLine, RiDownloadLine,
  RiEditLine, RiEyeLine, RiDeleteBinLine, RiCloseLine,
  RiSaveLine, RiUserLine, RiAlertLine, RiCheckLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const INIT_SISWA = [
  { id: 1, nama: 'Ahmad Fauzi', nis: '2024001', kelas: 'XI IPA 2', jk: 'L', status: 'Aktif', konseling: 3, hp: '081234567890', alamat: 'Jl. Merdeka No. 12, Jakarta' },
  { id: 2, nama: 'Siti Rahma', nis: '2024002', kelas: 'X IPS 1', jk: 'P', status: 'Aktif', konseling: 1, hp: '082345678901', alamat: 'Jl. Sudirman No. 45, Jakarta' },
  { id: 3, nama: 'Budi Santoso', nis: '2024003', kelas: 'XII IPA 1', jk: 'L', status: 'Aktif', konseling: 5, hp: '083456789012', alamat: 'Jl. Gatot Subroto No. 7, Jakarta' },
  { id: 4, nama: 'Dewi Lestari', nis: '2024004', kelas: 'XI IPS 3', jk: 'P', status: 'Perhatian', konseling: 7, hp: '084567890123', alamat: 'Jl. Thamrin No. 3, Jakarta' },
  { id: 5, nama: 'Riko Prasetyo', nis: '2024005', kelas: 'X IPA 1', jk: 'L', status: 'Aktif', konseling: 0, hp: '085678901234', alamat: 'Jl. Kebon Sirih No. 20, Jakarta' },
  { id: 6, nama: 'Fitri Handayani', nis: '2024006', kelas: 'XII IPS 2', jk: 'P', status: 'Perhatian', konseling: 4, hp: '086789012345', alamat: 'Jl. Diponegoro No. 15, Jakarta' },
  { id: 7, nama: 'Hendra Wijaya', nis: '2024007', kelas: 'X IPA 2', jk: 'L', status: 'Aktif', konseling: 2, hp: '087890123456', alamat: 'Jl. Hayam Wuruk No. 8, Jakarta' },
  { id: 8, nama: 'Rina Marlina', nis: '2024008', kelas: 'XI IPA 1', jk: 'P', status: 'Aktif', konseling: 0, hp: '088901234567', alamat: 'Jl. Mangga Dua No. 55, Jakarta' },
]

const STATUS_CLS = {
  'Aktif': 'badge bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'Perhatian': 'badge bg-amber-500/20 text-amber-300 border border-amber-500/30',
  'Alumni': 'badge bg-dark-500/30 text-dark-300 border border-dark-500/30',
}

const KELAS_OPTIONS = ['X IPA 1','X IPA 2','X IPS 1','XI IPA 1','XI IPA 2','XI IPS 3','XII IPA 1','XII IPS 2']
const PAGE_SIZE = 5

const emptyForm = { nama:'', nis:'', kelas:'X IPA 1', jk:'L', status:'Aktif', hp:'', alamat:'' }

function SiswaModal({ isOpen, onClose, initial, onSave }) {
  const [form, setForm] = useState(initial || emptyForm)
  const isEdit = !!initial?.id

  if (!isOpen) return null
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.nama.trim() || !form.nis.trim()) return toast.error('Nama dan NIS wajib diisi!')
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-dark-950 border border-white/10 rounded-2xl shadow-2xl animate-in flex flex-col max-h-[90vh]" style={{animationDuration:'0.25s'}}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <RiUserLine className="text-xl text-white" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">{isEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h2>
              <p className="text-dark-400 text-xs">{isEdit ? `NIS: ${initial.nis}` : 'Isi formulir data siswa binaan'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-dark-400 hover:text-white transition-colors"><RiCloseLine className="text-xl" /></button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">Nama Lengkap *</label>
              <input className="input-field" placeholder="Contoh: Ahmad Fauzi" value={form.nama} onChange={e=>set('nama',e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">NIS *</label>
              <input className="input-field" placeholder="2024001" value={form.nis} onChange={e=>set('nis',e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">Jenis Kelamin</label>
              <select className="input-field" value={form.jk} onChange={e=>set('jk',e.target.value)}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">Kelas</label>
              <select className="input-field" value={form.kelas} onChange={e=>set('kelas',e.target.value)}>
                {KELAS_OPTIONS.map(k=><option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">Status</label>
              <select className="input-field" value={form.status} onChange={e=>set('status',e.target.value)}>
                <option value="Aktif">Aktif</option>
                <option value="Perhatian">Perlu Perhatian</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">No. HP / WA</label>
              <input className="input-field" placeholder="+62 8xx-xxxx-xxxx" value={form.hp} onChange={e=>set('hp',e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-400 mb-2">Alamat Rumah</label>
              <textarea className="input-field resize-none" rows={2} placeholder="Jl. Contoh No. 1, Kota" value={form.alamat} onChange={e=>set('alamat',e.target.value)} />
            </div>
          </div>
        </form>
        <div className="p-5 border-t border-white/10 bg-dark-900/50 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 btn-secondary py-2.5 text-sm">Batal</button>
          <button type="button" onClick={handleSubmit} className="flex-1 btn-primary py-2.5 text-sm gap-2">
            <RiSaveLine /> {isEdit ? 'Simpan Perubahan' : 'Tambah Siswa'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailModal({ siswa, onClose }) {
  if (!siswa) return null
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-dark-950 border border-white/10 rounded-2xl shadow-2xl animate-in" style={{animationDuration:'0.25s'}}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="font-bold text-white text-lg">Detail Siswa</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-dark-400 hover:text-white"><RiCloseLine /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-2xl font-bold text-white">{siswa.nama[0]}</div>
            <div>
              <div className="font-bold text-white text-xl">{siswa.nama}</div>
              <div className="text-dark-400 text-sm font-mono">{siswa.nis}</div>
              <span className={STATUS_CLS[siswa.status]}>{siswa.status}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: 'Kelas', v: siswa.kelas },
              { l: 'Jenis Kelamin', v: siswa.jk === 'L' ? '👦 Laki-laki' : '👧 Perempuan' },
              { l: 'No. HP', v: siswa.hp || '-' },
              { l: 'Total Konseling', v: `${siswa.konseling} sesi` },
            ].map(({ l, v }) => (
              <div key={l} className="p-3 rounded-xl glass">
                <div className="text-dark-500 text-xs uppercase font-bold tracking-wider mb-1">{l}</div>
                <div className="text-white font-semibold text-sm">{v}</div>
              </div>
            ))}
          </div>
          {siswa.alamat && (
            <div className="p-3 rounded-xl glass">
              <div className="text-dark-500 text-xs uppercase font-bold tracking-wider mb-1">Alamat</div>
              <div className="text-white text-sm">{siswa.alamat}</div>
            </div>
          )}
        </div>
        <div className="p-5 border-t border-white/10">
          <button onClick={onClose} className="w-full btn-secondary py-2.5 text-sm">Tutup</button>
        </div>
      </div>
    </div>
  )
}

function ConfirmDelete({ siswa, onClose, onConfirm }) {
  if (!siswa) return null
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-950 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in" style={{animationDuration:'0.2s'}}>
        <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
          <RiAlertLine className="text-3xl text-red-400" />
        </div>
        <h3 className="text-white font-bold text-lg text-center mb-2">Hapus Data Siswa?</h3>
        <p className="text-dark-400 text-sm text-center mb-6">Data <span className="text-white font-semibold">{siswa.nama}</span> akan dihapus permanen dan tidak bisa dikembalikan.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-secondary py-2.5 text-sm">Batal</button>
          <button onClick={() => { onConfirm(siswa.id); onClose() }} className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-all">Hapus</button>
        </div>
      </div>
    </div>
  )
}

export default function SiswaPage() {
  const [siswa, setSiswa] = useState(INIT_SISWA)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('Semua')
  const [filterKelas, setFilterKelas] = useState('Semua')
  const [showFilter, setShowFilter] = useState(false)
  const [page, setPage] = useState(1)
  const [modalAdd, setModalAdd] = useState(false)
  const [modalEdit, setModalEdit] = useState(null)
  const [modalDetail, setModalDetail] = useState(null)
  const [modalDelete, setModalDelete] = useState(null)

  const filtered = useMemo(() => {
    return siswa.filter(s => {
      const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search)
      const matchStatus = filterStatus === 'Semua' || s.status === filterStatus
      const matchKelas = filterKelas === 'Semua' || s.kelas === filterKelas
      return matchSearch && matchStatus && matchKelas
    })
  }, [siswa, search, filterStatus, filterKelas])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleAdd = (form) => {
    const newId = Math.max(0, ...siswa.map(s => s.id)) + 1
    setSiswa(prev => [{ ...form, id: newId, konseling: 0 }, ...prev])
    setModalAdd(false)
    toast.success(`Siswa ${form.nama} berhasil ditambahkan!`)
  }

  const handleEdit = (form) => {
    setSiswa(prev => prev.map(s => s.id === modalEdit.id ? { ...s, ...form } : s))
    setModalEdit(null)
    toast.success('Data siswa berhasil diperbarui!')
  }

  const handleDelete = (id) => {
    setSiswa(prev => prev.filter(s => s.id !== id))
    toast.success('Data siswa berhasil dihapus.')
  }

  const handleExport = () => {
    const rows = [['NIS','Nama','Kelas','J/K','Status','Konseling']]
    filtered.forEach(s => rows.push([s.nis, s.nama, s.kelas, s.jk, s.status, s.konseling]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'data-siswa.csv'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Data berhasil diekspor ke CSV!')
  }

  const resetFilter = () => { setFilterStatus('Semua'); setFilterKelas('Semua'); setShowFilter(false) }
  const activeFilterCount = [filterStatus !== 'Semua', filterKelas !== 'Semua'].filter(Boolean).length

  return (
    <div className="space-y-6">
      <SiswaModal isOpen={modalAdd} onClose={() => setModalAdd(false)} onSave={handleAdd} />
      <SiswaModal isOpen={!!modalEdit} onClose={() => setModalEdit(null)} initial={modalEdit} onSave={handleEdit} />
      <DetailModal siswa={modalDetail} onClose={() => setModalDetail(null)} />
      <ConfirmDelete siswa={modalDelete} onClose={() => setModalDelete(null)} onConfirm={handleDelete} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Data Siswa</h1>
          <p className="text-dark-400 text-sm">Kelola data siswa binaan Guru BK</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary text-sm py-2"><RiDownloadLine /> Export CSV</button>
          <button id="siswa-add-btn" onClick={() => setModalAdd(true)} className="btn-primary text-sm py-2"><RiUserAddLine /> Tambah Siswa</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Siswa', value: siswa.length, color: 'text-primary-400' },
          { label: 'Aktif', value: siswa.filter(s=>s.status==='Aktif').length, color: 'text-teal-400' },
          { label: 'Perlu Perhatian', value: siswa.filter(s=>s.status==='Perhatian').length, color: 'text-amber-400' },
          { label: 'Konseling Aktif', value: siswa.reduce((a,s)=>a+s.konseling,0), color: 'text-accent-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card-feature text-center py-4">
            <div className={`font-display font-black text-3xl ${color} mb-1`}>{value}</div>
            <div className="text-dark-400 text-xs">{label}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="card-feature">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 relative">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text" placeholder="Cari nama atau NIS..."
              className="input-field pl-9"
              value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <button
            onClick={() => setShowFilter(f => !f)}
            className={`btn-secondary text-sm py-2.5 gap-2 relative ${activeFilterCount > 0 ? 'border-primary-500/60 text-primary-300' : ''}`}
          >
            <RiFilterLine /> Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="mb-5 p-4 rounded-xl glass border border-primary-500/20 space-y-3 animate-in" style={{animationDuration:'0.2s'}}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">Panel Filter</span>
              <button onClick={resetFilter} className="text-xs text-dark-400 hover:text-red-400 transition-colors flex items-center gap-1"><RiCloseLine /> Reset</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-dark-400 block mb-2">Status</label>
                <select className="input-field text-sm" value={filterStatus} onChange={e=>{setFilterStatus(e.target.value);setPage(1)}}>
                  {['Semua','Aktif','Perhatian','Alumni'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-dark-400 block mb-2">Kelas</label>
                <select className="input-field text-sm" value={filterKelas} onChange={e=>{setFilterKelas(e.target.value);setPage(1)}}>
                  <option>Semua</option>
                  {KELAS_OPTIONS.map(k=><option key={k}>{k}</option>)}
                </select>
              </div>
            </div>
            <button onClick={()=>setShowFilter(false)} className="btn-primary text-xs py-2 w-full gap-2"><RiCheckLine /> Terapkan Filter</button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="table-header text-left pb-3">Nama Siswa</th>
                <th className="table-header text-left pb-3">NIS</th>
                <th className="table-header text-left pb-3">Kelas</th>
                <th className="table-header text-left pb-3 hidden sm:table-cell">J/K</th>
                <th className="table-header text-left pb-3">Status</th>
                <th className="table-header text-left pb-3 hidden md:table-cell">Konseling</th>
                <th className="table-header text-center pb-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-dark-500">Tidak ada data siswa yang cocok.</td></tr>
              ) : paginated.map(s => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="table-cell font-medium text-white">{s.nama}</td>
                  <td className="table-cell font-mono text-xs">{s.nis}</td>
                  <td className="table-cell">{s.kelas}</td>
                  <td className="table-cell hidden sm:table-cell">{s.jk === 'L' ? '👦 L' : '👧 P'}</td>
                  <td className="table-cell"><span className={STATUS_CLS[s.status]}>{s.status}</span></td>
                  <td className="table-cell hidden md:table-cell">
                    <span className="font-semibold text-white">{s.konseling}</span>
                    <span className="text-dark-500 ml-1">sesi</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <button title="Detail" onClick={() => setModalDetail(s)} className="p-1.5 rounded-lg hover:bg-primary-500/20 text-dark-400 hover:text-primary-300 transition-colors"><RiEyeLine /></button>
                      <button title="Edit" onClick={() => setModalEdit(s)} className="p-1.5 rounded-lg hover:bg-teal-500/20 text-dark-400 hover:text-teal-300 transition-colors"><RiEditLine /></button>
                      <button title="Hapus" onClick={() => setModalDelete(s)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-dark-400 hover:text-red-400 transition-colors"><RiDeleteBinLine /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between text-dark-400 text-sm border-t border-white/10 pt-4">
          <span>Menampilkan {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} dari {filtered.length} siswa</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} className="w-8 h-8 rounded-lg text-sm transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed">‹</button>
            {Array.from({length: totalPages}, (_, i) => i+1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-sm transition-colors ${p===page ? 'bg-primary-600 text-white' : 'hover:bg-white/10'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="w-8 h-8 rounded-lg text-sm transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed">›</button>
          </div>
        </div>
      </div>
    </div>
  )
}
