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
export async function exportAkpdRaporToPdf(student, result, conf, namaSekolah = 'Konselia') {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // Header
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('RAPOR DIAGNOSA AKPD', 105, 20, { align: 'center' })
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(namaSekolah, 105, 26, { align: 'center' })
  
  doc.line(14, 30, 196, 30)

  // Student Info
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('DATA SISWA', 14, 40)
  
  doc.setFont('helvetica', 'normal')
  doc.text(`Nama Lengkap   : ${student.nama || '-'}`, 14, 48)
  doc.text(`No. Induk (NIS) : ${student.nis || '-'}`, 14, 54)
  doc.text(`Kelas / Gender  : ${student.kelas || '-'} / ${student.jk === 'L' ? 'Laki-laki' : 'Perempuan'}`, 14, 60)

  // Result Summary
  doc.setFont('helvetica', 'bold')
  doc.text('RINGKASAN HASIL', 120, 40)
  doc.setFont('helvetica', 'normal')
  doc.text(`Total Skor : ${result.totalScore} Masalah`, 120, 48)
  doc.text(`Kategori   : ${result.category}`, 120, 54)

  // Detail Masalah
  doc.setFont('helvetica', 'bold')
  doc.text('PETA DIAGNOSA MASALAH TERPILIH', 14, 75)

  // Table
  const selectedItems = result.selectedItems || []
  const tableRows = selectedItems.map(item => [
    item.no,
    item.pernyataan,
    item.bidang,
    item.strategiLayanan || '-'
  ])

  autoTable(doc, {
    startY: 80,
    head: [['No', 'Pernyataan / Masalah', 'Bidang', 'Layanan']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 90 },
      2: { cellWidth: 35 },
      3: { cellWidth: 45 },
    }
  })

  // Footer (Tanda tangan)
  const finalY = doc.lastAutoTable.finalY + 20
  doc.setFont('helvetica', 'normal')
  doc.text(`Mengetahui,`, 140, finalY)
  doc.text(`Guru Bimbingan Konseling`, 140, finalY + 5)
  doc.line(140, finalY + 25, 190, finalY + 25)

  doc.save(`Rapor_AKPD_${(student.nama || 'Siswa').replace(/\s+/g, '_')}.pdf`)
}
