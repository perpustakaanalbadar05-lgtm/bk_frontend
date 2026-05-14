import { useState, useEffect } from 'react'
import {
  RiAddLine, RiFileTextLine, RiDownloadLine, RiEditLine, RiEyeLine,
  RiMagicLine, RiCheckboxCircleLine, RiRefreshLine, RiCalendarCheckLine,
  RiSettings4Line, RiPrinterLine, RiFileChartLine, RiAlertLine, RiArrowRightLine,
  RiFileList3Line, RiBuildingLine
} from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useData } from '../contexts/DataContext'
import { useSettings } from '../contexts/SettingsContext'

// Fallbacks
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
  const { sekolah } = useSettings(); // Load official metadata!
  
  const [activeTab, setActiveTab] = useState('overview')
  const [generating, setGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [programType, setProgramType] = useState('ACTION PLAN') // Default directly to the missing Action Plan!
  
  // Generated states
  const [generatedProta, setGeneratedProta] = useState(FALLBACK_PROTA)
  const [generatedProsem, setGeneratedProsem] = useState([])
  const [generatedActionPlan, setGeneratedActionPlan] = useState([])

  const handleGenerate = () => {
    setGenerating(true)
    
    setTimeout(() => {
      setGenerating(false)
      setShowResult(true)
      
      if (akpdResult) {
        // Filter prioritized items
        let prioritizedItems = akpdResult.aggregates.filter(a => a.prioritas === 'TINGGI' || a.prioritas === 'SEDANG');
        
        if (prioritizedItems.length === 0) {
          prioritizedItems = [...akpdResult.aggregates].sort((a,b) => b.persentase - a.persentase).slice(0, 12);
        } else {
          prioritizedItems.sort((a, b) => b.persentase - a.persentase);
        }

        // 1. Map to Action Plan (Row-Headers matched exactly to original Excel)
        const actPlan = prioritizedItems.map((item) => ({
          bidang: item.bidang,
          tujuan: item.tujuanLayanan || `Peserta didik mampu mengelola hal terkait ${item.bidang}`,
          komponen: item.komponenLayanan || 'Dasar',
          layanan: item.strategiLayanan || 'Bimbingan Klasikal',
          kelas: akpdResult.meta.kelas.replace(/[^0-9]/g, '') || 'VII', // Extract numeric class for simplicity
          materi: item.materi || item.pernyataan,
          metode: item.strategiLayanan?.includes('Klasikal') ? 'Diskusi, Ceramah, Tanya Jawab' : 'Konseling Individu / Diskusi Kelompok',
          media: item.strategiLayanan?.includes('Klasikal') ? 'LCD Projector, PPT Slide, Alat Tulis' : 'Ruang Konseling, Kertas Kerja',
          evaluasi: 'Evaluasi Proses & Evaluasi Hasil',
          ekuivalensi: item.strategiLayanan?.includes('Klasikal') ? '2 Jam Pembelajaran' : 'Ekuivalen 1 Jam'
        }));
        setGeneratedActionPlan(actPlan);

        // 2. Map to PROTA format
        const dynamicProta = prioritizedItems.map((item, idx) => {
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

        // 3. Map to PROSEM (Semester Ganjil)
        const ganjilProta = dynamicProta.filter(p => 
          ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].includes(p.waktu)
        );
        
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

      toast.success('Rencana Kegiatan & Program BK berhasil disusun sesuai standar Excel!', {
        icon: '✨',
        duration: 4000
      })
    }, 2000)
  }

  // Shared Signatures Renderer Helper
  const renderSignatures = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    
    return (
      <div className="mt-12 border-t border-white/10 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm print:text-black text-dark-200">
        <div className="flex flex-col items-center text-center space-y-16">
          <div>
            <p>Mengetahui,</p>
            <p className="font-bold text-white">Kepala {sekolah.nama || 'Sekolah'}</p>
          </div>
          <div>
            <p className="font-bold text-white underline">{sekolah.kepsek || '..................................................'}</p>
            <p className="text-xs text-dark-400 font-mono">{sekolah.nip_kepsek ? `NIP. ${sekolah.nip_kepsek}` : 'NIP. -'}</p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center space-y-16">
          <div>
            <p>{sekolah.alamat?.split(',')[0] || 'Pamekasan'}, {formattedDate}</p>
            <p className="font-bold text-white">Guru Bimbingan Konseling</p>
          </div>
          <div>
            <p className="font-bold text-white underline">Guru Pembimbing BK</p>
            <p className="text-xs text-dark-400 font-mono">NIP. ..................................................</p>
          </div>
        </div>
      </div>
    );
  };

  // Notification if no School Metadata set
  const isSekolahConfigured = sekolah && sekolah.nama;

  return (
    <div className="space-y-6 animate-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-white flex items-center gap-2">
            Program BK Otomatis
            <span className="badge-teal bg-emerald-500/10 text-emerald-400 text-xs py-0.5 animate-pulse">Auto Engine v2</span>
          </h1>
          <p className="text-dark-200 text-sm mt-1">Menghasilkan dokumen ACTION PLAN, PROTA, PROSEM, dan RPL otomatis.</p>
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

      {/* Warning Banner if School Settings Empty */}
      {!isSekolahConfigured && activeTab === 'generator' && (
        <div className="card-feature py-3 px-4 bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <RiBuildingLine className="text-lg" />
            <span>Profil Sekolah Anda belum dikonfigurasi! Dokumen legalitas tidak akan memuat KOP dan tanda tangan NIP yang benar.</span>
          </div>
          <button onClick={() => navigate('/dashboard/settings')} className="text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-white px-2 py-1 rounded font-bold uppercase">Atur Sekarang</button>
        </div>
      )}

      {/* MAIN CONTENT: DASHBOARD OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in">
          {/* Grid Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Matriks Action Plan', count: akpdResult ? '1 Matriks' : '0 Matriks', color: 'from-cyan-500/20 to-blue-500/20', text: 'text-cyan-400' },
              { label: 'PROTA & PROSEM', count: akpdResult ? '2 Dokumen' : '0 Dokumen', color: 'from-purple-500/20 to-pink-500/20', text: 'text-pink-400' },
              { label: 'RPL Rencana Layanan', count: akpdResult ? `${akpdResult.aggregates.filter(x=>x.prioritas!=='RENDAH').length} Modul` : '0 Modul', color: 'from-teal-500/20 to-emerald-500/20', text: 'text-teal-400' }
            ].map((item, i) => (
              <div key={i} className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} border border-white/20 backdrop-blur-lg`}>
                <h4 className="text-dark-300 text-xs font-medium uppercase tracking-wider">{item.label}</h4>
                <p className={`text-3xl font-display font-black mt-2 ${item.text}`}>{item.count}</p>
                <div className="flex justify-between items-center mt-4 text-xs text-dark-200">
                  <span>Instansi: {sekolah.nama || (akpdResult ? akpdResult.meta.sekolah : 'Belum diatur')}</span>
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
                <p className="text-dark-300 mt-2 max-w-md text-sm">Sistem mendeteksi {akpdResult.aggregates.filter(x=>x.prioritas!=='RENDAH').length} materi prioritas. Hasilkan Action Plan lengkap beserta Tanda Tangan Kepala Sekolah.</p>
              </div>
              <button onClick={() => setActiveTab('generator')} className="relative z-10 btn-primary gap-3 group whitespace-nowrap bg-primary-500 font-bold">
                SUSUN PROGRAM SEKARANG <RiMagicLine className="group-hover:animate-spin" />
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
                  <p className="text-dark-300 mt-1 max-w-md text-sm">Sistem memerlukan dataset dari menu Asesmen (unggah Excel atau portal digital) untuk menyusun matriks program otomatis.</p>
                </div>
              </div>
              <button onClick={() => navigate('/dashboard/asesmen')} className="btn-secondary border-amber-500/20 text-amber-300 hover:bg-amber-500/10 whitespace-nowrap gap-2 flex items-center font-bold">
                Unggah di Asesmen <RiArrowRightLine />
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
                      <div className="p-3 rounded-xl bg-white/10 border border-white/20 text-cyan-400 group-hover:text-accent-400 transition-colors">
                        <RiFileList3Line className="text-xl" />
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">Rencana Kegiatan (ACTION PLAN) Kelas {akpdResult.meta.kelas}</div>
                        <div className="flex items-center gap-2 text-xs text-dark-300 mt-1">
                          <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/20 font-mono text-cyan-400 font-bold">MATRIKS</span>
                          <span>Sesuai standar birokrasi Excel</span>
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
                  <h2 className="text-2xl font-display font-bold text-white">Sedang Menyusun Dokumen...</h2>
                  <p className="text-dark-200 max-w-md mx-auto text-sm">Memetakan Bidang Layanan, Rumusan Tujuan, Metode, Media Pembelajaran, Evaluasi, dan data legalitas KOP Sekolah.</p>
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
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {['ACTION PLAN', 'PROTA', 'PROSEM', 'RPL'].map(item => (
                          <label key={item} className="flex items-center gap-2 p-3 rounded-xl glass cursor-pointer hover:bg-white/5 border-white/20">
                            <input type="checkbox" defaultChecked className="accent-primary-500 h-4 w-4" />
                            <span className="text-white font-bold text-[10px] sm:text-xs tracking-wider font-display">{item}</span>
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
                    <h4 className="text-white font-bold font-display text-lg">Dokumen Resmi Berhasil Tersusun!</h4>
                    <p className="text-dark-200 text-xs">
                      {akpdResult 
                        ? `Telah digenerate dokumen ${programType} resmi lengkap dengan ttd untuk Kelas ${akpdResult.meta.kelas}.` 
                        : 'Menyusun program berdasarkan template default.'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowResult(false)} className="btn-secondary text-xs gap-1 py-2"><RiRefreshLine /> Reset Generator</button>
                  <button onClick={() => window.print()} className="btn-primary text-xs bg-indigo-600 hover:bg-indigo-500 border-none shadow-none py-2 gap-1"><RiPrinterLine /> Cetak Sekarang</button>
                </div>
              </div>

              {/* Viewer Body with Internal Tabs */}
              <div className="card-feature p-0 overflow-hidden">
                {/* Result Type Switcher */}
                <div className="flex bg-dark-950 border-b border-white/10 overflow-x-auto">
                  {['ACTION PLAN', 'PROTA', 'PROSEM', 'RPL'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setProgramType(tab)}
                      className={`flex-1 min-w-[120px] py-4 text-center font-display font-bold text-[11px] sm:text-xs tracking-widest border-b-2 transition-all
                        ${programType === tab ? 'border-primary-500 bg-primary-500/5 text-primary-300' : 'border-transparent text-dark-300 hover:text-white hover:bg-white/5'}
                      `}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Data Renderer */}
                <div className="p-6 bg-dark-950/40 backdrop-blur">
                  
                  {/* KOP SEKOLAH PREVIEW */}
                  <div className="flex items-center gap-4 border-b-2 border-white pb-4 mb-6 text-center sm:text-left flex-col sm:flex-row justify-center sm:justify-start">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-2xl font-bold font-display text-white flex-shrink-0">
                      {sekolah.logo ? <img src={sekolah.logo} className="w-full h-full rounded-full object-cover"/> : <RiBuildingLine/>}
                    </div>
                    <div>
                      <h4 className="text-xs tracking-widest uppercase font-bold text-dark-300">BIMBINGAN DAN KONSELING</h4>
                      <h2 className="text-lg font-bold text-white font-display uppercase tracking-wider">{sekolah.nama || (akpdResult ? akpdResult.meta.sekolah : 'SMP NEGERI 2 PAMEKASAN')}</h2>
                      <p className="text-[10px] text-dark-400 max-w-md">{sekolah.alamat || 'Kabupaten Pamekasan, Provinsi Jawa Timur'}</p>
                    </div>
                  </div>

                  {/* TAB 1: ACTION PLAN MATRIX */}
                  {programType === 'ACTION PLAN' && (
                    <div className="space-y-4 animate-in">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="text-white font-bold text-sm uppercase tracking-wide">RENCANA KEGIATAN (ACTION PLAN)</h5>
                          <p className="text-[10px] text-dark-400 font-mono uppercase">Kelas: {akpdResult ? akpdResult.meta.kelas : 'VII G'} • Tahun Pelajaran: {akpdResult ? akpdResult.meta.tahun : '2022-2023'}</p>
                        </div>
                        <button onClick={() => toast.success('Mengunduh spreadsheet action plan...')} className="text-cyan-400 text-xs hover:underline flex items-center gap-1 font-bold uppercase"><RiDownloadLine /> UNDUH EXCEL</button>
                      </div>
                      
                      <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-[10px] sm:text-xs text-left text-dark-200 border-collapse min-w-[1000px]">
                          <thead className="bg-dark-950 text-dark-300 font-bold border-b border-white/10 uppercase">
                            <tr>
                              <th className="px-3 py-3 border-r border-white/10 w-20">Bidang Layanan</th>
                              <th className="px-3 py-3 border-r border-white/10 w-48">Tujuan Layanan</th>
                              <th className="px-3 py-3 border-r border-white/10 w-24">Komponen</th>
                              <th className="px-3 py-3 border-r border-white/10 w-32">Strategi</th>
                              <th className="px-2 py-3 border-r border-white/10 w-12 text-center">Kls</th>
                              <th className="px-3 py-3 border-r border-white/10 w-40">Topik / Materi</th>
                              <th className="px-3 py-3 border-r border-white/10">Metode</th>
                              <th className="px-3 py-3 border-r border-white/10">Media</th>
                              <th className="px-3 py-3 border-r border-white/10">Evaluasi</th>
                              <th className="px-2 py-3 text-center">Ekuivalensi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {(generatedActionPlan.length > 0 ? generatedActionPlan : [
                              { bidang: 'Pribadi', tujuan: 'Peserta didik bersyukur pada Tuhan YME', komponen: 'Dasar', layanan: 'Bimbingan Klasikal', kelas: 'VII', materi: 'Tuhan selalu hadir', metode: 'Diskusi', media: 'PPT', evaluasi: 'Proses & Hasil', ekuivalensi: '2 Jam' }
                            ]).map((row, idx) => (
                              <tr key={idx} className="hover:bg-white/5 transition-colors align-top">
                                <td className="px-3 py-3 border-r border-white/5 font-bold text-white">{row.bidang}</td>
                                <td className="px-3 py-3 border-r border-white/5 italic text-dark-300 leading-relaxed">{row.tujuan}</td>
                                <td className="px-3 py-3 border-r border-white/5 text-dark-300">{row.komponen}</td>
                                <td className="px-3 py-3 border-r border-white/5 text-cyan-400 font-medium">{row.layanan}</td>
                                <td className="px-2 py-3 border-r border-white/5 text-center font-mono">{row.kelas}</td>
                                <td className="px-3 py-3 border-r border-white/5 text-white font-medium">{row.materi}</td>
                                <td className="px-3 py-3 border-r border-white/5 text-[10px] text-dark-400">{row.metode}</td>
                                <td className="px-3 py-3 border-r border-white/5 text-[10px] text-dark-400">{row.media}</td>
                                <td className="px-3 py-3 border-r border-white/5 text-dark-400">{row.evaluasi}</td>
                                <td className="px-2 py-3 text-center text-[10px] text-dark-300">{row.ekuivalensi}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {renderSignatures()}
                    </div>
                  )}

                  {/* TAB 2: PROTA */}
                  {programType === 'PROTA' && (
                    <div className="space-y-4 animate-in">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="text-white font-bold text-sm uppercase tracking-wide">RENCANA PROGRAM TAHUNAN (PROTA)</h5>
                          <p className="text-[10px] text-dark-400 font-mono uppercase">Tahun Pelajaran: {akpdResult ? akpdResult.meta.tahun : '2025/2026'}</p>
                        </div>
                        <button className="text-primary-400 text-xs hover:underline flex items-center gap-1 font-bold uppercase"><RiDownloadLine /> UNDUH EXCEL</button>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-xs md:text-sm text-left text-dark-200 border-collapse">
                          <thead className="bg-dark-950 text-dark-300 font-bold border-b border-white/10 uppercase">
                            <tr>
                              <th className="px-4 py-3 w-24">Bulan / Waktu</th>
                              <th className="px-4 py-3 w-28 text-center">Bidang</th>
                              <th className="px-4 py-3">Rumusan Kebutuhan (Materi)</th>
                              <th className="px-4 py-3">Strategi Layanan</th>
                              <th className="px-4 py-3 w-28 text-center">Prioritas</th>
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
                      {renderSignatures()}
                    </div>
                  )}

                  {/* TAB 3: PROSEM */}
                  {programType === 'PROSEM' && (
                    <div className="space-y-4 animate-in">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="text-white font-bold text-sm uppercase tracking-wide">PROGRAM SEMESTER GANJIL (PROSEM)</h5>
                          <p className="text-[10px] text-dark-400 font-mono uppercase">Juli - Desember</p>
                        </div>
                        <button className="text-primary-400 text-xs hover:underline flex items-center gap-1 font-bold uppercase"><RiDownloadLine /> UNDUH EXCEL</button>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full text-xs md:text-sm text-left text-dark-200 border-collapse">
                          <thead className="bg-dark-950 text-dark-300 border-b border-white/10 text-center uppercase">
                            <tr>
                              <th className="px-4 py-3 text-left" rowSpan="2">Bulan</th>
                              <th className="px-4 py-2 border-b border-white/10" colSpan="4">Minggu Efektif Layanan</th>
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
                      {renderSignatures()}
                    </div>
                  )}

                  {/* TAB 4: RPL */}
                  {programType === 'RPL' && (
                    <div className="space-y-4 animate-in">
                      <h5 className="text-white font-bold text-sm mb-3 uppercase tracking-wide">DRAF MODUL RPL TERSUSUN (Berdasarkan Action Plan)</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {generatedProta.map((row, idx) => (
                          <div key={idx} className="p-4 rounded-xl glass border-white/10 bg-white/5 hover:border-primary-500/30 transition-all group flex flex-col justify-between relative overflow-hidden">
                            {/* Printable Kop Header Mock for single RPL */}
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
                              <span className="text-dark-300 text-[10px] flex items-center gap-1 uppercase font-bold font-mono"><RiCalendarCheckLine className="text-primary-400"/> Jadwal: {row.waktu}</span>
                              <div className="flex gap-1">
                                <button onClick={() => toast.success('Membuka preview cetak RPL khusus...')} className="p-1.5 bg-dark-950 rounded-lg border border-white/20 text-white hover:bg-primary-600 transition-colors" title="Print"><RiPrinterLine className="text-xs" /></button>
                                <button onClick={() => toast.success('Mengunduh berkas RPL...')} className="p-1.5 bg-dark-950 rounded-lg border border-white/20 text-white hover:bg-blue-600 transition-colors" title="Download"><RiDownloadLine className="text-xs" /></button>
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
