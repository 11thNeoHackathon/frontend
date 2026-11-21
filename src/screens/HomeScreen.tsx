import type { CSSProperties } from 'react'
import { StatusBar } from '../components/StatusBar'
import { HomeMissions } from '../features/missions/HomeMissions'
import logo from '../features/missions/assets/re-post.svg'

const books = [
  { relationship: '엄마', tone: 'green', angle: -14 },
  { relationship: '아빠', tone: 'pink', angle: -14 },
  { relationship: '언니', tone: 'pending', angle: -9 },
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

export function HomeScreen({
  onAddBook,
  onSelectMission,
}: {
  onAddBook: () => void
  onSelectMission: (chapterId: number, counterpart: string) => void
}) {
  return (
    <main className="screen home-screen">
      <section className="home-hero">
        <StatusBar />
        <div className="home-nav">
          <img className="home-logo" src={logo} alt="RE Post" />
          <button className="icon-button notification" type="button" aria-label="알림"><BellIcon /></button>
        </div>
        <div className="home-copy">
          <h1>오늘은 어떤 시절로 떠나볼까요?</h1>
        </div>
        <HomeMissions onSelect={onSelectMission} />
      </section>
      <section className="bookshelf-section">
        <h2>내 책장</h2>
        <div className="books-grid">
          {books.map((book) => <BookCard key={book.relationship} {...book} />)}
          <button className="add-book-card" type="button" onClick={onAddBook} aria-label="새 책 만들기"><span>＋</span></button>
        </div>
      </section>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
