import { useEffect, useState, type CSSProperties } from 'react'
import { familyApi, type Book } from '../api/family'
import { StatusBar } from '../components/StatusBar'
import { HomeMissions } from '../features/missions/HomeMissions'
import logo from '../features/missions/assets/re-post.svg'

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
  onSelectMission: (chapterId: number, counterpart: string) => void
}

export function HomeScreen({ onAddBook, onOpenBook, onSelectMission }: HomeScreenProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [bookError, setBookError] = useState('')
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    void familyApi.getBooks().then((data) => {
      if (active) setBooks(data)
    }).catch((cause: unknown) => {
      if (active) setBookError(cause instanceof Error ? cause.message : '엽서함을 불러오지 못했어요.')
    }).finally(() => { if (active) setLoadingBooks(false) })
    return () => { active = false }
  }, [reloadKey])

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
        <h2>내 엽서함</h2>
        {loadingBooks && <p role="status">엽서함을 불러오는 중이에요…</p>}
        {bookError && <p role="alert">{bookError} <button type="button" onClick={() => { setBookError(''); setLoadingBooks(true); setReloadKey((key) => key + 1) }}>다시 시도</button></p>}
        <div className="books-grid">
          {books.map((book) => <BookCard key={book.bookId} relationship={book.counterpartLabel} tone={book.status === 'INVITE_PENDING' ? 'pending' : book.counterpartLabel.includes('아빠') ? 'pink' : 'green'} angle={-14} onClick={() => onOpenBook(String(book.bookId))} />)}
          <button className="add-book-card" type="button" onClick={onAddBook} aria-label="새 책 만들기"><span>＋</span></button>
        </div>
      </section>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
