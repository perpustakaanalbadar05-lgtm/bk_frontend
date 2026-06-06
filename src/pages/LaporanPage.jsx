import { useState } from 'react'
import { 
  RiDownloadLine, RiFilePdfLine, RiFileExcelLine, RiBarChart2Line, 
  RiCalendarLine, RiPrinterLine, RiCloseLine, RiHeartLine, RiUserStarLine, 
  RiScales3Line, RiHomeHeartLine, RiCheckDoubleLine, RiDashboardLine
} from 'react-icons/ri'
import { useData } from '../contexts/DataContext'
import { useSettings } from '../contexts/SettingsContext'
import toast from 'react-hot-toast'

const ARCHIVED_REPORTS = [
  { judul: 'Laporan Bulanan April 2026', tipe: 'Bulanan', tanggal: '01 Mei 2026', ukuran: '2.4 MB', format: 'PDF' },
  { judul: 'Rekap Konseling Semester Genap', tipe: 'Semester', tanggal: '28 Apr 2026', ukuran: '1.8 MB', format: 'PDF' },
  { judul: 'Data Asesmen AKPD 2025/2026', tipe: 'Asesmen', tanggal: '15 Mar 2026', ukuran: '3.2 MB', format: 'Excel' },
]

const TIPE_CLS = {
  'Bulanan': 'badge bg-primary-500/20 text-primary-300 border border-primary-500/30',
  'Semester': 'badge bg-accent-500/20 text-accent-300 border border-accent-500/30',
  'Asesmen': 'badge bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'Tahunan': 'badge bg-amber-500/20 text-amber-300 border border-amber-500/30',
}

