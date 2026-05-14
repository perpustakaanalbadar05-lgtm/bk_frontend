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
import DashboardLayout from './layouts/DashboardLayout'
import { AuthProvider } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'
import { DataProvider } from './contexts/DataContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <DataProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#191265',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.1)',
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
      </SettingsProvider>
    </AuthProvider>
  )
}

export default App
