import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

function AdminRoute({ children }) {
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function verifySession() {
      try {
        const response = await api.get('/auth/me')
        if (!active) return
        setUser(response.data.user || null)
        setLoading(false)
      } catch {
        if (active) { setUser(null); setLoading(false) }
      }
    }
    verifySession()
    return () => { active = false }
  }, [setUser])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="spinner" />
    </div>
  )

  if (!user) return <Navigate to="/" replace />
  if (!user.isAdmin) return <Navigate to="/categories" replace />
  return children
}

export default AdminRoute
