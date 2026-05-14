import { AKPD_MASTER } from '../data/akpdMaster';

/**
 * Generic calculator to compute aggregated AKPD stats from a list of students.
 * @param {Object} meta - Metadata: { sekolah, kelas, tahun }
 * @param {Array} students - List of objects: { no, nama, jk, responses: Array(50) }
 */
export const computeAkpdResults = (meta, students) => {
  // Ensure students responses map to numbers
  const cleanStudents = students.map(s => ({
    ...s,
    responses: s.responses.map(r => Number(r) || 0),
    totalScore: s.responses.reduce((sum, val) => sum + (Number(val) || 0), 0)
  }));

  // Initialize aggregates
  const aggregates = AKPD_MASTER.map(item => ({
    ...item,
    jmlResponden: 0,
    persentase: 0,
    prioritas: 'RENDAH'
  }));

  // Accumulate responses
  cleanStudents.forEach(s => {
    s.responses.forEach((val, idx) => {
      if (val === 1 && aggregates[idx]) {
        aggregates[idx].jmlResponden++;
      }
    });
  });

  const totalSelectedProblems = aggregates.reduce((sum, item) => sum + item.jmlResponden, 0);

  // Apply formulas
  aggregates.forEach(item => {
    item.persentase = totalSelectedProblems > 0 ? (item.jmlResponden / totalSelectedProblems) : 0;
    
    // Excel Formula Logic: IF(Pct>=2%, "TINGGI", IF(Pct>=1%, "SEDANG", "RENDAH"))
    if (item.persentase >= 0.02) {
      item.prioritas = 'TINGGI';
    } else if (item.persentase >= 0.01) {
      item.prioritas = 'SEDANG';
    } else {
      item.prioritas = 'RENDAH';
    }
  });

  // Sum of Bidang Layanan
  const bidangSummary = {
    'Pribadi': { count: 0, persentase: 0, label: 'Pribadi' },
    'Sosial': { count: 0, persentase: 0, label: 'Sosial' },
    'Belajar': { count: 0, persentase: 0, label: 'Belajar' },
    'Karir': { count: 0, persentase: 0, label: 'Karir' }
  };

  aggregates.forEach(item => {
    if (bidangSummary[item.bidang]) {
      bidangSummary[item.bidang].count += item.jmlResponden;
    }
  });

  Object.keys(bidangSummary).forEach(key => {
    bidangSummary[key].persentase = totalSelectedProblems > 0 ? (bidangSummary[key].count / totalSelectedProblems) * 100 : 0;
  });

  return {
    meta: {
      ...meta,
      totalSiswa: cleanStudents.length,
      totalMasalah: totalSelectedProblems
    },
    students: cleanStudents,
    aggregates,
    bidangSummary: Object.values(bidangSummary)
  };
};
