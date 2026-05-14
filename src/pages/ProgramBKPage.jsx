import { useState, useEffect } from 'react'
import {
  RiAddLine, RiFileTextLine, RiDownloadLine, RiEditLine, RiEyeLine,
  RiMagicLine, RiCheckboxCircleLine, RiRefreshLine, RiCalendarCheckLine,
  RiSettings4Line, RiPrinterLine, RiFileChartLine, RiAlertLine, RiArrowRightLine
} from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useData } from '../contexts/DataContext'

// In case of no dynamic data, fall back to these standard items.
const FALLBACK_PROTA = [
  { id: 1, bidang: 'Pribadi', kebutuhan: 'Pengenalan Potensi Diri', layanan: 'Klasikal', sasaran: 'Kelas VII G', waktu: 'Juli' },
  { id: 2, bidang: 'Sosial', kebutuhan: 'Komunikasi Asertif', layanan: 'Bimbingan Kelompok', sasaran: 'Kelas VII G', waktu: 'Agustus' },
  { id: 3, bidang: 'Belajar', kebutuhan: 'Manajemen Waktu Belajar', layanan: 'Klasikal', sasaran: 'Kelas VII G', waktu: 'September' },
  { id: 4, bidang: 'Karir', kebutuhan: 'Perencanaan Karir Masa Depan', layanan: 'Lintas Kelas', sasaran: 'Kelas VII G', waktu: 'Oktober' },
]

const BULAN_LIST = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];

