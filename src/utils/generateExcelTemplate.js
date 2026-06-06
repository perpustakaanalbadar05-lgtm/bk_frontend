/**
 * generateExcelTemplate.js
 * Konseli by Alifba Media — Generator Template Excel AKPD
 *
 * Menghasilkan file .xlsx yang siap diisi oleh Guru BK/Siswa
 * dan kompatibel penuh dengan akpdParser.js (sheet ENTRI, kolom 1-50).
 */
import * as XLSX from 'xlsx';
import { AKPD_MASTER, AKPD_MASTER_SMA } from '../data/akpdMaster';
import {
  GAYA_BELAJAR_MASTER,
  KECERDASAN_MASTER,
  KEPRIBADIAN_MASTER,
  BAKAT_MINAT_MASTER,
} from '../data/assessmentMasters';

/**
 * Pilih master data sesuai tipe asesmen
 */
const getMaster = (type, meta = {}) => {
  switch (type) {
    case 'gaya-belajar': return { master: GAYA_BELAJAR_MASTER, title: 'Gaya Belajar' };
    case 'kecerdasan':   return { master: KECERDASAN_MASTER,   title: 'Kecerdasan Majemuk' };
    case 'kepribadian':  return { master: KEPRIBADIAN_MASTER,  title: 'Kepribadian' };
    case 'bakat-minat':  return { master: BAKAT_MINAT_MASTER,  title: 'Bakat & Karier' };
    default:             
      const isSma = meta.tingkat === 'SMA/SMK/MA';
      return { master: isSma ? AKPD_MASTER_SMA : AKPD_MASTER, title: 'AKPD' };
  }
};

/**
 * Buat dan unduh template Excel
 * @param {string} type - tipe asesmen: 'akpd' | 'gaya-belajar' | 'kecerdasan' | 'kepribadian' | 'bakat-minat'
 * @param {object} meta - { sekolah, kelas, tahun }
 */
export const generateExcelTemplate = (type = 'akpd', meta = {}) => {
  const { master, title } = getMaster(type, meta);
  const numItems = master.length;
  const sekolah  = meta.sekolah || 'Nama Sekolah';
  const kelas    = meta.kelas   || 'Nama Kelas';
  const tahun    = meta.tahun   || '2025/2026';

  /* ────────── SHEET 1: ENTRI (digunakan oleh parser) ────────── */
  const ENTRI_rows = [];

  // Baris 1-3: Header identitas (format yang dikenali parser)
  ENTRI_rows.push(['Sekolah :', sekolah, '', '', '', '', ...Array(numItems).fill('')]);
  ENTRI_rows.push(['Kelas   :', kelas,   '', '', '', '', ...Array(numItems).fill('')]);
  ENTRI_rows.push(['Tahun Pelajaran :', tahun, '', '', '', '', ...Array(numItems).fill('')]);
  ENTRI_rows.push([]); // baris kosong

  // Baris 5: Header kolom — No, Nama, JK, lalu no butir 1..N
  const headerRow = [
    'No',
    'NISN',
    'Nama Siswa',
    'Nama Siswa', // kolom index 3 = nama (sesuai parser: row[3])
    'JK',         // kolom index 4 = JK   (sesuai parser: row[4])
    '',
    ...Array.from({ length: numItems }, (_, i) => i + 1),
  ];
  ENTRI_rows.push(headerRow);

  // Baris 6+: Contoh 5 siswa kosong (bisa ditambah sendiri)
  const CONTOH_SISWA = [
    ['1', '', 'NAMA SISWA 1', 'NAMA SISWA 1', 'L', '', ...Array(numItems).fill(0)],
    ['2', '', 'NAMA SISWA 2', 'NAMA SISWA 2', 'P', '', ...Array(numItems).fill(0)],
    ['3', '', 'NAMA SISWA 3', 'NAMA SISWA 3', 'L', '', ...Array(numItems).fill(0)],
    ['4', '', 'NAMA SISWA 4', 'NAMA SISWA 4', 'P', '', ...Array(numItems).fill(0)],
    ['5', '', 'NAMA SISWA 5', 'NAMA SISWA 5', 'L', '', ...Array(numItems).fill(0)],
  ];
  CONTOH_SISWA.forEach(r => ENTRI_rows.push(r));

  const wsEntri = XLSX.utils.aoa_to_sheet(ENTRI_rows);

  // Lebar kolom
  wsEntri['!cols'] = [
    { wch: 6  },  // No
    { wch: 14 },  // NISN
    { wch: 26 },  // Nama (tampilan)
    { wch: 26 },  // Nama (parser)
    { wch: 5  },  // JK
    { wch: 3  },  // spacer
    ...Array(numItems).fill({ wch: 4 }),
  ];

  /* ────────── SHEET 2: PANDUAN ────────── */
  const PANDUAN_rows = [
    [`📋 TEMPLATE ASESMEN ${title.toUpperCase()} — Konseli by Alifba Media.`],
    [],
    ['PETUNJUK PENGISIAN:'],
    ['1. Isi data identitas Sekolah, Kelas, dan Tahun Pelajaran di Sheet "ENTRI" (baris 1-3, kolom B).'],
    ['2. Hapus baris contoh siswa (baris nomor 6-10) dan isi dengan data siswa Anda.'],
    ['3. Format kolom siswa:'],
    ['   • Kolom A = No Urut (angka, misal: 1, 2, 3...)'],
    ['   • Kolom B = NISN (opsional)'],
    ['   • Kolom C & D = Nama Siswa (isi sama di kedua kolom)'],
    ['   • Kolom E = JK (L untuk Laki-laki, P untuk Perempuan)'],
    ['   • Kolom G dst = Jawaban butir 1 s.d. ' + numItems + ' (isi angka 1 jika SESUAI, 0 jika TIDAK)'],
    [],
    ['PENTING:'],
    ['• Sheet harus bernama "ENTRI" (huruf kapital semua).'],
    ['• Jangan mengubah baris header nomor butir (baris 5, kolom G dst).'],
    ['• Simpan file dalam format .xlsx atau .xls.'],
    ['• Setelah selesai, unggah kembali file ini ke Konseli via tombol "UNGGAH EXCEL ACUAN".'],
    [],
    ['─────────────────────────────────────────────────────'],
    ['DAFTAR BUTIR PERNYATAAN:'],
    ['No', 'Pernyataan', 'Bidang', 'Komponen Layanan', 'Strategi Layanan'],
    ...master.map((item, i) => [
      i + 1,
      item.pernyataan,
      item.bidang,
      item.komponenLayanan || '',
      item.strategiLayanan || '',
    ]),
    [],
    ['© ' + new Date().getFullYear() + ' CV. Alifba Media — Konseli. Konseling, Solusi, Edukasi.'],
  ];

  const wsPanduan = XLSX.utils.aoa_to_sheet(PANDUAN_rows);
  wsPanduan['!cols'] = [
    { wch: 6  },
    { wch: 70 },
    { wch: 14 },
    { wch: 22 },
    { wch: 22 },
  ];

  /* ────────── Buat workbook & unduh ────────── */
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsEntri,   'ENTRI');
  XLSX.utils.book_append_sheet(wb, wsPanduan, 'PANDUAN');

  const fileName = `Template_Asesmen_${title.replace(/[^a-zA-Z0-9]/g, '_')}_${kelas.replace(/\s/g, '')}_${tahun.replace(/[^a-zA-Z0-9]/g, '-')}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