export default function LaporanPage() {
  const { siswa, sessions, kasus } = useData()
  const { sekolah } = useSettings()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDoc, setGeneratedDoc] = useState(null)

  const handleGenerateNew = (type = 'Bulanan') => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      
      // Calculate live metrics
      const completedSessions = sessions.filter(s => s.status === 'Selesai').length
      const totalPoin = kasus.reduce((sum, k) => sum + (k.poin || 0), 0)
      const pendingVisits = kasus.filter(k => k.visit && k.status !== 'Selesai').length
      const completedVisits = kasus.filter(k => k.visit && k.status === 'Selesai').length

      setGeneratedDoc({
        tipe: type,
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        judul: `LAPORAN REKAPITULASI LAYANAN BK (${type.toUpperCase()})`,
        stats: {
          totalSiswa: siswa.length,
          sesiKonseling: sessions.length,
          sesiSelesai: completedSessions,
          totalKasus: kasus.length,
          totalPoin: totalPoin,
          kunjunganRumah: kasus.filter(k => k.visit).length,
          kunjunganSelesai: completedVisits
        }
      })
      toast.success(`Berhasil men-generate data laporan ${type} terupdate!`)
    }, 1500)
  }

  // Sub-Calculations for UI metrics
  const countIndividu = sessions.filter(s => s.jenis === 'Individu').length
  const countKelompok = sessions.filter(s => s.jenis === 'Kelompok').length
  const totalSesi = sessions.length || 1
  const pctIndividu = Math.round((countIndividu / totalSesi) * 100)
  const pctKelompok = Math.round((countKelompok / totalSesi) * 100)

  return (
    <div className="space-y-6 animate-in relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 hide-on-print">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Pusat Laporan Pelayanan BK</h1>
          <p className="text-dark-200 text-sm">Hasilkan rekapitulasi kegiatan konseling, kasus, dan asesmen secara otomatis.</p>
        </div>
        <button 
          onClick={() => handleGenerateNew('Bulanan')}
          disabled={isGenerating}
          className="btn-primary text-sm py-2.5 shadow-glow-accent bg-primary-500 font-bold gap-2"
        >
          {isGenerating ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <RiBarChart2Line className="text-lg" />
          )}
          {isGenerating ? 'Menyusun Data...' : 'Buat Laporan Baru'}
        </button>
      </div>

      {/* REAL-TIME ANALYTICS SUMMARY FOR REPORT */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 hide-on-print">
        {[
          { label: 'Siswa Terlayani', val: `${siswa.length} Anak`, icon: RiUserStarLine, col: 'from-blue-500 to-blue-600' },
          { label: 'Konseling Berjalan', val: `${sessions.length} Sesi`, icon: RiHeartLine, col: 'from-pink-500 to-pink-600' },
          { label: 'Kasus Kedisiplinan', val: `${kasus.length} Kasus`, icon: RiScales3Line, col: 'from-amber-500 to-amber-600' },
          { label: 'Agenda Home Visit', val: `${kasus.filter(k => k.visit).length} Kunjungan`, icon: RiHomeHeartLine, col: 'from-emerald-500 to-emerald-600' }
        ].map((card, idx) => (
          <div key={idx} className="card-feature bg-white/5 p-5 flex items-center justify-between group border border-white/10 hover:border-white/20">
            <div>
              <span className="text-dark-300 text-[10px] font-bold uppercase tracking-wider">{card.label}</span>
              <div className="text-xl font-display font-black text-white mt-1">{card.val}</div>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.col} flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform`}>
              <card.icon />
            </div>
          </div>
        ))}
      </div>

      {/* TWO-COLUMN GRID: QUICK ACTIONS & LIVE BREAKDOWNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 hide-on-print">
        
        {/* Left Column: Quick Generators */}
        <div className="space-y-4 lg:col-span-1">
          <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest border-l-2 border-primary-500 pl-3">Instan Generator</h3>
          
          {[
            { label: 'Laporan Bulanan', desc: 'Rekap sesi & kegiatan bulan berjalan', icon: RiCalendarLine, type: 'Bulanan', gradient: 'from-primary-500 to-indigo-600' },
            { label: 'Laporan Semesteran', desc: 'Rangkuman program per 6 bulan', icon: RiBarChart2Line, type: 'Semesteran', gradient: 'from-accent-500 to-pink-600' },
            { label: 'Rekap Surat SP', desc: 'Print semua panggilan orang tua', icon: RiPrinterLine, type: 'Surat SP', gradient: 'from-teal-500 to-emerald-600' },
          ].map((gen, i) => (
            <button 
              key={i}
              onClick={() => handleGenerateNew(gen.type)}
              className="w-full card-feature flex items-center gap-4 text-left bg-white/5 border border-white/10 hover:border-white/30 p-4 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8 pointer-events-none group-hover:scale-110 transition-transform" />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gen.gradient} flex items-center justify-center text-white text-xl shadow-md flex-shrink-0`}>
                <gen.icon />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{gen.label}</h4>
                <p className="text-dark-300 text-xs mt-0.5">{gen.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column: Live Visual Breakdown */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="card-feature bg-white/5 border border-white/10 h-full flex flex-col justify-between p-6">
            <div>
              <h3 className="font-display font-bold text-white">Metrik Distribusi Layanan</h3>
              <p className="text-dark-300 text-xs mt-1 mb-6">Visualisasi porsi penyebaran jenis layanan yang terekam sistem.</p>
              
              <div className="space-y-6 flex-1">
                {/* Progress 1: Konseling Individu vs Kelompok */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
                    <span>Tipe Konseling ({countIndividu} Individu vs {countKelompok} Kelompok)</span>
                    <span className="text-primary-400">{pctIndividu}% / {pctKelompok}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-dark-950 rounded-full overflow-hidden flex border border-white/5">
                    <div className="h-full bg-primary-500 transition-all duration-500" style={{ width: `${pctIndividu}%` }} />
                    <div className="h-full bg-accent-500 transition-all duration-500" style={{ width: `${pctKelompok}%` }} />
                  </div>
                  <div className="flex gap-4 mt-2 text-[10px] text-dark-300 font-mono">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary-500" /> Individu</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-500" /> Kelompok</span>
                  </div>
                </div>

                {/* Progress 2: Kasus Status */}
                {(() => {
                  const fin = kasus.filter(k=>k.status==='Selesai').length
                  const totalK = kasus.length || 1
                  const pctFin = Math.round((fin/totalK)*100)
                  return (
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
                        <span>Kasus Berhasil Teratasi</span>
                        <span className="text-teal-400">{fin} dari {kasus.length} ({pctFin}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-dark-950 rounded-full overflow-hidden flex border border-white/5">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500" style={{ width: `${pctFin}%` }} />
                      </div>
                    </div>
                  )
                })()}

                {/* Progress 3: Validasi TTD */}
                {(() => {
                  const sig = sessions.filter(s=>s.signature).length
                  const totalS = sessions.length || 1
                  const pctSig = Math.round((sig/totalS)*100)
                  return (
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-white mb-2">
                        <span>Sesi Dengan Validasi TTD Digital</span>
                        <span className="text-purple-400">{sig} Sesi ({pctSig}%)</span>
                      </div>
                      <div className="w-full h-2.5 bg-dark-950 rounded-full overflow-hidden flex border border-white/5">
                        <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${pctSig}%` }} />
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2 text-[10px] text-dark-400 bg-dark-950/40 p-3 rounded-xl border border-white/5">
              <RiDashboardLine className="text-primary-500 text-base" />
              <span>Data divisualisasikan real-time dari database sinkronisasi otomatis.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ARCHIVED TABLE HISTORY */}
      <div className="card-feature bg-white/5 border border-white/10 hide-on-print">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display font-bold text-white text-base">Riwayat & Arsip Laporan Terdahulu</h3>
          <span className="text-xs bg-white/5 text-dark-300 px-2 py-1 rounded border border-white/10 font-mono">PDF/Excel Ready</span>
        </div>
        <div className="space-y-2">
          {ARCHIVED_REPORTS.map(({ judul, tipe, tanggal, ukuran, format }) => (
            <div key={judul} className="flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/10 transition-colors border border-white/5">
              <div className={`flex-shrink-0 text-2xl ${format === 'PDF' ? 'text-red-400' : 'text-emerald-400'}`}>
                {format === 'PDF' ? <RiFilePdfLine /> : <RiFileExcelLine />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm truncate">{judul}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={TIPE_CLS[tipe]}>{tipe}</span>
                  <span className="text-dark-300 text-xs font-mono">{tanggal} · {ukuran}</span>
                </div>
              </div>
              <button onClick={() => {
                setIsGenerating(true);
                toast.success(`Menyiapkan arsip: ${judul}...`);
                setTimeout(() => {
                  setIsGenerating(false);
                  const completedSessions = sessions.filter(s => s.status === 'Selesai').length;
                  const totalPoin = kasus.reduce((sum, k) => sum + (k.poin || 0), 0);
                  const completedVisits = kasus.filter(k => k.visit && k.status === 'Selesai').length;
                  
                  setGeneratedDoc({
                    tipe: tipe,
                    tanggal: tanggal,
                    judul: judul.toUpperCase(),
                    stats: {
                      totalSiswa: siswa.length,
                      sesiKonseling: sessions.length,
                      sesiSelesai: completedSessions,
                      totalKasus: kasus.length,
                      totalPoin: totalPoin,
                      kunjunganRumah: kasus.filter(k => k.visit).length,
                      kunjunganSelesai: completedVisits
                    }
                  });
                }, 1000);
              }} className="btn-secondary text-xs py-1.5 px-3 gap-1.5 flex-shrink-0 font-bold">
                <RiDownloadLine /> Unduh
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================== */}
      {/* MODAL: GENERATED OFFICIAL REPORT VIEW & PRINTING (THE ENGINE) */}
      {/* ========================================================== */}
      {generatedDoc && (
        <div className="fixed inset-0 z-[999] bg-dark-950/90 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-4 md:p-8 animate-in print:static print:block print:p-0 print:bg-transparent print:overflow-visible">
          <div className="w-full max-w-4xl bg-white text-black rounded-2xl shadow-2xl relative flex flex-col my-4 overflow-hidden border border-slate-300 animate-in print:max-w-none print:m-0 print:border-none print:shadow-none print:overflow-visible">
            
            {/* Sticky Top bar control */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center gap-3 hide-on-print">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center"><RiCheckDoubleLine /></div>
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-widest">Report Generated</span>
                  <h4 className="text-sm font-bold">{generatedDoc.judul}</h4>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="bg-primary-600 hover:bg-primary-500 text-white px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1 transition-transform active:scale-95 shadow-md"
                >
                  <RiPrinterLine /> CETAK LAPORAN
                </button>
                <button onClick={() => setGeneratedDoc(null)} className="p-2 hover:bg-white/10 rounded-lg text-slate-300"><RiCloseLine className="text-xl"/></button>
              </div>
            </div>

            {/* DOKUMEN FISIK REKAP LAPORAN */}
            <div className="bg-white p-8 md:p-12 font-serif min-h-[1100px] text-black">
              {/* KOP DINAS */}
              <div className="border-b-4 border-double border-black pb-3 flex items-center text-center justify-between gap-4">
                {sekolah.logo ? (
                  <img src={sekolah.logo} alt="Logo" className="w-16 h-16 object-contain flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 border border-black flex items-center justify-center text-xs font-bold">LOGO</div>
                )}
                <div className="flex-1">
                  <h3 className="text-xs font-bold uppercase leading-tight">{sekolah.yayasan || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}</h3>
                  <h2 className="text-lg font-black uppercase leading-tight tracking-wide mt-0.5">{sekolah.nama || 'UNIT PELAKSANA TEKNIS BIMBINGAN KONSELING'}</h2>
                  <p className="text-[10px] italic leading-tight">{sekolah.alamat || 'Pamekasan, Jawa Timur'}</p>
                </div>
                <div className="w-16 h-16 flex-shrink-0 invisible" />
              </div>

              {/* TITLE LAPORAN */}
              <div className="text-center my-8 uppercase">
                <h3 className="font-black text-base underline leading-none">{generatedDoc.judul}</h3>
                <p className="text-xs font-bold mt-1">TAHUN AJARAN {sekolah.tahun || '2025/2026'}</p>
              </div>

              <div className="text-sm leading-relaxed text-black font-sans">
                <p className="mb-4">Berdasarkan data rekapitulasi komprehensif sistem digital Bimbingan Konseling pada tanggal <b>{generatedDoc.tanggal}</b>, dengan ini dilaporkan rincian ketercapaian serta aktivitas layanan BK sebagai berikut:</p>
                
                {/* SECTION I: METRICS GRID */}
                <h4 className="font-bold text-sm border-b border-black pb-1 mt-6 mb-3 uppercase">I. REKAPITULASI VOLUME LAYANAN UTAMA</h4>
                <div className="border border-black rounded overflow-hidden mb-6">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-gray-100 font-bold border-b border-black text-center">
                      <tr>
                        <th className="border-r border-black p-2">No</th>
                        <th className="border-r border-black p-2 text-left">Kategori Aktivitas / Layanan</th>
                        <th className="border-r border-black p-2">Volume / Unit</th>
                        <th className="p-2 text-left">Keterangan / Status Terkini</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { no: 1, cat: 'Siswa Aktif Dalam Binaan', vol: `${generatedDoc.stats.totalSiswa} Orang`, note: 'Terdaftar aktif dalam database instansi.' },
                        { no: 2, cat: 'Sesi Konseling Terlaksana', vol: `${generatedDoc.stats.sesiKonseling} Sesi`, note: `${generatedDoc.stats.sesiSelesai} Sesi berstatus FINAL/SELESAI.` },
                        { no: 3, cat: 'Pelanggaran / Kasus Kedisiplinan', vol: `${generatedDoc.stats.totalKasus} Kasus`, note: `Akumulasi Poin Terkumpul: ${generatedDoc.stats.totalPoin} Poin.` },
                        { no: 4, cat: 'Agenda Kunjungan Rumah (Home Visit)', vol: `${generatedDoc.stats.kunjunganRumah} Agenda`, note: `${generatedDoc.stats.kunjunganSelesai} Kunjungan tuntas dilaksanakan.` }
                      ].map(row => (
                        <tr key={row.no} className="border-b border-black last:border-0 odd:bg-white even:bg-gray-50">
                          <td className="border-r border-black p-2 text-center">{row.no}</td>
                          <td className="border-r border-black p-2 font-semibold">{row.cat}</td>
                          <td className="border-r border-black p-2 text-center font-bold">{row.vol}</td>
                          <td className="p-2">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* SECTION II: LIVE LOG TABLE FOR DETAILS */}
                <h4 className="font-bold text-sm border-b border-black pb-1 mt-8 mb-3 uppercase">II. RINCIAN JURNAL KONSELING & KASUS TERAKHIR</h4>
                <div className="border border-black rounded overflow-hidden">
                  <table className="w-full text-[10px] text-left border-collapse font-sans">
                    <thead className="bg-gray-100 font-bold border-b border-black uppercase">
                      <tr>
                        <th className="border-r border-black p-1.5 text-center">Tipe</th>
                        <th className="border-r border-black p-1.5">Nama Siswa</th>
                        <th className="border-r border-black p-1.5 text-center">Kelas</th>
                        <th className="border-r border-black p-1.5">Hal / Uraian Permasalahan</th>
                        <th className="p-1.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.slice(0, 4).map((s, idx) => (
                        <tr key={idx} className="border-b border-black odd:bg-white even:bg-gray-50">
                          <td className="border-r border-black p-1.5 text-center text-[8px] font-bold text-primary-800">KONSELING</td>
                          <td className="border-r border-black p-1.5 font-bold">{s.siswa}</td>
                          <td className="border-r border-black p-1.5 text-center">{s.kelas}</td>
                          <td className="border-r border-black p-1.5 italic">{s.topik} ({s.jenis})</td>
                          <td className="p-1.5 text-center uppercase font-bold">{s.status}</td>
                        </tr>
                      ))}
                      {kasus.slice(0, 3).map((k, idx) => (
                        <tr key={idx} className="border-b border-black last:border-0 bg-amber-50/50">
                          <td className="border-r border-black p-1.5 text-center text-[8px] font-bold text-amber-800">KASUS</td>
                          <td className="border-r border-black p-1.5 font-bold">{k.siswa}</td>
                          <td className="border-r border-black p-1.5 text-center">{k.kelas}</td>
                          <td className="border-r border-black p-1.5 italic">Pelanggaran: {k.kasus} (+{k.poin} Poin)</td>
                          <td className="p-1.5 text-center uppercase font-bold text-red-600">{k.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* FOOTER SUMMARY */}
                <p className="mt-6 italic text-xs leading-relaxed">Catatan: Laporan ini dicetak secara digital melalui ekosistem aplikasi Konseli by Alifba Media. Data di atas bersifat rahasia dan hanya digunakan untuk evaluasi internal sekolah serta koordinasi bersama orang tua siswa / pengawas dinas.</p>

                {/* SIGNATURE AREA */}
                <div className="mt-12 grid grid-cols-2 gap-8 text-xs leading-normal">
                  <div className="flex flex-col items-center space-y-16">
                    <div>
                      <p>Mengetahui,</p>
                      <p className="font-bold">Kepala {sekolah.nama || 'Sekolah'}</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold underline">{sekolah.kepsek || '.................................................'}</p>
                      <p className="font-mono">NIP. {sekolah.nip_kepsek || '.........................'}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center space-y-16">
                    <div>
                      <p>{sekolah.alamat?.split(',')[0] || 'Pamekasan'}, {generatedDoc.tanggal}</p>
                      <p className="font-bold">Guru Pembimbing Bimbingan Konseling</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold underline">Guru Pembimbing BK</p>
                      <p className="font-mono">NIP. .........................................</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
