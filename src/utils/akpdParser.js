import * as XLSX from 'xlsx';
import { computeAkpdResults } from './akpdCalculator';
import { AKPD_MASTER, AKPD_MASTER_SMA } from '../data/akpdMaster';

export const parseAkpdExcel = async (file, masterData) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const entriSheet = workbook.Sheets['ENTRI'];
        if (!entriSheet) {
          throw new Error("Sheet 'ENTRI' tidak ditemukan di file Excel!");
        }
        const raw = XLSX.utils.sheet_to_json(entriSheet, { header: 1, defval: '' });
        
        let sekolah = 'SMP Negeri 2 Pamekasan';
        let kelas = 'VII G';
        let tahun = '2022-2023';
        
        for (let i = 0; i < Math.min(raw.length, 10); i++) {
          const row = raw[i];
          const rowText = row.join(' ').toLowerCase();
          if (rowText.includes('sekolah')) {
             const idx = row.findIndex(cell => String(cell).includes(':'));
             if (idx !== -1 && row[idx+1]) sekolah = String(row[idx+1]).trim();
          }
          if (rowText.includes('kelas')) {
             const idx = row.findIndex(cell => String(cell).includes(':'));
             if (idx !== -1 && row[idx+1]) kelas = String(row[idx+1]).trim();
          }
          if (rowText.includes('tahun pelajaran') || rowText.includes('tahun')) {
             const idx = row.findIndex(cell => String(cell).includes(':'));
             if (idx !== -1 && row[idx+1]) tahun = String(row[idx+1]).trim();
          }
        }

        let headerRowIndex = -1;
        let numStartColIndex = -1;
        for (let i = 0; i < raw.length; i++) {
          const row = raw[i];
          let idx1 = -1;
          for (let j = 0; j < row.length; j++) {
            if (String(row[j]).trim() === '1') {
              idx1 = j;
              break;
            }
          }
          if (idx1 >= 0 && String(row[idx1 + 1]).trim() === '2' && String(row[idx1 + 2]).trim() === '3') {
            headerRowIndex = i;
            numStartColIndex = idx1;
            break;
          }
        }

        if (headerRowIndex === -1) {
          throw new Error("Format kolom no urut item 1-50 tidak terdeteksi di sheet ENTRI!");
        }

        const students = [];
        for (let i = headerRowIndex + 1; i < raw.length; i++) {
          const row = raw[i];
          const noUrut = String(row[0]).trim();
          const nama = String(row[3] || '').trim();
          
          if (noUrut && !isNaN(noUrut) && nama) {
            const responses = [];
            for (let j = 0; j < masterData.length; j++) {
              const val = parseInt(String(row[numStartColIndex + j]).trim());
              responses.push(isNaN(val) ? 0 : val);
            }
            students.push({
              no: noUrut,
              nama: nama,
              jk: String(row[4] || '').trim(),
              responses: responses
            });
          }
        }

        if (students.length === 0) {
          throw new Error("Tidak ada data siswa yang terdeteksi di sheet ENTRI!");
        }

        let tingkat = 'SMP/MTs';
        if (sekolah.toUpperCase().includes('SMA') || sekolah.toUpperCase().includes('SMK') || sekolah.toUpperCase().includes('MAN ')) {
          tingkat = 'SMA/SMK/MA';
        }

        // Use central compute function with appropriate master
        const computed = computeAkpdResults({ sekolah, kelas, tahun, tingkat }, students, masterData);
        resolve(computed);

      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Gagal membaca file Excel."));
    reader.readAsArrayBuffer(file);
  });
};
