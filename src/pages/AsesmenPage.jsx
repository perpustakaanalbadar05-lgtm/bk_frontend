import { useState, useRef } from 'react'
import { 
  RiClipboardLine, 
  RiCheckboxCircleLine, 
  RiTimeLine, 
  RiBrainLine, 
  RiEyeLine, 
  RiStarLine, 
  RiFireLine, 
  RiUploadCloud2Line, 
  RiFileExcel2Line, 
  RiCloseLine, 
  RiAlertLine, 
  RiArrowRightLine 
} from 'react-icons/ri'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import toast from 'react-hot-toast'
import { useData } from '../contexts/DataContext'
import { parseAkpdExcel } from '../utils/akpdParser'

const TABS = [
  { id: 'akpd', label: 'Asesmen AKPD' },
  { id: 'gaya-belajar', label: 'Gaya Belajar' },
  { id: 'kecerdasan', label: 'Kecerdasan Majemuk' },
  { id: 'kepribadian', label: 'Kepribadian' },
  { id: 'bakat-minat', label: 'Bakat & Karier' }
]

const PRIORITAS_CLS = {
  'TINGGI': 'badge bg-red-500/20 text-red-300 border border-red-500/30 font-bold text-[10px]',
  'SEDANG': 'badge bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px]',
  'RENDAH': 'badge bg-slate-500/20 text-slate-400 border border-slate-500/30 font-bold text-[10px]',
}

