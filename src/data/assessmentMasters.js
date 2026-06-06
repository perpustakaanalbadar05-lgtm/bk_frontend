const DEFAULT_GAYA_BELAJAR = [
  { no: 1, pernyataan: "Saya lebih mudah mengingat sesuatu dengan melihat", bidangKode: "V", bidang: "Visual", materi: "Gaya Belajar Visual" },
  { no: 2, pernyataan: "Saya lebih suka membaca daripada dibacakan", bidangKode: "V", bidang: "Visual", materi: "Gaya Belajar Visual" },
  { no: 3, pernyataan: "Saya lebih mudah belajar dengan mendengarkan penjelasan", bidangKode: "A", bidang: "Auditori", materi: "Gaya Belajar Auditori" },
  { no: 4, pernyataan: "Saya suka berdiskusi dan berbicara", bidangKode: "A", bidang: "Auditori", materi: "Gaya Belajar Auditori" },
  { no: 5, pernyataan: "Saya tidak bisa duduk diam dalam waktu lama saat belajar", bidangKode: "K", bidang: "Kinestetik", materi: "Gaya Belajar Kinestetik" },
  { no: 6, pernyataan: "Saya lebih mudah belajar dengan mempraktikkan langsung", bidangKode: "K", bidang: "Kinestetik", materi: "Gaya Belajar Kinestetik" }
];

const DEFAULT_KECERDASAN = [
  { no: 1, pernyataan: "Saya suka membaca buku cerita atau novel", bidangKode: "L", bidang: "Linguistik", materi: "Kecerdasan Linguistik" },
  { no: 2, pernyataan: "Saya suka bermain angka dan memecahkan teka-teki logika", bidangKode: "M", bidang: "Logika-Matematika", materi: "Kecerdasan Logika" },
  { no: 3, pernyataan: "Saya mudah mengingat arah atau jalan baru", bidangKode: "S", bidang: "Spasial", materi: "Kecerdasan Spasial" },
  { no: 4, pernyataan: "Saya suka berolahraga atau menari", bidangKode: "K", bidang: "Kinestetik", materi: "Kecerdasan Kinestetik" },
  { no: 5, pernyataan: "Saya mudah menghafal lirik lagu atau nada", bidangKode: "Mu", bidang: "Musikal", materi: "Kecerdasan Musikal" },
  { no: 6, pernyataan: "Saya suka berkumpul dan ngobrol dengan teman-teman", bidangKode: "Ie", bidang: "Interpersonal", materi: "Kecerdasan Interpersonal" }
];

const DEFAULT_KEPRIBADIAN = [
  { no: 1, pernyataan: "Saya sangat suka tampil di depan umum", bidangKode: "E", bidang: "Ekstrovert", materi: "Kepribadian Terbuka" },
  { no: 2, pernyataan: "Saya lebih suka bekerja sendirian daripada kelompok", bidangKode: "I", bidang: "Introvert", materi: "Kepribadian Tertutup" },
  { no: 3, pernyataan: "Saya mudah bergaul dengan orang yang baru dikenal", bidangKode: "E", bidang: "Ekstrovert", materi: "Kepribadian Terbuka" },
  { no: 4, pernyataan: "Saya sering memikirkan sesuatu secara mendalam", bidangKode: "I", bidang: "Introvert", materi: "Kepribadian Tertutup" }
];

const DEFAULT_BAKAT_MINAT = [
  { no: 1, pernyataan: "Saya suka memperbaiki barang yang rusak", bidangKode: "R", bidang: "Realistis", materi: "Minat Realistis" },
  { no: 2, pernyataan: "Saya suka melakukan eksperimen sains", bidangKode: "I", bidang: "Investigatif", materi: "Minat Investigatif" },
  { no: 3, pernyataan: "Saya suka menggambar atau mendesain sesuatu", bidangKode: "A", bidang: "Artistik", materi: "Minat Artistik" },
  { no: 4, pernyataan: "Saya suka menolong orang lain yang kesulitan", bidangKode: "S", bidang: "Sosial", materi: "Minat Sosial" }
];

const getSaved = (key, defaultArr) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
  }
  return defaultArr;
};

export const GAYA_BELAJAR_MASTER = getSaved('simbk_custom_gaya_belajar', DEFAULT_GAYA_BELAJAR);
export const KECERDASAN_MASTER = getSaved('simbk_custom_kecerdasan', DEFAULT_KECERDASAN);
export const KEPRIBADIAN_MASTER = getSaved('simbk_custom_kepribadian', DEFAULT_KEPRIBADIAN);
export const BAKAT_MINAT_MASTER = getSaved('simbk_custom_bakat_minat', DEFAULT_BAKAT_MINAT);

export const saveCustomAssessment = (type, newMaster) => {
  let key = '';
  let masterArr = null;
  switch (type) {
    case 'gaya-belajar': key = 'simbk_custom_gaya_belajar'; masterArr = GAYA_BELAJAR_MASTER; break;
    case 'kecerdasan': key = 'simbk_custom_kecerdasan'; masterArr = KECERDASAN_MASTER; break;
    case 'kepribadian': key = 'simbk_custom_kepribadian'; masterArr = KEPRIBADIAN_MASTER; break;
    case 'bakat-minat': key = 'simbk_custom_bakat_minat'; masterArr = BAKAT_MINAT_MASTER; break;
  }
  if (key) {
    localStorage.setItem(key, JSON.stringify(newMaster));
    masterArr.splice(0, masterArr.length, ...newMaster);
  }
};
