import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LandingPage() {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    let mounted = true
    async function check() {
      await refreshUser()
      if (mounted) setCheckingAuth(false)
    }
    check()
    return () => { mounted = false }
  }, [refreshUser])

  useEffect(() => {
    if (user) navigate('/categories', { replace: true })
  }, [user, navigate])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,169,110,0.08) 0%, transparent 70%), var(--bg)',
    }}>
      <div className="fade-up" style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}>
        {/* Logo mark */}
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'var(--accent-dim)',
          border: '1px solid var(--accent-glow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px',
          fontSize: 28,
        }}>📚</div>

        <h1 style={{
          fontFamily: "'Lora', serif",
          fontSize: 'clamp(2rem, 5vw, 2.8rem)',
          fontWeight: 600,
          color: 'var(--text)',
          margin: '0 0 12px',
          lineHeight: 1.2,
        }}>
          Bilimingizni<br/>
          <span style={{ color: 'var(--accent)' }}>sinab ko'ring</span>
        </h1>

        <p className="fade-up fade-up-d1" style={{
          color: 'var(--text-muted)',
          fontSize: '1rem',
          lineHeight: 1.7,
          margin: '0 0 48px',
        }}>
          Google orqali kiring va har bir toifa bo'yicha testlarni ishlab,
          natijalaringizni saqlab boring.
        </p>

        <div className="fade-up fade-up-d2">
          <button
            type="button"
            disabled={checkingAuth}
            onClick={() => { window.location.href = 'http://localhost:5000/auth/google' }}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '15px 28px' }}
          >
            {checkingAuth ? (
              <>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Tekshirilmoqda...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google orqali kirish
              </>
            )}
          </button>
        </div>

        <p className="fade-up fade-up-d3" style={{
          marginTop: 24,
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
        }}>
          Kirish orqali siz foydalanish shartlarini qabul qilasiz
        </p>
      </div>
    </div>
  )
}

export default LandingPage
