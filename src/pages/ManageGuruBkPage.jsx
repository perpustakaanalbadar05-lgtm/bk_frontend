import { useState, useEffect } from 'react'
import { RiAddLine, RiEditLine, RiDeleteBinLine } from 'react-icons/ri'
import api from '../lib/axios'
import toast from 'react-hot-toast'
import Modal from '../components/Modal'

export default function ManageGuruBkPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    nip: '',
    hp: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/super-admin/guru-bk')
      setUsers(res.data)
    } catch (err) {
      toast.error('Gagal memuat data Guru BK')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingId(user.id)
      setForm({ name: user.name, email: user.email, nip: user.nip || '', hp: user.hp || '', password: '' })
    } else {
      setEditingId(null)
      setForm({ name: '', email: '', password: '', nip: '', hp: '' })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/super-admin/guru-bk/${editingId}`, form)
        toast.success('Data berhasil diperbarui')
      } else {
        await api.post('/super-admin/guru-bk', form)
        toast.success('Guru BK berhasil ditambahkan')
      }
      setIsModalOpen(false)
      fetchUsers()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Terjadi kesalahan')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus akun Guru BK ini? Semua data terkait (Siswa, Kasus, dll) yang dimiliki akun ini bisa ikut terhapus!')) {
      try {
        await api.delete(`/super-admin/guru-bk/${id}`)
        toast.success('Akun berhasil dihapus')
        fetchUsers()
      } catch (err) {
        toast.error('Gagal menghapus akun')
      }
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Manajemen Guru BK</h1>
          <p className="text-gray-500 dark:text-dark-200">Kelola akun akses untuk masing-masing cabang / institusi BK.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <RiAddLine /> Tambah Akun
        </button>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-900 border-b border-gray-100 dark:border-white/5">
                <th className="py-4 px-6 text-sm font-medium text-gray-500 dark:text-dark-300">Nama Instansi / Guru</th>
                <th className="py-4 px-6 text-sm font-medium text-gray-500 dark:text-dark-300">Email</th>
                <th className="py-4 px-6 text-sm font-medium text-gray-500 dark:text-dark-300">NIP/NPSN</th>
                <th className="py-4 px-6 text-sm font-medium text-gray-500 dark:text-dark-300 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">Belum ada akun Guru BK</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-dark-900 transition-colors">
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">{user.name}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-dark-200">{user.email}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-dark-200">{user.nip || '-'}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenModal(user)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors">
                          <RiEditLine />
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Akun Guru BK' : 'Tambah Akun Guru BK'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">Nama / Instansi</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Guru BK SMPN 1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">Email (untuk Login)</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="bk1@sekolah.id" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">Password {editingId && <span className="text-gray-400 font-normal">(kosongkan jika tidak diubah)</span>}</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required={!editingId} minLength={6} className="input-field" placeholder="••••••" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">NIP (Opsional)</label>
              <input type="text" name="nip" value={form.nip} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-200 mb-1">No HP (Opsional)</label>
              <input type="text" name="hp" value={form.hp} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Batal</button>
            <button type="submit" className="btn-primary">Simpan</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
