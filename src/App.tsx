import { useEffect, useState, type CSSProperties } from 'react'
import './App.css'

type Screen = 'home' | 'relationship' | 'invitation'
type Relationship = '엄마' | '아빠' | '할머니' | '할아버지' | '언니'

const relationships: Relationship[] = ['엄마', '아빠', '할머니', '할아버지', '언니']

const missions = [
  {
    relationship: '엄마 X 나',
    chapter: 'chp4. 중학교 시절',
    title: '이 노래 끝까지 듣고 한 줄 후기',
    tone: 'green',
  },
  {
    relationship: '아빠 X 나',
    chapter: 'chp2. 초등학교 시절',
    title: '요즘 하는 게임 10분 해보기',
    tone: 'pink',
  },
] as const

const books = [
  { relationship: '엄마', tone: 'green', angle: -14 },
  { relationship: '아빠', tone: 'pink', angle: -14 },
  { relationship: '언니', tone: 'pending', angle: -9 },
] as const

function StatusBar() {
  return (
    <div className="status-bar" aria-hidden="true">
      <strong>09:41</strong>
      <div className="status-icons">
        <span className="signal">▮▮▮</span>
        <span className="wifi">⌁</span>
        <span className="battery"><i /></span>
      </div>
    </div>
  )
}

function ChevronLeft() {
  return <span className="chevron chevron-left" aria-hidden="true" />
}

function ChevronRight() {
  return <span className="chevron chevron-right" aria-hidden="true" />
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 20h4" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="7" width="11" height="13" rx="1" />
      <path d="M16 7V4H5v13h3" />
    </svg>
  )
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="page-header">
      <button className="icon-button back-button" type="button" onClick={onBack} aria-label="뒤로 가기">
        <ChevronLeft />
      </button>
      <strong>{title}</strong>
      <span className="header-spacer" />
    </header>
  )
}

function PaperStack({ tone, angle = -12 }: { tone: string; angle?: number }) {
  return (
    <div
      className={`paper-stack ${tone}`}
      style={{ '--paper-angle': `${angle}deg` } as CSSProperties}
      aria-hidden="true"
    >
      <span className="paper paper-back" />
      <span className="paper paper-color" />
      <span className="paper paper-front"><i /><i /><i /><i /></span>
    </div>
  )
}

function BookCard({ relationship, tone, angle }: { relationship: string; tone: string; angle: number }) {
  return (
    <button className="book-card" type="button" aria-label={`${relationship}와 나의 책`}>
      <PaperStack tone={tone} angle={angle} />
      <span className="book-cover">
        <i className="pin top-left" /><i className="pin top-right" />
        <span>{relationship}</span><b aria-hidden="true" /> <span>나</span>
        <i className="pin bottom-left" /><i className="pin bottom-right" />
      </span>
    </button>
  )
}

