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
      <PageHeader title="새 엽서 만들기" onBack={onBack} />
      <section className="flow-content relationship-input-content">
        <h1>초대할 가족이<br />나의 누구인지 적어주세요</h1>
        <p className="description">서로의 청춘에 답장을 보내요</p>

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
          </span>
        </label>
      </section>
      <div className="relation-footer">
        <button
          className="primary-button"
          type="button"
          disabled={!normalizedRelationship}
          onClick={() => onSubmit(normalizedRelationship)}
        >
          추가 하기
        </button>
      </div>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
