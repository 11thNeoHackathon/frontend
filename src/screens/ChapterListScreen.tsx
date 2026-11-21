import { useParams } from 'react-router-dom'
import deleteActiveIcon from '../assets/chapter/delete-active.svg'
import deleteMutedIcon from '../assets/chapter/delete-muted.svg'
import plusIcon from '../assets/chapter/plus.svg'
import timelineA from '../assets/chapter/timeline-a.svg'
import timelineB from '../assets/chapter/timeline-b.svg'
import { PageHeader } from '../components/PageHeader'
import { StatusBar } from '../components/StatusBar'
import type { ChapterListItem } from '../types/chapter'

interface ChapterListScreenProps {
  chapters: ChapterListItem[]
  onBack: () => void
  onAddChapter: (bookId: string) => void
}

export function ChapterListScreen({ chapters, onBack, onAddChapter }: ChapterListScreenProps) {
  const { bookId = 'mom' } = useParams()

  return (
    <main className="screen chapter-list-screen">
      <section className="chapter-book-hero">
        <StatusBar />
        <PageHeader title="" onBack={onBack} />
        <div className="chapter-book-visual">
          <h1>엄마 <i aria-hidden="true" /> 나</h1>
          <div className="chapter-paper-stack" aria-hidden="true"><span /><span /></div>
        </div>
      </section>

      <section className="chapter-list-content">
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
                <button type="button" aria-label={`${chapter.title} 삭제`}>
                  <img src={index === 0 ? deleteActiveIcon : deleteMutedIcon} alt="" />
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
