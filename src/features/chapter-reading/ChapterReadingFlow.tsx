import { useEffect, useState } from 'react'
import './chapter-reading.css'

type Story = {
  title: string | null
  content: string | null
}

type Reflection = {
  content: string | null
}

type Chapter = {
  id: number
  name: string | null
  nextAction: string
  openedAt: string | null
  myStory: Story | null
  counterpartStory: Story | null
  myReflection: Reflection | null
  counterpartReflection: Reflection | null
}

type ApiResponse = {
  success: boolean
  data: Chapter | null
  error: { code?: string; message?: string } | null
}

type Props = {
  chapterId: string
  onBack?: () => void
}

type Screen = 'opening' | 'stories' | 'reflections'

export function ChapterReadingFlow({ chapterId, onBack }: Props) {
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [screen, setScreen] = useState<Screen>('opening')

  useEffect(() => {
    const controller = new AbortController()

    async function loadChapter() {
      setLoading(true)
      setError(null)
      setChapter(null)
      setScreen('opening')

      try {
        const response = await fetch(
          `/api/v1/chapters/${encodeURIComponent(chapterId)}`,
          { credentials: 'include', signal: controller.signal },
        )
        const result = (await response.json()) as ApiResponse

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error?.message ?? '챕터를 불러오지 못했어요.')
        }

        setChapter(result.data)
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(
            cause instanceof Error
              ? cause.message
              : '챕터를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
          )
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    if (!chapterId.trim()) {
      setError('챕터 ID가 필요해요.')
      setLoading(false)
    } else {
      void loadChapter()
    }

    return () => controller.abort()
  }, [chapterId])

  const isOpen = chapter?.nextAction === 'READ'
  const hasStories = Boolean(chapter?.myStory && chapter.counterpartStory)
  const hasReflections = Boolean(
    chapter?.myReflection && chapter.counterpartReflection,
  )
  const canRead = Boolean(isOpen && hasStories)
  const period = chapter?.name?.trim() || '우리의 이야기'
  const storyPeriod = period.replace(/\s*이야기$/, '')
  const chapterNumber = chapter ? String(chapter.id).padStart(2, '0') : ''

  function goBack() {
    if (screen === 'reflections') setScreen('stories')
    else if (screen === 'stories') setScreen('opening')
    else onBack?.()
  }

  return (
    <main className="chapter-reading-app">
      <div className="chapter-reading-phone">
        <div className="chapter-reading-status" aria-hidden="true">
          <span>09:41</span>
          <span className="status-icons">● ● ▰</span>
        </div>

        <header className="chapter-reading-header">
          <button className="icon-button" type="button" onClick={goBack} aria-label="뒤로 가기">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <span className="chapter-reading-brand">RE Post</span>
          <span className="chapter-header-spacer" />
        </header>

        {loading && (
          <section className="chapter-state" aria-live="polite">
            <span className="chapter-spinner" />
            <p>챕터를 펼치는 중이에요</p>
          </section>
        )}

        {!loading && error && (
          <section className="chapter-state chapter-state-card" role="alert">
            <h1>챕터를 불러오지 못했어요</h1>
            <p>{error}</p>
            <button className="chapter-primary-button" type="button" onClick={() => window.location.reload()}>
              다시 불러오기
            </button>
          </section>
        )}

        {!loading && !error && chapter && (
          <>
            {screen === 'opening' && (
              <section className="chapter-opening">
                <p className="chapter-kicker">OUR CHAPTER</p>
                <h1>{period}</h1>
                <p className="chapter-opening-copy">
                  {canRead
                    ? '서로의 이야기를 한 장씩 펼쳐보세요.'
                    : '두 사람의 이야기를 모으고 있어요. 모두 준비되면 함께 열어볼 수 있어요.'}
                </p>
                <div className="chapter-book-cover" aria-label={`${period} 챕터 표지`}>
                  <span className="cover-decoration cover-decoration-one" />
                  <span className="cover-decoration cover-decoration-two" />
                  <span className="cover-label">우리의 교환일기</span>
                  <span className="cover-title">{period}</span>
                  <span className="cover-bottom">RE POST · FAMILY LETTERS</span>
                </div>
                {canRead ? (
                  <button className="chapter-primary-button" type="button" onClick={() => setScreen('stories')}>
                    이야기 펼치기 <span aria-hidden="true">→</span>
                  </button>
                ) : (
                  <div className="chapter-waiting-note" role="status">
                    <span className="waiting-dot" />
                    아직 열람할 수 없어요
                  </div>
                )}
              </section>
            )}

            {screen === 'stories' && canRead && chapter.myStory && chapter.counterpartStory && (
              <section className="chapter-content-screen">
                <p className="chapter-kicker">chapter. {chapterNumber}</p>
                <h1 className="chapter-screen-title">{period}</h1>
                <div className="story-papers">
                  <StoryPaper variant="green" label={`가족의 ${storyPeriod}`} story={chapter.counterpartStory} />
                  <StoryPaper variant="pink" label={`나의 ${storyPeriod}`} story={chapter.myStory} />
                </div>
                <PageNavigation current={1} onPrevious={() => setScreen('opening')} onNext={() => setScreen('reflections')} />
              </section>
            )}

            {screen === 'reflections' && canRead && (
              <section className="chapter-content-screen">
                <p className="chapter-kicker">chapter. {chapterNumber}</p>
                <h1 className="chapter-screen-title">서로에게 남긴 후기</h1>
                {hasReflections ? (
                  <div className="reflection-papers">
                    <ReflectionPaper variant="green" label="내가 남긴 후기" reflection={chapter.myReflection} />
                    <ReflectionPaper variant="pink" label="가족이 남긴 후기" reflection={chapter.counterpartReflection} />
                  </div>
                ) : (
                  <div className="chapter-waiting-note" role="status">
                    두 사람의 감상을 불러오고 있어요.
                  </div>
                )}
                <PageNavigation current={2} onPrevious={() => setScreen('stories')} onNext={() => setScreen('opening')} />
              </section>
            )}
          </>
        )}

        <div className="chapter-home-indicator" aria-hidden="true"><span /></div>
      </div>
    </main>
  )
}

function StoryPaper({
  variant,
  label,
  story,
}: {
  variant: 'green' | 'pink'
  label: string
  story: Story
}) {
  return (
    <article className={`memory-paper ${variant}`}>
      <h2>{label}</h2>
      {story.title && <h3>{story.title}</h3>}
      <p>{story.content || '아직 작성된 이야기가 없어요.'}</p>
    </article>
  )
}

function ReflectionPaper({
  variant,
  label,
  reflection,
}: {
  variant: 'green' | 'pink'
  label: string
  reflection: Reflection | null
}) {
  return (
    <article className={`memory-paper reflection-paper ${variant}`}>
      <h2>{label}</h2>
      <p>{reflection?.content || '아직 남긴 감상이 없어요.'}</p>
    </article>
  )
}

function PageNavigation({
  current,
  onPrevious,
  onNext,
}: {
  current: number
  onPrevious: () => void
  onNext: () => void
}) {
  return (
    <nav className="chapter-page-navigation" aria-label="챕터 페이지 이동">
      <button type="button" onClick={onPrevious} aria-label="이전 페이지">‹</button>
      <div className="chapter-page-dots" aria-label={`${current} / 2`}>
        <span className={current === 1 ? 'active' : ''} />
        <span className={current === 2 ? 'active' : ''} />
      </div>
      <button type="button" onClick={onNext} aria-label="다음 페이지">›</button>
    </nav>
  )
}
