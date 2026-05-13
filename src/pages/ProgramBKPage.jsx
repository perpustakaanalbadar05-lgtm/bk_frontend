import { useState } from 'react'
import {
  RiAddLine, RiFileTextLine, RiDownloadLine, RiEditLine, RiEyeLine,
  RiMagicLine, RiCheckboxCircleLine, RiRefreshLine, RiCalendarCheckLine,
  RiSettings4Line, RiPrinterLine, RiFileChartLine
} from 'react-icons/ri'
import toast from 'react-hot-toast'

// Mock Generated Data
const MOCK_PROTA = [
  { id: 1, bidang: 'Pribadi', kebutuhan: 'Pengenalan Potensi Diri', layanan: 'Klasikal', sasaran: 'Kelas X', waktu: 'Juli' },
  { id: 2, bidang: 'Sosial', kebutuhan: 'Komunikasi Asertif', layanan: 'Bimbingan Kelompok', sasaran: 'Kelas XI', waktu: 'Agustus' },
  { id: 3, bidang: 'Belajar', kebutuhan: 'Manajemen Waktu Belajar', layanan: 'Klasikal', sasaran: 'Kelas X', waktu: 'September' },
  { id: 4, bidang: 'Karir', kebutuhan: 'Perencanaan Karir Masa Depan', layanan: 'Lintas Kelas', sasaran: 'Kelas XII', waktu: 'Oktober' },
]

const MOCK_PROSEM = [
  { bulan: 'Juli', m1: 'Pengenalan BK', m2: 'Orientasi Sekolah', m3: 'Pribadi', m4: '-' },
  { bulan: 'Agustus', m1: 'Potensi Diri', m2: 'Etika Bergaul', m3: 'Sosial', m4: 'Bim. Kelompok' },
  { bulan: 'September', m1: 'Cara Belajar', m2: 'Gaya Belajar', m3: 'Belajar', m4: 'Klasikal' },
]

