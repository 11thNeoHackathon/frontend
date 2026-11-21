import copyIcon from '../assets/hifi/copy.svg'
import { useEffect, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { StatusBar } from '../components/StatusBar'
import type { Relationship } from '../types/invite'

function CopyIcon() {
  return <img className="copy-icon" src={copyIcon} alt="" />
}

interface InvitationScreenProps {
  relationship: Relationship
  onBack: () => void
  onDone: () => void
  inviteUrl: string
}

export function InvitationScreen({ relationship, onBack, onDone, inviteUrl }: InvitationScreenProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    if (copyStatus === 'idle') return
    const timer = window.setTimeout(() => setCopyStatus('idle'), 3000)
    return () => window.clearTimeout(timer)
  }, [copyStatus])

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopyStatus('success')
    } catch {
      setCopyStatus('error')
    }
  }

  return (
    <main className="screen flow-screen">
      <StatusBar />
      <PageHeader title="새 엽서 만들기" onBack={onBack} />
      <section className="flow-content invitation-content">
        <h1>{relationship}를 초대해요</h1>
        <p className="description">{relationship}가 수락하면 엽서함이 열려요.</p>
        <button className="invite-link-card" type="button" onClick={copyInvite} aria-label="초대 링크 복사">
          <span><small>초대 링크</small><strong>{inviteUrl}</strong></span>
          <CopyIcon />
        </button>
        <div className="steps-card">
          <h2>이렇게 진행돼요</h2>
          <ol>
            <li><span>1</span>링크를 {relationship}에게 보내요</li>
            <li><span>2</span>{relationship}가 링크를 열고 수락해요</li>
            <li><span>3</span>엽서함이 열리고 새 엽서를 만들 수 있어요</li>
          </ol>
        </div>
      </section>
      {copyStatus !== 'idle' && (
        <div className="copy-toast" role="status">
          <CopyIcon />
          <span>{copyStatus === 'success' ? '복사가 완료되었어요.' : '복사하지 못했어요. 다시 시도해 주세요.'}</span>
        </div>
      )}
      <div className="fixed-footer"><button className="primary-button" type="button" onClick={onDone}>완료</button></div>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
