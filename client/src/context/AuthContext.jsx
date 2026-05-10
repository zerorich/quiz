/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const refreshUser = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
      return response.data.user
    } catch {
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      refreshUser,
    }),
    [user, loading, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
