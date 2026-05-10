import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

const CATEGORY_META = [
  {
    key: 'Ijtimoiy_siyosat',
    title: 'Ijtimoiy siyosatlar',
    icon: '🏛️',
    desc: "Davlat va jamiyat o'rtasidagi ijtimoiy munosabatlar",
  },
  {
    key: 'Mahalla_va_oila',
    title: "Mahalla va oila",
    desc: "Sotsiologik tadqiqotlar metodologiyasi va amaliyoti",
    icon: '🏘️',
  },
  {
    key: 'Tazyiq_va_zoravonlik',
    title: "Tazyiq va zo'ravonlik",
    desc: "Jabr ko'rganlar bilan ijtimoiy ish asoslari",
    icon: '⚖️',
  },
]

function CategoriesPage() {
  const { user } = useAuth()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.get('/api/results')
      .then(r => { if (active) setResults(r.data.results || []) })
      .catch(() => { if (active) setError('Natijalarni yuklashda xato') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const latestByCategory = useMemo(() => {
    const map = {}
    for (const r of results) {
      if (!map[r.category]) map[r.category] = r
    }
    return map
  }, [results])

  return (
    <div style={{
      minHeight: '100vh',
      padding: '0 0 60px',
      background: 'radial-gradient(ellipse 60% 40% at 80% 10%, rgba(201,169,110,0.06) 0%, transparent 60%), var(--bg)',
    }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(26,29,39,0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 10,
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>📚</span>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--accent)' }}>QuizApp</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src={user?.photo || 'https://ui-avatars.com/api/?name=U&background=2e3348&color=c9a96e'}
              alt={user?.displayName}
              style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
            />
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', display: 'none' }} className="md:block">
              {user?.displayName}
            </span>
            <button
              className="btn-danger"
              onClick={() => { window.location.href = 'https://quiz-production-19b3.up.railway.app/auth/logout' }}
            >
              Chiqish
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 0' }}>
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <h1 style={{
            fontFamily: "'Lora', serif",
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 600,
            margin: '0 0 8px',
          }}>
            Toifani tanlang
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>
            Xush kelibsiz, <strong style={{ color: 'var(--text)' }}>{user?.displayName}</strong>
          </p>
        </div>

        {error && (
          <p style={{ color: 'var(--error)', marginBottom: 24, fontSize: '0.9rem' }}>{error}</p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
          {CATEGORY_META.map((cat, i) => {
            const latest = latestByCategory[cat.key]
            const pct = latest ? Math.round((latest.correctAnswers / latest.totalQuestions) * 100) : null
            return (
              <Link
                key={cat.key}
                to={`/quiz/${cat.key}`}
                className={`card fade-up fade-up-d${i + 1}`}
                style={{
                  display: 'block',
                  padding: 28,
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{cat.icon}</div>
                <h3 style={{ margin: '0 0 8px', fontWeight: 600, fontSize: '1rem', lineHeight: 1.4 }}>
                  {cat.title}
                </h3>
                <p style={{ margin: '0 0 20px', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  {cat.desc}
                </p>

                {loading ? (
                  <div style={{ height: 4, background: 'var(--surface2)', borderRadius: 4 }} />
                ) : latest ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>So'nggi natija</span>
                      <span style={{
                        fontSize: '0.78rem', fontWeight: 600,
                        color: pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : 'var(--error)',
                      }}>{pct}%</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 4, width: `${pct}%`,
                        background: pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : 'var(--error)',
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {latest.correctAnswers}/{latest.totalQuestions} to'g'ri
                    </p>
                  </div>
                ) : (
                  <div style={{
                    fontSize: '0.78rem', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span>Boshlash</span>
                    <span>→</span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default CategoriesPage
