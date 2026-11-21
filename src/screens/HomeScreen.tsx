import ribbon from '../assets/hifi/ribbon.svg'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { ApiError, missionApi, type Book } from '../features/missions/api'
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

function BookCard({ relationship, tone, angle, onClick }: { relationship: string; tone: string; angle: number; onClick: () => void }) {
  return (
    <button className="book-card" type="button" onClick={onClick} aria-label={`${relationship}와 나의 책`}>
      <PaperStack tone={tone} angle={angle} />
      <span className="book-cover">
        <i className="pin top-left" /><i className="pin top-right" />
        <span>{relationship}</span><img className="family-ribbon" src={ribbon} alt="" /> <span>나</span>
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
  const [books,setBooks]=useState<Book[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const [reload,setReload]=useState(0)
  useEffect(()=>{let active=true; missionApi.getBooks().then(data=>{if(active){setBooks(data);setError('')}}).catch(e=>{if(active)setError(e instanceof ApiError?e.message:'엽서함을 불러오지 못했어요.')}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[reload])
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
        <div className="books-grid">
          {books.map((book) => <BookCard key={book.bookId} relationship={book.counterpartLabel || book.counterpartName || book.title} tone={book.mySlotNo === 2 ? 'pink' : 'green'} angle={-14} onClick={() => onOpenBook(String(book.bookId))} />)}
          {loading && <p>엽서함을 불러오고 있어요…</p>}{error && <div role="alert">{error} <button type="button" onClick={()=>{setLoading(true);setReload(x=>x+1)}}>다시 시도</button></div>}{!loading&&!error&&books.length===0&&<p>아직 엽서함이 없어요. ＋를 눌러 가족을 초대해 보세요.</p>}
          <button className="add-book-card" type="button" onClick={onAddBook} aria-label="새 책 만들기"><span>＋</span></button>
        </div>
      </section>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
