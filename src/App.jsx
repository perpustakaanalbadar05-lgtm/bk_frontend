import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SiswaPage from './pages/SiswaPage'
import KonselingPage from './pages/KonselingPage'
import ProgramBKPage from './pages/ProgramBKPage'
import AsesmenPage from './pages/AsesmenPage'
import LaporanPage from './pages/LaporanPage'
import SettingsPage from './pages/SettingsPage'
import KlasikalPage from './pages/KlasikalPage'
import KasusPage from './pages/KasusPage'
import IsiAkpdPage from './pages/IsiAkpdPage'
import PortalLoginPage from './pages/PortalLoginPage'
import PortalKepalaSekolah from './pages/PortalKepalaSekolah'
import PortalOrangTua from './pages/PortalOrangTua'
import PortalMurid from './pages/PortalMurid'
import DashboardLayout from './layouts/DashboardLayout'
import { AuthProvider } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { DataProvider } from './contexts/DataContext'
import { RoleProvider } from './contexts/RoleContext'
import ProtectedRoute from './components/ProtectedRoute'

import SuperAdminLayout from './layouts/SuperAdminLayout'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import ManageGuruBkPage from './pages/ManageGuruBkPage'

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <RoleProvider>
          <DataProvider>
            <BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  className: 'bg-white dark:bg-dark-900 text-dark-950 dark:text-white border border-dark-200 dark:border-white/10 shadow-lg',
                  style: {
                    background: 'rgb(var(--bg-main))',
                    color: 'inherit',
                    border: '1px solid rgba(150, 150, 150, 0.2)'
                  },
                  success: {
                    iconTheme: { primary: '#14b8a6', secondary: '#ffffff' },
                  },
                  error: {
                    iconTheme: { primary: '#f43f5e', secondary: '#ffffff' },
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/isi-asesmen" element={<IsiAkpdPage />} />
                {/* Portal routes */}
                <Route path="/portal/login" element={<PortalLoginPage />} />
                <Route path="/portal/kepala-sekolah" element={<PortalKepalaSekolah />} />
                <Route path="/portal/orang-tua" element={<PortalOrangTua />} />
                <Route path="/portal/murid" element={<PortalMurid />} />
                
                {/* Super Admin Routes */}
                <Route
                  path="/super-admin"
                  element={
                    <ProtectedRoute>
                      <SuperAdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<SuperAdminDashboard />} />
                  <Route path="guru-bk" element={<ManageGuruBkPage />} />
                </Route>

                {/* Admin dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="siswa" element={<SiswaPage />} />
                  <Route path="klasikal" element={<KlasikalPage />} />
                  <Route path="konseling" element={<KonselingPage />} />
                  <Route path="kasus" element={<KasusPage />} />
                  <Route path="program-bk" element={<ProgramBKPage />} />
                  <Route path="asesmen" element={<AsesmenPage />} />
                  <Route path="laporan" element={<LaporanPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </DataProvider>
        </RoleProvider>
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App
