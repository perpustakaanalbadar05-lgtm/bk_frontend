import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../lib/axios'

const RoleContext = createContext()

// Default menu permissions per role
const DEFAULT_MENUS = {
  super_admin: ['dashboard', 'siswa', 'klasikal', 'konseling', 'kasus', 'asesmen', 'program-bk', 'laporan', 'settings'],
  kepala_sekolah: ['dashboard', 'siswa', 'konseling', 'kasus', 'laporan'],
  pengawas: ['dashboard', 'siswa', 'klasikal', 'konseling', 'kasus', 'asesmen', 'program-bk', 'laporan'],
}

const ROLE_LABELS = {
  super_admin: 'Super Admin (Guru BK)',
  kepala_sekolah: 'Kepala Sekolah',
  pengawas: 'Pengawas',
  murid: 'Murid / Siswa',
  orang_tua: 'Orang Tua',
}

export function RoleProvider({ children }) {
  // Portal accounts list — now from DB API (managed by authenticated guru_bk)
  const [accounts, setAccounts] = useState([])
  const [accountsLoading, setAccountsLoading] = useState(false)

  // Role visibility settings (can still be local for UX speed)
  const [roleMenus, setRoleMenus] = useState(() => {
    const saved = localStorage.getItem('simbk_role_menus')
    return saved ? JSON.parse(saved) : DEFAULT_MENUS
  })

  // Current portal session (for non-admin portals)
  const [portalUser, setPortalUser] = useState(() => {
    const saved = localStorage.getItem('simbk_portal_user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    localStorage.setItem('simbk_role_menus', JSON.stringify(roleMenus))
  }, [roleMenus])

  useEffect(() => {
    if (portalUser) {
      localStorage.setItem('simbk_portal_user', JSON.stringify(portalUser))
    } else {
      localStorage.removeItem('simbk_portal_user')
    }
  }, [portalUser])

  // ── Fetch portal accounts from DB (called when guru_bk is authenticated) ──
  const fetchAccounts = useCallback(async () => {
    setAccountsLoading(true)
    try {
      const res = await api.get('/portal-accounts')
      setAccounts(res.data)
    } catch (e) {
      console.warn('Gagal memuat akun portal:', e)
    } finally {
      setAccountsLoading(false)
    }
  }, [])

  // ── Create portal account via backend ────────────────────────────────────
  const createAccount = useCallback(async (accountData) => {
    const res = await api.post('/portal-accounts', accountData)
    setAccounts(prev => [res.data, ...prev])
    return res.data
  }, [])

  // ── Update portal account (menus, etc.) ──────────────────────────────────
  const updateAccount = useCallback(async (id, data) => {
    const res = await api.put(`/portal-accounts/${id}`, data)
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...res.data } : a))
    return res.data
  }, [])

  // ── Delete portal account ────────────────────────────────────────────────
  const deleteAccount = useCallback(async (id) => {
    await api.delete(`/portal-accounts/${id}`)
    setAccounts(prev => prev.filter(a => a.id !== id))
  }, [])

  // ── Portal login — calls backend, NO plaintext password in localStorage ──
  const loginPortal = useCallback(async (username, password, userId = null) => {
    try {
      const res = await api.post('/portal/login', { username, password, user_id: userId })
      const { account } = res.data
      setPortalUser(account)
      return { success: true, account }
    } catch (err) {
      const message = err?.response?.data?.message || 'Username atau password salah.'
      return { success: false, message }
    }
  }, [])

  const logoutPortal = () => {
    setPortalUser(null)
  }

  const updateRoleMenus = (role, menus) => {
    setRoleMenus(prev => ({ ...prev, [role]: menus }))
    // Persist to account in DB if it's a specific portal account role
    // (for simplicity, we keep the role menu config in localStorage for now)
  }

  const getVisibleMenus = (role) => {
    return roleMenus[role] || DEFAULT_MENUS[role] || []
  }

  return (
    <RoleContext.Provider value={{
      accounts,
      accountsLoading,
      roleMenus,
      portalUser,
      fetchAccounts,
      createAccount,
      updateAccount,
      deleteAccount,
      loginPortal,
      logoutPortal,
      updateRoleMenus,
      getVisibleMenus,
      ROLE_LABELS,
      DEFAULT_MENUS,
    }}>
      {children}
    </RoleContext.Provider>
  )
}

export const useRole = () => {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
