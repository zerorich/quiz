import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data.users)
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    if (!user.isAdmin) { navigate('/', { replace: true }); return }
    fetchUsers()
  }, [user, navigate, fetchUsers])

  const handleToggleBlock = async (userId, isBlocked) => {
    setTogglingId(userId)
    try {
      const res = await api.patch(`/admin/users/${userId}/block`)
      setUsers(prev => prev.map(u => u._id === userId ? res.data.user : u))
    } catch (e) {
      alert(e.response?.data?.message || 'Error')
    } finally {
      setTogglingId(null)
    }
  }

  if (!user || !user.isAdmin) return null

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      padding: '32px 24px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{
              fontFamily: "'Lora', serif",
              fontSize: '1.8rem',
              fontWeight: 600,
              color: 'var(--text)',
              margin: '0 0 4px',
            }}>
              Admin Panel
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
              User management
            </p>
          </div>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => navigate('/categories')}
          >
            ← Back
          </button>
        </div>

        {/* Content */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '48px 1fr 1fr auto auto',
            gap: 16,
            padding: '12px 20px',
            borderBottom: '1px solid var(--border)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            <span></span>
            <span>Name</span>
            <span>Email</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {/* States */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
              <div className="spinner" />
            </div>
          )}
          {error && (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--error)' }}>{error}</div>
          )}
          {!loading && !error && users.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</div>
          )}

          {/* Rows */}
          {!loading && !error && users.map((u, i) => {
            const isSelf = u._id === user._id
            const isToggling = togglingId === u._id
            return (
              <div
                key={u._id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 1fr 1fr auto auto',
                  gap: 16,
                  padding: '14px 20px',
                  alignItems: 'center',
                  borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none',
                  opacity: u.isBlocked ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                  background: u.isBlocked ? 'rgba(248,113,113,0.03)' : 'transparent',
                }}
              >
                {/* Avatar */}
                <div style={{ width: 36, height: 36 }}>
                  {u.photo ? (
                    <img
                      src={u.photo}
                      alt=""
                      style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                    />
                  ) : (
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'var(--surface2)',
                      border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, color: 'var(--text-muted)',
                    }}>
                      {(u.displayName || '?')[0].toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div>
                  <span style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: 500 }}>
                    {u.displayName || '—'}
                  </span>
                  {u.isAdmin && (
                    <span style={{
                      marginLeft: 8, fontSize: '0.7rem', fontWeight: 600,
                      color: 'var(--accent)', background: 'var(--accent-dim)',
                      padding: '2px 6px', borderRadius: 4,
                    }}>Admin</span>
                  )}
                  {isSelf && (
                    <span style={{
                      marginLeft: 8, fontSize: '0.7rem', fontWeight: 600,
                      color: 'var(--text-muted)', background: 'var(--surface2)',
                      padding: '2px 6px', borderRadius: 4,
                    }}>You</span>
                  )}
                </div>

                {/* Email */}
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.email || '—'}
                </span>

                {/* Status badge */}
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: 20,
                  background: u.isBlocked ? 'rgba(248,113,113,0.12)' : 'rgba(74,222,128,0.12)',
                  color: u.isBlocked ? 'var(--error)' : 'var(--success)',
                  border: `1px solid ${u.isBlocked ? 'rgba(248,113,113,0.25)' : 'rgba(74,222,128,0.25)'}`,
                  whiteSpace: 'nowrap',
                }}>
                  {u.isBlocked ? 'Blocked' : 'Active'}
                </span>

                {/* Action */}
                <button
                  type="button"
                  disabled={isSelf || isToggling}
                  onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: `1px solid ${u.isBlocked ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                    background: 'transparent',
                    color: u.isBlocked ? 'var(--success)' : 'var(--error)',
                    cursor: isSelf || isToggling ? 'not-allowed' : 'pointer',
                    opacity: isSelf ? 0.3 : 1,
                    transition: 'background 0.2s',
                    whiteSpace: 'nowrap',
                    minWidth: 80,
                  }}
                  onMouseEnter={e => {
                    if (!isSelf && !isToggling) {
                      e.currentTarget.style.background = u.isBlocked
                        ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)'
                    }
                  }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  {isToggling ? '...' : u.isBlocked ? 'Unblock' : 'Block'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        {!loading && !error && users.length > 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 16 }}>
            {users.length} user{users.length !== 1 ? 's' : ''} total
          </p>
        )}
      </div>
    </div>
  )
}

export default AdminPage
