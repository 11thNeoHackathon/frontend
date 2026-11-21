import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { StatusBar } from '../../components/StatusBar'
import { ApiError } from '../../shared/api'
import { participantApi } from './api'
import './nickname-screen.css'

type SessionState = 'checking' | 'needsName' | 'ready' | 'error'

export function ParticipantGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>('checking')
  const [retryKey, setRetryKey] = useState(0)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    participantApi.getMe()
      .then(() => { if (active) setState('ready') })
      .catch((cause: unknown) => {
        if (!active) return
        if (cause instanceof ApiError && cause.status === 401 && cause.code === 'SESSION_REQUIRED') {
          setState('needsName')
        } else {
          setMessage(cause instanceof Error ? cause.message : '참여자 정보를 확인하지 못했어요.')
          setState('error')
        }
      })
    return () => { active = false }
  }, [retryKey])

  async function register(displayName: string) {
    await participantApi.register(displayName)
    // 쿠키가 실제로 저장됐는지 확인한 뒤 홈의 API를 호출한다.
    await participantApi.getMe()
    setState('ready')
  }

  if (state === 'ready') return children

  if (state === 'needsName') return <NicknameScreen onSubmit={register} />

  return <div className="app-shell">
    <main className="nickname-screen">
      <StatusBar />
      <div className="nickname-topbar">닉네임 설정</div>
      <div className="nickname-status" role={state === 'error' ? 'alert' : 'status'}>
        {state === 'checking' ? '참여자 정보를 확인하고 있어요…' : message}
        {state === 'error' && <button type="button" onClick={() => {
          setState('checking')
          setRetryKey((key) => key + 1)
        }}>다시 시도</button>}
      </div>
    </main>
  </div>
}

function NicknameScreen({ onSubmit }: { onSubmit: (name: string) => Promise<void> }) {
  const [name, setName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const trimmedName = name.trim()

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!trimmedName || submitting) return
    setSubmitting(true)
    setError('')
    try {
      await onSubmit(trimmedName)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '닉네임을 저장하지 못했어요.')
    } finally {
      setSubmitting(false)
    }
  }

  return <div className="app-shell">
    <main className="nickname-screen">
      <StatusBar />
      <div className="nickname-topbar">닉네임 설정</div>
      <form className="nickname-form" onSubmit={submit}>
        <div className="nickname-intro">
          <h1>내 닉네임을 정해주세요</h1>
          <p>엽서를 주고받을 때 쓰는 이름이에요</p>
        </div>
        <div className="nickname-field">
          <label htmlFor="nickname">닉네임</label>
          <input id="nickname" name="nickname" value={name} maxLength={50}
            placeholder="나를 부르는 이름을 적어주세요" autoComplete="nickname"
            onChange={(event) => { setName(event.target.value); setError('') }}
            aria-describedby={error ? 'nickname-error' : 'nickname-helper'}
            aria-invalid={Boolean(error)} />
          <div className="nickname-helper" id="nickname-helper">
            <strong>상대 화면에 이 이름으로 보여요.</strong>
            <span>부르고 싶은 이름으로 적어주세요.</span>
          </div>
          {error && <p className="nickname-error" id="nickname-error" role="alert">{error}</p>}
        </div>
        <div className="nickname-footer">
          <button type="submit" disabled={!trimmedName || submitting}>
            {submitting ? '저장 중…' : '완료'}
          </button>
          <div className="nickname-home-indicator" aria-hidden="true" />
        </div>
      </form>
    </main>
  </div>
}
