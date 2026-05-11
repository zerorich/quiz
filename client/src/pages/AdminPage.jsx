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

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState(null)
  const [form, setForm] = useState({ username: '', password: '', displayName: '', email: '', isAdmin: false })

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

  const handleCreateUser = async () => {
    if (!form.username || !form.password) {
      setCreateError('Username and password are required')
      return
    }
    setCreating(true)
    setCreateError(null)
    try {
      const res = await api.post('/admin/users', form)
      setUsers(prev => [res.data.user, ...prev])
      setShowModal(false)
      setForm({ username: '', password: '', displayName: '', email: '', isAdmin: false })
    } catch (e) {
      setCreateError(e.response?.data?.message || 'Failed to create user')
    } finally {
      setCreating(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setCreateError(null)
    setForm({ username: '', password: '', displayName: '', email: '', isAdmin: false })
  }

  if (!user || !user.isAdmin) return null

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 8,
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text)',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '32px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'Lora', serif", fontSize: '1.8rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 4px' }}>
              Admin Panel
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>User management</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: '1px solid var(--accent)',
                background: 'var(--accent)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              + New User
            </button>
            <button type="button" className="btn-ghost" onClick={() => navigate('/categories')}>
              ← Back
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
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
            <span></span><span>Name</span><span>Email</span><span>Status</span><span>Action</span>
          </div>

          {loading && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}><div className="spinner" /></div>}
          {error && <div style={{ padding: 32, textAlign: 'center', color: 'var(--error)' }}>{error}</div>}
          {!loading && !error && users.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</div>}

          {!loading && !error && users.map((u, i) => {
            const isSelf = u._id === user._id
            const isToggling = togglingId === u._id
            return (
              <div key={u._id} style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr 1fr auto auto',
                gap: 16,
                padding: '14px 20px',
                alignItems: 'center',
                borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none',
                opacity: u.isBlocked ? 0.6 : 1,
                transition: 'opacity 0.2s',
                background: u.isBlocked ? 'rgba(248,113,113,0.03)' : 'transparent',
              }}>
                <div style={{ width: 36, height: 36 }}>
                  {u.photo ? (
                    <img src={u.photo} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
                      {(u.displayName || u.username || '?')[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <span style={{ color: 'var(--text)', fontSize: '0.9rem', fontWeight: 500 }}>{u.displayName || u.username || '—'}</span>
                  {u.isAdmin && <span style={{ marginLeft: 8, fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-dim)', padding: '2px 6px', borderRadius: 4 }}>Admin</span>}
                  {isSelf && <span style={{ marginLeft: 8, fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4 }}>You</span>}
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email || '—'}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: u.isBlocked ? 'rgba(248,113,113,0.12)' : 'rgba(74,222,128,0.12)', color: u.isBlocked ? 'var(--error)' : 'var(--success)', border: `1px solid ${u.isBlocked ? 'rgba(248,113,113,0.25)' : 'rgba(74,222,128,0.25)'}`, whiteSpace: 'nowrap' }}>
                  {u.isBlocked ? 'Blocked' : 'Active'}
                </span>
                <button
                  type="button"
                  disabled={isSelf || isToggling}
                  onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                  style={{ fontSize: '0.8rem', fontWeight: 600, padding: '6px 14px', borderRadius: 8, border: `1px solid ${u.isBlocked ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`, background: 'transparent', color: u.isBlocked ? 'var(--success)' : 'var(--error)', cursor: isSelf || isToggling ? 'not-allowed' : 'pointer', opacity: isSelf ? 0.3 : 1, transition: 'background 0.2s', whiteSpace: 'nowrap', minWidth: 80 }}
                  onMouseEnter={e => { if (!isSelf && !isToggling) e.currentTarget.style.background = u.isBlocked ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  {isToggling ? '...' : u.isBlocked ? 'Unblock' : 'Block'}
                </button>
              </div>
            )
          })}
        </div>

        {!loading && !error && users.length > 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 16 }}>
            {users.length} user{users.length !== 1 ? 's' : ''} total
          </p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          onClick={closeModal}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 24 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, width: '100%', maxWidth: 420 }}
          >
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: '1.3rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 20px' }}>
              Create New User
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Username *</label>
                <input style={inputStyle} value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="username" />
              </div>
              <div>
                <label style={labelStyle}>Password *</label>
                <input style={inputStyle} type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
              </div>
              <div>
                <label style={labelStyle}>Display Name</label>
                <input style={inputStyle} value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} placeholder="John Doe" />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="user@example.com" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={form.isAdmin}
                  onChange={e => setForm(f => ({ ...f, isAdmin: e.target.checked }))}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="isAdmin" style={{ ...labelStyle, margin: 0, textTransform: 'none', cursor: 'pointer' }}>Grant admin privileges</label>
              </div>
            </div>

            {createError && (
              <div style={{ marginTop: 14, padding: '8px 12px', borderRadius: 8, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: 'var(--error)', fontSize: '0.85rem' }}>
                {createError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                type="button"
                onClick={handleCreateUser}
                disabled={creating}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: creating ? 'not-allowed' : 'pointer', opacity: creating ? 0.7 : 1 }}
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={closeModal}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage
