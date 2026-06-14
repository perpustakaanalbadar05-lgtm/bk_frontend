/**
 * StudentSelector.jsx
 * Konselia by Alifba Media — Komponen pencarian & pemilihan siswa dari database.
 *
 * Cara pakai:
 *   <StudentSelector
 *     siswa={siswaArray}
 *     value={formData.siswa}
 *     kelas={formData.kelas}
 *     onSelect={(student) => setFormData({...formData, siswa: student.nama, kelas: student.kelas})}
 *     onChange={(val) => setFormData({...formData, siswa: val})}
 *     placeholder="Cari nama / NIS siswa..."
 *   />
 */
import { useState, useRef, useEffect } from 'react'
import { RiUserLine, RiSearchLine, RiCloseLine, RiGroupLine } from 'react-icons/ri'

export default function StudentSelector({
  siswa = [],
  value = '',
  kelas = '',
  onSelect,
  onChange,
  placeholder = 'Cari nama atau NIS siswa...',
  disabled = false,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef(null)

  // Tutup dropdown saat klik luar
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Filter: kelas dulu (jika ada), lalu teks query
  const filtered = siswa
    .filter(s => !kelas || s.kelas === kelas)
    .filter(s => {
      if (!query) return true
      const q = query.toLowerCase()
      return s.nama?.toLowerCase().includes(q) || s.nis?.toLowerCase().includes(q)
    })
    .slice(0, 12)

  const handleSelect = (s) => {
    onSelect?.(s)
    setOpen(false)
    setQuery('')
  }

  const handleClear = () => {
    onSelect?.({ nama: '', kelas: kelas || '', nis: '' })
    onChange?.('')
    setQuery('')
  }

  const getInitial = (nama) => nama?.substring(0, 2).toUpperCase() || '?'

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input trigger */}
      <div className={`relative flex items-center input-field py-0 pr-0 transition-all ${open ? 'border-primary-500 ring-1 ring-primary-500/30' : ''}`}>
        <RiUserLine className="flex-shrink-0 ml-3 text-dark-300 text-base" />
        <input
          type="text"
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder-dark-400 px-2.5 py-2.5"
          value={open ? query : value}
          onChange={e => {
            setQuery(e.target.value)
            onChange?.(e.target.value)
            if (!open) setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          autoComplete="off"
        />
        {value && !open && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 p-2.5 text-dark-400 hover:text-red-400 transition-colors"
          >
            <RiCloseLine className="text-base" />
          </button>
        )}
        {!value && (
          <RiSearchLine className="flex-shrink-0 mr-3 text-dark-500 text-base" />
        )}
      </div>

      {/* Dropdown list */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-[99999] bg-dark-900 border border-white/15 rounded-xl shadow-2xl overflow-hidden animate-in">
          {/* Info kelas filter */}
          {kelas && (
            <div className="px-3 py-2 border-b border-white/10 flex items-center gap-1.5 bg-primary-500/5">
              <RiGroupLine className="text-primary-400 text-xs" />
              <span className="text-[10px] text-primary-300 font-bold uppercase tracking-wider">
                Menampilkan siswa kelas {kelas} · {filtered.length} ditemukan
              </span>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="py-8 text-center text-dark-400 text-sm">
                <RiUserLine className="text-2xl mx-auto mb-2 opacity-40" />
                {siswa.length === 0
                  ? 'Belum ada data siswa. Tambah di menu Data Siswa.'
                  : `Tidak ada siswa${kelas ? ` di kelas ${kelas}` : ''} yang cocok dengan "${query}".`
                }
              </div>
            ) : (
              filtered.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelect(s)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center font-bold text-primary-300 text-xs flex-shrink-0 group-hover:bg-primary-500/30 transition-colors">
                    {getInitial(s.nama)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{s.nama}</div>
                    <div className="text-dark-400 text-[10px] flex items-center gap-2">
                      <span>NIS: {s.nis || '-'}</span>
                      <span>·</span>
                      <span className="text-primary-400 font-medium">{s.kelas}</span>
                      {s.jenisKelamin && <><span>·</span><span>{s.jenisKelamin}</span></>}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer: aksi manual jika tidak ada */}
          {siswa.length === 0 && (
            <div className="px-3 py-2 border-t border-white/10 bg-amber-500/5">
              <p className="text-[10px] text-amber-400 flex items-center gap-1">
                ⚠️ Import atau tambah data siswa terlebih dahulu di menu <b>Data Siswa</b>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
