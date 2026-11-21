import mom from '../assets/hifi/mom.svg'
import dad from '../assets/hifi/dad.svg'
import grandma from '../assets/hifi/grandma.svg'
import grandpa from '../assets/hifi/grandpa.svg'
import selectedPostcard from '../assets/hifi/selected-postcard.svg'
import { PageHeader } from '../components/PageHeader'
import { StatusBar } from '../components/StatusBar'
import type { Relationship } from '../types/invite'

const relationships: Relationship[] = ['엄마', '아빠', '할머니']

function RelationshipCard({ relationship, isSelected, onSelect }: {
  relationship: Relationship
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button className={`relationship-card ${isSelected ? 'selected' : ''} ${isSelected && relationship === '엄마' ? 'selected-mom' : ''}`} type="button" onClick={onSelect} aria-pressed={isSelected}>
      <span className={`relation-paper graphic-paper ${relationship === '아빠' ? 'dad' : relationship === '할머니' ? 'grandma' : relationship === '할아버지' ? 'grandpa' : 'mom'}`} aria-hidden="true"><img src={isSelected && relationship === '엄마' ? selectedPostcard : relationship === '아빠' ? dad : relationship === '할머니' ? grandma : relationship === '할아버지' ? grandpa : mom} alt="" /></span>
      <strong>{relationship}</strong>
    </button>
  )
}

interface RelationshipScreenProps {
  onBack: () => void
  onContinue: (relationship: Relationship) => void
  selectedRelationship: Relationship | null
  onSelectRelationship: (relationship: Relationship) => void
  error?:string
  busy?:boolean
}

export function RelationshipScreen({
  onBack,
  onContinue,
  selectedRelationship,
  onSelectRelationship,
  error, busy=false,
}: RelationshipScreenProps) {
  const visibleRelationships = selectedRelationship && selectedRelationship !== '할아버지'
    ? [selectedRelationship, ...relationships.filter((relationship) => relationship !== selectedRelationship)]
    : relationships

  return (
    <main className="screen flow-screen relationship-selection-screen">
      <StatusBar />
      <PageHeader title="새 엽서 만들기" onBack={onBack} />
      <section className={`flow-content relation-content ${selectedRelationship ? 'has-selection' : ''}`}>
        <h1><span>초대할 가족이</span><span>나의 누구인지 알려주세요.</span></h1>
        <p className="description">서로의 청춘을 엽서로 주고받아요</p>
        {selectedRelationship && (
          <div className="relation-note">
            <strong>링크를 보내면 상대가 수락했을 때 엽서함이 열려요.</strong>
            <span>수락하기 전까지는 엽서함에 &quot;초대 대기&quot;로 보여요.</span>
          </div>
        )}
        {error && <p role="alert" className="flow-error">{error}</p>}
        <div className="relationship-grid">
          <button className={`relationship-card custom-relation ${selectedRelationship && !relationships.includes(selectedRelationship) ? 'selected' : ''}`} type="button" onClick={() => onSelectRelationship('할아버지')} aria-label="할아버지 엽서함 추가">
            <span className="relation-paper" aria-hidden="true" />
            <strong>{selectedRelationship === '할아버지' ? '할아버지' : '＋'}</strong>
          </button>
          {visibleRelationships.map((relationship) => (
            <RelationshipCard relationship={relationship} isSelected={selectedRelationship === relationship} onSelect={() => onSelectRelationship(relationship)} key={relationship} />
          ))}
        </div>
      </section>
      {selectedRelationship && <div className="relation-footer"><button className="primary-button" type="button" disabled={busy} onClick={() => onContinue(selectedRelationship)}>{busy ? '만드는 중…' : '초대 링크 만들기'}</button></div>}
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
