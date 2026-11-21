import type { CSSProperties } from 'react'
import { StatusBar } from '../components/StatusBar'

const missions = [
  { relationship: '엄마 X 나', chapter: 'chp4. 중학교 시절', title: '이 노래 끝까지 듣고 한 줄 후기', tone: 'green' },
  { relationship: '아빠 X 나', chapter: 'chp2. 초등학교 시절', title: '요즘 하는 게임 10분 해보기', tone: 'pink' },
] as const

const books = [
  { id: 'mom-and-me', relationship: '엄마', tone: 'green', angle: -14 },
  { id: 'dad-and-me', relationship: '아빠', tone: 'pink', angle: -14 },
  { id: 'sister-and-me', relationship: '언니', tone: 'pending', angle: -9 },
] as const

function BellIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 20h4" /></svg>
}

function PaperStack({ tone, angle = -12 }: { tone: string; angle?: number }) {
  return (
    <div className={`paper-stack ${tone}`} style={{ '--paper-angle': `${angle}deg` } as CSSProperties} aria-hidden="true">
      <span className="paper paper-back" />
      <span className="paper paper-color" />
      <span className="paper paper-front"><i /><i /><i /><i /></span>
    </div>
  )
}

function BookCard({ relationship, tone, angle, onClick }: {
  relationship: string
  tone: string
  angle: number
  onClick: () => void
}) {
  return (
    <button className="book-card" type="button" onClick={onClick} aria-label={`${relationship}와 나의 엽서함`}>
      <PaperStack tone={tone} angle={angle} />
      <span className="book-cover">
        <i className="pin top-left" /><i className="pin top-right" />
        <span>{relationship}</span><b aria-hidden="true" /> <span>나</span>
        <i className="pin bottom-left" /><i className="pin bottom-right" />
      </span>
    </button>
  )
}

interface HomeScreenProps {
  onAddBook: () => void
  onOpenBook: (bookId: string) => void
}

export function HomeScreen({ onAddBook, onOpenBook }: HomeScreenProps) {
  return (
    <main className="screen home-screen">
      <section className="home-hero">
        <StatusBar />
        <div className="home-nav">
          <div className="logo-placeholder">로고</div>
          <button className="icon-button notification" type="button" aria-label="알림"><BellIcon /></button>
        </div>
        <div className="home-copy">
          <h1>오늘은 어떤 시절로 떠나볼까요?</h1>
          <p>총 2건의 미션이 남아있습니다.</p>
        </div>
        <div className="mission-list">
          {missions.map((mission) => (
            <button className="mission-card" type="button" key={mission.relationship}>
              <span className={`mission-chip ${mission.tone}`}>{mission.relationship}</span>
              <span className="mission-copy"><small>{mission.chapter}</small><strong>{mission.title}</strong></span>
              <span className="chevron chevron-right" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
      <section className="bookshelf-section">
        <h2>내 엽서함</h2>
        <div className="books-grid">
          {books.map((book) => <BookCard key={book.id} {...book} onClick={() => onOpenBook(book.id)} />)}
          <button className="add-book-card" type="button" onClick={onAddBook} aria-label="새 책 만들기"><span>＋</span></button>
        </div>
      </section>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
