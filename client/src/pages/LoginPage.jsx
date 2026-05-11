import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      })

      setUser(response.data.user)
      navigate('/categories', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 70%), var(--bg)',
      }}
    >
      <div
        className="fade-up"
        style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            fontSize: 28,
          }}
        >
          📚
        </div>

        <h1
          style={{
            fontFamily: "'Lora', serif",
            fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
            fontWeight: 600,
            color: 'var(--text)',
            margin: '0 0 24px',
            lineHeight: 1.2,
          }}
        >
          Kirish
        </h1>

        <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
          {/* Error message */}
          {error && (
            <div
              className="fade-up"
              style={{
                marginBottom: 16,
                padding: '12px 16px',
                borderRadius: 10,
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.25)',
                color: 'var(--error)',
                fontSize: '0.9rem',
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}

          {/* Username input */}
          <div style={{ marginBottom: 16, textAlign: 'left' }}>
            <label
              htmlFor="username"
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--text)',
              }}
            >
              Foydalanuvchi nomi
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Foydalanuvchi nomi"
              disabled={loading}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--input-bg)',
                color: 'var(--text)',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Password input */}
          <div style={{ marginBottom: 24, textAlign: 'left' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: 8,
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--text)',
              }}
            >
              Parol
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parol"
              disabled={loading}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--input-bg)',
                color: 'var(--text)',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              fontSize: '1rem',
              padding: '15px 28px',
            }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Yuklanmoqda...
              </>
            ) : (
              'Kirish'
            )}
          </button>
        </form>

        <p
          style={{
            marginTop: 24,
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
          }}
        >
          Hisobingiz yo'qmi?{' '}
          <span style={{ color: 'var(--text-muted)' }}>
            Administratorga murojaat qiling
          </span>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
