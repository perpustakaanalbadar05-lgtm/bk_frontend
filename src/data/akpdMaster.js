// Master Basis Data 50 Butir Instrumen AKPD Berdasarkan Acuan Standard Excel
// Digunakan sebagai acuan analisis hitungan profil kelas & generator action plan / RPL.

const DEFAULT_AKPD_MASTER = [
  {
    "no": 1,
    "pernyataan": "Saya belum bersungguh-sungguh beribadah pada Tuhan YME",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Kesadaran untuk beribadah Tuhan YME dengan Ikhlas",
    "materi": "Tuhan selalu hadir dalam hidupku",
    "tujuanLayanan": "Peserta didik/konseli memiliki kesadaran untuk beribadah pada Tuhan YME",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 2,
    "pernyataan": "Kadang-kadang perbuatan saya tidak sesuai dengan yang diucapkan",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Kesadaran untuk selalu bersikap jujur",
    "materi": "Nilai suatu sikap kejujuran",
    "tujuanLayanan": "Peserta didik/konseli memiliki kebiasaan untuk selalu bersikap jujur",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 3,
    "pernyataan": "Saya kadang lupa bersyukur atas nikmat dan karunia dari Tuhan YME",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Memiliki sikap selalu bersyukur pada Tuhan YME",
    "materi": "Bersyukur dengan hati yang ikhlas",
    "tujuanLayanan": "Peserta didik/konseli selau bersyukur pada Tuhan YME atas segala yang telah diberikan-Nya",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 4,
    "pernyataan": "Saya merasa pernah menyontek pada waktu ulangan",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Pemahaman terhadap dampak menyontek",
    "materi": "Akibat suka menyontek",
    "tujuanLayanan": "Peserta didik/konseli memahami dampak menyontek dan dapat menghindarinya",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Individual"
  },
  {
    "no": 5,
    "pernyataan": "Saya lebih senang budaya luar (asing) daripada budaya Indonesia",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Kesadaran untuk mencintai budaya indonesia",
    "materi": "Saya cinta budaya sendiri",
    "tujuanLayanan": "Peserta didik/konseli memiliki kesadaran mencintai budaya indonesia tercinta",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Kelompok"
  },
  {
    "no": 6,
    "pernyataan": "Saya merasa kurang memiliki rasa tanggung jawab",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Kemampuan untuk selalu bertanggung jawab",
    "materi": "Langkahku tanggung jawabku",
    "tujuanLayanan": "Peserta didik/konseli memiliki sikap yang bertanggung jawab",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Kelompok"
  },
  {
    "no": 7,
    "pernyataan": "Saya gampang marah tanpa tahu penyebabnya",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Kemampuan mengendalikan diri dari rasa marah",
    "materi": "Mengelola marah",
    "tujuanLayanan": "Peserta didik/konseli  mengelola kemarahan",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Individual"
  },
  {
    "no": 8,
    "pernyataan": "Saya merasa rendah diri",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Memiliki kepercaya diri",
    "materi": "Menghilangkan rasa rendah diri",
    "tujuanLayanan": "Peserta didik/konseli tidak rendah diri",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Individual"
  },
  {
    "no": 9,
    "pernyataan": "Saya merasa malu dengan kondisi fisik (jasmani) yang dimiliki",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Kesadaran untuk menerima pemberian terbaik dari Tuhan",
    "materi": "Menerima diriku apa adanya",
    "tujuanLayanan": "Peserta didik/konseli mampu besyukur dan menerima dengan ikhlas apa yang sudah dimilikinya",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Individual"
  },
  {
    "no": 10,
    "pernyataan": "Saya merasa kurang mendapatkan perhatian dari orang tua",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Memperoleh perhatian orang tua yang cukup",
    "materi": "Kiat mendapat perhatian orang tua",
    "tujuanLayanan": "Peserta didik/konseli memperoleh perhatian orang tua yang cukup",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Individual"
  },
  {
    "no": 11,
    "pernyataan": "Saya belum tahu cara menjaga kesehatan yang baik dan benar",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Memiliki kesehatan jasmani dan rohani yang baik",
    "materi": "Pola hidup bersih dan sehat",
    "tujuanLayanan": "Peserta didik/konseli memiliki kesehatan jasmani dan rohani yang baik",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 12,
    "pernyataan": "Saya belum tahu tentang potensi diri saya sendiri",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Menggali Potensi Diri Sendiri",
    "materi": "Potensi diri",
    "tujuanLayanan": "Peserta didik/konseli mampu menggali Potensi Diri Sendiri",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 13,
    "pernyataan": "Saya sering mengalami sakit / alergi",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Memiliki kesehatan jasmani dan rohani yang baik",
    "materi": "Menjaga kesehatan diri",
    "tujuanLayanan": "Peserta didik/konseli mampu menjaga kesehatan jasmani dan rohani",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Individual"
  },
  {
    "no": 14,
    "pernyataan": "Saya belum memahami kelebihan dan kekurangan yang saya miliki",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Mengetahui Kelebihan dan Kelemahan yang dimiliki",
    "materi": "Kelebihan dan kekurangan diri",
    "tujuanLayanan": "Peserta didik/konseli dapat mengetahui kelebihan dan  kelemahan yang dimilikinya",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Kelompok"
  },
  {
    "no": 15,
    "pernyataan": "Orang tua saya tidak mempunyai penghasilan tetap",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Meningkatkan taraf hidup /ekonomi keluarga",
    "materi": "Kiat mengatur keuangan",
    "tujuanLayanan": "Peserta didik/konseli dapat meningkatkan taraf hidup /ekonomi keluarga",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Individual"
  },
  {
    "no": 16,
    "pernyataan": "Saya merasa kesulitan mengatur waktu belajar dan bermain",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Mengatur jadwal kegiatan sehari-hari dengan baik",
    "materi": "Cara mengatur waktu",
    "tujuanLayanan": "Peserta didik/konseli mampu mengatur jadwal kegiatan sehari-hari dengan baik",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 17,
    "pernyataan": "Saya belum mengenal jati diri saya yang sebenarnya",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Kemampuan mengenal diri sendiri sendiri",
    "materi": "Pemahaman diri sendiri",
    "tujuanLayanan": "Peserta didik/konseli mampu mengenal diri sendiri sendiri",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 18,
    "pernyataan": "Saya belum tahu perubahan apa saja yang terjadi pada masa remaja",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Menyadari dan memahami perubahan yang terjadi pada masa remaja",
    "materi": "Masa remaja dan perubahannya",
    "tujuanLayanan": "Peserta didik/konseli dapat menyadari dan memahami perubahan yang terjadi pada masa remaja",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 19,
    "pernyataan": "Saya belum terbiasa disiplin dalam kehidupan",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Memiliki disiplin diri dalam kehidupan",
    "materi": "Disiplin diri",
    "tujuanLayanan": "Peserta didik/konseli memiliki disiplin diri dalam kehidupan",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 20,
    "pernyataan": "Saya belum tahu cara menjadi pribadi mandiri",
    "bidangKode": "P",
    "bidang": "Pribadi",
    "rumusanKebutuhan": "Memiliki kepribadian yang mandiri",
    "materi": "Menjadi pribadi mandiri",
    "tujuanLayanan": "Peserta didik/konseli dapat memiliki kepribadian yang mandiri",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 21,
    "pernyataan": "Pemahaman saya masih sedikit  tentang bahaya atau dampak rokok",
    "bidangKode": "S",
    "bidang": "Sosial",
    "rumusanKebutuhan": "Menghindari bahaya atau dampak rokok",
    "materi": "Bahaya rokok dan dampaknya",
    "tujuanLayanan": "Peserta didik/konseli dapat menghindari bahaya atau dampak rokok",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 22,
    "pernyataan": "Kata maaf, tolong dan terimakasih kadang lupa saya ucapkan dalam pergaulan",
    "bidangKode": "S",
    "bidang": "Sosial",
    "rumusanKebutuhan": "Kemampuan mengucapkan kata maaf, tolong dan terima kasih",
    "materi": "Melakukan 3 kata penting dalam pergaulan",
    "tujuanLayanan": "Peserta didik/konseli mampu melakukan 3 kata penting dalam pergaulan",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Kelompok"
  },
  {
    "no": 23,
    "pernyataan": "Saya merasa malu untuk berinteraksi dengan para guru dan karyawan di sekolah",
    "bidangKode": "S",
    "bidang": "Sosial",
    "rumusanKebutuhan": "Dapat berinteraksi dengan guru dan karyawan sekolah",
    "materi": "Membina hubungan baik dengan guru dan karyawan",
    "tujuanLayanan": "Peserta didik/konseli dapat berinteraksi dengan guru dan karyawan sekolah",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Individual"
  },
  {
    "no": 24,
    "pernyataan": "Saya belum banyak mengenal lingkungan sekolah baru saya (guru, fasilitas, prestasi, dll)",
    "bidangKode": "S",
    "bidang": "Sosial",
    "rumusanKebutuhan": "Mudah beradaptasi dengan lingkungan sekolah baru",
    "materi": "Adaptasi di lingkungan sekolah baru",
    "tujuanLayanan": "Peserta didik/konseli mudah beradaptasi dengan lingkungan sekolah baru",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 25,
    "pernyataan": "Saya merasa sulit bergaul/kaku dengan teman-teman di sekolah",
    "bidangKode": "S",
    "bidang": "Sosial",
    "rumusanKebutuhan": "Kemudahan bergaul dengan teman-teman di sekolah",
    "materi": "Kiat membina hubungan dengan teman",
    "tujuanLayanan": "Peserta didik/konseli dapat mudah bergaul dengan teman-teman di sekolah",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Individual"
  },
  {
    "no": 26,
    "pernyataan": "Saya ingin  menyelesaikan  masalah dengan teman bermain",
    "bidangKode": "S",
    "bidang": "Sosial",
    "rumusanKebutuhan": "Kemampuan mengatasi masalah dengan teman di sekolah",
    "materi": "Menyelesaikan  masalah dengan teman",
    "tujuanLayanan": "Peserta didik/konseli mampu mengatasi masalah dengan teman di sekolah",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Kelompok"
  },
  {
    "no": 27,
    "pernyataan": "Saya belum banyak teman atau sahabat",
    "bidangKode": "S",
    "bidang": "Sosial",
    "rumusanKebutuhan": "Kemudahan mencari dan disenangi teman",
    "materi": "Kiat mencari dan disenangi teman",
    "tujuanLayanan": "Peserta didik/konseli mudah mencarai dan disenangi teman",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 28,
    "pernyataan": "Saya belum tahu tentang bullying dan cara mensikapinya",
    "bidangKode": "S",
    "bidang": "Sosial",
    "rumusanKebutuhan": "Memahami tentang bullying dan cara mensikapinya",
    "materi": "Stop bulliying",
    "tujuanLayanan": "Peserta didik/konseli dapat memahami tentang bullying dan cara mensikapinya",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 29,
    "pernyataan": "Saya sering lupa waktu ketika bermain/membuka medsos (fb, wa, dll)",
    "bidangKode": "S",
    "bidang": "Sosial",
    "rumusanKebutuhan": "Mengendalikan penggunaan medsos sesuai kebutuhan",
    "materi": "Mengelola sarana media sosial",
    "tujuanLayanan": "Peserta didik/konseli dapat mengendalikan penggunaan medsos sesuai kebutuhan",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 30,
    "pernyataan": "Saya merasa malu jika bergaul dengan teman yang beda jenis kelamin",
    "bidangKode": "S",
    "bidang": "Sosial",
    "rumusanKebutuhan": "Dapat berinteraksi dengan lawan jenis sesuai norma yang berlaku",
    "materi": "Mengenal norma kehidupan",
    "tujuanLayanan": "Peserta didik/konseli dapat berinteraksi dengan lawan jenis sesuai norma yang berlaku",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 31,
    "pernyataan": "Saya jarang bermain/berteman di lingkungan tempat saya tinggal",
    "bidangKode": "S",
    "bidang": "Sosial",
    "rumusanKebutuhan": "Kesadaran sebagai makhluk sosial yang harus berinteraksi",
    "materi": "Manusia sebagai makhluk sosial",
    "tujuanLayanan": "Peserta didik/konseli memiliki Kesadaran sebagai makhluk sosial yang harus berinteraksi",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 32,
    "pernyataan": "Orang tua saya tidak peduli dengan kegiatan belajar saya",
    "bidangKode": "B",
    "bidang": "Belajar",
    "rumusanKebutuhan": "Kesadaran orang tua untuk peduli pada kegiatan belajar anaknya",
    "materi": "Kiat agar orang tua peduli dengan kegiatan belajar kita",
    "tujuanLayanan": "Peserta didik/konseli memiliki kesadaran orang tua untuk peduli pada kegiatan belajar anaknya",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Individual"
  },
  {
    "no": 33,
    "pernyataan": "Saya masih kesulitan dalam memahami pelajaran tertentu",
    "bidangKode": "B",
    "bidang": "Belajar",
    "rumusanKebutuhan": "Kemudahan memaham pelajaran",
    "materi": "Identifikasi kesulitan belajar",
    "tujuanLayanan": "Peserta didik/konseli memperoleh kemudahan memaham pelajaran",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Individual"
  },
  {
    "no": 34,
    "pernyataan": "Saya merasa tidak disiplin kalau belajar di rumah sendiri",
    "bidangKode": "B",
    "bidang": "Belajar",
    "rumusanKebutuhan": "Melakukan disiplin belajar",
    "materi": "Pentingnya disiplin belajar",
    "tujuanLayanan": "Peserta didik/konseli dapat melakukan disiplin belajar",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 35,
    "pernyataan": "Saya belajarnya jika akan ada ulangan atau ujian saja",
    "bidangKode": "B",
    "bidang": "Belajar",
    "rumusanKebutuhan": "Melakukan kebiasaan belajar",
    "materi": "Tanggung jawab seorang siswa",
    "tujuanLayanan": "Peserta didik/konseli dapat melakukan kebiasaan belajar",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 36,
    "pernyataan": "Saya belajar di rumah kalau disuruh/diperintah orang tua",
    "bidangKode": "B",
    "bidang": "Belajar",
    "rumusanKebutuhan": "Memiliki kebiasaan belajar di rumah",
    "materi": "Cara belajar di rumah",
    "tujuanLayanan": "Peserta didik/konseli dapat belajar di rumah",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 37,
    "pernyataan": "Saya sering menunda-nunda pekerjaan sekolah",
    "bidangKode": "B",
    "bidang": "Belajar",
    "rumusanKebutuhan": "Kemampuan untuk tidak  menunda pekerjaan sekolah",
    "materi": "Bahaya menunda pekerjaan sekolah",
    "tujuanLayanan": "Peserta didik/konseli tidak menunda pekerjaan sekolah",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Individual"
  },
  {
    "no": 38,
    "pernyataan": "Saya belum tahu cara meraih prestasi di sekolah",
    "bidangKode": "B",
    "bidang": "Belajar",
    "rumusanKebutuhan": "Memperoleh atau meraih prestasi di sekolah",
    "materi": "Kiat sukses meraih prestasi",
    "tujuanLayanan": "Peserta didik/konseli dapat memperoleh atau meraih prestasi di sekolah",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 39,
    "pernyataan": "Saya selalu malas untuk belajar",
    "bidangKode": "B",
    "bidang": "Belajar",
    "rumusanKebutuhan": "Memiliki Motivasi belajar",
    "materi": "Pentingnya motivasi belajar",
    "tujuanLayanan": "Peserta didik/konseli memiliki Motivasi belajar",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 40,
    "pernyataan": "Saya belum terbiasa belajar kelompok, biasanya saya selalu belajar sendiri",
    "bidangKode": "B",
    "bidang": "Belajar",
    "rumusanKebutuhan": "Melakukan belajar kelompok yang baik",
    "materi": "Cara belajar kelompok",
    "tujuanLayanan": "Peserta didik/konseli dapat melakukan belajar kelompok yang baik",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 41,
    "pernyataan": "Saya belum paham cara yang baik belajar di sekolah baru (SMP/MTs)",
    "bidangKode": "B",
    "bidang": "Belajar",
    "rumusanKebutuhan": "Pemahaman cara belajar di SMP/MTs yang baik",
    "materi": "Cara belajar di sekolah baru",
    "tujuanLayanan": "Peserta didik/konseli memiliki pemahaman tentang cara belajar di SMP/MTs yang baik",
    "komponenLayanan": "Dasar",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 42,
    "pernyataan": "Saya belum ada teman yang cocok untuk belajar bersama",
    "bidangKode": "B",
    "bidang": "Belajar",
    "rumusanKebutuhan": "Menemukan cara belajar yang sesuai",
    "materi": "Cara mencari teman yang cocok untuk belajar bersama",
    "tujuanLayanan": "Peserta didik/konseli dapat menemukan cara belajar yang sesuai",
    "komponenLayanan": "Responsif",
    "strategiLayanan": "Konseling Individual"
  },
  {
    "no": 43,
    "pernyataan": "Saya belum tahu cara memperoleh bantuan pendidikan (beasiswa)",
    "bidangKode": "K",
    "bidang": "Karir",
    "rumusanKebutuhan": "Memperoleh informasi beasiswa",
    "materi": "Cara mendapatkan beasiswa",
    "tujuanLayanan": "Peserta didik/konseli dapat memperoleh informasi beasiswa",
    "komponenLayanan": "Pem&Perenc Indv",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 44,
    "pernyataan": "Saya terpaksa harus bekerja untuk mencukupi kebutuhan hidup",
    "bidangKode": "K",
    "bidang": "Karir",
    "rumusanKebutuhan": "Kemampuan mengatur waktu bekerja dan sekolah",
    "materi": "Cara mengatur waktu belajar sambil bekerja",
    "tujuanLayanan": "Peserta didik/konseli memiliki kemampuan mengatur waktu bekerja dan sekolah",
    "komponenLayanan": "Pem&Perenc Indv",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 45,
    "pernyataan": "Saya merasa bingung memilih kegiatan esktrakurikuler di sekolah",
    "bidangKode": "K",
    "bidang": "Karir",
    "rumusanKebutuhan": "Memilih Ekskul yang sesuai",
    "materi": "Cara memilih kegiatan ekstra kurikuler yang sesuai",
    "tujuanLayanan": "Peserta didik/konseli dapat memilih Ekskul yang sesuai",
    "komponenLayanan": "Pem&Perenc Indv",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 46,
    "pernyataan": "Saya merasa pesimis bisa naik kelas",
    "bidangKode": "K",
    "bidang": "Karir",
    "rumusanKebutuhan": "Memiliki Sikap optimis dapat naik kelas",
    "materi": "Optimis untuk naik kelas",
    "tujuanLayanan": "Peserta didik/konseli memiliki Sikap optimis dapat naik kelas",
    "komponenLayanan": "Pem&Perenc Indv",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 47,
    "pernyataan": "Saya belum mempunyai cita-cita yang pasti",
    "bidangKode": "K",
    "bidang": "Karir",
    "rumusanKebutuhan": "Mengidentifikasi cita-cita yang sesuai dengan dirinya",
    "materi": "Cita-cita karirku",
    "tujuanLayanan": "Peserta didik/konseli dapat mengidentifikasi cita-cita yang sesuai dengan dirinya",
    "komponenLayanan": "Pem&Perenc Indv",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 48,
    "pernyataan": "Saya belum banyak tahu tentang jenis-jenis pekerjaan di masyakarat",
    "bidangKode": "K",
    "bidang": "Karir",
    "rumusanKebutuhan": "Pemahaman mengenai jenis-jenis profesi di masyarakat",
    "materi": "Jenis pekerjaan dan prospeknya",
    "tujuanLayanan": "Peserta didik/konseli mampu memahami mengenai jenis-jenis profesi di masyarakat",
    "komponenLayanan": "Pem&Perenc Indv",
    "strategiLayanan": "Bimbingan Klasikal"
  },
  {
    "no": 49,
    "pernyataan": "Saya belum tahu tentang osis dan kegiatannya",
    "bidangKode": "K",
    "bidang": "Karir",
    "rumusanKebutuhan": "Mengenal osis dan kegiataannya",
    "materi": "Mengenal osis dan kegiataannya",
    "tujuanLayanan": "Peserta didik/konseli dapat mengenal osis dan kegiataannya",
    "komponenLayanan": "Pem&Perenc Indv",
    "strategiLayanan": "Bimbingan Kelas besar"
  },
  {
    "no": 50,
    "pernyataan": "saya merasa belum paham hubungan antara hobi, bakat, minat dan kemampuan",
    "bidangKode": "K",
    "bidang": "Karir",
    "rumusanKebutuhan": "Memahami hubungan hobi, bakat, minat dan kemampuan",
    "materi": "Mengenal bakat, minat, hobi dan karir",
    "tujuanLayanan": "Peserta didik/konseli dapat memahami hubungan hobi, bakat, minat dan kemampuan",
    "komponenLayanan": "Pem&Perenc Indv",
    "strategiLayanan": "Bimbingan Klasikal"
  }
];

const getSavedAkpdMaster = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('simbk_custom_akpd_master');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

export const AKPD_MASTER = getSavedAkpdMaster() || DEFAULT_AKPD_MASTER;

export const saveCustomAkpd = (newMaster) => {
  localStorage.setItem('simbk_custom_akpd_master', JSON.stringify(newMaster));
  // Mutate in place so current session sees it
  AKPD_MASTER.splice(0, AKPD_MASTER.length, ...newMaster);
};

export const resetCustomAkpd = () => {
  localStorage.removeItem('simbk_custom_akpd_master');
  AKPD_MASTER.splice(0, AKPD_MASTER.length, ...DEFAULT_AKPD_MASTER);
};