export default function AsesmenPage() {
  const [activeTab, setActiveTab] = useState('akpd')
  const { akpdResult, setAkpdResult } = useData()
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('profil-kelas') // profil-kelas, daftar-siswa
  const fileInputRef = useRef(null)

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const toastId = toast.loading('Sedang memproses file Excel...')
    
    try {
      const result = await parseAkpdExcel(file)
      setAkpdResult(result)
      toast.success(`Berhasil memproses data AKPD ${result.meta.kelas}!`, { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Gagal memproses file Excel!', { id: toastId })
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleResetData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus hasil Asesmen ini dan mengunggah ulang?')) {
      setAkpdResult(null)
      toast.success('Data asesmen berhasil dihapus.')
    }
  }

  const renderAkpdContent = () => {
    // If no uploaded data, show upload area
    if (!akpdResult) {
      return (
        <div className="max-w-3xl mx-auto text-center py-12 animate-in">
          <div className="card-feature border-dashed border-white/30 p-12 bg-white/5/30 hover:bg-white/5 transition-all flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-3xl bg-primary-500/20 text-primary-400 flex items-center justify-center border border-primary-500/30 mb-6 text-4xl relative">
              {loading ? <RiTimeLine className="animate-spin" /> : <RiUploadCloud2Line />}
            </div>
            <h2 className="text-2xl font-display font-black text-white mb-3">Belum Ada Data Asesmen AKPD</h2>
            <p className="text-dark-200 text-sm max-w-md mb-8 leading-relaxed">
              Unggah file acuan Excel AKPD Anda untuk mengkalkulasi Profil Kelas secara otomatis, menganalisis persentase kebutuhan, dan memprioritaskan topik bimbingan.
            </p>
            
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
              disabled={loading}
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="btn-primary py-3 px-8 shadow-glow-accent bg-primary-500 gap-3 font-bold tracking-wider disabled:opacity-50"
            >
              <RiFileExcel2Line className="text-xl" /> 
              {loading ? 'MENGOLAH DATA...' : 'UNGGAH HASIL AKPD (XLSX)'}
            </button>
            
            <div className="mt-8 flex items-center gap-2 text-dark-300 text-xs border-t border-white/10 pt-6 w-full justify-center">
              <RiAlertLine className="text-amber-400" />
              <span>Sistem mendeteksi baris otomatis dari lembar jawab sheet <b>ENTRI</b></span>
            </div>
          </div>
        </div>
      )
    }

    // Render populated state
    const radarData = akpdResult.bidangSummary.map(b => ({
      subject: b.label,
      A: Math.round(b.persentase),
      fullMark: 100
    }))

    return (
      <div className="animate-in space-y-6">
        {/* Meta Information Card */}
        <div className="card-feature py-4 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-primary-900/30 to-dark-900 border border-white/10">
          <div>
            <span className="text-[10px] font-bold text-primary-400 tracking-widest uppercase">SUMBER DATA AKTIF</span>
            <h3 className="text-white font-display font-bold text-xl mt-0.5 flex items-center gap-2">
              {akpdResult.meta.sekolah}
              <span className="badge bg-primary-500/20 border border-primary-500/30 text-primary-300 text-xs uppercase font-semibold">Kelas {akpdResult.meta.kelas}</span>
            </h3>
            <div className="flex gap-4 text-xs text-dark-300 mt-1">
              <span>Tahun: <b>{akpdResult.meta.tahun}</b></span>
              <span>•</span>
              <span>Responden: <b>{akpdResult.meta.totalSiswa} Siswa</b></span>
              <span>•</span>
              <span>Masalah Dipilih: <b>{akpdResult.meta.totalMasalah} Kali</b></span>
            </div>
          </div>
          <button onClick={handleResetData} className="btn-secondary py-2 text-xs border-red-500/20 hover:bg-red-500/10 text-red-300 gap-1.5 whitespace-nowrap">
            <RiCloseLine /> Ganti Data File
          </button>
        </div>

        {/* Top Metrics & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-feature">
            <h3 className="font-display font-bold text-white mb-1 flex items-center justify-between">
              Profil Kebutuhan Siswa
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-dark-300">Persentase %</span>
            </h3>
            <p className="text-dark-300 text-xs mb-4">Rasio persebaran masalah dalam 4 Bidang Bimbingan Konseling</p>
            
            <div className="flex items-center justify-center h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} />
                  <Radar name="Persentase %" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} strokeWidth={2} />
                  <Tooltip 
                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 12, color: '#f1f5f9' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-feature flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-white mb-4">Kebutuhan Bidang Layanan</h3>
              <div className="space-y-3.5">
                {akpdResult.bidangSummary.map(item => (
                  <div key={item.label} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-bold text-sm">{item.label}</span>
                      <span className="text-primary-300 font-mono font-bold text-sm">{item.persentase.toFixed(2)}%</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${item.persentase}%` }} 
                      />
                    </div>
                    <div className="flex justify-between items-center mt-2 text-[10px] text-dark-300">
                      <span>Total Terpilih: <b>{item.count} kali</b></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis Split Tabs */}
        <div className="flex border-b border-white/10">
          <button 
            onClick={() => setViewMode('profil-kelas')}
            className={`px-5 py-3 font-display font-bold text-sm border-b-2 transition-all ${viewMode === 'profil-kelas' ? 'border-primary-500 text-white' : 'border-transparent text-dark-300 hover:text-white'}`}
          >
            Profil Kelas (Rekap 50 Item)
          </button>
          <button 
            onClick={() => setViewMode('daftar-siswa')}
            className={`px-5 py-3 font-display font-bold text-sm border-b-2 transition-all ${viewMode === 'daftar-siswa' ? 'border-primary-500 text-white' : 'border-transparent text-dark-300 hover:text-white'}`}
          >
            Daftar Responden Konseli ({akpdResult.students.length})
          </button>
        </div>

        {/* View Area */}
        {viewMode === 'profil-kelas' ? (
          <div className="card-feature p-0 overflow-hidden">
            <div className="overflow-x-auto max-h-[500px] scrollbar-thin">
              <table className="w-full text-left text-sm text-dark-200 border-collapse">
                <thead className="bg-dark-950 text-dark-300 text-xs font-bold border-b border-white/10 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3.5 text-center w-12 bg-dark-950">NO</th>
                    <th className="px-4 py-3.5 bg-dark-950">BUTIR MASALAH SISWA</th>
                    <th className="px-4 py-3.5 w-24 bg-dark-950 text-center">BIDANG</th>
                    <th className="px-4 py-3.5 w-24 bg-dark-950 text-center">JML RESP</th>
                    <th className="px-4 py-3.5 w-24 bg-dark-950 text-center">PERSEN</th>
                    <th className="px-4 py-3.5 w-28 bg-dark-950 text-center">PRIORITAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {akpdResult.aggregates.map((item) => (
                    <tr key={item.no} className={`hover:bg-white/5 transition-colors ${item.prioritas === 'TINGGI' ? 'bg-red-500/5' : ''}`}>
                      <td className="px-4 py-3 text-center font-mono font-bold text-xs text-dark-300">{item.no}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-white/90 leading-relaxed">{item.pernyataan}</div>
                        <div className="text-[10px] text-dark-400 mt-0.5">Materi: {item.materi}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          item.bidang === 'Pribadi' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                          item.bidang === 'Sosial' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                          item.bidang === 'Belajar' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {item.bidang}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold font-mono text-white">{item.jmlResponden}</td>
                      <td className="px-4 py-3 text-center font-mono text-xs text-primary-300 font-bold">
                        {(item.persentase * 100).toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={PRIORITAS_CLS[item.prioritas]}>{item.prioritas}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {akpdResult.students.map((std, i) => (
              <div key={i} className="card-feature hover:border-primary-500/30 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center font-bold text-white font-display text-sm uppercase">
                      {std.nama.substring(0, 2)}
                    </div>
                    <span className={`text-[10px] font-bold tracking-widest uppercase font-mono border px-2 py-0.5 rounded ${
                      std.totalScore > 15 ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      std.totalScore > 7 ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                      'bg-teal-500/20 text-teal-400 border-teal-500/30'
                    }`}>
                      SKOR: {std.totalScore}
                    </span>
                  </div>
                  <h4 className="text-white font-bold group-hover:text-primary-300 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">{std.nama}</h4>
                  <p className="text-xs text-dark-300 mt-0.5">Urut: {std.no} {std.jk ? `• Gender: ${std.jk}` : ''}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] text-dark-300">
                    {std.totalScore > 15 ? '⚠️ Butuh Penanganan Segera' : 
                     std.totalScore > 7 ? '💡 Rekomendasi Kelompok' : 
                     '✅ Kondisi Stabil'}
                  </span>
                  <button className="text-primary-400 hover:text-primary-300 flex items-center gap-0.5 text-[10px] font-bold tracking-wide group/btn">
                    DETAIL PROFIL <RiArrowRightLine className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'akpd':
        return renderAkpdContent()
      case 'gaya-belajar':
        return (
          <div className="animate-in space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                 { t: 'Visual', val: '45%', col: 'text-indigo-400', bg: 'bg-indigo-500' },
                 { t: 'Auditori', val: '30%', col: 'text-emerald-400', bg: 'bg-emerald-500' },
                 { t: 'Kinestetik', val: '25%', col: 'text-amber-400', bg: 'bg-amber-500' }
               ].map(item => (
                 <div key={item.t} className="card-feature flex items-center justify-between py-6">
                   <div>
                     <div className="text-dark-200 text-sm font-bold uppercase tracking-wider mb-1">{item.t}</div>
                     <div className={`font-display font-black text-3xl ${item.col}`}>{item.val}</div>
                   </div>
                   <div className={`w-12 h-12 rounded-full ${item.bg} bg-opacity-20 border border-${item.bg.replace('bg-', '')}/50 flex items-center justify-center text-2xl ${item.col}`}>
                     <RiEyeLine />
                   </div>
                 </div>
               ))}
             </div>
             <div className="card-feature p-8 text-center border-dashed">
                <RiBrainLine className="text-6xl text-primary-500/50 mx-auto mb-4" />
                <h3 className="text-xl text-white font-bold">Sebarkan Kuesioner Gaya Belajar</h3>
                <p className="text-dark-200 text-sm mt-2 max-w-md mx-auto mb-6">Bagikan link ini ke siswa untuk mengukur dominasi gaya belajar (V-A-K) secara mandiri.</p>
                <button className="btn-primary" onClick={() => toast.success('Link disalin!')}>Salin Link Kuesioner</button>
             </div>
          </div>
        )
      case 'bakat-minat':
      case 'kecerdasan':
      case 'kepribadian':
        return (
           <div className="animate-in flex flex-col items-center justify-center p-12 text-center card-feature border-dashed mt-4">
             <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-3xl text-dark-200 border border-white/20 mb-6">
               {activeTab === 'kepribadian' ? <RiStarLine /> : <RiFireLine />}
             </div>
             <h2 className="text-xl font-bold text-white mb-2">Modul {TABS.find(t=>t.id === activeTab).label}</h2>
             <p className="text-dark-200 text-sm max-w-lg mb-6">Bank soal untuk asesmen psikologis ini sudah diintegrasikan. Silakan generate token ujian untuk mendistribusikannya ke siswa melalui portal murid.</p>
             <button className="btn-primary py-2.5 px-6">Buat Sesi Ujian Baru</button>
           </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Pusat Asesmen & Psikotes</h1>
          <p className="text-dark-200 text-sm">Integrasi alat ukur psikologis dan diagnostik kebutuhan peserta didik</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 bg-white/5 p-1.5 rounded-xl border border-white/20 w-max">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-primary-600 shadow-glow-sm text-white' 
                  : 'text-dark-200 hover:text-white hover:bg-white/5'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {renderContent()}
    </div>
  )
}
