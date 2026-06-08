import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RiShieldCheckLine, RiHeartLine, RiGroupLine, RiBookOpenLine,
  RiBriefcaseLine, RiCheckboxCircleLine, RiArrowRightLine, RiArrowLeftLine,
  RiSave3Line, RiSunLine, RiMoonLine, RiUserLine, RiCloseLine
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import { AKPD_MASTER } from '../data/akpdMaster';
import { GAYA_BELAJAR_MASTER, KECERDASAN_MASTER, KEPRIBADIAN_MASTER, BAKAT_MINAT_MASTER } from '../data/assessmentMasters';
import { computeAkpdResults } from '../utils/akpdCalculator';

export default function IsiAkpdPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'akpd';

  const getAssessmentConfig = () => {
    switch (type) {
      case 'gaya-belajar': return { title: 'GAYA BELAJAR', key: 'simbk_data_gaya-belajar_result', master: GAYA_BELAJAR_MASTER };
      case 'kecerdasan': return { title: 'KECERDASAN MAJEMUK', key: 'simbk_data_kecerdasan_result', master: KECERDASAN_MASTER };
      case 'kepribadian': return { title: 'KEPRIBADIAN', key: 'simbk_data_kepribadian_result', master: KEPRIBADIAN_MASTER };
      case 'bakat-minat': return { title: 'BAKAT & MINAT', key: 'simbk_data_bakat-minat_result', master: BAKAT_MINAT_MASTER };
      default: return { title: 'AKPD', key: 'simbk_data_akpd_result', master: AKPD_MASTER };
    }
  };
  const config = getAssessmentConfig();
  
  // Theme State
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const isDarkNow = document.documentElement.classList.toggle('dark');
    setIsDark(isDarkNow);
    localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
  };

  // Load existing data or default
  const getActiveMeta = () => {
    try {
      const saved = localStorage.getItem(config.key);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.meta;
      }
    } catch (_) {}
    return { sekolah: 'SMP Negeri 2 Pamekasan', kelas: 'VII G', tahun: '2022-2023' };
  };

  const activeMeta = getActiveMeta();

  // Form states
  const [step, setStep] = useState(1);
  const [studentInfo, setStudentInfo] = useState({ nama: '', jk: 'L', kelas: activeMeta.kelas });

  // Autocomplete — baca cache siswa dari localStorage (disimpan oleh DataContext)
  const [siswaCache] = useState(() => {
    try { const r = localStorage.getItem('simbk_cache_siswa'); return r ? JSON.parse(r) : []; } catch { return []; }
  });
  const [namaQuery, setNamaQuery] = useState('');
  const [showDrop, setShowDrop] = useState(false);
  const inputRef = useRef(null);

  const filteredSiswa = siswaCache
    .filter(s => !namaQuery || (s.nama || '').toLowerCase().includes(namaQuery.toLowerCase()) || (s.nis || '').includes(namaQuery))
    .slice(0, 10);

  const handleSelectSiswa = (s) => {
    const nama = s.nama || '';
    setStudentInfo({ nama, jk: s.jenisKelamin === 'Perempuan' ? 'P' : 'L', kelas: s.kelas || activeMeta.kelas });
    setNamaQuery(nama);
    setShowDrop(false);
  };

  // Selected indices
  const [selections, setSelections] = useState(Array(config.master.length).fill(0));

  const toggleSelection = (idx) => {
    setSelections(prev => {
      const next = [...prev];
      next[idx] = next[idx] === 1 ? 0 : 1;
      return next;
    });
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!studentInfo.nama.trim()) {
      toast.error('Silakan isi nama lengkap Anda!');
      return;
    }
    setStep(2);
    window.scrollTo(0,0);
  };

  const handleSubmit = () => {
    const confirmSubmit = confirm("Apakah Anda yakin jawaban Anda sudah benar dan siap dikirim?");
    if (!confirmSubmit) return;

    try {
      let currentResult = null;
      const savedStr = localStorage.getItem(config.key);
      if (savedStr) {
        currentResult = JSON.parse(savedStr);
      } else {
        currentResult = {
          meta: { ...activeMeta },
          students: []
        };
      }

      const nextNo = currentResult.students.length + 1;
      const newStudent = {
        no: String(nextNo),
        nama: studentInfo.nama.trim(),
        jk: studentInfo.jk,
        responses: selections
      };

      const updatedStudents = [...currentResult.students, newStudent];
      const finalComputed = computeAkpdResults(currentResult.meta, updatedStudents, config.master);

      localStorage.setItem(config.key, JSON.stringify(finalComputed));

      // Trigger sync across tabs
      window.dispatchEvent(new Event('storage'));

      setStep(3);
      window.scrollTo(0,0);
      toast.success("Jawaban berhasil terkirim ke sistem BK!", { icon: '🎉' });

    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan data.");
    }
  };

  const countChecked = selections.reduce((a, b) => a + b, 0);
  
  const sectionsMap = {};
  config.master.forEach(item => {
    if (!sectionsMap[item.bidang]) {
      sectionsMap[item.bidang] = { label: item.bidang, list: [] };
    }
    sectionsMap[item.bidang].list.push(item);
  });
  const sections = Object.values(sectionsMap);

  const renderHeader = () => (
    <div className="bg-dark-950 border-b border-white/10 py-6 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-xl text-white shadow-glow-sm">
            <RiShieldCheckLine />
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-lg leading-tight">PORTAL ASESMEN {config.title}</h1>
            <p className="text-dark-300 text-xs">{activeMeta.sekolah} • {activeMeta.tahun}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-dark-300 hover:text-white transition-colors"
            title={isDark ? "Ubah ke Light Mode" : "Ubah ke Dark Mode"}
          >
            {isDark ? <RiSunLine className="text-base text-amber-400" /> : <RiMoonLine className="text-base text-primary-500" />}
          </button>
          <span className="badge bg-teal-500/10 text-teal-500 dark:text-teal-400 border border-teal-500/20 text-xs px-3 py-1.5 uppercase font-bold">
            KELAS {studentInfo.kelas}
          </span>
        </div>
      </div>
    </div>
  );

  if (step === 1) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg-main))] text-white flex flex-col transition-colors duration-300">
        {renderHeader()}
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md card-feature p-8">
            <h2 className="font-display font-black text-2xl text-white text-center mb-2">Mulai Mengisi Instrumen</h2>
            <p className="text-dark-200 text-sm text-center mb-6">
              Silakan isi identitas Anda untuk memulai asesmen {config.title}.
            </p>

            <form onSubmit={handleStart} className="space-y-5">
              {/* Nama Lengkap — autocomplete dari cache siswa */}
              <div className="relative" ref={inputRef}>
                <label className="block text-xs font-bold text-dark-300 mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
                <div className={`relative flex items-center input-field py-0 pr-0 ${showDrop ? 'border-primary-500 ring-1 ring-primary-500/30' : ''}`}>
                  <RiUserLine className="flex-shrink-0 ml-3 text-dark-300" />
                  <input
                    type="text" required autoComplete="off"
                    placeholder={siswaCache.length > 0 ? 'Ketik nama atau NIS Anda...' : 'Ketik nama lengkap Anda...'}
                    className="flex-1 bg-transparent outline-none text-sm text-white placeholder-dark-400 px-2.5 py-3"
                    value={namaQuery}
                    onChange={e => { setNamaQuery(e.target.value); setStudentInfo({...studentInfo, nama: e.target.value}); setShowDrop(true); }}
                    onFocus={() => setShowDrop(true)}
                  />
                  {namaQuery && (
                    <button type="button" onClick={() => { setNamaQuery(''); setStudentInfo({...studentInfo, nama: ''}); setShowDrop(false); }}
                      className="flex-shrink-0 p-3 text-dark-400 hover:text-red-400 transition-colors">
                      <RiCloseLine className="text-base" />
                    </button>
                  )}
                </div>

                {/* Dropdown */}
                {showDrop && siswaCache.length > 0 && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDrop(false)} />
                    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-dark-900 border border-white/15 rounded-xl shadow-2xl overflow-hidden">
                      <div className="px-3 py-1.5 border-b border-white/10 bg-primary-500/5">
                        <span className="text-[10px] text-primary-300 font-bold uppercase tracking-wider">{filteredSiswa.length} siswa ditemukan</span>
                      </div>
                      <div className="max-h-52 overflow-y-auto">
                        {filteredSiswa.length === 0
                          ? <div className="py-5 text-center text-dark-400 text-sm">Tidak ditemukan</div>
                          : filteredSiswa.map(s => (
                            <button key={s.id} type="button"
                              onMouseDown={e => { e.preventDefault(); handleSelectSiswa(s); }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 transition-colors text-left">
                              <div className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center font-bold text-primary-300 text-xs flex-shrink-0">
                                {s.nama?.substring(0,2).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-white text-sm truncate">{s.nama}</div>
                                <div className="text-dark-400 text-[10px]">
                                  NIS: {s.nis || '-'} · <span className="text-primary-400 font-medium">{s.kelas}</span>
                                </div>
                              </div>
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark-300 mb-1.5 uppercase tracking-wider">Jenis Kelamin</label>
                  <select 
                    className="input-field py-3"
                    value={studentInfo.jk}
                    onChange={(e) => setStudentInfo({...studentInfo, jk: e.target.value})}
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-300 mb-1.5 uppercase tracking-wider">Kelas</label>
                  <input 
                    type="text" 
                    disabled
                    className="input-field py-3 opacity-75 bg-dark-900 border-dashed"
                    value={studentInfo.kelas}
                  />
                </div>
              </div>

              <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4 text-xs text-dark-200 leading-relaxed">
                <b>Petunjuk Pengisian:</b> Bacalah pernyataan yang muncul di layar. <b>Centang / pilih</b> pernyataan jika hal tersebut merupakan masalah yang saat ini sedang Anda alami atau rasakan.
              </div>

              <button type="submit" className="btn-primary w-full py-3.5 bg-primary-500 font-bold gap-2">
                MULAI PENGISIAN <RiArrowRightLine />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg-main))] text-white flex flex-col pb-24 transition-colors duration-300">
        {renderHeader()}
        
        {/* Sticky progress bar */}
        <div className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur border-b border-white/10 py-3 px-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-dark-300 uppercase tracking-widest">PROFIL PENGISI</span>
              <span className="text-white text-sm font-bold truncate max-w-[180px] sm:max-w-sm">{studentInfo.nama}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-xs text-dark-200 font-medium">Masalah Dipilih:</span>
              <span className="text-primary-500 dark:text-primary-400 font-bold text-sm font-mono bg-primary-500/10 px-2 rounded border border-primary-500/30">{countChecked}</span>
            </div>
          </div>
        </div>

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
          
          {/* Info Banner */}
          <div className="card-feature p-4 bg-primary-500/10 border-primary-500/20 flex items-center gap-3 text-xs sm:text-sm text-dark-200 shadow-none hover:transform-none hover:shadow-none">
            <RiCheckboxCircleLine className="text-teal-500 dark:text-teal-400 text-xl flex-shrink-0" />
            <p>Silakan <b>sentuh atau klik kotak pernyataan</b> di bawah jika Anda menyetujui atau merasakan hal tersebut.</p>
          </div>

          {/* Form sections based on Bidang */}
          {sections.map((sect, sectIdx) => (
            <div key={sectIdx} className="space-y-4">
              <div className="flex items-center gap-2 text-white font-display font-black text-base border-b border-white/10 pb-2">
                <RiHeartLine className="text-primary-500" />
                {sect.label}
              </div>
              <div className="grid grid-cols-1 gap-3">
                {sect.list.map((item) => {
                  const globalIndex = item.no - 1;
                  const isSelected = selections[globalIndex] === 1;
                  return (
                    <div 
                      key={item.no}
                      onClick={() => toggleSelection(globalIndex)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none
                        ${isSelected 
                          ? 'bg-primary-500/10 dark:bg-primary-600/15 border-primary-500 shadow-glow-sm dark:bg-gradient-to-r dark:from-primary-950/50 dark:to-dark-900' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded mt-0.5 flex-shrink-0 ${isSelected ? 'bg-primary-500 text-white' : 'bg-dark-900 text-dark-300'}`}>
                          {item.no}
                        </span>
                        <p className={`text-sm font-medium leading-relaxed ${isSelected ? 'text-white' : 'text-dark-200'}`}>
                          {item.pernyataan}
                        </p>
                      </div>
                      
                      {/* Checkbox Circle */}
                      <div className={`w-6 h-6 rounded-full flex-shrink-0 border-2 flex items-center justify-center transition-all
                        ${isSelected ? 'bg-primary-500 border-primary-400 text-white scale-110' : 'border-dark-300 dark:border-dark-500 bg-transparent'}
                      `}>
                        {isSelected && <RiCheckboxCircleLine className="text-lg" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Bottom Action Float Bar */}
          <div className="fixed bottom-0 inset-x-0 bg-dark-950/90 backdrop-blur-md border-t border-white/15 p-4 flex justify-center z-50">
            <div className="max-w-md w-full flex gap-3">
              <button onClick={() => { if(confirm("Kembali ke halaman pengisian nama?")) setStep(1) }} className="btn-secondary py-3 w-1/3 gap-1">
                <RiArrowLeftLine /> Identitas
              </button>
              <button onClick={handleSubmit} className="btn-primary py-3 flex-1 bg-emerald-600 hover:bg-emerald-500 shadow-glow-accent font-bold gap-2 uppercase">
                <RiSave3Line className="text-xl" /> Kirim Jawaban
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[rgb(var(--bg-main))] text-white flex flex-col items-center justify-center p-6 transition-colors duration-300">
        <div className="max-w-md w-full text-center card-feature p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />
          
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-4xl mb-6 shadow-glow">
            <RiCheckboxCircleLine />
          </div>
          
          <h2 className="font-display font-black text-2xl text-white mb-2">Kirim Berhasil!</h2>
          <p className="text-dark-200 text-sm mb-6 leading-relaxed">
            Terima kasih, <b>{studentInfo.nama}</b>. Jawaban instrumen {config.title} Anda telah terekam dengan aman oleh Guru BK Anda.
          </p>
          
          <div className="bg-dark-950/60 p-4 rounded-xl border border-white/5 mb-8 text-xs text-dark-300">
             Anda dapat menutup halaman tab ini sekarang.
          </div>

          <button 
            onClick={() => {
              setSelections(Array(config.master.length).fill(0));
              setStudentInfo({ nama: '', jk: 'L', kelas: activeMeta.kelas });
              setStep(1);
            }} 
            className="btn-secondary text-xs py-2 px-4"
          >
            Isi Sebagai Responden Baru
          </button>
        </div>
      </div>
    );
  }
}
