import { useEffect, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { StatusBar } from '../components/StatusBar'
import type { Relationship } from '../types/invite'

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="7" width="11" height="13" rx="1" />
      <path d="M16 7V4H5v13h3" />
    </svg>
  )
}

interface InvitationScreenProps {
  relationship: Relationship
  onBack: () => void
  onDone: () => void
}

export function InvitationScreen({ relationship, onBack, onDone }: InvitationScreenProps) {
  const [copied, setCopied] = useState(false)
  const inviteUrl = 'https://(서비스 주소)/invite/a8k2x9'

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 3000)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
    } catch {
      // WebView나 권한이 없는 환경에서도 디자인 상태는 확인할 수 있다.
    }
    setCopied(true)
  }

  return (
    <main className="screen flow-screen">
      <StatusBar />
      <PageHeader title="새 책 만들기" onBack={onBack} />
      <section className="flow-content invitation-content">
        <h1>{relationship} 를 초대해요</h1>
        <p className="description">링크를 보내면 {relationship}가 수락했을 때 책이 만들어져요.</p>
        <button className="invite-link-card" type="button" onClick={copyInvite} aria-label="초대 링크 복사">
          <span><small>초대 링크</small><strong>{inviteUrl}</strong></span>
          <CopyIcon />
        </button>
        <div className="steps-card">
          <h2>이렇게 진행돼요</h2>
          <ol>
            <li><span>1</span>링크를 {relationship}에게 보내요</li>
            <li><span>2</span>{relationship}가 링크를 열고 수락해요</li>
            <li><span>3</span>책이 책장에 꽂히고 챕터를 만들 수 있어요</li>
          </ol>
        </div>
      </section>
      {copied && <div className="copy-toast" role="status"><CopyIcon /><span>복사가 완료되었어요.</span></div>}
      <div className="fixed-footer"><button className="primary-button" type="button" onClick={onDone}>완료</button></div>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
