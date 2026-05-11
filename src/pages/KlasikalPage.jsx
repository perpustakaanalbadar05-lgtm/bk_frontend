import { useState } from 'react'
import {
  RiPresentationLine, RiTeamLine, RiCalendarCheckLine, RiFileTextLine,
  RiCheckLine, RiCloseLine, RiGroupLine, RiHistoryLine, RiArrowRightLine,
  RiSaveLine, RiPrinterLine, RiSearchLine, RiTimeLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const SAMPLE_STUDENTS = [
  { id: 1, name: 'Ahmad Fauzi', nis: '2024001', status: 'Hadir' },
  { id: 2, name: 'Annisa Zahra', nis: '2024002', status: 'Hadir' },
  { id: 3, name: 'Bagus Pratama', nis: '2024003', status: 'Hadir' },
  { id: 4, name: 'Budi Santoso', nis: '2024004', status: 'Sakit' },
  { id: 5, name: 'Citra Ayu', nis: '2024005', status: 'Hadir' },
  { id: 6, name: 'Dedi Kusuma', nis: '2024006', status: 'Hadir' },
  { id: 7, name: 'Dewi Lestari', nis: '2024007', status: 'Izin' },
  { id: 8, name: 'Eko Wahyudi', nis: '2024008', status: 'Hadir' },
  { id: 9, name: 'Fahmi Idris', nis: '2024009', status: 'Hadir' },
  { id: 10, name: 'Gita Putri', nis: '2024010', status: 'Hadir' },
]

const SCHEDULES = [
  { id: 1, class: 'XI IPA 2', topic: 'Strategi Sukses Ujian', time: 'Senin, 08:00', status: 'Selesai', attended: 32, total: 34 },
  { id: 2, class: 'X IPS 1', topic: 'Bahaya Bullying', time: 'Selasa, 10:30', status: 'Berlangsung', attended: 0, total: 36 },
  { id: 3, class: 'XII IPA 1', topic: 'Orientasi Perguruan Tinggi', time: 'Rabu, 13:00', status: 'Terjadwal', attended: 0, total: 35 },
]

export default function KlasikalPage() {
  const [view, setView] = useState('list') // 'list' or 'attendance'
  const [activeClass, setActiveClass] = useState(null)
  const [students, setStudents] = useState(SAMPLE_STUDENTS)
  const [searchTerm, setSearchTerm] = useState('')

  const handleOpenAttendance = (schedule) => {
    setActiveClass(schedule)
    setView('attendance')
  }

  const handleStatusChange = (studentId, newStatus) => {
    setStudents(students.map(s => s.id === studentId ? { ...s, status: newStatus } : s))
  }

  const handleSaveAttendance = () => {
    toast.success(`Daftar hadir kelas ${activeClass.class} berhasil disimpan!`, {
      icon: '📋',
    })
    setView('list')
  }

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.nis.includes(searchTerm)
  )

  return (
    <div className="space-y-6 animate-in">
      {view === 'list' ? (
        <>
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
                Bimbingan Klasikal
                <span className="badge-primary text-[10px] uppercase font-bold tracking-wider bg-primary-500/20 text-primary-300 border-primary-500/30">Grup</span>
              </h1>
              <p className="text-dark-400 text-sm">Jadwal masuk kelas & manajemen kehadiran peserta didik secara kolektif.</p>
            </div>
            <button className="btn-primary gap-2 py-2.5 shadow-glow-indigo">
              <RiPresentationLine className="text-lg" /> Buat Jadwal Baru
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Sesi Bulan Ini', val: '14 Kali', icon: RiHistoryLine, color: 'text-indigo-400' },
              { label: 'Jam Layanan', val: '28 JP', icon: RiTimeLine, color: 'text-emerald-400' },
              { label: 'Tingkat Kehadiran', val: '96.5%', icon: RiGroupLine, color: 'text-accent-400' },
            ].map(item => (
              <div key={item.label} className="card-feature flex items-center gap-4 py-5">
                <div className="p-3 rounded-xl bg-dark-800 text-2xl border border-white/5">{<item.icon className={item.color}/>}</div>
                <div>
                  <div className="text-2xl font-display font-black text-white">{item.val}</div>
                  <div className="text-xs text-dark-400">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CLASS SCHEDULE GRID */}
          <h3 className="text-white font-display font-bold mt-8 mb-2">Agenda Minggu Ini</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCHEDULES.map((item) => (
              <div key={item.id} className="card-feature group border-white/10 hover:border-primary-500/30 relative overflow-hidden">
                {item.status === 'Berlangsung' && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-[9px] font-bold text-white uppercase px-3 py-1 rounded-bl-xl animate-pulse">Live Now</div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-dark-800 border border-white/5 flex items-center justify-center font-display font-black text-primary-400 text-lg group-hover:scale-110 transition-transform duration-300">
                    {item.class.split(' ')[0]}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    item.status === 'Selesai' ? 'bg-dark-800 text-dark-400 border-white/10' :
                    item.status === 'Berlangsung' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>{item.status}</span>
                </div>

                <h4 className="font-bold text-white text-lg group-hover:text-primary-300 transition-colors">{item.class}</h4>
                <p className="text-dark-300 text-sm mt-1 font-medium line-clamp-1">{item.topic}</p>

                <div className="flex items-center gap-2 text-dark-500 text-xs mt-4 bg-dark-900/50 p-2 rounded-lg">
                  <RiCalendarCheckLine className="text-primary-400" />
                  {item.time}
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-dark-400">
                    <RiTeamLine /> {item.status === 'Selesai' ? `${item.attended}/${item.total} Hadir` : `${item.total} Siswa`}
                  </div>
                  <button 
                    onClick={() => handleOpenAttendance(item)}
                    className={`flex items-center gap-1 text-xs font-bold py-1.5 px-3 rounded-lg transition-all ${
                      item.status === 'Selesai' ? 'bg-dark-800 text-dark-400 hover:bg-dark-700' : 'bg-primary-600 text-white hover:bg-primary-500 shadow-glow-sm'
                    }`}
                  >
                    {item.status === 'Selesai' ? 'Detail' : 'Presensi'} <RiArrowRightLine />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* ATTENDANCE ENTRY MODE */
        <div className="animate-in">
          {/* ATTENDANCE HEADER */}
          <div className="card-feature p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-gradient-to-r from-indigo-900/40 to-dark-950 border-indigo-500/30 mb-6">
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
                 <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                 <input 
                    type="text" placeholder="Cari nama/NIS..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-dark-800/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-indigo-500 transition-colors"
                  />
               </div>
               <button onClick={handleSaveAttendance} className="btn-primary bg-gradient-to-r from-emerald-600 to-teal-600 gap-2 py-2 text-sm shadow-glow-teal whitespace-nowrap">
                 <RiSaveLine /> Simpan Kehadiran
               </button>
            </div>
          </div>

          {/* QUICK STATS IN ATTENDANCE */}
          <div className="flex flex-wrap gap-2 mb-5">
            <div className="bg-dark-800/80 px-4 py-2 rounded-xl border border-white/5 text-xs text-white"><span className="text-dark-400">Hadir:</span> <b className="text-emerald-400 text-sm ml-1">{students.filter(s=>s.status==='Hadir').length}</b></div>
            <div className="bg-dark-800/80 px-4 py-2 rounded-xl border border-white/5 text-xs text-white"><span className="text-dark-400">Izin:</span> <b className="text-blue-400 text-sm ml-1">{students.filter(s=>s.status==='Izin').length}</b></div>
            <div className="bg-dark-800/80 px-4 py-2 rounded-xl border border-white/5 text-xs text-white"><span className="text-dark-400">Sakit:</span> <b className="text-amber-400 text-sm ml-1">{students.filter(s=>s.status==='Sakit').length}</b></div>
            <div className="bg-dark-800/80 px-4 py-2 rounded-xl border border-white/5 text-xs text-white"><span className="text-dark-400">Alfa:</span> <b className="text-red-400 text-sm ml-1">{students.filter(s=>s.status==='Alfa').length}</b></div>
          </div>

          {/* ATTENDANCE TABLE GRID */}
          <div className="card-feature p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-dark-900 border-b border-white/10 text-dark-400 font-semibold text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">No</th>
                    <th className="px-4 py-4">NIS & Nama Siswa</th>
                    <th className="px-6 py-4 text-center">Opsi Kehadiran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredStudents.map((student, idx) => (
                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-dark-500 font-mono">{idx + 1}</td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-white">{student.name}</div>
                        <div className="text-xs text-dark-500">{student.nis}</div>
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
                                className={`w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center font-bold text-xs transition-all duration-200 ${baseColorClass}`}
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
