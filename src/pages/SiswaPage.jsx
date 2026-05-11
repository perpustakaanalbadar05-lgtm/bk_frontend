import { useState } from 'react'
import { RiUserAddLine, RiSearchLine, RiFilterLine, RiDownloadLine, RiEditLine, RiEyeLine, RiDeleteBinLine } from 'react-icons/ri'

const SISWA = [
  { id: 1, nama: 'Ahmad Fauzi', nis: '2024001', kelas: 'XI IPA 2', jk: 'L', status: 'Aktif', konseling: 3 },
  { id: 2, nama: 'Siti Rahma', nis: '2024002', kelas: 'X IPS 1', jk: 'P', status: 'Aktif', konseling: 1 },
  { id: 3, nama: 'Budi Santoso', nis: '2024003', kelas: 'XII IPA 1', jk: 'L', status: 'Aktif', konseling: 5 },
  { id: 4, nama: 'Dewi Lestari', nis: '2024004', kelas: 'XI IPS 3', jk: 'P', status: 'Perhatian', konseling: 7 },
  { id: 5, nama: 'Riko Prasetyo', nis: '2024005', kelas: 'X IPA 1', jk: 'L', status: 'Aktif', konseling: 0 },
  { id: 6, nama: 'Fitri Handayani', nis: '2024006', kelas: 'XII IPS 2', jk: 'P', status: 'Perhatian', konseling: 4 },
]

const STATUS_CLS = {
  'Aktif': 'badge bg-teal-500/20 text-teal-300 border border-teal-500/30',
  'Perhatian': 'badge bg-amber-500/20 text-amber-300 border border-amber-500/30',
}

export default function SiswaPage() {
  const [search, setSearch] = useState('')
  const filtered = SISWA.filter(s => s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Data Siswa</h1>
          <p className="text-dark-400 text-sm">Kelola data siswa binaan Guru BK</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm py-2"><RiDownloadLine /> Export</button>
          <button id="siswa-add-btn" className="btn-primary text-sm py-2"><RiUserAddLine /> Tambah Siswa</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Siswa', value: '312', color: 'text-primary-400' },
          { label: 'Aktif', value: '298', color: 'text-teal-400' },
          { label: 'Perlu Perhatian', value: '14', color: 'text-amber-400' },
          { label: 'Konseling Aktif', value: '47', color: 'text-accent-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card-feature text-center py-4">
            <div className={`font-display font-black text-3xl ${color} mb-1`}>{value}</div>
            <div className="text-dark-400 text-xs">{label}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="card-feature">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex-1 relative">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text" placeholder="Cari nama atau NIS..."
              className="input-field pl-9"
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-secondary text-sm py-2.5 gap-2"><RiFilterLine /> Filter</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="table-header text-left pb-3">Nama Siswa</th>
                <th className="table-header text-left pb-3">NIS</th>
                <th className="table-header text-left pb-3">Kelas</th>
                <th className="table-header text-left pb-3 hidden sm:table-cell">J/K</th>
                <th className="table-header text-left pb-3">Status</th>
                <th className="table-header text-left pb-3 hidden md:table-cell">Konseling</th>
                <th className="table-header text-center pb-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-white/5 transition-colors">
                  <td className="table-cell font-medium text-white">{s.nama}</td>
                  <td className="table-cell font-mono text-xs">{s.nis}</td>
                  <td className="table-cell">{s.kelas}</td>
                  <td className="table-cell hidden sm:table-cell">{s.jk === 'L' ? '👦 L' : '👧 P'}</td>
                  <td className="table-cell"><span className={STATUS_CLS[s.status]}>{s.status}</span></td>
                  <td className="table-cell hidden md:table-cell">
                    <span className="font-semibold text-white">{s.konseling}</span>
                    <span className="text-dark-500 ml-1">sesi</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-primary-500/20 text-dark-400 hover:text-primary-300 transition-colors"><RiEyeLine /></button>
                      <button className="p-1.5 rounded-lg hover:bg-teal-500/20 text-dark-400 hover:text-teal-300 transition-colors"><RiEditLine /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-500/20 text-dark-400 hover:text-red-400 transition-colors"><RiDeleteBinLine /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between text-dark-400 text-sm border-t border-white/10 pt-4">
          <span>Menampilkan {filtered.length} dari {SISWA.length} siswa</span>
          <div className="flex gap-1">
            {['‹', '1', '2', '3', '›'].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-sm transition-colors ${p === '1' ? 'bg-primary-600 text-white' : 'hover:bg-white/10'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
