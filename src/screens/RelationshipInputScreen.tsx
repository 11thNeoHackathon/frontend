import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { StatusBar } from '../components/StatusBar'
import type { Relationship } from '../types/invite'

const maxRelationshipLength = 10

interface RelationshipInputScreenProps {
  onBack: () => void
  onSubmit: (relationship: Relationship) => void
}

export function RelationshipInputScreen({ onBack, onSubmit }: RelationshipInputScreenProps) {
  const [relationship, setRelationship] = useState('')
  const normalizedRelationship = relationship.trim()

  return (
    <main className="screen flow-screen">
      <StatusBar />
      <PageHeader title="새 책 만들기" onBack={onBack} />
      <section className="flow-content relationship-input-content">
        <h1>초대할 분이 나의 누구인지 직접 적어주세요.</h1>
        <p className="description">서로의 청춘을 한 권으로 만들어드릴게요</p>

        <label className="relationship-field">
          <span>관계</span>
          <span className="relationship-input-wrap">
            <input
              value={relationship}
              maxLength={maxRelationshipLength}
              placeholder="부르는 그대로 적어주세요. 예: 이모, 삼촌, 고모, 친구"
              onChange={(event) => setRelationship(event.target.value)}
              aria-label="초대할 가족 관계"
            />
            <small>{relationship.length}/{maxRelationshipLength}</small>
          </span>
          <small>부르는 그대로 적어주세요. 예: 이모, 삼촌, 고모, 친구</small>
        </label>

        <div className="relation-note input-note">
          <strong>링크를 보내면 상대가 수락했을 때 책이 만들어져요.</strong>
          <span>수락하기 전까지는 책장에 &quot;초대 대기&quot;로 보여요.</span>
        </div>
      </section>
      <div className="relation-footer">
        <button
          className="primary-button"
          type="button"
          disabled={!normalizedRelationship}
          onClick={() => onSubmit(normalizedRelationship)}
        >
          {normalizedRelationship ? '초대 링크 만들기' : '추가 하기'}
        </button>
      </div>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
