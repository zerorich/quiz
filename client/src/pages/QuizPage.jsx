import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import questionsData from '../data/questions.json'
import api from '../lib/api'

function QuizPage() {
  const { category } = useParams()
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const questions = useMemo(() => questionsData[category] || [], [category])

  if (!questions.length) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--error)' }}>Toifa topilmadi.</p>
      </div>
    )
  }

  const question = questions[currentIndex]
  const selectedOptionId = selectedAnswers[question.id]
  const allAnswered = Object.keys(selectedAnswers).length === questions.length
  const progress = ((currentIndex + 1) / questions.length) * 100
  const answeredCount = Object.keys(selectedAnswers).length

  const handleSelect = (optionId) => {
    if (selectedAnswers[question.id] !== undefined) return
    setSelectedAnswers(prev => ({ ...prev, [question.id]: optionId }))
  }

  const handleSubmit = async () => {
    if (!allAnswered) {
      const idx = questions.findIndex(q => selectedAnswers[q.id] === undefined)
      setError("Barcha savollarga javob bering.")
      if (idx >= 0) setCurrentIndex(idx)
      return
    }
    try {
      setSubmitting(true)
      setError('')
      const answers = questions.map(q => {
        const selectedId = selectedAnswers[q.id]
        const selectedOption = q.options.find(o => o.id === selectedId)
        const correctOption = q.options.find(o => o.isCorrect)
        return {
          questionId: q.id,
          questionText: q.quiz,
          selectedOptionId: selectedOption?.id ?? -1,
          selectedOptionText: selectedOption?.option ?? 'Javob yo\'q',
          correctOptionId: correctOption?.id ?? -1,
          correctOptionText: correctOption?.option ?? '',
          isCorrect: selectedOption?.id === correctOption?.id,
        }
      })
      const response = await api.post('/api/results', { category, answers })
      navigate(`/results/${response.data.result._id}`)
    } catch {
      setError('Yuborishda xato yuz berdi. Qayta urinib ko\'ring.')
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '24px 16px',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{ maxWidth: 720, width: '100%', margin: '0 auto 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button
            className="btn-ghost"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            onClick={() => navigate('/categories')}
          >
            ← Orqaga
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {answeredCount}/{questions.length} javoblangan
            </span>
            <span style={{
              fontSize: '0.82rem', fontWeight: 600,
              color: 'var(--accent)',
              background: 'var(--accent-dim)',
              padding: '3px 10px',
              borderRadius: 20,
            }}>
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--accent) 0%, #e8c98a 100%)',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Question card */}
      <div style={{ maxWidth: 720, width: '100%', margin: '0 auto', flex: 1 }}>
        <div className="card fade-up" style={{ padding: 'clamp(24px, 5vw, 40px)' }}>
          <p style={{
            fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em',
            color: 'var(--accent)', textTransform: 'uppercase', marginBottom: 16,
          }}>
            Savol {currentIndex + 1}
          </p>
          <h2 style={{
            fontFamily: "'Lora', serif",
            fontSize: 'clamp(1.05rem, 3vw, 1.3rem)',
            fontWeight: 500,
            lineHeight: 1.6,
            margin: '0 0 28px',
          }}>
            {question.quiz}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {question.options.map((option, idx) => {
              const isSelected = selectedOptionId === option.id
              const isLocked = selectedOptionId !== undefined
              const letters = ['A', 'B', 'C', 'D', 'E']
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  disabled={isLocked}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '14px 18px',
                    borderRadius: 10,
                    border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
                    background: isSelected ? 'var(--accent-dim)' : 'var(--surface2)',
                    color: isSelected ? 'var(--text)' : 'var(--text)',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    transition: 'border-color 0.2s, background 0.2s',
                    width: '100%',
                    opacity: isLocked && !isSelected ? 0.55 : 1,
                  }}
                  onMouseEnter={e => {
                    if (!isLocked && !isSelected) {
                      e.currentTarget.style.borderColor = 'var(--accent-glow)'
                      e.currentTarget.style.background = 'rgba(201,169,110,0.05)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isLocked && !isSelected) {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.background = 'var(--surface2)'
                    }
                  }}
                >
                  <span style={{
                    minWidth: 26, height: 26,
                    borderRadius: 6,
                    background: isSelected ? 'var(--accent)' : 'var(--border)',
                    color: isSelected ? '#0f1117' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                  }}>
                    {letters[idx] || idx + 1}
                  </span>
                  <span style={{ fontSize: '0.92rem', lineHeight: 1.6, paddingTop: 2 }}>
                    {option.option}
                  </span>
                </button>
              )
            })}
          </div>

          {error && (
            <p style={{ marginTop: 20, color: 'var(--error)', fontSize: '0.88rem' }}>{error}</p>
          )}

          {/* Navigation */}
          <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn-ghost"
              onClick={() => setCurrentIndex(p => p - 1)}
              disabled={currentIndex === 0}
            >
              ← Oldingi
            </button>
            <div style={{ display: 'flex', gap: 10 }}>
              {currentIndex < questions.length - 1 ? (
                <button
                  className="btn-primary"
                  onClick={() => setCurrentIndex(p => p + 1)}
                  disabled={selectedOptionId === undefined}
                >
                  Keyingi →
                </button>
              ) : (
                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting || !allAnswered}
                  style={{ background: allAnswered ? 'var(--accent)' : undefined }}
                >
                  {submitting ? (
                    <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Yuborilmoqda...</>
                  ) : 'Yakunlash ✓'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question dots */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 6,
          marginTop: 24, justifyContent: 'center',
        }}>
          {questions.map((q, i) => {
            const answered = selectedAnswers[q.id] !== undefined
            const isCurrent = i === currentIndex
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: 28, height: 28, borderRadius: 6,
                  border: isCurrent ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                  background: isCurrent ? 'var(--accent-dim)' : answered ? 'var(--surface2)' : 'transparent',
                  color: isCurrent ? 'var(--accent)' : answered ? 'var(--text-muted)' : 'var(--text-muted)',
                  fontSize: '0.7rem', fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {answered && !isCurrent ? '✓' : i + 1}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default QuizPage
