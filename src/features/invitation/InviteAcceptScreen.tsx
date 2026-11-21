import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ApiError, missionApi, type InvitationPreview } from '../missions/api'

type Phase = 'loading' | 'ready' | 'error'

// 초대 링크(/invite/:code)를 연 사람이 초대를 확인하고 수락하는 화면.
export function InviteAcceptScreen() {
  const { code = '' } = useParams()
  const navigate = useNavigate()
  const [phase, setPhase] = useState<Phase>('loading')
  const [invitation, setInvitation] = useState<InvitationPreview | null>(null)
  const [hasSession, setHasSession] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [counterpartLabel, setCounterpartLabel] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const preview = await missionApi.getInvitation(code)
        if (!active) return
        if (preview.status === 'LINKED' && preview.bookId !== null) {
          navigate(`/books/${preview.bookId}`, { replace: true })
          return
        }
        const session = await missionApi.getParticipant().then(
          () => true,
          (error: unknown) => {
            if (error instanceof ApiError && error.code === 'SESSION_REQUIRED') return false
            throw error
          },
        )
        if (!active) return
        setInvitation(preview)
        setHasSession(session)
        setPhase('ready')
      } catch (error) {
        if (!active) return
        setMessage(error instanceof ApiError ? error.message : '초대 정보를 불러오지 못했어요.')
        setPhase('error')
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [code, navigate])

  async function accept(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      const book = await missionApi.acceptInvitation(code, {
        displayName: hasSession ? undefined : displayName.trim(),
        counterpartLabel: counterpartLabel.trim() || undefined,
      })
      navigate(`/books/${book.bookId}`, { replace: true })
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : '초대를 수락하지 못했어요.')
    } finally {
      setBusy(false)
    }
  }

  if (phase === 'loading') {
    return <div className="app-shell"><main className="screen"><p>초대 정보를 확인하고 있어요…</p></main></div>
  }

  if (phase === 'error' || !invitation) {
    return (
      <div className="app-shell">
        <main className="screen profile-screen">
          <h1>초대를 열 수 없어요</h1>
          <div role="alert" className="mission-message error">{message}</div>
          <button type="button" onClick={() => navigate('/')}>홈으로</button>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <main className="screen profile-screen">
        <h1>{invitation.inviterName}님이 초대했어요</h1>
        <p>‘{invitation.bookTitle}’ 엽서함에 함께해요.</p>
        <form onSubmit={accept}>
          {!hasSession && (
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              maxLength={50}
              placeholder="내 닉네임"
              aria-label="내 닉네임"
            />
          )}
          <input
            value={counterpartLabel}
            onChange={(event) => setCounterpartLabel(event.target.value)}
            maxLength={30}
            placeholder={`${invitation.inviterName}님을 부르는 말 (기본: 가족)`}
            aria-label="상대를 부르는 말"
          />
          <button type="submit" disabled={busy || (!hasSession && !displayName.trim())}>
            {busy ? '수락하는 중…' : '초대 수락하기'}
          </button>
        </form>
        {message && <p role="alert">{message}</p>}
      </main>
    </div>
  )
}
