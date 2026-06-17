/**
 * exportUtils.js
 * Real PDF and Excel export utilities using jsPDF and SheetJS (xlsx).
 */

// ── Excel Export ─────────────────────────────────────────────────────────────

/**
 * Export an array of objects to an Excel (.xlsx) file.
 * @param {object[]} data - Array of row objects
 * @param {string[]} headers - Column header names
 * @param {string} filename - Output filename (without extension)
 * @param {string} sheetName - Worksheet name
 */
export async function exportToExcel(data, headers, filename = 'export', sheetName = 'Data') {
  const XLSX = await import('xlsx')
  
  // Build rows: [headers, ...data rows]
  const rows = [headers, ...data.map(row => headers.map(h => row[h] ?? ''))]
  
  const ws = XLSX.utils.aoa_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

/**
 * Export student data to Excel
 * @param {object[]} siswa
 */
export async function exportSiswaToExcel(siswa) {
  const XLSX = await import('xlsx')
  
  const rows = siswa.map((s, i) => ({
    'No': i + 1,
    'NIS': s.nis || '',
    'Nama Lengkap': s.nama || '',
    'Kelas': s.kelas || '',
    'Jenis Kelamin': s.jk === 'L' ? 'Laki-laki' : 'Perempuan',
    'Status': s.status || '',
    'No. HP': s.hp || '',
    'Alamat': s.alamat || '',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa')

  // Auto column widths
  const maxW = Object.keys(rows[0] || {}).map(k => ({
    wch: Math.max(k.length, ...rows.map(r => String(r[k] || '').length)) + 2
  }))
  ws['!cols'] = maxW

  XLSX.writeFile(wb, `data-siswa-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

/**
 * Export counseling sessions to Excel
 * @param {object[]} sessions
 */
export async function exportSesiToExcel(sessions) {
  const XLSX = await import('xlsx')

  const rows = sessions.map((s, i) => ({
    'No': i + 1,
    'Nama Siswa': s.siswa || s.student?.nama || '',
    'Kelas': s.kelas || '',
    'Tanggal': s.tanggal || '',
    'Topik': s.topik || '',
    'Jenis': s.jenis || '',
    'Durasi': s.durasi || '',
    'Status': s.status || '',
    'Ringkasan': s.ringkasan || '',
    'Tanda Tangan Digital': s.signature ? 'Ya' : 'Tidak',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sesi Konseling')
  XLSX.writeFile(wb, `konseling-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

/**
 * Export kasus (disciplinary cases) to Excel
 * @param {object[]} kasus
 */
export async function exportKasusToExcel(kasus) {
  const XLSX = await import('xlsx')

  const rows = kasus.map((k, i) => ({
    'No': i + 1,
    'Nama Siswa': k.siswa || k.student?.nama || '',
    'Kelas': k.kelas || '',
    'Tanggal': k.date || '',
    'Kasus / Pelanggaran': k.kasus || '',
    'Poin': k.poin || 0,
    'Status': k.status || '',
    'Home Visit': k.visit ? 'Ya' : 'Tidak',
    'Konseling': k.konseling ? 'Ya' : 'Tidak',
    'Panggilan Ortu': k.panggilan ? 'Ya' : 'Tidak',
  }))

  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Kasus Kedisiplinan')
  XLSX.writeFile(wb, `kasus-${new Date().toISOString().slice(0, 10)}.xlsx`)
}

// ── PDF Export ───────────────────────────────────────────────────────────────

/**
 * Export a simple table to PDF using jsPDF + autotable
 * @param {string} title
 * @param {string[]} columns - Column header labels
 * @param {any[][]} rows - 2D array of row values
 * @param {string} filename
 */
export async function exportToPdf(title, columns, rows, filename = 'export') {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 14, 16)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 22)

  autoTable(doc, {
    startY: 26,
    head: [columns],
    body: rows,
    theme: 'striped',
    headStyles: { fillColor: [99, 102, 241], fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [245, 247, 250] },
  })

  doc.save(`${filename}-${new Date().toISOString().slice(0, 10)}.pdf`)
}

/**
 * Export siswa list to PDF
 */
export async function exportSiswaToPdf(siswa, namaSekolah = 'Konselia') {
  const columns = ['No', 'NIS', 'Nama', 'Kelas', 'J/K', 'Status', 'HP']
  const rows = siswa.map((s, i) => [
    i + 1,
    s.nis || '',
    s.nama || '',
    s.kelas || '',
    s.jk === 'L' ? 'L' : 'P',
    s.status || '',
    s.hp || '-',
  ])
  await exportToPdf(`Data Siswa Binaan — ${namaSekolah}`, columns, rows, 'data-siswa')
}

/**
 * Export individual AKPD Rapor to PDF
 */
export async function exportAkpdRaporToPdf(student, result, conf, sekolah = {}, user = {}) {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // KOP SURAT
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text((sekolah?.yayasan || 'DINAS PENDIDIKAN DAN KEBUDAYAAN').toUpperCase(), 105, 16, { align: 'center' })
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text((sekolah?.nama || 'UNIT PELAKSANA TEKNIS BIMBINGAN KONSELING').toUpperCase(), 105, 23, { align: 'center' })
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(sekolah?.alamat || 'Jalan Raya Pendidikan No. 101, Pamekasan', 105, 29, { align: 'center' })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.text(sekolah?.kontak || 'Email: bk@sekolah.sch.id | Telp: (0324) 321456', 105, 34, { align: 'center' })

  // Garis KOP ganda
  doc.setLineWidth(0.5)
  doc.line(14, 38, 196, 38)
  doc.setLineWidth(1.0)
  doc.line(14, 39.5, 196, 39.5)

  // Judul
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`RAPOR DIAGNOSA ${conf?.title || 'AKPD'}`, 105, 50, { align: 'center' })
  
  // Detail Siswa
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('DATA IDENTITAS', 14, 65)
  
  doc.setFont('helvetica', 'normal')
  doc.text(`Nama Lengkap   : ${student.nama || '-'}`, 14, 72)
  doc.text(`No. Induk (NIS) : ${student.nis || '-'}`, 14, 78)
  doc.text(`Kelas / Gender  : ${student.kelas || '-'} / ${student.jk === 'L' ? 'Laki-laki' : student.jk === 'P' ? 'Perempuan' : '-'}`, 14, 84)

  // Result Summary
  doc.setFont('helvetica', 'bold')
  doc.text('RINGKASAN HASIL', 120, 65)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total Skor : ${result.totalScore} Masalah`, 120, 72)
  doc.text(`Kategori   : ${result.category}`, 120, 78)

  // Detail Masalah
  doc.setFont('helvetica', 'bold')
  doc.text('PETA DIAGNOSA MASALAH TERPILIH', 14, 95)

  // Table
  const selectedItems = result.selectedItems || []
  const tableRows = selectedItems.map((item, idx) => [
    idx + 1,
    item.pernyataan,
    item.bidang,
    item.strategiLayanan || '-'
  ])

  autoTable(doc, {
    startY: 100,
    head: [['No', 'Pernyataan / Masalah', 'Bidang', 'Layanan']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [51, 65, 85], fontStyle: 'bold', fontSize: 9, halign: 'center' },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 90 },
      2: { cellWidth: 35, halign: 'center' },
      3: { cellWidth: 45, halign: 'center' },
    }
  })

  // Footer (Tanda tangan)
  const finalY = doc.lastAutoTable.finalY + 20
  
  // Tanggal
  const today = new Date();
  const formattedDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const kota = sekolah?.alamat?.split(',')[0] || 'Pamekasan';

  doc.setFont('helvetica', 'normal')
  doc.text(`${kota}, ${formattedDate}`, 130, finalY)
  doc.text(`Guru Bimbingan Konseling`, 130, finalY + 6)
  
  doc.setFont('helvetica', 'bold')
  doc.text(user?.name || 'Guru Pembimbing BK', 130, finalY + 25)
  doc.setFont('helvetica', 'normal')
  doc.text(user?.nip ? `NIP. ${user.nip}` : 'NIP. -', 130, finalY + 30)

  // Mengetahui Kepala Sekolah
  doc.text(`Mengetahui,`, 14, finalY)
  doc.text(`Kepala Sekolah`, 14, finalY + 6)

  doc.setFont('helvetica', 'bold')
  doc.text(sekolah?.kepsek || 'Nama Kepala Sekolah', 14, finalY + 25)
  doc.setFont('helvetica', 'normal')
  doc.text(sekolah?.nip_kepsek ? `NIP. ${sekolah.nip_kepsek}` : 'NIP. -', 14, finalY + 30)

  doc.save(`Rapor_AKPD_${(student.nama || 'Siswa').replace(/\s+/g, '_')}.pdf`)
}
