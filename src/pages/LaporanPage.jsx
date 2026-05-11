import { RiDownloadLine, RiFilePdfLine, RiFileExcelLine, RiBarChart2Line, RiCalendarLine, RiPrinterLine } from 'react-icons/ri'

const REPORTS = [
  { judul: 'Laporan Bulanan April 2026', tipe: 'Bulanan', tanggal: '01 Mei 2026', ukuran: '2.4 MB', format: 'PDF' },
  { judul: 'Rekap Konseling Semester Genap', tipe: 'Semester', tanggal: '28 Apr 2026', ukuran: '1.8 MB', format: 'PDF' },
  { judul: 'Data Asesmen AKPD 2025/2026', tipe: 'Asesmen', tanggal: '15 Mar 2026', ukuran: '3.2 MB', format: 'Excel' },
  { judul: 'Laporan Bulanan Maret 2026', tipe: 'Bulanan', tanggal: '01 Apr 2026', ukuran: '2.1 MB', format: 'PDF' },
  { judul: 'Program Tahunan BK 2025/2026', tipe: 'Tahunan', tanggal: '05 Jan 2026', ukuran: '5.6 MB', format: 'PDF' },
]

const TIPE_CLS = {
  'Bulanan': 'badge bg-primary-500/20 text-primary-300 border border-primary-500/30',
  'Semester': 'badge bg-accent-500/20 text-accent-300 border border-accent-500/30',
  'Asesmen': 'badge bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'Tahunan': 'badge bg-amber-500/20 text-amber-300 border border-amber-500/30',
}

export default function LaporanPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Laporan BK</h1>
          <p className="text-dark-400 text-sm">Unduh dan cetak laporan layanan bimbingan konseling</p>
        </div>
        <button id="laporan-generate-btn" className="btn-primary text-sm py-2.5">
          <RiBarChart2Line /> Buat Laporan Baru
        </button>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Laporan Bulanan', desc: 'Rekap sesi dan layanan bulan ini', icon: RiCalendarLine, color: 'from-primary-500 to-primary-700' },
          { label: 'Laporan Semester', desc: 'Rangkuman program BK per semester', icon: RiBarChart2Line, color: 'from-accent-500 to-accent-700' },
          { label: 'Cetak Rekap', desc: 'Print rekap data konseling & asesmen', icon: RiPrinterLine, color: 'from-teal-500 to-teal-700' },
        ].map(({ label, desc, icon: Icon, color }) => (
          <button key={label} className="card-feature flex items-center gap-4 text-left group hover:scale-[1.02] transition-transform duration-200">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
              <Icon className="text-white text-xl" />
            </div>
            <div>
              <div className="font-semibold text-white">{label}</div>
              <div className="text-dark-400 text-xs">{desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Archive table */}
      <div className="card-feature">
        <h3 className="font-display font-bold text-white mb-5">Arsip Laporan</h3>
        <div className="space-y-2">
          {REPORTS.map(({ judul, tipe, tanggal, ukuran, format }) => (
            <div key={judul} className="flex items-center gap-4 p-4 rounded-xl glass hover:bg-white/10 transition-colors">
              <div className={`flex-shrink-0 text-2xl ${format === 'PDF' ? 'text-red-400' : 'text-emerald-400'}`}>
                {format === 'PDF' ? <RiFilePdfLine /> : <RiFileExcelLine />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm truncate">{judul}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={TIPE_CLS[tipe]}>{tipe}</span>
                  <span className="text-dark-500 text-xs">{tanggal} · {ukuran}</span>
                </div>
              </div>
              <button className="btn-secondary text-xs py-1.5 px-3 gap-1.5 flex-shrink-0">
                <RiDownloadLine /> Unduh
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
