import { useState } from 'react'
import {
  RiHomeHeartLine, RiMapPinLine, RiCalendarCheckLine,
  RiAddLine, RiSearchLine, RiCheckDoubleLine, RiFileList3Line, RiAlertLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

const MOCK_KASUS = [
  { id: 1, siswa: 'Ahmad Fauzi', kelas: 'XI IPA 2', kasus: 'Sering membolos', status: 'Selesai', visit: true, date: '11 Mei 2026' },
  { id: 2, siswa: 'Budi Santoso', kelas: 'XII IPA 1', kasus: 'Penurunan prestasi drastis', status: 'Proses', visit: false, date: '10 Mei 2026' },
  { id: 3, siswa: 'Riko Prasetyo', kelas: 'X IPA 1', kasus: 'Korban perundungan', status: 'Proses', visit: true, date: '08 Mei 2026' },
  { id: 4, siswa: 'Dewi Lestari', kelas: 'XI IPS 3', kasus: 'Kondisi ekonomi keluarga', status: 'Terjadwal', visit: true, date: '12 Mei 2026' },
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
            Penanganan Kasus & Home Visit
          </h1>
          <p className="text-dark-400 text-sm">Pencatatan kasus siswa dan penjadwalan kunjungan rumah (Home Visit).</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm py-2"><RiAddLine /> Catat Kasus</button>
          <button className="btn-primary text-sm py-2 shadow-glow-amber bg-gradient-to-r from-amber-600 to-orange-600"><RiHomeHeartLine /> Jadwal Home Visit</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-white/10">
        <div className="flex gap-6 w-max">
          <button
            onClick={() => setActiveTab('kasus')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2
              ${activeTab === 'kasus' ? 'border-primary-500 text-white' : 'border-transparent text-dark-500 hover:text-dark-300'}
            `}
          >
            Arsip Kasus Siswa
          </button>
          <button
            onClick={() => setActiveTab('homevisit')}
            className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2
              ${activeTab === 'homevisit' ? 'border-amber-500 text-white' : 'border-transparent text-dark-500 hover:text-dark-300'}
            `}
          >
            Agenda Home Visit
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'kasus' ? (
        <div className="card-feature p-0 overflow-hidden animate-in">
          <div className="p-5 border-b border-white/10 flex justify-between items-center bg-dark-900/50">
            <div className="relative w-full max-w-xs">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="text" placeholder="Cari nama siswa atau kasus..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-dark-800 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white outline-none focus:border-primary-500"
              />
            </div>
            <div className="text-xs text-dark-500 hidden sm:block">Total 4 Kasus</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-dark-900 border-b border-white/10 text-dark-400 font-semibold text-xs uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Siswa</th>
                  <th className="px-4 py-4">Kasus / Permasalahan</th>
                  <th className="px-4 py-4">Home Visit</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {MOCK_KASUS.filter(k => k.siswa.toLowerCase().includes(searchTerm.toLowerCase()) || k.kasus.toLowerCase().includes(searchTerm.toLowerCase())).map((k) => (
                  <tr key={k.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{k.siswa}</div>
                      <div className="text-xs text-dark-500">{k.kelas}</div>
                    </td>
                    <td className="px-4 py-4 text-dark-300">{k.kasus}</td>
                    <td className="px-4 py-4">
                      {k.visit ? (
                        <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded w-max border border-amber-500/20">
                          <RiHomeHeartLine /> Diperlukan
                        </span>
                      ) : (
                        <span className="text-xs text-dark-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                       <span className={`badge ${
                         k.status === 'Selesai' ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' :
                         k.status === 'Proses' ? 'bg-primary-500/20 text-primary-400 border-primary-500/30' :
                         'bg-dark-600/30 text-dark-400 border-white/10'
                       }`}>
                         {k.status}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <button className="text-primary-400 hover:text-white bg-primary-500/10 hover:bg-primary-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Detail</button>
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
             <div key={k.id} className="card-feature group border-amber-500/20 hover:border-amber-500/50 relative overflow-hidden bg-gradient-to-br from-dark-900 to-amber-900/10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                    <RiHomeHeartLine />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-dark-400 bg-dark-800 px-2 py-1 rounded">{k.date}</span>
                </div>
                <h4 className="font-bold text-white text-lg">{k.siswa}</h4>
                <p className="text-dark-300 text-xs mt-1 mb-4 flex items-center gap-1"><RiMapPinLine className="text-dark-500" /> Alamat: Jl. Merdeka No. {k.id * 12}</p>
                
                <div className="p-3 bg-dark-950/50 rounded-xl border border-white/5 mb-4">
                   <div className="text-[10px] text-dark-500 uppercase font-bold tracking-wider mb-1">Terkait Kasus</div>
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
