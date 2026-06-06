import { useState, useMemo } from 'react'
import {
  RiPresentationLine, RiTeamLine, RiCalendarCheckLine, RiFileTextLine,
  RiCheckLine, RiCloseLine, RiGroupLine, RiHistoryLine, RiArrowRightLine,
  RiSaveLine, RiPrinterLine, RiSearchLine, RiTimeLine, RiLoader4Line
} from 'react-icons/ri'
import toast from 'react-hot-toast'
import { useData } from '../contexts/DataContext'
import { useSettings } from '../contexts/SettingsContext'

function JadwalKlasikalModal({ isOpen, onClose, onSave, classes }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    class: classes?.[0] || '',
    topic: '',
    date: today,
    time: '',
    total: 36,
    materi: '',
    metode: 'Ceramah & Diskusi',
    catatan: ''
  })

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.class || !form.topic || !form.date || !form.time) return toast.error('Harap isi semua kolom!')
    onSave(form)
  }

  const formatTanggal = (d) => {
    if (!d) return ''
    const dt = new Date(d)
    return dt.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg card-feature p-0 flex flex-col overflow-hidden animate-in max-h-[90vh]">
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5 flex-shrink-0">
          <div>
            <h2 className="font-display font-bold text-white text-lg">📋 Rekam Sesi Bimbingan Klasikal</h2>
            <p className="text-dark-300 text-xs mt-0.5">Catat sesi mingguan bimbingan klasikal</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-dark-200 hover:text-white"><RiCloseLine /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Identitas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1.5">Kelas *</label>
              <select className="input-field text-sm" value={form.class} onChange={e => setForm({...form, class: e.target.value})}>
                {classes.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1.5">Total Siswa</label>
              <input type="number" min="1" max="60" className="input-field text-sm" value={form.total} onChange={e => setForm({...form, total: parseInt(e.target.value) || 30})} />
            </div>
          </div>

          {/* Tanggal Pelaksanaan */}
          <div className="p-3 bg-primary-500/10 border border-primary-500/30 rounded-xl">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-300 mb-1.5">📅 Tanggal Pelaksanaan *</label>
            <input
              type="date"
              required
              className="input-field text-sm w-full"
              value={form.date}
              onChange={e => setForm({...form, date: e.target.value})}
            />
            {form.date && (
              <p className="text-primary-400 text-xs mt-1.5 font-medium">{formatTanggal(form.date)}</p>
            )}
          </div>

          {/* Waktu */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1.5">Jam Pelaksanaan *</label>
            <div className="grid grid-cols-2 gap-3">
              <input type="time" required className="input-field text-sm" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
              <select className="input-field text-sm" value={form.metode} onChange={e => setForm({...form, metode: e.target.value})}>
                {['Ceramah & Diskusi','Permainan','Penugasan','Presentasi','Simulasi','Video & Diskusi'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <p className="text-dark-400 text-[10px] mt-1">Kiri: Jam mulai · Kanan: Metode layanan</p>
          </div>

          {/* Topik & Materi */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1.5">Topik / Judul Layanan *</label>
            <input type="text" placeholder="Cth: Bahaya Bullying & Dampaknya" required className="input-field text-sm" value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1.5">Materi Pokok</label>
            <input type="text" placeholder="Cth: Pengertian, jenis, dan dampak bullying" className="input-field text-sm" value={form.materi} onChange={e => setForm({...form, materi: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-200 mb-1.5">Catatan / Evaluasi</label>
            <textarea rows={2} placeholder="Catatan pelaksanaan, kendala, atau tindak lanjut..." className="input-field text-sm resize-none" value={form.catatan} onChange={e => setForm({...form, catatan: e.target.value})} />
          </div>
        </form>

        <div className="p-4 border-t border-white/10 bg-dark-950/50 flex gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="flex-1 btn-secondary text-sm py-2">Batal</button>
          <button type="button" onClick={handleSubmit} className="flex-1 btn-primary text-sm py-2.5 gap-2 bg-primary-500"><RiSaveLine /> Simpan Sesi</button>
        </div>
      </div>
    </div>
  )
}

export default function KlasikalPage() {
  const { classes } = useSettings()
  const { schedules, addSchedule, updateSchedule, siswa } = useData()
  const [view, setView] = useState('list')
  const [activeClass, setActiveClass] = useState(null)
  const [attendance, setAttendance] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Real students filtered by active class
  const classStudents = useMemo(() => {
    if (!activeClass) return []
    return siswa
      .filter(s => s.kelas === activeClass.class)
      .map(s => ({ id: s.id, name: s.nama, nis: s.nis, status: attendance[s.id] || 'Hadir' }))
  }, [siswa, activeClass, attendance])

  const handleOpenAttendance = (schedule) => {
    setActiveClass(schedule)
    setAttendance({})
    setView('attendance')
  }

  const handleStatusChange = (studentId, newStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: newStatus }))
  }

  const handleSaveAttendance = async () => {
    const hadirCount = classStudents.filter(s => (attendance[s.id] || 'Hadir') === 'Hadir').length
    setSaving(true)
    try {
      await updateSchedule(activeClass.id, { status: 'Selesai', attended: hadirCount })
      toast.success(`Presensi kelas ${activeClass.class} berhasil disimpan!`, { icon: '📋' })
      setView('list')
    } catch {
      toast.error('Gagal menyimpan presensi.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSchedule = async (form) => {
    setSaving(true)
    try {
      await addSchedule({ ...form, status: 'Terjadwal', attended: 0 })
      setModalOpen(false)
      toast.success('Sesi bimbingan klasikal berhasil direkam!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal menyimpan sesi.')
    } finally {
      setSaving(false)
    }
  }

  const formatTgl = (d) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getWeekLabel = (d) => {
    if (!d) return ''
    const dt = new Date(d)
    const startOfYear = new Date(dt.getFullYear(), 0, 1)
    const week = Math.ceil(((dt - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7)
    return `Minggu ke-${week}`
  }

  const getBulan = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }

  // Group schedules by month
  const grouped = schedules.reduce((acc, s) => {
    const key = getBulan(s.date)
    if (!acc[key]) acc[key] = []
    acc[key].push(s)
    return acc
  }, {})

  const filteredStudents = classStudents.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.nis.includes(searchTerm)
  )

  return (
    <div className="space-y-6 animate-in">
      <JadwalKlasikalModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSave={handleSaveSchedule} 
        classes={classes} 
      />

      {view === 'list' ? (
        <>
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
                Bimbingan Klasikal
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary-500/10 text-black dark:bg-primary-500/20 dark:text-primary-300 border border-primary-500/20 dark:border-primary-500/30 shadow-sm">
                  Grup
                </span>
              </h1>
              <p className="text-dark-200 text-sm">Jadwal masuk kelas & manajemen kehadiran peserta didik secara kolektif.</p>
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary gap-2 py-2.5 shadow-glow-indigo">
              <RiPresentationLine className="text-lg" /> + Rekam Sesi
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Sesi', val: `${schedules.length}`, sub: 'Kali', icon: RiHistoryLine, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
              { label: 'Jam Layanan', val: `${schedules.length * 2}`, sub: 'JP', icon: RiTimeLine, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { label: 'Sesi Selesai', val: `${schedules.filter(s=>s.status==='Selesai').length}`, sub: 'Selesai', icon: RiCheckLine, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
              { label: 'Rata Kehadiran', val: schedules.length ? Math.round(schedules.filter(s=>s.attended).reduce((a,s)=>(a + (s.attended/s.total)*100),0)/schedules.filter(s=>s.attended).length || 0) + '%' : '—', sub: 'Hadir', icon: RiGroupLine, color: 'text-accent-400', bg: 'bg-accent-500/10 border-accent-500/20' },
            ].map(item => (
              <div key={item.label} className={`card-feature flex items-center gap-3 py-4 border ${item.bg}`}>
                <div className={`p-2.5 rounded-xl bg-white/10 text-xl border border-white/10`}>{<item.icon className={item.color}/>}</div>
                <div>
                  <div className="text-2xl font-display font-black text-white">{item.val} <span className="text-xs font-normal text-dark-300">{item.sub}</span></div>
                  <div className="text-[10px] text-dark-300 uppercase tracking-wider">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* RIWAYAT SESI — Grouped by Month */}
          {schedules.length === 0 ? (
            <div className="card-feature text-center py-16 border-dashed border-white/20">
              <RiCalendarCheckLine className="text-5xl text-dark-500 mx-auto mb-3" />
              <p className="text-dark-300 font-bold">Belum ada sesi yang direkam</p>
              <p className="text-dark-400 text-sm mt-1">Klik "Rekam Sesi" untuk mulai mencatat bimbingan mingguan</p>
            </div>
          ) : (
            Object.entries(grouped).reverse().map(([bulan, items]) => (
              <div key={bulan}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs font-bold uppercase tracking-wider">
                    📅 {bulan}
                  </div>
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-dark-400 text-xs">{items.length} sesi</span>
                </div>
                <div className="space-y-3">
                  {[...items].reverse().map((item) => (
                    <div key={item.id} className="card-feature group border-white/10 hover:border-primary-500/30 transition-all p-0 overflow-hidden">
                      <div className="flex items-stretch">
                        {/* Tanggal sidebar */}
                        <div className="w-20 flex-shrink-0 bg-primary-500/10 border-r border-primary-500/20 flex flex-col items-center justify-center py-4 px-2">
                          <span className="text-2xl font-display font-black text-primary-300 leading-none">
                            {item.date ? new Date(item.date).getDate() : '—'}
                          </span>
                          <span className="text-[10px] text-primary-400 font-bold uppercase mt-0.5">
                            {item.date ? new Date(item.date).toLocaleDateString('id-ID',{month:'short'}) : ''}
                          </span>
                          <span className="text-[10px] text-dark-400 mt-0.5">
                            {item.date ? getWeekLabel(item.date) : ''}
                          </span>
                        </div>
                        {/* Konten */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-display font-black text-white text-base">{item.class}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex-shrink-0 ${
                                  item.status === 'Selesai' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>{item.status}</span>
                              </div>
                              <p className="text-white/80 text-sm font-medium mt-0.5 line-clamp-1">{item.topic}</p>
                              {item.materi && <p className="text-dark-400 text-xs mt-0.5 line-clamp-1">Materi: {item.materi}</p>}
                            </div>
                            <button
                              onClick={() => handleOpenAttendance(item)}
                              className={`flex-shrink-0 flex items-center gap-1 text-xs font-bold py-1.5 px-3 rounded-lg transition-all ${
                                item.status === 'Selesai' ? 'bg-white/10 text-dark-200 hover:bg-dark-700' : 'bg-primary-600 text-white hover:bg-primary-500 shadow-glow-sm'
                              }`}
                            >
                              {item.status === 'Selesai' ? 'Detail' : 'Presensi'} <RiArrowRightLine />
                            </button>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-white/10">
                            <span className="flex items-center gap-1 text-xs text-dark-300">
                              <RiTimeLine className="text-primary-400" />
                              {item.time || '—'}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-dark-300">
                              <RiTeamLine className="text-emerald-400" />
                              {item.status === 'Selesai' ? `${item.attended}/${item.total} Hadir` : `${item.total} Siswa`}
                            </span>
                            {item.metode && <span className="text-xs text-dark-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">{item.metode}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        /* ATTENDANCE ENTRY MODE */
        <div className="animate-in">
          {/* ATTENDANCE HEADER */}
          <div className="card-feature p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-primary-500 border-indigo-500/30 mb-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('list')} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                <RiCloseLine className="text-2xl" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-black rounded uppercase tracking-wider">Presensi Klasikal</span>
                  <h2 className="font-display font-bold text-xl text-white">{activeClass?.class}</h2>
                </div>
                <p className="text-indigo-300 text-sm mt-0.5 flex items-center gap-1"><RiFileTextLine /> {activeClass?.topic}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="relative flex-1 md:flex-none md:w-64">
                 <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-200" />
                 <input 
                    type="text" placeholder="Cari nama/NIS..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-white/10/80 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                  />
               </div>
               <button onClick={handleSaveAttendance} className="btn-primary bg-primary-500 gap-2 py-2 text-sm shadow-glow-teal whitespace-nowrap">
                 <RiSaveLine /> Simpan Kehadiran
               </button>
            </div>
          </div>

          {/* QUICK STATS IN ATTENDANCE */}
          <div className="flex flex-wrap gap-2 mb-5">
            <div className="bg-white/10/80 px-4 py-2 rounded-xl border border-white/20 text-xs text-white"><span className="text-dark-200">Hadir:</span> <b className="text-emerald-400 text-sm ml-1">{classStudents.filter(s=>s.status==='Hadir').length}</b></div>
            <div className="bg-white/10/80 px-4 py-2 rounded-xl border border-white/20 text-xs text-white"><span className="text-dark-200">Izin:</span> <b className="text-blue-400 text-sm ml-1">{classStudents.filter(s=>s.status==='Izin').length}</b></div>
            <div className="bg-white/10/80 px-4 py-2 rounded-xl border border-white/20 text-xs text-white"><span className="text-dark-200">Sakit:</span> <b className="text-amber-400 text-sm ml-1">{classStudents.filter(s=>s.status==='Sakit').length}</b></div>
            <div className="bg-white/10/80 px-4 py-2 rounded-xl border border-white/20 text-xs text-white"><span className="text-dark-200">Alfa:</span> <b className="text-red-400 text-sm ml-1">{classStudents.filter(s=>s.status==='Alfa').length}</b></div>
          </div>

          {/* ATTENDANCE TABLE GRID */}
          <div className="card-feature p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-dark-900 border-b border-white/20 text-dark-200 font-semibold text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">No</th>
                    <th className="px-4 py-4">NIS & Nama Siswa</th>
                    <th className="px-6 py-4 text-center">Opsi Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredStudents.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-dark-300 font-mono">{idx + 1}</td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-white">{student.name}</div>
                        <div className="text-xs text-dark-300">{student.nis}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {[
                            { label: 'H', full: 'Hadir', c: 'emerald' },
                            { label: 'I', full: 'Izin', c: 'blue' },
                            { label: 'S', full: 'Sakit', c: 'amber' },
                            { label: 'A', full: 'Alfa', c: 'red' },
                          ].map(opt => {
                            const isSelected = student.status === opt.full;
                            const baseColorClass = 
                              opt.c === 'emerald' ? (isSelected ? 'bg-emerald-500 text-white shadow-glow-sm border-emerald-400' : 'hover:border-emerald-500/50 text-emerald-500/70') :
                              opt.c === 'blue' ? (isSelected ? 'bg-blue-500 text-white shadow-glow-sm border-blue-400' : 'hover:border-blue-500/50 text-blue-500/70') :
                              opt.c === 'amber' ? (isSelected ? 'bg-amber-500 text-white shadow-glow-sm border-amber-400' : 'hover:border-amber-500/50 text-amber-500/70') :
                              (isSelected ? 'bg-red-500 text-white shadow-glow-sm border-red-400' : 'hover:border-red-500/50 text-red-500/70');

                            return (
                              <button
                                key={opt.full}
                                onClick={() => handleStatusChange(student.id, opt.full)}
                                className={`w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center font-bold text-xs transition-all duration-200 ${baseColorClass}`}
                                title={opt.full}
                              >
                                {opt.label}
                              </button>
                            )
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