function HomeScreen({ onAddBook }: { onAddBook: () => void }) {
  return (
    <main className="screen home-screen">
      <section className="home-hero">
        <StatusBar />
        <div className="home-nav">
          <div className="logo-placeholder">로고</div>
          <button className="icon-button notification" type="button" aria-label="알림">
            <BellIcon />
          </button>
        </div>

        <div className="home-copy">
          <h1>오늘은 어떤 시절로 떠나볼까요?</h1>
          <p>총 2건의 미션이 남아있습니다.</p>
        </div>

        <div className="mission-list">
          {missions.map((mission) => (
            <button className="mission-card" type="button" key={mission.relationship}>
              <span className={`mission-chip ${mission.tone}`}>{mission.relationship}</span>
              <span className="mission-copy">
                <small>{mission.chapter}</small>
                <strong>{mission.title}</strong>
              </span>
              <ChevronRight />
            </button>
          ))}
        </div>
      </section>

      <section className="bookshelf-section">
        <h2>내 책장</h2>
        <div className="books-grid">
          {books.map((book) => <BookCard key={book.relationship} {...book} />)}
          <button className="add-book-card" type="button" onClick={onAddBook} aria-label="새 책 만들기">
            <span>＋</span>
          </button>
        </div>
      </section>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}

function RelationshipCard({
  relationship,
  isSelected,
  onSelect,
}: {
  relationship: Relationship
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      className={`relationship-card ${isSelected ? 'selected' : ''}`}
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      <span className="relation-paper" aria-hidden="true" />
      <strong>{relationship}</strong>
    </button>
  )
}

function RelationshipScreen({
  onBack,
  onContinue,
  onAddRelationship,
}: {
  onBack: () => void
  onContinue: (relationship: Relationship) => void
  onAddRelationship: () => void
}) {
  const [selected, setSelected] = useState<Relationship | null>(null)
  const visibleRelationships = selected
    ? [selected, ...relationships.filter((relationship) => relationship !== selected)]
    : relationships.slice(0, 4)

  return (
    <main className="screen flow-screen">
      <StatusBar />
      <Header title="새 책 만들기" onBack={onBack} />

      <section className={`flow-content relation-content ${selected ? 'has-selection' : ''}`}>
        <h1>
          <span>초대할 가족이</span>
          <span>나의 누구인지 알려주세요.</span>
        </h1>
        <p className="description">서로의 청춘을 한 권으로 만들어드릴게요</p>

        {selected && (
          <div className="relation-note">
            <strong>링크를 보내면 상대가 수락했을 때 책이 만들어져요.</strong>
            <span>수락하기 전까지는 책장에 &quot;초대 대기&quot;로 보여요.</span>
          </div>
        )}

        <div className="relationship-grid">
          {selected && (
            <button
              className="relationship-card custom-relation"
              type="button"
              onClick={onAddRelationship}
              aria-label="다른 가족 관계 추가"
            >
              <span className="relation-paper" aria-hidden="true" />
              <strong>＋</strong>
            </button>
          )}
          {visibleRelationships.map((relationship) => (
            <RelationshipCard
              relationship={relationship}
              isSelected={selected === relationship}
              onSelect={() => setSelected(relationship)}
              key={relationship}
            />
          ))}
        </div>
      </section>

      {selected && (
        <div className="relation-footer">
          <button className="primary-button" type="button" onClick={() => onContinue(selected)}>
            초대 링크 만들기
          </button>
        </div>
      )}
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}

function InvitationScreen({
  relationship,
  onBack,
  onDone,
}: {
  relationship: Relationship
  onBack: () => void
  onDone: () => void
}) {
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
      <Header title="새 책 만들기" onBack={onBack} />

      <section className="flow-content invitation-content">
        <h1>{relationship} 를 초대해요</h1>
        <p className="description">링크를 보내면 {relationship}가 수락했을 때 책이 만들어져요.</p>

        <button className="invite-link-card" type="button" onClick={copyInvite} aria-label="초대 링크 복사">
          <span>
            <small>초대 링크</small>
            <strong>{inviteUrl}</strong>
          </span>
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

      {copied && (
        <div className="copy-toast" role="status">
          <CopyIcon />
          <span>복사가 완료되었어요.</span>
        </div>
      )}

      <div className="fixed-footer">
        <button className="primary-button" type="button" onClick={onDone}>완료</button>
      </div>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [relationship, setRelationship] = useState<Relationship>('엄마')

  return (
    <div className="app-shell">
      {screen === 'home' && <HomeScreen onAddBook={() => setScreen('relationship')} />}
      {screen === 'relationship' && (
        <RelationshipScreen
          onBack={() => setScreen('home')}
          onAddRelationship={() => {
            setRelationship('엄마')
            setScreen('invitation')
          }}
          onContinue={(nextRelationship) => {
            setRelationship(nextRelationship)
            setScreen('invitation')
          }}
        />
      )}
      {screen === 'invitation' && (
        <InvitationScreen
          relationship={relationship}
          onBack={() => setScreen('relationship')}
          onDone={() => setScreen('home')}
        />
      )}
    </div>
  )
}

export default App
