import { PageHeader } from '../components/PageHeader'
import { StatusBar } from '../components/StatusBar'
import type { Relationship } from '../types/invite'

const relationships: Relationship[] = ['엄마', '아빠', '할머니', '할아버지', '언니']

function RelationshipCard({ relationship, isSelected, onSelect }: {
  relationship: Relationship
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button className={`relationship-card ${isSelected ? 'selected' : ''}`} type="button" onClick={onSelect} aria-pressed={isSelected}>
      <span className="relation-paper" aria-hidden="true" />
      <strong>{relationship}</strong>
    </button>
  )
}

interface RelationshipScreenProps {
  onBack: () => void
  onContinue: (relationship: Relationship) => void
  onAddRelationship: () => void
  selectedRelationship: Relationship | null
  onSelectRelationship: (relationship: Relationship) => void
}

export function RelationshipScreen({
  onBack,
  onContinue,
  onAddRelationship,
  selectedRelationship,
  onSelectRelationship,
}: RelationshipScreenProps) {
  const visibleRelationships = selectedRelationship
    ? [selectedRelationship, ...relationships.filter((relationship) => relationship !== selectedRelationship)]
    : relationships

  return (
    <main className="screen flow-screen">
      <StatusBar />
      <PageHeader title="새 책 만들기" onBack={onBack} />
      <section className={`flow-content relation-content ${selectedRelationship ? 'has-selection' : ''}`}>
        <h1><span>초대할 가족이</span><span>나의 누구인지 알려주세요.</span></h1>
        <p className="description">서로의 청춘을 한 권으로 만들어드릴게요</p>
        {selectedRelationship && (
          <div className="relation-note">
            <strong>링크를 보내면 상대가 수락했을 때 책이 만들어져요.</strong>
            <span>수락하기 전까지는 책장에 &quot;초대 대기&quot;로 보여요.</span>
          </div>
        )}
        <div className="relationship-grid">
          <button className="relationship-card custom-relation" type="button" onClick={onAddRelationship} aria-label="다른 가족 관계 추가">
            <span className="relation-paper" aria-hidden="true" /><strong>＋</strong>
          </button>
          {visibleRelationships.map((relationship) => (
            <RelationshipCard relationship={relationship} isSelected={selectedRelationship === relationship} onSelect={() => onSelectRelationship(relationship)} key={relationship} />
          ))}
        </div>
      </section>
      {selectedRelationship && <div className="relation-footer"><button className="primary-button" type="button" onClick={() => onContinue(selectedRelationship)}>초대 링크 만들기</button></div>}
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
