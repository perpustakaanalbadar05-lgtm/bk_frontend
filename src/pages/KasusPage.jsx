import { useState } from 'react'
import {
  RiHomeHeartLine, RiMapPinLine, RiCalendarCheckLine,
  RiAddLine, RiSearchLine, RiCheckDoubleLine, RiFileList3Line, RiAlertLine,
  RiScales3Line, RiPrinterLine, RiMailSendLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const MOCK_KASUS = [
  { id: 1, siswa: 'Ahmad Fauzi', kelas: 'XI IPA 2', kasus: 'Sering membolos (Alpa > 3x)', poin: 20, status: 'Selesai', visit: true, date: '11 Mei 2026' },
  { id: 2, siswa: 'Budi Santoso', kelas: 'XII IPA 1', kasus: 'Berkelahi di lingkungan sekolah', poin: 50, status: 'Proses', visit: false, date: '10 Mei 2026' },
  { id: 3, siswa: 'Riko Prasetyo', kelas: 'X IPA 1', kasus: 'Merokok di kantin', poin: 30, status: 'Proses', visit: true, date: '08 Mei 2026' },
  { id: 4, siswa: 'Dewi Lestari', kelas: 'XI IPS 3', kasus: 'Terlambat lebih dari 5 kali', poin: 10, status: 'Terjadwal', visit: true, date: '12 Mei 2026' },
]

export default function KasusPage() {
  const [activeTab, setActiveTab] = useState('kasus') // kasus, homevisit
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            Buku Kasus & Poin Kedisiplinan
          </h1>
          <p className="text-dark-200 text-sm">Pencatatan pelanggaran, akumulasi poin, dan pembuatan Surat Panggilan (SP).</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm py-2"><RiAddLine /> Catat Kasus</button>
          <button className="btn-primary text-sm py-2 shadow-glow-amber bg-primary-500"><RiHomeHeartLine /> Jadwal Home Visit</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-white/20">
        <div className="flex gap-6 w-max">
          <button
            onClick={() => setActiveTab('kasus')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2
              ${activeTab === 'kasus' ? 'border-primary-500 text-white' : 'border-transparent text-dark-300 hover:text-dark-300'}
            `}
          >
            <RiScales3Line className="text-lg" /> Poin & Pelanggaran
          </button>
          <button
            onClick={() => setActiveTab('homevisit')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-2
              ${activeTab === 'homevisit' ? 'border-amber-500 text-white' : 'border-transparent text-dark-300 hover:text-dark-300'}
            `}
          >
            <RiHomeHeartLine className="text-lg" /> Agenda Home Visit
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'kasus' ? (
        <div className="card-feature p-0 overflow-hidden animate-in">
          <div className="p-5 border-b border-white/20 flex justify-between items-center bg-white/5">
            <div className="relative w-full max-w-xs">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-200" />
              <input
                type="text" placeholder="Cari nama siswa atau kasus..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-primary-500"
              />
            </div>
            <div className="text-xs text-dark-300 hidden sm:block">Total 4 Kasus</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-black/20 border-b border-white/10 text-dark-200 font-semibold text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 bg-transparent">Siswa</th>
                  <th className="px-4 py-4 bg-transparent">Kasus / Permasalahan</th>
                  <th className="px-4 py-4 bg-transparent">Poin</th>
                  <th className="px-4 py-4 bg-transparent">Tindak Lanjut</th>
                  <th className="px-4 py-4 bg-transparent">Status</th>
                  <th className="px-6 py-4 text-center bg-transparent">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_KASUS.filter(k => k.siswa.toLowerCase().includes(searchTerm.toLowerCase()) || k.kasus.toLowerCase().includes(searchTerm.toLowerCase())).map((k) => (
                  <tr key={k.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{k.siswa}</div>
                      <div className="text-xs text-dark-300">{k.kelas}</div>
                    </td>
                    <td className="px-4 py-4 text-dark-300">{k.kasus}</td>
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
                        {k.poin >= 20 && (
                          <span className="flex items-center gap-1 text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded w-max border border-red-500/20">
                            <RiMailSendLine /> SP Orang Tua
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                       <span className={`badge ${
                         k.status === 'Selesai' ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' :
                         k.status === 'Proses' ? 'bg-primary-500/20 text-primary-400 border-primary-500/30' :
                         'bg-dark-600/30 text-dark-200 border-white/20'
                       }`}>
                         {k.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <div className="flex items-center justify-center gap-2">
                         <button className="text-dark-200 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors" title="Detail Kasus"><RiFileList3Line /></button>
                         <button onClick={() => {
                           toast.success(`Surat Panggilan Orang Tua untuk ${k.siswa} siap dicetak!`)
                           window.print()
                         }} className="text-red-400 hover:text-white hover:bg-red-500/20 p-1.5 rounded-lg transition-colors" title="Cetak Surat Panggilan"><RiPrinterLine /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in">
          {MOCK_KASUS.filter(k => k.visit).map(k => (
             <div key={k.id} className="card-feature group border-amber-500/20 hover:border-amber-500/50 relative overflow-hidden bg-primary-500/10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300 shadow-glow-amber">
                    <RiHomeHeartLine />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-dark-200 bg-black/20 border border-white/10 px-2 py-1 rounded">{k.date}</span>
                </div>
                <h4 className="font-bold text-white text-lg">{k.siswa}</h4>
                <p className="text-dark-300 text-xs mt-1 mb-4 flex items-center gap-1"><RiMapPinLine className="text-dark-300" /> Alamat: Jl. Merdeka No. {k.id * 12}</p>
                
                <div className="p-3 bg-black/40 rounded-xl border border-white/10 shadow-inner mb-4">
                   <div className="text-[10px] text-dark-300 uppercase font-bold tracking-wider mb-1">Terkait Kasus</div>
                   <div className="text-sm text-amber-100 font-medium">{k.kasus}</div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 btn-primary bg-amber-600 hover:bg-amber-500 border-none py-2 text-xs shadow-glow-amber" onClick={() => toast.success('Status kunjungan diperbarui!')}>
                    <RiCheckDoubleLine /> Tandai Selesai
                  </button>
                  <button className="btn-secondary py-2 px-3 text-dark-300 hover:text-white" title="Laporan Kunjungan">
                    <RiFileList3Line />
                  </button>
                </div>
             </div>
          ))}
        </div>
      )}
    </div>
  )
}
