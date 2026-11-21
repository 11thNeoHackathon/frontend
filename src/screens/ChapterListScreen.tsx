import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import deleteActiveIcon from '../assets/chapter-list/delete-active.svg'
import deleteMutedIcon from '../assets/chapter-list/delete-muted.svg'
import postcardFront from '../assets/chapter-list/postcard-front.svg'
import relationLink from '../assets/chapter-list/relation-link.svg'
import threadLeft from '../assets/chapter-list/thread-left.svg'
import threadRight from '../assets/chapter-list/thread-right.svg'
import { PageHeader } from '../components/PageHeader'
import { StatusBar } from '../components/StatusBar'

type ChapterTagTone = 'green' | 'pink' | 'purple'

type ChapterListItem = {
  id: string
  number: string
  title: string
  tags: Array<{ label: string; tone: ChapterTagTone }>
  canDelete: boolean
  thread: 'left' | 'right'
}

const initialChapters: ChapterListItem[] = [
  { id: 'chapter-1', number: '01', title: '초등학생 시절', tags: [{ label: '열람 가능', tone: 'green' }], canDelete: true, thread: 'left' },
  { id: 'chapter-2', number: '02', title: '중학교 시절', tags: [{ label: '엄마가 추가', tone: 'green' }, { label: '내 미션 하기', tone: 'pink' }], canDelete: false, thread: 'right' },
  { id: 'chapter-3', number: '03', title: '중학교 시절', tags: [{ label: '아직 아무도 안 썼어요', tone: 'purple' }, { label: '내 미션 하기', tone: 'pink' }], canDelete: false, thread: 'left' },
]

function ChapterCard({ chapter, onDelete }: { chapter: ChapterListItem; onDelete: () => void }) {
  return (
    <article className="chapter-list-row">
      <strong className="chapter-number">{chapter.number}</strong>
      <img className="chapter-thread" src={chapter.thread === 'left' ? threadLeft : threadRight} alt="" aria-hidden="true" />
      <div className="chapter-summary-card">
        <div className="chapter-summary-copy">
          <h2>{chapter.title}</h2>
          <div className="chapter-tags">
            {chapter.tags.map((tag) => <span className={`chapter-tag ${tag.tone}`} key={tag.label}>{tag.label}</span>)}
          </div>
        </div>
        <button className="chapter-delete-button" type="button" disabled={!chapter.canDelete} onClick={onDelete} aria-label={`${chapter.title} 챕터 삭제`}>
          <img src={chapter.canDelete ? deleteActiveIcon : deleteMutedIcon} alt="" />
        </button>
      </div>
    </article>
  )
}

export function ChapterListScreen() {
  const navigate = useNavigate()
  const { bookId } = useParams()
  const [chapters, setChapters] = useState(initialChapters)
  const [chapterToDelete, setChapterToDelete] = useState<ChapterListItem | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="app-shell">
      <main className="screen chapter-list-screen" data-book-id={bookId}>
        <section className="chapter-list-hero">
          <StatusBar />
          <PageHeader title="" onBack={() => navigate('/')} />
          <div className="chapter-book-cover">
            <div className="chapter-book-copy">
              <div className="chapter-book-title">
                <strong>엄마</strong><img className="chapter-book-link" src={relationLink} alt="" aria-hidden="true" /><strong>나</strong>
              </div>
              <p>현재 열람 가능한 엽서가 <strong>{chapters.length}</strong> 개 있어요!</p>
            </div>
            <div className="chapter-postcard-mascot" aria-hidden="true">
              <span />
              <img src={postcardFront} alt="" />
            </div>
          </div>
        </section>

        <section className="chapter-list-content">
          <header className="chapter-list-heading">
            <h1>지금까지 나눈 엽서 <strong>{chapters.length}</strong> 개</h1>
            <button type="button" onClick={() => navigate(`/books/${bookId}/chapters/new`)} aria-label="챕터 추가">＋</button>
          </header>
          <div className="chapter-list">
            {chapters.map((chapter) => <ChapterCard chapter={chapter} onDelete={() => setChapterToDelete(chapter)} key={chapter.id} />)}
          </div>
        </section>

        {chapterToDelete && (
          <div className="chapter-delete-overlay">
            <section className="chapter-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="chapter-delete-title">
              <div className="chapter-delete-copy">
                <div className="chapter-delete-target"><strong>{chapterToDelete.number}</strong><span>{chapterToDelete.title}</span></div>
                <div>
                  <h2 id="chapter-delete-title">챕터를 삭제할까요?</h2>
                  <p>아직 아무도 쓰지 않은 챕터예요.<br />삭제하면 엄마 화면에서도 사라져요.</p>
                </div>
              </div>
              <div className="chapter-delete-actions">
                <button type="button" onClick={() => setChapterToDelete(null)}>취소</button>
                <button className="confirm" type="button" onClick={() => { setChapters((current) => current.filter((chapter) => chapter.id !== chapterToDelete.id)); setChapterToDelete(null) }}>챕터 삭제</button>
              </div>
            </section>
          </div>
        )}
        <div className="home-indicator" aria-hidden="true" />
      </main>
    </div>
  )
}
