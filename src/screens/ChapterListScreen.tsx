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
import { familyApi, type Book } from '../api/family'
import type { Chapter } from '../features/missions/api'

function chapterTags(chapter: Chapter) {
  switch (chapter.nextAction) {
    case 'READ': return [{ label: '열람 가능', tone: 'green' }]
    case 'DO_MISSION': return [{ label: '미션 완료하기', tone: 'pink' }]
    case 'WAIT_FOR_OPEN': return [{ label: '상대의 미션 완료를 기다려요', tone: 'purple' }]
    case 'WAIT': return [{ label: '상대의 미션을 기다려요', tone: 'purple' }]
    default: return [{ label: '이야기 쓰고 미션 주기', tone: 'green' }]
  }
}

function canDeleteChapter(chapter: Chapter) {
  return !chapter.myStory && !chapter.counterpartStory && !chapter.receivedMission &&
    chapter.progress.every((item) => !item.storyCompleted && !item.reflectionCompleted)
}

function ChapterCard({ chapter, index, onDelete }: { chapter: Chapter; index: number; onDelete: () => void }) {
  const canDelete = canDeleteChapter(chapter)
  return (
    <article className="chapter-list-row">
      <strong className="chapter-number">{String(index + 1).padStart(2, '0')}</strong>
      <img className="chapter-thread" src={index % 2 ? threadRight : threadLeft} alt="" aria-hidden="true" />
      <div className="chapter-summary-card">
        <div className="chapter-summary-copy">
          <h2>{chapter.name}</h2>
          <div className="chapter-tags">
            {chapterTags(chapter).map((tag) => <span className={`chapter-tag ${tag.tone}`} key={tag.label}>{tag.label}</span>)}
          </div>
        </div>
        <button className="chapter-delete-button" type="button" disabled={!canDelete} onClick={onDelete} aria-label={`${chapter.name} 챕터 삭제`}>
          <img src={canDelete ? deleteActiveIcon : deleteMutedIcon} alt="" />
        </button>
      </div>
    </article>
  )
}

export function ChapterListScreen() {
  const navigate = useNavigate()
  const { bookId } = useParams()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [book, setBook] = useState<Book | null>(null)
  const [chapterToDelete, setChapterToDelete] = useState<Chapter | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    let active = true
    void Promise.all([familyApi.getBook(Number(bookId)), familyApi.getChapters(Number(bookId))]).then(([nextBook, nextChapters]) => {
      if (active) { setBook(nextBook); setChapters(nextChapters) }
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : '챕터를 불러오지 못했어요.')
    }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [bookId, reloadKey])

  return (
    <div className="app-shell">
      <main className="screen chapter-list-screen" data-book-id={bookId}>
        <section className="chapter-list-hero">
          <StatusBar />
          <PageHeader title="" onBack={() => navigate('/')} />
          <div className="chapter-book-cover">
            <div className="chapter-book-copy">
              <div className="chapter-book-title">
                <strong>{book?.counterpartLabel ?? '가족'}</strong><img className="chapter-book-link" src={relationLink} alt="" aria-hidden="true" /><strong>나</strong>
              </div>
              <p>현재 열람 가능한 엽서가 <strong>{chapters.filter((chapter) => chapter.nextAction === 'READ').length}</strong> 개 있어요!</p>
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
            {loading && <p role="status">챕터를 불러오는 중이에요…</p>}
            {error && <p role="alert">{error} <button type="button" onClick={() => { setError(''); setLoading(true); setReloadKey((key) => key + 1) }}>다시 시도</button></p>}
            {!loading && !error && chapters.length === 0 && <p>아직 챕터가 없어요.</p>}
            {chapters.map((chapter, index) => <ChapterCard chapter={chapter} index={index} onDelete={() => setChapterToDelete(chapter)} key={chapter.id} />)}
          </div>
        </section>

        {chapterToDelete && (
          <div className="chapter-delete-overlay">
            <section className="chapter-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="chapter-delete-title">
              <div className="chapter-delete-copy">
                <div className="chapter-delete-target"><strong>{String(chapters.indexOf(chapterToDelete) + 1).padStart(2, '0')}</strong><span>{chapterToDelete.name}</span></div>
                <div>
                  <h2 id="chapter-delete-title">챕터를 삭제할까요?</h2>
                  <p>아직 아무도 쓰지 않은 챕터예요.<br />삭제하면 엄마 화면에서도 사라져요.</p>
                </div>
              </div>
              <div className="chapter-delete-actions">
                <button type="button" onClick={() => { setChapterToDelete(null); setError('') }}>취소</button>
                <button className="confirm" type="button" disabled={deleting} onClick={() => {
                  setDeleting(true)
                  void familyApi.deleteChapter(chapterToDelete.id).then(() => familyApi.getChapters(Number(bookId))).then((nextChapters) => {
                    setChapters(nextChapters)
                    setChapterToDelete(null)
                  }).catch((cause: unknown) => setError(cause instanceof Error ? cause.message : '챕터를 삭제하지 못했어요.')).finally(() => setDeleting(false))
                }}>{deleting ? '삭제 중…' : '챕터 삭제'}</button>
              </div>
              {error && <p role="alert">{error}</p>}
            </section>
          </div>
        )}
        <div className="home-indicator" aria-hidden="true" />
      </main>
    </div>
  )
}
