import postcardLine from '../assets/hifi/postcard-line.svg'
import postcardFace from '../assets/hifi/postcard-face.svg'
import stamp from '../assets/hifi/stamp.svg'
import ribbon from '../assets/hifi/ribbon.svg'
import { useParams } from 'react-router-dom'
import plusIcon from '../assets/chapter/plus.svg'
import timelineA from '../assets/chapter/timeline-a.svg'
import timelineB from '../assets/chapter/timeline-b.svg'
import { PageHeader } from '../components/PageHeader'
import { StatusBar } from '../components/StatusBar'
import type { Book } from '../features/missions/api'
import deleteActiveIcon from '../assets/chapter/delete-active.svg'
import deleteMutedIcon from '../assets/chapter/delete-muted.svg'
import type { ChapterListItem } from '../types/chapter'

interface ChapterListScreenProps {
  book:Book
  chapters: ChapterListItem[]
  onDeleteChapter:(id:string)=>void
  onBack: () => void
  onAddChapter: (bookId: string) => void
}

export function ChapterListScreen({ book, chapters, onDeleteChapter, onBack, onAddChapter }: ChapterListScreenProps) {
  const { bookId = 'mom' } = useParams()

  return (
    <main className="screen chapter-list-screen">
      <section className="chapter-book-hero">
        <StatusBar />
        <PageHeader title="" onBack={onBack} />
        <div className="chapter-book-visual">
          <h1>{book.counterpartLabel || book.counterpartName || book.title} <img src={ribbon} alt="" /> 나</h1>
          <p className="chapter-available">현재 열람 가능한 엽서가 <strong>{chapters.filter(chapter => chapter.tags.some(tag => tag.label === '열람 가능')).length}</strong> 개 있어요!</p>
          <div className="chapter-paper-stack" aria-hidden="true"><span /><span className="postcard-art"><img className="postcard-face" src={postcardFace} alt="" /><img className="postcard-stamp" src={stamp} alt="" /><i className="postcard-lines"><img src={postcardLine} alt="" /><img src={postcardLine} alt="" /><img src={postcardLine} alt="" /></i><small>엽서를 눌러보세요!</small></span></div>
        </div>
      </section>

      <section className="chapter-list-content">
        {chapters.length===0&&<p>아직 만든 엽서가 없어요. ＋를 눌러 첫 엽서를 만들어 보세요.</p>}
        <header>
          <h2>지금까지 나눈 엽서 <strong>{chapters.length}</strong>개</h2>
          <button type="button" onClick={() => onAddChapter(bookId)} aria-label="새 챕터 만들기">
            <img src={plusIcon} alt="" />
          </button>
        </header>

        <ol className="chapter-cards">
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <div className="chapter-number">{String(index + 1).padStart(2, '0')}</div>
              <img className="chapter-timeline" src={index % 2 === 0 ? timelineA : timelineB} alt="" />
              <article>
                <div>
                  <h3>{chapter.title}</h3>
                  <div className="chapter-tags">
                    {chapter.tags.map((tag) => <span className={tag.tone} key={tag.label}>{tag.label}</span>)}
                  </div>
                </div>
                <button type="button" aria-label={`${chapter.title} 삭제`} onClick={()=>onDeleteChapter(chapter.id)}>
                  <img src={chapter.tags.some(tag=>tag.label==='이야기 작성하기')?deleteActiveIcon:deleteMutedIcon} alt="" />
                </button>
              </article>
            </li>
          ))}
        </ol>
      </section>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
