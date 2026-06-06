import { createContext, useContext, useState, useEffect } from 'react'

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
}

export function RoleProvider({ children }) {
  // Portal accounts list (managed by super admin)
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('simbk_accounts')
    return saved ? JSON.parse(saved) : []
  })

  // Role visibility settings per role type
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
    localStorage.setItem('simbk_accounts', JSON.stringify(accounts))
  }, [accounts])

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

  const createAccount = (accountData) => {
    const newAccount = {
      id: Date.now().toString(),
      ...accountData,
      createdAt: new Date().toISOString(),
    }
    setAccounts(prev => [...prev, newAccount])
    return newAccount
  }

  const updateAccount = (id, data) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, ...data } : a))
  }

  const deleteAccount = (id) => {
    setAccounts(prev => prev.filter(a => a.id !== id))
  }

  const loginPortal = (username, password) => {
    const account = accounts.find(
      a => (a.username === username || a.email === username) && a.password === password
    )
    if (!account) return { success: false, message: 'Username atau password salah.' }
    setPortalUser(account)
    return { success: true, account }
  }

  const logoutPortal = () => {
    setPortalUser(null)
  }

  const updateRoleMenus = (role, menus) => {
    setRoleMenus(prev => ({ ...prev, [role]: menus }))
  }

  const getVisibleMenus = (role) => {
    return roleMenus[role] || DEFAULT_MENUS[role] || []
  }

  return (
    <RoleContext.Provider value={{
      accounts,
      roleMenus,
      portalUser,
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