export default function ProgramBKPage() {
  const navigate = useNavigate();
  const { akpdResult } = useData();
  const [activeTab, setActiveTab] = useState('overview') // overview, generator, viewer
  const [generating, setGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [programType, setProgramType] = useState('PROTA') // PROTA, PROSEM, RPL
  
  // Generated states
  const [generatedProta, setGeneratedProta] = useState(FALLBACK_PROTA)
  const [generatedProsem, setGeneratedProsem] = useState([])

  const handleGenerate = () => {
    setGenerating(true)
    
    setTimeout(() => {
      setGenerating(false)
      setShowResult(true)
      
      if (akpdResult) {
        // 1. Logic to generate PROTA based on real AKPD results!
        // Filter for problems that need addressing (Prioritas TINGGI or SEDANG).
        // If none, take top 10 problems sorted by percentage.
        let prioritizedItems = akpdResult.aggregates.filter(a => a.prioritas === 'TINGGI' || a.prioritas === 'SEDANG');
        
        if (prioritizedItems.length === 0) {
          // Just fallback to top items
          prioritizedItems = [...akpdResult.aggregates].sort((a,b) => b.persentase - a.persentase).slice(0, 12);
        } else {
          // Sort them by percentage descending
          prioritizedItems.sort((a, b) => b.persentase - a.persentase);
        }

        // Map to PROTA format
        const dynamicProta = prioritizedItems.map((item, idx) => {
          // Distribute months sequentially across academic year starting from July (idx % 12)
          const bulan = BULAN_LIST[idx % 12] || 'Juli';
          return {
            id: item.no,
            bidang: item.bidang,
            kebutuhan: item.materi || item.rumusanKebutuhan,
            tujuan: item.tujuanLayanan,
            layanan: item.strategiLayanan || 'Bimbingan Klasikal',
            sasaran: `Kelas ${akpdResult.meta.kelas}`,
            waktu: bulan,
            prioritas: item.prioritas,
            persentase: item.persentase
          };
        });

        setGeneratedProta(dynamicProta);

        // 2. Logic to generate PROSEM (Program Semester Ganjil - Juli to Des)
        const ganjilProta = dynamicProta.filter(p => 
          ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].includes(p.waktu)
        );
        
        // Create months map
        const prosemMonths = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => {
          const currentMonthTopics = ganjilProta.filter(x => x.waktu === m);
          return {
            bulan: m,
            m1: currentMonthTopics[0] ? currentMonthTopics[0].kebutuhan : '-',
            m2: currentMonthTopics[1] ? currentMonthTopics[1].kebutuhan : 'Evaluasi & Laporan',
            m3: currentMonthTopics[0] ? currentMonthTopics[0].bidang : '-',
            m4: currentMonthTopics[0] ? currentMonthTopics[0].layanan : '-'
          };
        });
        setGeneratedProsem(prosemMonths);
      }

      toast.success('Program BK berhasil disusun secara logis berdasarkan skor prioritas AKPD!', {
        icon: '✨',
        duration: 4000
      })
    }, 2000)
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white flex items-center gap-2">
            Program BK Otomatis
            <span className="badge-teal bg-emerald-500/10 text-emerald-400 text-xs py-0.5 animate-pulse">Auto Engine</span>
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
              { label: 'PROTA Dinamis', count: akpdResult ? '1 Dokumen' : '0 Dokumen', color: 'from-blue-500/20 to-indigo-500/20', text: 'text-indigo-400' },
              { label: 'PROSEM Tersusun', count: akpdResult ? '2 Dokumen' : '0 Dokumen', color: 'from-purple-500/20 to-pink-500/20', text: 'text-pink-400' },
              { label: 'RPL Prioritas', count: akpdResult ? `${akpdResult.aggregates.filter(x=>x.prioritas!=='RENDAH').length} Dokumen` : '0 Dokumen', color: 'from-teal-500/20 to-emerald-500/20', text: 'text-teal-400' }
            ].map((item, i) => (
              <div key={i} className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} border border-white/20 backdrop-blur-lg`}>
                <h4 className="text-dark-300 text-xs font-medium uppercase tracking-wider">{item.label}</h4>
                <p className={`text-3xl font-display font-black mt-2 ${item.text}`}>{item.count}</p>
                <div className="flex justify-between items-center mt-4 text-xs text-dark-200">
                  <span>Aktif: {akpdResult ? `${akpdResult.meta.sekolah} (${akpdResult.meta.tahun})` : 'Belum ada data'}</span>
                  <RiCheckboxCircleLine className={akpdResult ? "text-teal-400 text-lg" : "text-dark-500 text-lg"} />
                </div>
              </div>
            ))}
          </div>

          {/* Actionable Generator Banner */}
          {akpdResult ? (
            <div className="card-feature bg-gradient-to-r from-primary-900/50 via-dark-900 to-accent-900/30 p-8 border border-primary-500/20 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-bold text-white flex items-center gap-2">
                  Data AKPD {akpdResult.meta.kelas} Siap Digunakan!
                </h3>
                <p className="text-dark-300 mt-2 max-w-md text-sm">Sistem mendeteksi {akpdResult.aggregates.filter(x=>x.prioritas!=='RENDAH').length} materi kebutuhan prioritas. Klik di bawah untuk menyusun jadwal layanan bimbingan secara otomatis.</p>
              </div>
              <button onClick={() => setActiveTab('generator')} className="relative z-10 btn-primary gap-3 group whitespace-nowrap bg-primary-500">
                Susun Program Sekarang <RiMagicLine className="group-hover:animate-spin" />
              </button>
            </div>
          ) : (
            <div className="card-feature bg-amber-500/10 border border-amber-500/20 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 flex items-center justify-center rounded-xl border border-amber-500/30 text-2xl flex-shrink-0">
                  <RiAlertLine />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Data Asesmen AKPD Belum Diunggah</h3>
                  <p className="text-dark-300 mt-1 max-w-md text-sm">Sistem tidak dapat menyusun rencana program (PROTA/PROSEM) otomatis karena Anda belum mengunggah file Excel hasil AKPD di menu Asesmen.</p>
                </div>
              </div>
              <button onClick={() => navigate('/asesmen')} className="btn-secondary border-amber-500/20 text-amber-300 hover:bg-amber-500/10 whitespace-nowrap gap-2 flex items-center">
                Unggah File di Asesmen <RiArrowRightLine />
              </button>
            </div>
          )}

          {/* Recent Programs List */}
          <div className="card-feature">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display font-bold text-white text-lg">Daftar Dokumen Program Terbit</h3>
              <div className="flex gap-2">
                <select className="bg-white/10 text-dark-300 text-xs border border-white/20 rounded-lg px-3 py-1.5 outline-none">
                  <option>{akpdResult ? akpdResult.meta.tahun : 'Tahun 2025/2026'}</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {akpdResult ? (
                <>
                  <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl glass border-white/20 hover:bg-white/5 transition-colors group">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-primary-400 group-hover:text-accent-400 transition-colors">
                        <RiFileTextLine className="text-xl" />
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">Program Tahunan (PROTA) Kelas {akpdResult.meta.kelas}</div>
                        <div className="flex items-center gap-2 text-xs text-dark-300 mt-1">
                          <span className="px-2 py-0.5 rounded bg-dark-700 border border-white/20 font-mono">PROTA</span>
                          <span>Siap Di-Generate</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => { setActiveTab('generator'); handleGenerate(); }} className="btn-secondary text-xs py-1.5 px-4 border-primary-500/20 hover:bg-primary-500/10 text-primary-300">Generate</button>
                  </div>
                </>
              ) : (
                <p className="text-dark-400 text-center py-8 text-sm italic">Belum ada dokumen program yang tersusun.</p>
              )}
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
                  <h2 className="text-2xl font-display font-bold text-white">Sedang Mengolah Data Asesmen...</h2>
                  <p className="text-dark-200 max-w-md mx-auto text-sm">Mengambil item dengan prioritas TINGGI dan SEDANG, menyusun materi ke dalam bulan efektif, dan menghasilkan Rencana Pelaksanaan Layanan (RPL).</p>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden max-w-sm mx-auto mt-6">
                    <div className="bg-primary-500 h-full animate-shimmer" style={{ width: '100%', backgroundSize: '200% 100%' }} />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-display font-bold text-white mb-2">Konfigurasi Generator Program</h2>
                  <p className="text-dark-200 text-sm mb-8 max-w-lg mx-auto">
                    {akpdResult 
                      ? `Sistem mendeteksi sumber data aktif dari ${akpdResult.meta.sekolah} Kelas ${akpdResult.meta.kelas}.` 
                      : 'Anda tidak memiliki sumber data aktif. Sistem akan menggunakan template default.'
                    }
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                    <div>
                      <label className="text-xs font-semibold text-dark-300 mb-1.5 block">Tahun Pelajaran</label>
                      <select className="input-field py-2.5 text-sm">
                        <option>{akpdResult ? akpdResult.meta.tahun : '2025/2026'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-dark-300 mb-1.5 block">Sumber Acuan Materi</label>
                      <select className="input-field py-2.5 text-sm">
                        {akpdResult ? (
                          <option>Hasil Asesmen AKPD Kelas {akpdResult.meta.kelas}</option>
                        ) : (
                          <option>Template Default Sistem</option>
                        )}
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
                    <button onClick={handleGenerate} className="btn-primary py-2.5 bg-primary-500 gap-2 px-8 font-bold">
                      <RiMagicLine /> BANGUN PROGRAM OTOMATIS
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
                  <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20">
                    <RiCheckboxCircleLine className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold font-display text-lg">Penyusunan Berhasil!</h4>
                    <p className="text-dark-200 text-xs">
                      {akpdResult 
                        ? `Menyusun ${generatedProta.length} topik layanan terprioritas secara kronologis akademik.` 
                        : 'Menyusun program berdasarkan template default.'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowResult(false)} className="btn-secondary text-xs gap-1 py-2"><RiRefreshLine /> Reset Generator</button>
                  <button onClick={() => toast.success('Dokumen disimpan ke draf!')} className="btn-primary text-xs bg-emerald-600 hover:bg-emerald-500 border-none shadow-none py-2 gap-1"><RiDownloadLine /> Simpan Permanen</button>
                </div>
              </div>

              {/* Viewer Body with Internal Tabs */}
              <div className="card-feature p-0 overflow-hidden">
                {/* Result Type Switcher */}
                <div className="flex bg-dark-950 border-b border-white/10">
                  {['PROTA', 'PROSEM', 'RPL'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setProgramType(tab)}
                      className={`flex-1 py-4 text-center font-display font-bold text-sm tracking-wider border-b-2 transition-all
                        ${programType === tab ? 'border-primary-500 bg-primary-500/5 text-primary-300' : 'border-transparent text-dark-200 hover:text-white hover:bg-white/5'}
                      `}
                    >
                      {tab} {tab === 'PROTA' ? '(Tahun)' : tab === 'PROSEM' ? '(Semester)' : '(Rencana Layanan)'}
                    </button>
                  ))}
                </div>

                {/* Data Renderer */}
                <div className="p-6">
                  {programType === 'PROTA' && (
                    <div className="space-y-4 animate-in">
                      <div className="flex justify-between items-center">
                        <h5 className="text-white font-bold text-sm">Rencana Program Tahunan (PROTA) - {akpdResult ? akpdResult.meta.tahun : '2025/2026'}</h5>
                        <button className="text-primary-400 text-xs hover:underline flex items-center gap-1 font-bold"><RiDownloadLine /> UNDUH EXCEL</button>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-xs md:text-sm text-left text-dark-200 border-collapse">
                          <thead className="bg-dark-950 text-dark-300 font-bold border-b border-white/10">
                            <tr>
                              <th className="px-4 py-3 w-24">WAKTU</th>
                              <th className="px-4 py-3 w-28 text-center">BIDANG</th>
                              <th className="px-4 py-3">RUMUSAN KEBUTUHAN (MATERI)</th>
                              <th className="px-4 py-3">STRATEGI LAYANAN</th>
                              <th className="px-4 py-3 w-28 text-center">PRIORITAS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {generatedProta.map((row, idx) => (
                              <tr key={idx} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-3 font-bold text-white text-xs uppercase">{row.waktu}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[10px] border font-bold uppercase ${
                                    row.bidang === 'Belajar' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                                    row.bidang === 'Pribadi' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                    row.bidang === 'Sosial' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' :
                                    'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                  }`}>
                                    {row.bidang}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="text-white/90 font-medium">{row.kebutuhan}</div>
                                  {row.tujuan && <div className="text-[10px] text-dark-400 mt-0.5 italic">{row.tujuan}</div>}
                                </td>
                                <td className="px-4 py-3 text-dark-300">{row.layanan}</td>
                                <td className="px-4 py-3 text-center">
                                  <span className={`badge text-[10px] font-bold border ${
                                    row.prioritas === 'TINGGI' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                                    row.prioritas === 'SEDANG' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                                    'bg-slate-500/20 text-slate-300 border-white/10'
                                  }`}>
                                    {row.prioritas || 'NORMAL'}
                                  </span>
                                </td>
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
                        <h5 className="text-white font-bold text-sm">Rencana Program Semester Ganjil (PROSEM)</h5>
                        <button className="text-primary-400 text-xs hover:underline flex items-center gap-1 font-bold"><RiDownloadLine /> UNDUH EXCEL</button>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-xs md:text-sm text-left text-dark-200 border-collapse">
                          <thead className="bg-dark-950 text-dark-300 border-b border-white/10 text-center">
                            <tr>
                              <th className="px-4 py-3 text-left" rowSpan="2">BULAN</th>
                              <th className="px-4 py-2 border-b border-white/10" colSpan="4">MINGGU EFEKTIF LAYANAN</th>
                            </tr>
                            <tr className="text-[10px] bg-dark-900/50">
                              <th className="px-2 py-1 border-r border-white/10">I</th>
                              <th className="px-2 py-1 border-r border-white/10">II</th>
                              <th className="px-2 py-1 border-r border-white/10">III (Bidang)</th>
                              <th className="px-2 py-1">IV (Strategi)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-center">
                            {(generatedProsem.length > 0 ? generatedProsem : [
                              { bulan: 'Juli', m1: 'Tuhan selalu hadir dalam', m2: 'Evaluasi & Laporan', m3: 'Pribadi', m4: 'Bimbingan Klasikal' },
                              { bulan: 'Agustus', m1: 'Nilai suatu sikap kejujur', m2: 'Evaluasi & Laporan', m3: 'Pribadi', m4: 'Bimbingan Klasikal' },
                              { bulan: 'September', m1: 'Bersyukur dengan hati yan', m2: 'Evaluasi & Laporan', m3: 'Pribadi', m4: 'Bimbingan Klasikal' }
                            ]).map((row, idx) => (
                              <tr key={idx} className="hover:bg-white/5 transition-colors">
                                <td className="px-4 py-4 text-left font-bold text-white uppercase">{row.bulan}</td>
                                <td className="px-2 py-4 border-r border-white/10 text-dark-200 text-xs text-left pl-4 max-w-[200px] truncate">{row.m1}</td>
                                <td className="px-2 py-4 border-r border-white/10 text-dark-300 text-xs">{row.m2}</td>
                                <td className="px-2 py-4 border-r border-white/10 text-accent-300 font-semibold text-xs bg-white/5">{row.m3}</td>
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
                      <h5 className="text-white font-bold text-sm mb-3">Draf Rencana Pelaksanaan Layanan (RPL) Tersusun</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {generatedProta.map((row, idx) => (
                          <div key={idx} className="p-4 rounded-xl glass border-white/10 bg-white/5 hover:border-primary-500/30 transition-all group flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <div className="w-full">
                                  <span className="text-[10px] font-extrabold text-primary-400 uppercase tracking-widest">RPL {row.layanan.toUpperCase()}</span>
                                  <h6 className="text-white font-bold mt-1 group-hover:text-primary-300 transition-colors line-clamp-2 h-10">{row.kebutuhan}</h6>
                                  <p className="text-dark-400 text-[10px] mt-1">Durasi: 1 x 45 Menit • Sasaran: {row.sasaran}</p>
                                </div>
                                <RiFileChartLine className="text-dark-600 text-3xl group-hover:text-primary-500/40 transition-colors flex-shrink-0 ml-2" />
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                              <span className="text-dark-300 text-[10px] flex items-center gap-1 uppercase font-bold font-mono"><RiCalendarCheckLine className="text-primary-400"/> {row.waktu}</span>
                              <div className="flex gap-1">
                                <button onClick={() => toast.success('Membuka preview cetak...')} className="p-1.5 bg-dark-950 rounded-lg border border-white/10 text-white hover:bg-primary-600 transition-colors" title="Print"><RiPrinterLine className="text-xs" /></button>
                                <button onClick={() => toast.success('Mengunduh file dokumen...')} className="p-1.5 bg-dark-950 rounded-lg border border-white/10 text-white hover:bg-blue-600 transition-colors" title="Download"><RiDownloadLine className="text-xs" /></button>
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