export default function ProgramBKPage() {
  const [activeTab, setActiveTab] = useState('overview') // overview, generator, viewer
  const [generating, setGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [programType, setProgramType] = useState('PROTA') // PROTA, PROSEM, RPL

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setShowResult(true)
      toast.success('Program BK berhasil dibuat otomatis berdasarkan hasil AKPD!', {
        icon: '✨',
        duration: 4000
      })
    }, 2500)
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white flex items-center gap-2">
            Program BK Otomatis
            <span className="badge-teal bg-emerald-500/10 text-emerald-400 text-xs py-0.5 animate-pulse">AI Powered</span>
          </h1>
          <p className="text-dark-200 text-sm mt-1">Hasilkan PROTA, PROSEM, dan RPL otomatis dari integrasi data asesmen.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setActiveTab('overview'); setShowResult(false); }}
            className={`btn-ghost text-sm px-4 py-2 ${activeTab === 'overview' ? 'bg-white/10 text-white' : ''}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('generator')}
            className="btn-primary text-sm py-2.5 shadow-glow-accent bg-primary-500"
          >
            <RiMagicLine className="text-lg" /> Generate Otomatis
          </button>
        </div>
      </div>

      {/* MAIN CONTENT: DASHBOARD OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in">
          {/* Grid Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'PROTA Selesai', count: '1 Dokumen', color: 'from-blue-500/20 to-indigo-500/20', text: 'text-indigo-400' },
              { label: 'PROSEM Selesai', count: '2 Dokumen', color: 'from-purple-500/20 to-pink-500/20', text: 'text-pink-400' },
              { label: 'RPL Terbit', count: '18 Dokumen', color: 'from-teal-500/20 to-emerald-500/20', text: 'text-teal-400' }
            ].map((item, i) => (
              <div key={i} className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} border border-white/20 backdrop-blur-lg`}>
                <h4 className="text-dark-300 text-xs font-medium uppercase tracking-wider">{item.label}</h4>
                <p className={`text-3xl font-display font-black mt-2 ${item.text}`}>{item.count}</p>
                <div className="flex justify-between items-center mt-4 text-xs text-dark-200">
                  <span>Aktif Tahun 2025/2026</span>
                  <RiCheckboxCircleLine className="text-teal-400 text-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* Actionable Generator Banner */}
          <div className="card-feature bg-gradient-to-r from-primary-900/50 via-dark-900 to-accent-900/30 p-8 border border-primary-500/20 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h3 className="font-display text-2xl font-bold text-white">Belum membuat Program Semester Genap?</h3>
              <p className="text-dark-300 mt-2 max-w-md text-sm">Sistem cerdas SIMBK dapat menarik hasil AKPD siswa bulan ini dan menyusun urutan materi layanan yang relevan secara instan.</p>
            </div>
            <button onClick={() => setActiveTab('generator')} className="relative z-10 btn-primary gap-3 group whitespace-nowrap">
              Mulai Generator Cerdas <RiMagicLine className="group-hover:animate-spin" />
            </button>
          </div>

          {/* Recent Programs List */}
          <div className="card-feature">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-white text-lg">Daftar Dokumen Program Terbit</h3>
              <div className="flex gap-2">
                <select className="bg-white/10 text-dark-300 text-xs border border-white/20 rounded-lg px-3 py-1.5 outline-none">
                  <option>Tahun 2025/2026</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { name: 'PROTA (Program Tahunan) 2025/2026', type: 'PROTA', date: 'Baru Saja', status: 'Selesai' },
                { name: 'PROSEM Semester Ganjil', type: 'PROSEM', date: '2 hari lalu', status: 'Selesai' },
                { name: 'RPL Klasikal: Cara Belajar Efektif', type: 'RPL', date: '1 minggu lalu', status: 'Selesai' },
                { name: 'RPL Bimbingan Kelompok: Karir', type: 'RPL', date: '2 minggu lalu', status: 'Draft' },
              ].map((prog, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl glass border-white/20 hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-primary-400 group-hover:text-accent-400 transition-colors">
                      <RiFileTextLine className="text-xl" />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{prog.name}</div>
                      <div className="flex items-center gap-2 text-xs text-dark-300 mt-1">
                        <span className="px-2 py-0.5 rounded bg-dark-700 border border-white/20 font-mono">{prog.type}</span>
                        <span>Diproses {prog.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none p-2 rounded-lg hover:bg-white/10 text-dark-300" title="Edit"><RiEditLine /></button>
                    <button className="flex-1 sm:flex-none p-2 rounded-lg hover:bg-white/10 text-dark-300" title="Cetak"><RiPrinterLine /></button>
                    <button className="flex-1 sm:flex-none btn-secondary text-xs py-1.5 px-4 border-primary-500/20 hover:bg-primary-500/10 text-primary-300">Detail</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GENERATOR WORKSPACE */}
      {activeTab === 'generator' && (
        <div className="animate-in">
          {!showResult ? (
            <div className="max-w-3xl mx-auto card-feature p-8 md:p-12 text-center border-dashed border-white/20">
              <div className="w-20 h-20 mx-auto bg-primary-500 rounded-3xl flex items-center justify-center border border-primary-500/30 mb-6 relative">
                <RiMagicLine className={`text-4xl text-primary-400 ${generating ? 'animate-spin' : ''}`} />
                {generating && <div className="absolute inset-0 border-2 border-primary-500 rounded-3xl animate-ping opacity-40" />}
              </div>

              {generating ? (
                <div className="space-y-4 animate-pulse">
                  <h2 className="text-2xl font-display font-bold text-white">Sedang Mengolah Data...</h2>
                  <p className="text-dark-200 max-w-md mx-auto text-sm">Menarik data Asesmen AKPD, mengurutkan skala prioritas masalah, memetakan bidang layanan, dan menyusun Rencana Pelaksanaan Layanan (RPL).</p>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden max-w-sm mx-auto mt-6">
                    <div className="bg-primary-500 h-full animate-shimmer" style={{ width: '100%', backgroundSize: '200% 100%' }} />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Konfigurasi Generator Program</h2>
                  <p className="text-dark-200 text-sm mb-8 max-w-lg mx-auto">Pilih parameter di bawah ini, AI SIMBK akan menyusun struktur program tahunan dan semesteran Anda dalam hitungan detik.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                    <div>
                      <label className="text-xs font-semibold text-dark-300 mb-1.5 block">Tahun Pelajaran</label>
                      <select className="input-field py-2.5 text-sm">
                        <option>2025/2026</option>
                        <option>2026/2027</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark-300 mb-1.5 block">Sumber Acuan Materi</label>
                      <select className="input-field py-2.5 text-sm">
                        <option>Hasil Asesmen AKPD Terbaru</option>
                        <option>Kurikulum Merdeka Default</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-dark-300 mb-1.5 block">Output Dokumen Yang Diperlukan</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['PROTA', 'PROSEM', 'RPL'].map(item => (
                          <label key={item} className="flex items-center gap-2 p-3 rounded-xl glass cursor-pointer hover:bg-white/5 border-white/20">
                            <input type="checkbox" defaultChecked className="accent-primary-500 h-4 w-4" />
                            <span className="text-white font-medium text-sm">{item}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-3 border-t border-white/20 pt-6">
                    <button onClick={() => setActiveTab('overview')} className="btn-secondary py-2.5">Batal</button>
                    <button onClick={handleGenerate} className="btn-primary py-2.5 bg-primary-500 gap-2 px-8">
                      <RiMagicLine /> Bangun Program Otomatis
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* GENERATION RESULT VIEWER */
            <div className="space-y-6 animate-in">
              {/* Result Toolbar */}
              <div className="card-feature p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-primary-500 border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                    <RiCheckboxCircleLine className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold font-display text-lg">Pembuatan Berhasil!</h4>
                    <p className="text-dark-200 text-xs">Draf dokumen di bawah disusun berdasarkan skor prioritas masalah siswa.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowResult(false)} className="btn-secondary text-xs gap-1 py-2"><RiRefreshLine /> Regenerate</button>
                  <button className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-500 border-none shadow-none py-2 gap-1"><RiDownloadLine /> Simpan Permanen</button>
                </div>
              </div>

              {/* Viewer Body with Internal Tabs */}
              <div className="card-feature p-0 overflow-hidden">
                {/* Result Type Switcher */}
                <div className="flex bg-dark-900 border-b border-white/20">
                  {['PROTA', 'PROSEM', 'RPL'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setProgramType(tab)}
                      className={`flex-1 py-4 text-center font-display font-bold text-sm tracking-wider border-b-2 transition-all
                        ${programType === tab ? 'border-primary-500 bg-primary-500/5 text-primary-300' : 'border-transparent text-dark-200 hover:text-white hover:bg-white/5'}
                      `}
                    >
                      {tab} {tab === 'PROTA' ? 'Tahun' : tab === 'PROSEM' ? 'Semester' : 'Harian'}
                    </button>
                  ))}
                </div>

                {/* Data Renderer */}
                <div className="p-6">
                  {programType === 'PROTA' && (
                    <div className="space-y-4 animate-in">
                      <div className="flex justify-between items-center">
                        <h5 className="text-white font-bold text-sm">Rencana Program Tahunan (PROTA) - 2025/2026</h5>
                        <button className="text-primary-400 text-xs hover:underline flex items-center gap-1"><RiDownloadLine /> Unduh XLSX</button>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-white/20">
                        <table className="w-full text-xs md:text-sm text-left text-dark-300">
                          <thead className="bg-white/10 text-dark-200 font-semibold border-b border-white/20">
                            <tr>
                              <th className="px-4 py-3">Bidang</th>
                              <th className="px-4 py-3">Rumusan Kebutuhan (Materi)</th>
                              <th className="px-4 py-3">Layanan</th>
                              <th className="px-4 py-3">Waktu</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {MOCK_PROTA.map((row) => (
                              <tr key={row.id} className="hover:bg-white/5">
                                <td className="px-4 py-3 font-medium text-white">
                                  <span className={`px-2 py-0.5 rounded text-[10px] border uppercase ${
                                    row.bidang === 'Belajar' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                                    row.bidang === 'Pribadi' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                                    'bg-teal-500/10 border-teal-500/30 text-teal-400'
                                  }`}>
                                    {row.bidang}
                                  </span>
                                </td>
                                <td className="px-4 py-3">{row.kebutuhan}</td>
                                <td className="px-4 py-3">{row.layanan}</td>
                                <td className="px-4 py-3 text-accent-300 font-semibold">{row.waktu}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {programType === 'PROSEM' && (
                    <div className="space-y-4 animate-in">
                      <div className="flex justify-between items-center">
                        <h5 className="text-white font-bold text-sm">Rencana Program Semester Ganjil</h5>
                        <button className="text-primary-400 text-xs hover:underline flex items-center gap-1"><RiDownloadLine /> Unduh XLSX</button>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-white/20">
                        <table className="w-full text-xs md:text-sm text-left text-dark-300">
                          <thead className="bg-white/10 text-dark-200 border-b border-white/20 text-center">
                            <tr>
                              <th className="px-4 py-3 text-left" rowSpan="2">Bulan</th>
                              <th className="px-4 py-2 border-b border-white/20" colSpan="4">Minggu Efektif</th>
                            </tr>
                            <tr className="text-[10px] bg-white/5">
                              <th className="px-2 py-1 border-r border-white/20">I</th>
                              <th className="px-2 py-1 border-r border-white/20">II</th>
                              <th className="px-2 py-1 border-r border-white/20">III</th>
                              <th className="px-2 py-1">IV</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-center">
                            {MOCK_PROSEM.map((row, idx) => (
                              <tr key={idx} className="hover:bg-white/5">
                                <td className="px-4 py-4 text-left font-bold text-white">{row.bulan}</td>
                                <td className="px-2 py-4 border-r border-white/20 text-dark-200 text-xs">{row.m1}</td>
                                <td className="px-2 py-4 border-r border-white/20 text-dark-200 text-xs">{row.m2}</td>
                                <td className="px-2 py-4 border-r border-white/20 text-accent-400 font-medium text-xs bg-accent-500/5">{row.m3}</td>
                                <td className="px-2 py-4 text-dark-300 text-xs">{row.m4}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {programType === 'RPL' && (
                    <div className="space-y-4 animate-in">
                      <h5 className="text-white font-bold text-sm mb-3">Draf RPL Siap Cetak (Berdasarkan PROTA)</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {MOCK_PROTA.map((row) => (
                          <div key={row.id} className="p-4 rounded-xl glass border-white/20 bg-white/10/40 hover:border-primary-500/30 transition-all group">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">RPL BK KLASIKAL</span>
                                <h6 className="text-white font-bold mt-1 group-hover:text-primary-300 transition-colors">{row.kebutuhan}</h6>
                                <p className="text-dark-300 text-xs mt-1">Alokasi Waktu: 1 x 45 Menit</p>
                              </div>
                              <RiFileChartLine className="text-dark-600 text-3xl group-hover:text-primary-500/50 transition-colors" />
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
                              <span className="text-dark-200 text-[11px] flex items-center gap-1"><RiCalendarCheckLine /> Jadwal: {row.waktu}</span>
                              <div className="flex gap-1">
                                <button className="p-1.5 bg-dark-900 rounded-lg border border-white/20 text-white hover:bg-primary-600 transition-colors" title="Print"><RiPrinterLine className="text-xs" /></button>
                                <button className="p-1.5 bg-dark-900 rounded-lg border border-white/20 text-white hover:bg-blue-600 transition-colors" title="Download"><RiDownloadLine className="text-xs" /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
