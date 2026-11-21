import deleteActiveIcon from '../assets/chapter/delete-active.svg'
import deleteMutedIcon from '../assets/chapter/delete-muted.svg'
import plusIcon from '../assets/chapter/plus.svg'
import timelineA from '../assets/chapter/timeline-a.svg'
import timelineB from '../assets/chapter/timeline-b.svg'
import { PageHeader } from '../components/PageHeader'
import { StatusBar } from '../components/StatusBar'
import type { ChapterListItem } from '../types/chapter'

interface ChapterListScreenProps {
  relationship: string
  chapters: ChapterListItem[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onBack: () => void
  onAddChapter: () => void
}

export function ChapterListScreen({ relationship, chapters, isLoading, error, onRetry, onBack, onAddChapter }: ChapterListScreenProps) {
  return (
    <main className="screen chapter-list-screen">
      <section className="chapter-book-hero">
        <StatusBar />
        <PageHeader title="" onBack={onBack} />
        <div className="chapter-book-visual">
          <h1>{relationship} <i aria-hidden="true" /> 나</h1>
          <div className="chapter-paper-stack" aria-hidden="true"><span /><span /></div>
        </div>
      </section>

      <section className="chapter-list-content">
        <header>
          <h2>지금까지 나눈 엽서 <strong>{chapters.length}</strong>개</h2>
          <button type="button" onClick={onAddChapter} aria-label="새 챕터 만들기" disabled={isLoading || Boolean(error)}>
            <img src={plusIcon} alt="" />
          </button>
        </header>

        {isLoading && <p className="data-state" role="status">엽서를 불러오는 중이에요.</p>}
        {error && (
          <div className="data-state data-state-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={onRetry}>다시 시도</button>
          </div>
        )}
        {!isLoading && !error && chapters.length === 0 && <p className="data-state">아직 만든 엽서가 없어요.</p>}
        {!isLoading && !error && <ol className="chapter-cards">
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <div className="chapter-number">{String(index + 1).padStart(2, '0')}</div>
              <img className="chapter-timeline" src={index % 2 === 0 ? timelineA : timelineB} alt="" />
              <article>
                <div>
                  <h3>{chapter.title}</h3>
                  {chapter.nextAction && <div className="chapter-tags"><span className="purple">{chapter.nextAction}</span></div>}
                </div>
                <button type="button" aria-label={`${chapter.title} 삭제`}>
                  <img src={index === 0 ? deleteActiveIcon : deleteMutedIcon} alt="" />
                </button>
              </article>
            </li>
          ))}
        </ol>}
      </section>
      <div className="home-indicator" aria-hidden="true" />
    </main>
  )
}
