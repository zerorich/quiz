import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children }) {
  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function verifySession() {
      try {
        const response = await fetch('https://quiz-production-19b3.up.railway.app/auth/me', { credentials: 'include' })
        if (!active) return
        if (!response.ok) { setUser(null); setLoading(false); return }
        const data = await response.json()
        setUser(data.user || null)
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
  return children
}

export default ProtectedRoute
