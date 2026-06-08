import { useState, useEffect } from 'react'
import {
  RiAddLine, RiFileTextLine, RiDownloadLine, RiEditLine, RiEyeLine,
  RiMagicLine, RiCheckboxCircleLine, RiRefreshLine, RiCalendarCheckLine,
  RiSettings4Line, RiPrinterLine, RiFileChartLine, RiAlertLine, RiArrowRightLine,
  RiFileList3Line, RiBuildingLine, RiCloseLine, RiCheckLine, RiCalendarLine
} from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useData } from '../contexts/DataContext'
import { useSettings } from '../contexts/SettingsContext'
import { useAuth } from '../contexts/AuthContext'

// Fallbacks
const FALLBACK_PROTA = [
  { id: 1, bidang: 'Pribadi', kebutuhan: 'Pengenalan Potensi Diri', layanan: 'Klasikal', sasaran: 'Kelas VII G', waktu: 'Juli' },
  { id: 2, bidang: 'Sosial', kebutuhan: 'Komunikasi Asertif', layanan: 'Bimbingan Kelompok', sasaran: 'Kelas VII G', waktu: 'Agustus' },
  { id: 3, bidang: 'Belajar', kebutuhan: 'Manajemen Waktu Belajar', layanan: 'Klasikal', sasaran: 'Kelas VII G', waktu: 'September' },
  { id: 4, bidang: 'Karir', kebutuhan: 'Perencanaan Karir Masa Depan', layanan: 'Lintas Kelas', sasaran: 'Kelas VII G', waktu: 'Oktober' },
]

