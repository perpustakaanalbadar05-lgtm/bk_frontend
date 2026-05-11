import { useState } from 'react'
import { RiAddLine, RiClipboardLine, RiCheckboxCircleLine, RiTimeLine, RiBrainLine, RiEyeLine, RiStarLine, RiFireLine } from 'react-icons/ri'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts'
import toast from 'react-hot-toast'

const RADAR_DATA = [
  { subject: 'Pribadi', A: 75, fullMark: 100 },
  { subject: 'Sosial', A: 62, fullMark: 100 },
  { subject: 'Belajar', A: 88, fullMark: 100 },
  { subject: 'Karir', A: 55, fullMark: 100 },
  { subject: 'Keluarga', A: 70, fullMark: 100 },
]

const ASESMEN_LIST = [
  { kelas: 'X IPA 1', total: 34, selesai: 34, pct: 100, status: 'Selesai' },
  { kelas: 'X IPA 2', total: 32, selesai: 28, pct: 88, status: 'Proses' },
  { kelas: 'XI IPS 1', total: 30, selesai: 20, pct: 67, status: 'Proses' },
]

const STATUS_CLS = {
  'Selesai': 'badge bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'Proses': 'badge bg-primary-500/20 text-primary-300 border border-primary-500/30',
  'Belum': 'badge bg-dark-500/40 text-dark-300 border border-dark-500/30',
}

const TABS = [
  { id: 'akpd', label: 'Asesmen AKPD' },
  { id: 'gaya-belajar', label: 'Gaya Belajar' },
  { id: 'kecerdasan', label: 'Kecerdasan Majemuk' },
  { id: 'kepribadian', label: 'Kepribadian' },
  { id: 'bakat-minat', label: 'Bakat & Karier' }
]

export default function AsesmenPage() {
  const [activeTab, setActiveTab] = useState('akpd')

  const renderContent = () => {
    switch (activeTab) {
      case 'akpd':
        return (
          <div className="animate-in space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-feature">
                <h3 className="font-display font-bold text-white mb-1">Profil Kebutuhan Siswa</h3>
                <p className="text-dark-400 text-xs mb-4">Rata-rata skor kebutuhan 4 bidang BK</p>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={RADAR_DATA}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Radar name="Skor" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#f1f5f9' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="card-feature">
                <h3 className="font-display font-bold text-white mb-4">Ringkasan AKPD</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Total Siswa Diasesmen', value: '125/157', icon: RiClipboardLine, color: 'text-primary-400' },
                    { label: 'Kelas Sudah Selesai', value: '2 dari 5', icon: RiCheckboxCircleLine, color: 'text-teal-400' },
                    { label: 'Dalam Proses', value: '2 kelas', icon: RiTimeLine, color: 'text-amber-400' },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="flex items-center justify-between p-3 rounded-xl glass">
                      <div className="flex items-center gap-2 text-dark-300 text-sm"><Icon className={color} />{label}</div>
                      <span className={`font-semibold text-sm ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-feature">
              <h3 className="font-display font-bold text-white mb-5">Progress AKPD Per Kelas</h3>
              <div className="space-y-3">
                {ASESMEN_LIST.map(({ kelas, total, selesai, pct, status }) => (
                  <div key={kelas} className="flex items-center gap-4 p-3 rounded-xl glass hover:bg-white/10 transition-colors">
                    <div className="w-24 text-white font-semibold text-sm">{kelas}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-dark-400 mb-1">
                        <span>{selesai}/{total} siswa</span>
                        <span className="font-semibold text-white">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-dark-700 rounded-full">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className={STATUS_CLS[status]}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
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
                     <div className="text-dark-400 text-sm font-bold uppercase tracking-wider mb-1">{item.t}</div>
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
                <p className="text-dark-400 text-sm mt-2 max-w-md mx-auto mb-6">Bagikan link ini ke siswa untuk mengukur dominasi gaya belajar (V-A-K) secara mandiri.</p>
                <button className="btn-primary" onClick={() => toast.success('Link disalin!')}>Salin Link Kuesioner</button>
             </div>
          </div>
        )
      case 'bakat-minat':
      case 'kecerdasan':
      case 'kepribadian':
        return (
           <div className="animate-in flex flex-col items-center justify-center p-12 text-center card-feature border-dashed mt-4">
             <div className="w-20 h-20 bg-dark-800 rounded-full flex items-center justify-center text-3xl text-dark-400 border border-white/10 mb-6">
               {activeTab === 'kepribadian' ? <RiStarLine /> : <RiFireLine />}
             </div>
             <h2 className="text-xl font-bold text-white mb-2">Modul {TABS.find(t=>t.id === activeTab).label}</h2>
             <p className="text-dark-400 text-sm max-w-lg mb-6">Bank soal untuk asesmen psikologis ini sudah diintegrasikan. Silakan generate token ujian untuk mendistribusikannya ke siswa melalui portal murid.</p>
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
          <p className="text-dark-400 text-sm">Integrasi alat ukur psikologis dan diagnostik kebutuhan peserta didik</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2 bg-dark-900/50 p-1.5 rounded-xl border border-white/10 w-max">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
                ${activeTab === tab.id 
                  ? 'bg-primary-600 shadow-glow-sm text-white' 
                  : 'text-dark-400 hover:text-white hover:bg-white/5'}
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
