'use client'
import RefreshToken from '@/components/refresh-token'
import { decodedToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false
    }
  }
})

const AppContext = createContext({
  isAuth: false,
  role: undefined as RoleType | undefined,
  setRole: (role?: RoleType | undefined) => {}
})

export const useAppContext = () => {
  return useContext(AppContext)
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<RoleType | undefined>()
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage()
    if (accessToken) {
      const role = decodedToken(accessToken).role
      setRoleState(role)
    }
  }, [])

  // Nếu dùng nextjs 15 và react 19 thì không cần dùng useCallback
  const setRole = useCallback((role?: RoleType | undefined) => {
    setRoleState(role)
    if (!role) {
      removeTokensFromLocalStorage()
    }
  }, [])

  const isAuth = Boolean(role)
  return (
    // Nếu dùng nextjs 15 và react 19 thì chỉ cần dùng <AppContext></AppContext>
    <AppContext.Provider value={{ role, setRole, isAuth }}>
      <QueryClientProvider client={queryClient}>
        {children}
        <RefreshToken />
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
