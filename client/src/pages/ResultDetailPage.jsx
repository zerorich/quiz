import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../lib/api'

function ResultDetailPage() {
  const { id } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    let active = true
    api.get(`/api/results/${id}`)
      .then(r => { if (active) setResult(r.data.result) })
      .catch(() => { if (active) setError("Natijani yuklab bo'lmadi") })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )

  if (error || !result) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--error)' }}>{error || 'Natija topilmadi'}</p>
    </div>
  )

  const pct = Math.round((result.correctAnswers / result.totalQuestions) * 100)
  const isGreat = pct >= 80
  const isOk = pct >= 50

  const scoreColor = isGreat ? 'var(--success)' : isOk ? 'var(--accent)' : 'var(--error)'
  const emoji = isGreat ? '🎉' : isOk ? '👍' : '📖'
  const message = isGreat ? "Ajoyib natija!" : isOk ? "Yaxshi harakat!" : "Ko'proq mashq qiling"

  return (
    <div style={{
      minHeight: '100vh',
      padding: '32px 16px 60px',
      background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${isGreat ? 'rgba(74,222,128,0.05)' : isOk ? 'rgba(201,169,110,0.06)' : 'rgba(248,113,113,0.05)'} 0%, transparent 60%), var(--bg)`,
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        {/* Score card */}
        <div className="card fade-up" style={{ padding: 'clamp(28px, 5vw, 48px)', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>{emoji}</div>
          <h1 style={{
            fontFamily: "'Lora', serif",
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 600, margin: '0 0 8px',
          }}>
            {message}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.95rem' }}>
            {result.correctAnswers} ta to'g'ri / {result.totalQuestions} ta savol
          </p>

          {/* Big score */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 120, height: 120,
            borderRadius: '50%',
            border: `4px solid ${scoreColor}`,
            boxShadow: `0 0 32px ${scoreColor}33`,
            marginBottom: 28,
          }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, color: scoreColor }}>
              {pct}%
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 8, background: 'var(--surface2)', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{
              height: '100%', borderRadius: 8,
              width: `${pct}%`,
              background: scoreColor,
              transition: 'width 1s ease',
            }} />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
            <Link to="/categories" className="btn-primary">
              ← Toifalarga qaytish
            </Link>
            <button
              className="btn-ghost"
              onClick={() => setShowDetails(v => !v)}
            >
              {showDetails ? 'Yopish' : 'Batafsil ko\'rish'}
            </button>
          </div>
        </div>

        {/* Detailed answers */}
        {showDetails && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result.answers.map((answer, idx) => (
              <div
                key={`${answer.questionId}-${idx}`}
                className="card fade-up"
                style={{ padding: '20px 24px', borderLeft: `3px solid ${answer.isCorrect ? 'var(--success)' : 'var(--error)'}` }}
              >
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{
                    minWidth: 28, height: 28, borderRadius: 6,
                    background: answer.isCorrect ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)',
                    color: answer.isCorrect ? 'var(--success)' : 'var(--error)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                  }}>
                    {answer.isCorrect ? '✓' : '✗'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 10px', fontSize: '0.92rem', lineHeight: 1.6, fontWeight: 500 }}>
                      {idx + 1}. {answer.questionText}
                    </p>
                    <p style={{ margin: '0 0 4px', fontSize: '0.82rem', color: answer.isCorrect ? 'var(--success)' : 'var(--error)' }}>
                      Sizning javobingiz: {answer.selectedOptionText}
                    </p>
                    {!answer.isCorrect && (
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--success)' }}>
                        To'g'ri javob: {answer.correctOptionText}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultDetailPage
