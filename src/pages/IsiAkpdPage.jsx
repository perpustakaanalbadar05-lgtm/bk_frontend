import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RiShieldCheckLine, 
  RiHeartLine, 
  RiGroupLine, 
  RiBookOpenLine, 
  RiBriefcaseLine, 
  RiCheckboxCircleLine, 
  RiArrowRightLine, 
  RiArrowLeftLine,
  RiSave3Line,
  RiSunLine,
  RiMoonLine
} from 'react-icons/ri';
import toast from 'react-hot-toast';
import { AKPD_MASTER } from '../data/akpdMaster';
import { computeAkpdResults } from '../utils/akpdCalculator';

export default function IsiAkpdPage() {
  const navigate = useNavigate();
  
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
      const saved = localStorage.getItem('simbk_data_akpd_result');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.meta;
      }
    } catch (_) {}
    return { sekolah: 'SMP Negeri 2 Pamekasan', kelas: 'VII G', tahun: '2022-2023' };
  };

  const activeMeta = getActiveMeta();

  // Form states
  const [step, setStep] = useState(1); // 1: Identitas, 2: Soal, 3: Berhasil
  const [studentInfo, setStudentInfo] = useState({
    nama: '',
    jk: 'L',
    kelas: activeMeta.kelas
  });

  // Selected indices (from 50 statements) - Store 1 if selected, 0 if not
  const [selections, setSelections] = useState(Array(50).fill(0));

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
      const savedStr = localStorage.getItem('simbk_data_akpd_result');
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
      const finalComputed = computeAkpdResults(currentResult.meta, updatedStudents);

      localStorage.setItem('simbk_data_akpd_result', JSON.stringify(finalComputed));

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
  
  const listPribadi = AKPD_MASTER.filter(q => q.bidang === 'Pribadi');
  const listSosial = AKPD_MASTER.filter(q => q.bidang === 'Sosial');
  const listBelajar = AKPD_MASTER.filter(q => q.bidang === 'Belajar');
  const listKarir = AKPD_MASTER.filter(q => q.bidang === 'Karir');

  const renderHeader = () => (
    <div className="bg-dark-950 border-b border-white/10 py-6 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-xl text-white shadow-glow-sm">
            <RiShieldCheckLine />
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-lg leading-tight">PORTAL ASESMEN AKPD</h1>
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
              Silakan isi identitas Anda untuk memulai asesmen kebutuhan peserta didik (AKPD).
            </p>

            <form onSubmit={handleStart} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-dark-300 mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ketik nama lengkap Anda..."
                  className="input-field py-3"
                  value={studentInfo.nama}
                  onChange={(e) => setStudentInfo({...studentInfo, nama: e.target.value})}
                />
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
          {[
            { label: 'A. BIDANG PRIBADI', icon: RiHeartLine, color: 'text-purple-500 dark:text-purple-400', list: listPribadi },
            { label: 'B. BIDANG SOSIAL', icon: RiGroupLine, color: 'text-cyan-500 dark:text-cyan-400', list: listSosial },
            { label: 'C. BIDANG BELAJAR', icon: RiBookOpenLine, color: 'text-blue-500 dark:text-blue-400', list: listBelajar },
            { label: 'D. BIDANG KARIR', icon: RiBriefcaseLine, color: 'text-amber-500 dark:text-amber-400', list: listKarir }
          ].map((sect, sectIdx) => (
            <div key={sectIdx} className="space-y-4">
              <div className="flex items-center gap-2 text-white font-display font-black text-base border-b border-white/10 pb-2">
                <sect.icon className={sect.color} />
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
            Terima kasih, <b>{studentInfo.nama}</b>. Jawaban instrumen AKPD Anda telah terekam dengan aman oleh Guru BK Anda.
          </p>
          
          <div className="bg-dark-950/60 p-4 rounded-xl border border-white/5 mb-8 text-xs text-dark-300">
             Anda dapat menutup halaman tab ini sekarang.
          </div>

          <button 
            onClick={() => {
              setSelections(Array(50).fill(0));
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