const BULAN_LIST = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni'];
const PROSEM_BULAN_GANJIL = ['Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function ProgramBKPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { akpdResult } = useData();
  const { sekolah } = useSettings();
  
  const [activeTab, setActiveTab] = useState('overview')
  const [generating, setGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [programType, setProgramType] = useState('ACTION PLAN')
  
  // States for dynamic generation
  const [generatedProta, setGeneratedProta] = useState(FALLBACK_PROTA)
  const [generatedActionPlan, setGeneratedActionPlan] = useState([])
  const [selectedRpl, setSelectedRpl] = useState(null); // State for selected RPL Modal

  let tingkatFallback = 'SMP/MTs';
  if (sekolah?.nama?.toUpperCase().includes('SMA') || sekolah?.nama?.toUpperCase().includes('SMK') || sekolah?.nama?.toUpperCase().includes('MAN ')) {
    tingkatFallback = 'SMA/SMK/MA';
  }

  const handleGenerate = () => {
    setGenerating(true)
    
    setTimeout(() => {
      setGenerating(false)
      setShowResult(true)
      
      if (akpdResult) {
        let prioritizedItems = akpdResult.aggregates.filter(a => a.prioritas === 'TINGGI' || a.prioritas === 'SEDANG');
        
        if (prioritizedItems.length === 0) {
          prioritizedItems = [...akpdResult.aggregates].sort((a,b) => b.persentase - a.persentase).slice(0, 12);
        } else {
          prioritizedItems.sort((a, b) => b.persentase - a.persentase);
        }

        // 1. Map to Action Plan (Rows matched exactly to original Excel)
        const actPlan = prioritizedItems.map((item) => ({
          bidang: item.bidang,
          tujuan: item.tujuanLayanan || `Peserta didik mampu mengelola hal terkait ${item.bidang}`,
          komponen: item.komponenLayanan || 'Dasar',
          layanan: item.strategiLayanan || 'Bimbingan Klasikal',
          kelas: akpdResult.meta.kelas.replace(/[^0-9]/g, '') || 'VII',
          materi: item.materi || item.pernyataan,
          metode: item.strategiLayanan?.includes('Klasikal') ? 'Diskusi, Ceramah, Tanya Jawab' : 'Konseling Individu / Diskusi Kelompok',
          media: item.strategiLayanan?.includes('Klasikal') ? 'LCD Projector, PPT Slide, Alat Tulis' : 'Ruang Konseling, Kertas Kerja',
          evaluasi: 'Evaluasi Proses & Evaluasi Hasil',
          ekuivalensi: item.strategiLayanan?.includes('Klasikal') ? '2 Jam Pembelajaran' : 'Ekuivalen 1 Jam'
        }));
        setGeneratedActionPlan(actPlan);

        // 2. Map to PROTA
        const dynamicProta = prioritizedItems.map((item, idx) => {
          const bulan = BULAN_LIST[idx % 12] || 'Juli';
          return {
            id: item.no,
            bidang: item.bidang,
            kebutuhan: item.materi || item.rumusanKebutuhan || item.pernyataan,
            tujuan: item.tujuanLayanan || `Memahami pentingnya ${item.materi || item.pernyataan}`,
            komponen: item.komponenLayanan || 'Layanan Dasar',
            layanan: item.strategiLayanan || 'Bimbingan Klasikal',
            sasaran: `Kelas ${akpdResult.meta.kelas}`,
            waktu: bulan,
            prioritas: item.prioritas,
            persentase: item.persentase,
            metode: item.strategiLayanan?.includes('Klasikal') ? 'Ceramah & Diskusi' : 'Sesi Tatap Muka',
            media: item.strategiLayanan?.includes('Klasikal') ? 'LCD Projector, Slide' : 'Lembar Kerja'
          };
        });
        setGeneratedProta(dynamicProta);
      }

      toast.success('Program BK & RPL berhasil disusun sesuai standar!', { icon: '✨', duration: 4000 })
    }, 2000)
  }

  // Printing current DOM section helper
  const handlePrint = () => {
    window.print();
  }

  const renderSignatures = () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    
    return (
      <div className="mt-12 border-t border-white/10 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm print:text-black print:border-black text-dark-200">
        <div className="flex flex-col items-center text-center space-y-16">
          <div>
            <p className="print:text-black">Mengetahui,</p>
            <p className="font-bold text-white print:text-black">Kepala {sekolah.nama || 'Sekolah'}</p>
          </div>
          <div>
            <p className="font-bold text-white print:text-black underline">{sekolah.kepsek || '..................................................'}</p>
            <p className="text-xs text-dark-400 font-mono print:text-black">{sekolah.nip_kepsek ? `NIP. ${sekolah.nip_kepsek}` : 'NIP. -'}</p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center space-y-16">
          <div>
            <p className="print:text-black">{sekolah.alamat?.split(',')[0] || 'Pamekasan'}, {formattedDate}</p>
            <p className="font-bold text-white print:text-black">Guru Bimbingan Konseling</p>
          </div>
          <div>
            <p className="font-bold text-white print:text-black underline">{user?.name || 'Guru Pembimbing BK'}</p>
            <p className="text-xs text-dark-400 font-mono print:text-black">{user?.nip ? `NIP. ${user.nip}` : 'NIP. ..................................................'}</p>
          </div>
        </div>
      </div>
    );
  };

  const isSekolahConfigured = sekolah && sekolah.nama;

  return (
    <div className="space-y-6 animate-in relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hide-on-print">
        <div>
          <h1 className="font-display font-bold text-3xl text-slate-800 dark:text-white flex items-center gap-3">
            Program BK Otomatis
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-500/30 shadow-sm animate-pulse">Auto Engine v2</span>
          </h1>
          <p className="text-slate-500 dark:text-dark-300 text-sm mt-1">Menghasilkan dokumen ACTION PLAN, PROTA, PROSEM, dan RPL otomatis.</p>
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

      {/* Warning Banner */}
      {!isSekolahConfigured && activeTab === 'generator' && (
        <div className="card-feature py-3 px-4 bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3 hide-on-print">
          <div className="flex items-center gap-2 text-xs text-amber-300">
            <RiBuildingLine className="text-lg" />
            <span>Profil Sekolah Anda belum dikonfigurasi! Dokumen tidak akan memuat KOP dan Tanda Tangan yang benar.</span>
          </div>
          <button onClick={() => navigate('/dashboard/settings')} className="text-[10px] bg-amber-500/20 hover:bg-amber-500/30 text-white px-2 py-1 rounded font-bold uppercase">Atur Sekarang</button>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in hide-on-print">
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

          {akpdResult ? (
            <div className="card-feature bg-gradient-to-r from-primary-900/50 via-dark-900 to-accent-900/30 p-8 border border-primary-500/20 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="relative z-10">
                <h3 className="font-display text-2xl font-bold text-white flex items-center gap-2">Data AKPD {akpdResult.meta.kelas} Siap Digunakan!</h3>
                <p className="text-dark-300 mt-2 max-w-md text-sm">Sistem mendeteksi {akpdResult.aggregates.filter(x=>x.prioritas!=='RENDAH').length} materi prioritas untuk target <b className="text-white">{akpdResult.meta.tingkat || tingkatFallback}</b>. Hasilkan Action Plan, Prota, Promes, dan 1-Page RPL lengkap.</p>
              </div>
              <button onClick={() => setActiveTab('generator')} className="btn-primary gap-3 whitespace-nowrap bg-primary-500 font-bold">
                SUSUN PROGRAM SEKARANG <RiMagicLine />
              </button>
            </div>
          ) : (
            <div className="card-feature bg-amber-500/10 border border-amber-500/20 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 flex items-center justify-center rounded-xl border border-amber-500/30 text-2xl flex-shrink-0"><RiAlertLine /></div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Data Asesmen AKPD Belum Tersedia</h3>
                  <p className="text-dark-300 mt-1 max-w-md text-sm">Sistem memerlukan data dari menu Asesmen untuk menyusun matriks program otomatis.</p>
                </div>
              </div>
              <button onClick={() => navigate('/dashboard/asesmen')} className="btn-secondary whitespace-nowrap gap-2 flex items-center font-bold">
                Masuk ke Asesmen <RiArrowRightLine />
              </button>
            </div>
          )}
        </div>
      )}

      {/* GENERATOR TAB */}
      {activeTab === 'generator' && (
        <div className="space-y-6 animate-in">
          {!showResult ? (
            <div className="card-feature text-center py-16 max-w-2xl mx-auto border border-white/10 bg-dark-950/30 flex flex-col items-center space-y-6 hide-on-print">
              <div className="w-20 h-20 rounded-3xl bg-primary-500/10 text-primary-400 border border-primary-500/20 flex items-center justify-center text-4xl"><RiFileTextLine /></div>
              <div>
                <h2 className="font-display text-2xl font-black text-white uppercase">Bangun Rencana Program BK</h2>
                <p className="text-dark-300 text-sm mt-2 max-w-md mx-auto">Auto Engine akan memetakan topik instrumen dengan bobot prioritas TINGGI & SEDANG langsung ke dalam alur Action Plan, Program Semester Ganjil, & Template RPL Resmi.</p>
              </div>

              {generating ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-dark-300 font-mono">Mengkalkulasi matriks program semester...</span>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => setActiveTab('overview')} className="btn-secondary text-sm">Batal</button>
                  <button onClick={handleGenerate} className="btn-primary text-sm bg-primary-500 font-bold shadow-glow-accent gap-2">
                    <RiMagicLine /> BANGUN PROGRAM OTOMATIS
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-in">
              {/* Dynamic Result Frame with Printed KOP */}
              <div className="card-feature bg-white/5 border border-white/10 p-0 overflow-hidden">
                {/* Tab Switches (Hidden on Print) */}
                <div className="bg-dark-950/80 border-b border-white/10 p-3 flex flex-wrap justify-between items-center gap-3 hide-on-print">
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
                    {['ACTION PLAN', 'PROTA', 'PROSEM', 'RPL'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setProgramType(tab)}
                        className={`px-4 py-2 text-xs rounded-lg font-bold uppercase whitespace-nowrap transition-all ${
                          programType === tab ? 'bg-primary-500 text-white shadow-md' : 'text-dark-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowResult(false)} className="btn-secondary text-xs py-2 gap-1"><RiRefreshLine /> Reset</button>
                    <button onClick={handlePrint} className="btn-primary text-xs py-2 gap-1 bg-primary-500 font-bold shadow-glow-accent"><RiPrinterLine /> Cetak Sekarang</button>
                  </div>
                </div>

                {/* Official KOP (Visible ALWAYS on rendering frame) */}
                <div className="p-6 md:p-8 bg-white text-black flex flex-col min-h-[600px]">
                  <div className="border-b-4 border-double border-black pb-4 flex items-center text-center justify-between gap-4">
                    {sekolah.logo ? (
                      <img src={sekolah.logo} alt="School Logo" className="w-20 h-20 object-contain flex-shrink-0" />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 text-gray-500 font-bold text-xs flex items-center justify-center border border-black rounded flex-shrink-0">LOGO</div>
                    )}
                    <div className="flex-1 text-center">
                      <h3 className="text-base font-extrabold tracking-wide uppercase leading-tight">{sekolah.yayasan || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}</h3>
                      <h2 className="text-xl font-black tracking-widest uppercase mt-0.5">{sekolah.nama || 'UNIT PELAKSANA TEKNIS BIMBINGAN KONSELING'}</h2>
                      <p className="text-xs tracking-normal font-medium mt-1 italic">{sekolah.alamat || 'Jalan Raya Pendidikan No. 101, Pamekasan'}</p>
                      <p className="text-[10px] font-mono font-semibold">{sekolah.kontak || 'Email: bk@sekolah.sch.id | Telp: (0324) 321456'}</p>
                    </div>
                    <div className="w-20 h-20 flex-shrink-0 invisible" />
                  </div>

                  <div className="py-6 flex-1 text-black">
                    {/* TAB 1: ACTION PLAN */}
                    {programType === 'ACTION PLAN' && (
                      <div className="space-y-4 animate-in text-black">
                        <div className="text-center mb-6">
                          <h4 className="font-bold text-lg underline uppercase leading-tight">MATRIKS RENCANA KEGIATAN (ACTION PLAN)</h4>
                          <p className="text-xs font-bold mt-1">TINGKAT: {akpdResult?.meta?.tingkat || tingkatFallback} | SEMESTER GANJIL TAHUN AJARAN {akpdResult ? akpdResult.meta.tahun : '2022-2023'}</p>
                        </div>
                        
                        <div className="overflow-x-auto border border-black rounded-sm">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead className="bg-gray-100 text-center uppercase font-extrabold border-b border-black">
                              <tr>
                                <th className="border border-black px-2 py-2">No</th>
                                <th className="border border-black px-2 py-2 min-w-[100px]">Bidang</th>
                                <th className="border border-black px-2 py-2 min-w-[150px]">Tujuan Layanan</th>
                                <th className="border border-black px-2 py-2 min-w-[100px]">Komponen</th>
                                <th className="border border-black px-2 py-2 min-w-[100px]">Strategi</th>
                                <th className="border border-black px-2 py-2">Kelas</th>
                                <th className="border border-black px-2 py-2 min-w-[150px]">Materi/Topik</th>
                                <th className="border border-black px-2 py-2 min-w-[120px]">Metode</th>
                                <th className="border border-black px-2 py-2 min-w-[120px]">Media</th>
                                <th className="border border-black px-2 py-2 min-w-[120px]">Evaluasi</th>
                                <th className="border border-black px-2 py-2">Ekuivalensi</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(generatedActionPlan.length > 0 ? generatedActionPlan : [
                                { bidang: 'Pribadi', tujuan: 'Siswa mampu beradaptasi', komponen: 'Layanan Dasar', layanan: 'Klasikal', kelas: 'VII', materi: 'Adaptasi Remaja', metode: 'Diskusi', media: 'Slide', evaluasi: 'Proses/Hasil', ekuivalensi: '2 Jam' }
                              ]).map((row, idx) => (
                                <tr key={idx} className="align-top odd:bg-white even:bg-gray-50">
                                  <td className="border border-black px-2 py-2 text-center">{idx + 1}</td>
                                  <td className="border border-black px-2 py-2 font-bold">{row.bidang}</td>
                                  <td className="border border-black px-2 py-2">{row.tujuan}</td>
                                  <td className="border border-black px-2 py-2">{row.komponen}</td>
                                  <td className="border border-black px-2 py-2">{row.layanan}</td>
                                  <td className="border border-black px-2 py-2 text-center font-bold">{row.kelas}</td>
                                  <td className="border border-black px-2 py-2 font-medium italic">{row.materi}</td>
                                  <td className="border border-black px-2 py-2">{row.metode}</td>
                                  <td className="border border-black px-2 py-2">{row.media}</td>
                                  <td className="border border-black px-2 py-2">{row.evaluasi}</td>
                                  <td className="border border-black px-2 py-2 text-center">{row.ekuivalensi}</td>
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
                      <div className="space-y-4 animate-in text-black">
                        <div className="text-center mb-6">
                          <h4 className="font-bold text-lg underline uppercase leading-tight">PROGRAM TAHUNAN (PROTA) BIMBINGAN KONSELING</h4>
                          <p className="text-xs font-bold mt-1">TINGKAT: {akpdResult?.meta?.tingkat || tingkatFallback} | SASARAN: {akpdResult ? `KELAS ${akpdResult.meta.kelas}` : 'SEMUA SISWA'}</p>
                        </div>
                        <div className="overflow-x-auto border border-black">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead className="bg-gray-100 font-extrabold text-center border-b border-black uppercase">
                              <tr>
                                <th className="border border-black px-3 py-2">No</th>
                                <th className="border border-black px-3 py-2">Kebutuhan/Materi</th>
                                <th className="border border-black px-3 py-2">Bidang</th>
                                <th className="border border-black px-3 py-2">Layanan</th>
                                <th className="border border-black px-3 py-2">Bulan</th>
                                <th className="border border-black px-3 py-2">Prioritas</th>
                              </tr>
                            </thead>
                            <tbody>
                              {generatedProta.map((row, idx) => (
                                <tr key={idx} className="align-middle odd:bg-white even:bg-gray-50">
                                  <td className="border border-black px-3 py-2.5 text-center">{idx + 1}</td>
                                  <td className="border border-black px-3 py-2.5 font-medium">{row.kebutuhan}</td>
                                  <td className="border border-black px-3 py-2.5 text-center">{row.bidang}</td>
                                  <td className="border border-black px-3 py-2.5 text-center">{row.layanan}</td>
                                  <td className="border border-black px-3 py-2.5 text-center font-bold">{row.waktu}</td>
                                  <td className="border border-black px-3 py-2.5 text-center font-bold">{row.prioritas || 'SEDANG'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {renderSignatures()}
                      </div>
                    )}

                    {/* TAB 3: PROSEM (24-Weeks Schedule Matrix Upgrade) */}
                    {programType === 'PROSEM' && (
                      <div className="space-y-4 animate-in text-black">
                        <div className="text-center mb-6">
                          <h4 className="font-bold text-lg underline uppercase leading-tight">PROGRAM SEMESTER GANJIL (PROSEM)</h4>
                          <p className="text-xs font-bold mt-1">TINGKAT: {akpdResult?.meta?.tingkat || tingkatFallback} | BULAN PELAKSANAAN: JULI - DESEMBER</p>
                        </div>
                        
                        <div className="overflow-x-auto border border-black">
                          <table className="w-full text-[10px] text-left border-collapse font-sans">
                            <thead className="bg-gray-100 font-black border-b border-black text-center uppercase">
                              <tr>
                                <th className="border border-black px-2 py-2" rowSpan={2}>No</th>
                                <th className="border border-black px-2 py-2" rowSpan={2}>Program / Topik Layanan</th>
                                <th className="border border-black px-2 py-2" rowSpan={2}>Bidang</th>
                                <th className="border border-black px-2 py-2" rowSpan={2}>Strategi</th>
                                {PROSEM_BULAN_GANJIL.map(m => (
                                  <th key={m} className="border border-black px-1 py-1 bg-gray-200" colSpan={4}>{m}</th>
                                ))}
                              </tr>
                              <tr className="bg-gray-50">
                                {PROSEM_BULAN_GANJIL.flatMap(m => [1, 2, 3, 4].map(w => (
                                  <th key={`${m}-${w}`} className="border border-black w-5 text-[8px] font-bold py-1">{w}</th>
                                )))}
                              </tr>
                            </thead>
                            <tbody>
                              {generatedProta.filter(p => PROSEM_BULAN_GANJIL.includes(p.waktu)).map((row, idx) => {
                                // Deterministic week mapping to spread topics visually
                                const assignedWeek = (idx % 4) + 1; 
                                return (
                                  <tr key={idx} className="odd:bg-white even:bg-gray-50 h-8">
                                    <td className="border border-black px-2 py-1 text-center">{idx + 1}</td>
                                    <td className="border border-black px-2 py-1 font-medium leading-tight truncate max-w-[200px]">{row.kebutuhan}</td>
                                    <td className="border border-black px-2 py-1 text-center font-semibold">{row.bidang}</td>
                                    <td className="border border-black px-2 py-1 text-center">{row.layanan}</td>
                                    {PROSEM_BULAN_GANJIL.flatMap(m => 
                                      [1, 2, 3, 4].map(w => {
                                        const isActive = row.waktu === m && assignedWeek === w;
                                        return (
                                          <td 
                                            key={`${m}-${w}`} 
                                            className={`border border-black text-center font-black text-sm p-0 ${isActive ? 'bg-primary-600 print:bg-black text-white' : ''}`}
                                          >
                                            {isActive ? '✓' : ''}
                                          </td>
                                        );
                                      })
                                    )}
                                  </tr>
                                );
                              })}
                              {/* Add systematic filler rows for mandatory activities */}
                              {['Masa Pengenalan Sekolah (MPLS)', 'Pengisian AKPD Awal', 'Analisis & Asesmen Data', 'Evaluasi Akhir Semester'].map((act, aidx) => (
                                <tr key={aidx} className="bg-gray-100 font-bold h-8 italic">
                                  <td className="border border-black px-2 py-1 text-center">F{aidx+1}</td>
                                  <td className="border border-black px-2 py-1 leading-tight" colSpan={3}>{act}</td>
                                  {PROSEM_BULAN_GANJIL.flatMap(m => 
                                    [1, 2, 3, 4].map(w => {
                                      // Place filler activities in logical slots
                                      const isActActive = (aidx === 0 && m === 'Juli' && w === 1) || 
                                                          (aidx === 1 && m === 'Juli' && w === 2) ||
                                                          (aidx === 2 && m === 'Juli' && w === 3) ||
                                                          (aidx === 3 && m === 'Desember' && w === 4);
                                      return (
                                        <td key={`${m}-${w}`} className={`border border-black text-center font-black p-0 ${isActActive ? 'bg-dark-800 text-white print:bg-black' : ''}`}>
                                          {isActActive ? 'X' : ''}
                                        </td>
                                      );
                                    })
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {renderSignatures()}
                      </div>
                    )}

                    {/* TAB 4: RPL MODUL GRID & DRAFTS */}
                    {programType === 'RPL' && (
                      <div className="space-y-4 animate-in text-white bg-dark-950/10 p-4 rounded-xl hide-on-print">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-dark-950 dark:text-white font-bold text-sm uppercase tracking-wide">DRAF MODUL RPL TERSUSUN (Berdasarkan Action Plan)</h5>
                          <span className="text-xs text-dark-300 font-bold bg-primary-500/10 text-primary-500 px-2 py-1 rounded border border-primary-500/20">💡 KLIK TOMBOL CETAK UNTUK PREVIEW 1-HALAMAN</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {generatedProta.map((row, idx) => (
                            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-primary-500 dark:hover:border-primary-500/50 transition-all group flex flex-col justify-between relative overflow-hidden shadow-sm">
                              <div className="absolute top-0 right-0 w-1 h-full bg-primary-500" />
                              <div>
                                <div className="flex justify-between items-start">
                                  <div className="w-full">
                                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">RPL {row.layanan.toUpperCase()}</span>
                                    <h6 className="text-slate-900 dark:text-white font-bold mt-1 group-hover:text-primary-500 transition-colors line-clamp-2 min-h-[40px] text-sm">{row.kebutuhan}</h6>
                                    <p className="text-dark-200 text-[10px] mt-1.5">Durasi: 1 x 45 Menit • Sasaran: {row.sasaran}</p>
                                  </div>
                                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xl text-slate-400 dark:text-dark-300 group-hover:text-primary-500 flex-shrink-0 ml-2">
                                    <RiFileChartLine />
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-3">
                                <span className="text-slate-500 dark:text-dark-300 text-[10px] flex items-center gap-1 uppercase font-black font-mono"><RiCalendarCheckLine className="text-primary-500"/> Jadwal: {row.waktu}</span>
                                <div className="flex gap-1.5">
                                  <button 
                                    onClick={() => setSelectedRpl(row)}
                                    className="p-1.5 bg-slate-100 hover:bg-primary-500 hover:text-white dark:bg-dark-900 rounded-lg border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white transition-all active:scale-95 shadow-sm" 
                                    title="Lihat Rencana & Cetak"
                                  >
                                    <RiPrinterLine className="text-sm" />
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setSelectedRpl(row);
                                      toast.success(`Menyiapkan dokumen RPL: ${row.kebutuhan}...`);
                                      setTimeout(() => window.print(), 500);
                                    }} 
                                    className="p-1.5 bg-slate-100 hover:bg-teal-600 hover:text-white dark:bg-dark-900 rounded-lg border border-slate-200 dark:border-white/20 text-slate-700 dark:text-white transition-all active:scale-95 shadow-sm" 
                                    title="Download PDF"
                                  >
                                    <RiDownloadLine className="text-sm" />
                                  </button>
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
            </div>
          )}
        </div>
      )}

      {/* ========================================= */}
      {/* MODAL: PREVIEW & CETAK RPL 1-HALAMAN RESMI */}
      {/* ========================================= */}
      {selectedRpl && (
        <div className="fixed inset-0 z-[999] bg-dark-950/90 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-4 md:p-8 animate-in print:p-0 print:bg-transparent">
          <div className="w-full max-w-4xl bg-white text-black rounded-2xl shadow-2xl relative flex flex-col overflow-hidden my-4">
            
            {/* Modal Sticky Top Bar Controls */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center gap-3 shadow-md z-10 hide-on-print">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-500 text-white rounded-lg flex items-center justify-center"><RiFileTextLine /></div>
                <div>
                  <span className="text-[10px] text-slate-300 block font-bold uppercase tracking-widest">Official RPL Document</span>
                  <h4 className="text-xs sm:text-sm font-bold font-display leading-tight truncate max-w-sm sm:max-w-md">{selectedRpl.kebutuhan}</h4>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()} 
                  className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 rounded-lg text-xs font-black uppercase flex items-center gap-1.5 transition-all shadow-glow-sm"
                >
                  <RiPrinterLine /> CETAK RPL
                </button>
                <button 
                  onClick={() => setSelectedRpl(null)}
                  className="p-2 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg transition-all"
                >
                  <RiCloseLine className="text-xl" />
                </button>
              </div>
            </div>

            {/* DOKUMEN FISIK RPL PRINT-READY CONTAINER */}
            <div id="printable-rpl-doc" className="bg-white text-black p-8 md:p-12 font-serif leading-normal min-h-[1100px]">
              {/* KOP Surat Modal */}
              <div className="border-b-4 border-double border-black pb-3 flex items-center text-center justify-between gap-4">
                {sekolah.logo ? (
                  <img src={sekolah.logo} alt="School Logo" className="w-16 h-16 object-contain flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 text-gray-500 font-bold text-xs flex items-center justify-center border border-black rounded flex-shrink-0">LOGO</div>
                )}
                <div className="flex-1 text-center">
                  <h3 className="text-xs font-bold tracking-wide uppercase leading-tight">{sekolah.yayasan || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}</h3>
                  <h2 className="text-lg font-black tracking-widest uppercase mt-0.5">{sekolah.nama || 'UNIT PELAKSANA TEKNIS BIMBINGAN KONSELING'}</h2>
                  <p className="text-[10px] font-medium italic leading-tight mt-0.5">{sekolah.alamat || 'Jalan Raya Pendidikan No. 101, Pamekasan'}</p>
                </div>
                <div className="w-16 h-16 flex-shrink-0 invisible" />
              </div>

              {/* Judul RPL */}
              <div className="text-center my-6">
                <h3 className="font-black text-base underline leading-tight uppercase">RENCANA PELAKSANAAN LAYANAN (RPL)</h3>
                <h3 className="font-black text-base uppercase leading-tight">{selectedRpl.layanan === 'Klasikal' ? 'BIMBINGAN KLASIKAL' : `LAYANAN ${selectedRpl.layanan.toUpperCase()}`}</h3>
                <p className="text-xs font-bold mt-1 uppercase">SEMESTER GANJIL TAHUN AJARAN {akpdResult?.meta?.tahun || '2022-2023'}</p>
              </div>

              {/* ISI TABEL STRUKTUR RPL 1-HALAMAN KEMDIKBUD */}
              <div className="space-y-0 text-xs border border-black border-collapse text-black">
                
                {/* A. IDENTITAS */}
                <div className="bg-gray-200 font-bold p-1.5 border-b border-black flex gap-2">
                  <span>A.</span><span>KOMPONEN & SPESIFIKASI LAYANAN</span>
                </div>
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="col-span-1 p-2 font-bold border-r border-black">1. Komponen Layanan</div>
                  <div className="col-span-2 p-2">{selectedRpl.komponen || 'Layanan Dasar'}</div>
                </div>
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="col-span-1 p-2 font-bold border-r border-black">2. Bidang Layanan</div>
                  <div className="col-span-2 p-2">{selectedRpl.bidang}</div>
                </div>
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="col-span-1 p-2 font-bold border-r border-black">3. Topik / Tema Layanan</div>
                  <div className="col-span-2 p-2 font-bold italic">{selectedRpl.kebutuhan}</div>
                </div>
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="col-span-1 p-2 font-bold border-r border-black">4. Sasaran Layanan</div>
                  <div className="col-span-2 p-2 font-bold">{selectedRpl.sasaran}</div>
                </div>
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="col-span-1 p-2 font-bold border-r border-black">5. Alokasi Waktu & Jadwal</div>
                  <div className="col-span-2 p-2">1 Kali Pertemuan x 45 Menit ({selectedRpl.waktu})</div>
                </div>
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="col-span-1 p-2 font-bold border-r border-black">6. Metode / Alat / Media</div>
                  <div className="col-span-2 p-2">{selectedRpl.metode || 'Ceramah & Diskusi'} / LCD, Slide PPT, Lembar Kerja</div>
                </div>

                {/* B. TUJUAN */}
                <div className="bg-gray-200 font-bold p-1.5 border-b border-black flex gap-2 mt-0">
                  <span>B.</span><span>TUJUAN LAYANAN</span>
                </div>
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="col-span-1 p-2 font-bold border-r border-black flex flex-col">
                    <span>1. Tujuan Umum (SKKPD)</span>
                  </div>
                  <div className="col-span-2 p-2">
                    Peserta didik/konseli mampu memahami pentingnya aspek {selectedRpl.bidang} terkait materi "{selectedRpl.kebutuhan}" untuk menunjang kesuksesan pribadi dan sosialnya di lingkungan sekolah.
                  </div>
                </div>
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="col-span-1 p-2 font-bold border-r border-black flex flex-col">
                    <span>2. Tujuan Khusus</span>
                  </div>
                  <div className="col-span-2 p-2 space-y-1">
                    <p>1. Peserta didik dapat <b>mengidentifikasi</b> urgensi materi {selectedRpl.kebutuhan}.</p>
                    <p>2. Peserta didik dapat <b>menganalisis</b> dampak positif penerapan konsep ini.</p>
                    <p>3. Peserta didik dapat <b>merumuskan / merencanakan</b> langkah aksi nyata untuk mempraktikkan hal tersebut.</p>
                  </div>
                </div>

                {/* C. LANGKAH KEGIATAN */}
                <div className="bg-gray-200 font-bold p-1.5 border-b border-black flex gap-2">
                  <span>C.</span><span>LANGKAH-LANGKAH KEGIATAN LAYANAN</span>
                </div>
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="col-span-1 p-2 font-bold border-r border-black flex flex-col">
                    <span>1. Tahap Awal (Pendahuluan)</span>
                    <span className="text-[10px] font-normal italic mt-0.5">(Alokasi: 5 Menit)</span>
                  </div>
                  <div className="col-span-2 p-2 space-y-1">
                    <p>a. Guru BK menyapa konseli dengan kalimat penyemangat, memimpin doa bersama.</p>
                    <p>b. Guru BK membina hubungan baik (*building rapport*) dan melakukan ice breaking singkat.</p>
                    <p>c. Menyampaikan tujuan khusus dan kontrak layanan bimbingan yang akan berjalan.</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="col-span-1 p-2 font-bold border-r border-black flex flex-col">
                    <span>2. Tahap Inti</span>
                    <span className="text-[10px] font-normal italic mt-0.5">(Alokasi: 30 Menit)</span>
                  </div>
                  <div className="col-span-2 p-2 space-y-1">
                    <p>a. **Tahap Pengamatan**: Guru BK menayangkan materi PPT atau skenario cerita.</p>
                    <p>b. **Tahap Asosiasi**: Konseli berkelompok mendiskusikan rumusan masalah topik "{selectedRpl.kebutuhan}".</p>
                    <p>c. **Tahap Komunikasi**: Perwakilan kelompok menyajikan hasil refleksi solusi pemecahan masalah di depan kelas.</p>
                    <p>d. Guru BK memberikan penguatan (*reinforcement*) dan meluruskan pemahaman yang kurang tepat.</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="col-span-1 p-2 font-bold border-r border-black flex flex-col">
                    <span>3. Tahap Penutup</span>
                    <span className="text-[10px] font-normal italic mt-0.5">(Alokasi: 10 Menit)</span>
                  </div>
                  <div className="col-span-2 p-2 space-y-1">
                    <p>a. Peserta didik menyimpulkan inti sari pemahaman baru (*insight*) yang didapat.</p>
                    <p>b. Guru BK memberikan lembar refleksi diri / lembar komitmen rencana tindakan.</p>
                    <p>c. Layanan ditutup dengan doa dan salam penutup.</p>
                  </div>
                </div>

                {/* D. EVALUASI */}
                <div className="bg-gray-200 font-bold p-1.5 border-b border-black flex gap-2">
                  <span>D.</span><span>RENCANA EVALUASI LAYANAN</span>
                </div>
                <div className="grid grid-cols-3 border-b border-black">
                  <div className="col-span-1 p-2 font-bold border-r border-black">1. Evaluasi Proses</div>
                  <div className="col-span-2 p-2">Guru BK mengamati keterlibatan keaktifan konseli, antusiasme mengikuti materi, keharmonisan kerja sama kelompok, dan kedisiplinan waktu secara kualitatif.</div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="col-span-1 p-2 font-bold border-r border-black">2. Evaluasi Hasil</div>
                  <div className="col-span-2 p-2">Evaluasi setelah layanan dengan mengukur tingkat pemahaman diri peserta didik (*Understanding*), perubahan sikap perasaan (*Comfort*), dan kesediaan melakukan aksi nyata (*Action*).</div>
                </div>
              </div>

              {/* Dynamic Signatures */}
              {renderSignatures()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
