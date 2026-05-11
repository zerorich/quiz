import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LandingPage() {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()

  useEffect(() => {
    let mounted = true
    async function check() {
      await refreshUser()
      if (mounted && user) {
        navigate('/categories', { replace: true })
      }
    }
    check()
    return () => {
      mounted = false
    }
  }, [user, navigate, refreshUser])

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
        style={{ width: '100%', maxWidth: 480, textAlign: 'center' }}
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
            fontSize: 'clamp(2rem, 5vw, 2.8rem)',
            fontWeight: 600,
            color: 'var(--text)',
            margin: '0 0 12px',
            lineHeight: 1.2,
          }}
        >
          Bilimingizni
          <br />
          <span style={{ color: 'var(--accent)' }}>sinab ko'ring</span>
        </h1>

        <p
          className="fade-up fade-up-d1"
          style={{
            color: 'var(--text-muted)',
            fontSize: '1rem',
            lineHeight: 1.7,
            margin: '0 0 32px',
          }}
        >
          Kirish va har bir toifa bo'yicha testlarni ishlab, natijalaringizni
          saqlab boring.
        </p>

        <div className="fade-up fade-up-d2">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              fontSize: '1rem',
              padding: '15px 28px',
            }}
          >
            Kirish
          </button>
        </div>

        <p
          className="fade-up fade-up-d3"
          style={{
            marginTop: 24,
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          Kirish orqali siz foydalanish shartlarini qabul qilasiz
        </p>
      </div>
    </div>
  )
}

export default LandingPage
