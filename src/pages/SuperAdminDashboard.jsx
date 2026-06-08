import { useState, useEffect } from 'react'
import { RiTeamLine, RiFolderUserLine, RiFileList3Line, RiCalendarCheckLine } from 'react-icons/ri'
import api from '../lib/axios'
import toast from 'react-hot-toast'

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/super-admin/dashboard')
        setStats(res.data)
      } catch (err) {
        toast.error('Gagal memuat statistik')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-white/10 rounded-2xl"></div>)}
      </div>
    </div>
  }

  const statCards = [
    { title: 'Total Guru BK', value: stats?.total_guru_bk || 0, icon: RiTeamLine, color: 'bg-blue-500' },
    { title: 'Total Siswa', value: stats?.total_students || 0, icon: RiFolderUserLine, color: 'bg-primary-500' },
    { title: 'Total Kasus', value: stats?.total_cases || 0, icon: RiFileList3Line, color: 'bg-red-500' },
    { title: 'Total Konseling', value: stats?.total_sessions || 0, icon: RiCalendarCheckLine, color: 'bg-emerald-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">Dashboard Utama</h1>
        <p className="text-gray-500 dark:text-dark-200">Ringkasan data seluruh instansi/akun Guru BK.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${stat.color}`}>
                <stat.icon className="text-2xl" />
              </div>
            </div>
            <h3 className="text-gray-500 dark:text-dark-300 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
