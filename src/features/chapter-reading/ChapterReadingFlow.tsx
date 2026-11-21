import { StatusBar } from '../../components/StatusBar'
import ribbonGreen from '../../assets/hifi/ribbon-green.svg'
import ribbonPink from '../../assets/hifi/ribbon-pink.svg'
import { chapterApi } from './api'
import { useEffect, useState } from 'react'
import './chapter-reading.css'

type Story = { title:string|null; content:string|null; missionInstruction?:string|null; completedAt?:string|null }

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

type Props = {
  chapterId: string
  onBack?: () => void
}

type Screen = 'opening' | 'write' | 'stories' | 'reflections'

export function ChapterReadingFlow({ chapterId, onBack }: Props) {
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [screen, setScreen] = useState<Screen>('opening')
  const [activePage,setActivePage]=useState<'counterpart'|'mine'>('counterpart')
  const [storyTitle,setStoryTitle]=useState('')
  const [storyContent,setStoryContent]=useState('')
  const [missionInstruction,setMissionInstruction]=useState('')
  const [saving,setSaving]=useState(false)
  const [saveError,setSaveError]=useState<string|null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadChapter() {
      setLoading(true)
      setError(null)
      setChapter(null)
      setScreen('opening')

      try {
        const data = await chapterApi.get(chapterId)
        setChapter(data)
        setStoryTitle(data.myStory?.title ?? '')
        setStoryContent(data.myStory?.content ?? '')
        setMissionInstruction(data.myStory?.missionInstruction ?? '')
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

    void loadChapter()

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

  async function saveStory(complete:boolean) {
    if(!chapter||saving)return
    setSaving(true);setSaveError(null)
    try {
      const updated=await chapterApi.write(chapter.id,{title:storyTitle.trim(),content:storyContent.trim(),missionInstruction:missionInstruction.trim()})
      const result=complete?await chapterApi.complete(chapter.id):updated
      setChapter(result)
      if(complete)setScreen('opening')
    } catch(cause) { setSaveError(cause instanceof Error?cause.message:'이야기를 저장하지 못했어요.') } finally { setSaving(false) }
  }

  function goBack() {
    if (screen === 'write') setScreen('opening')
    else if (screen === 'reflections') setScreen('stories')
    else if (screen === 'stories' && activePage === 'mine') setActivePage('counterpart')
    else if (screen === 'stories') setScreen('opening')
    else onBack?.()
  }

  return (
    <main className="chapter-reading-app">
      <div className="chapter-reading-phone">
        <StatusBar />

        <header className="chapter-reading-header">
          <button className="icon-button" type="button" onClick={goBack} aria-label="뒤로 가기">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <span className="chapter-header-spacer" />
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
            {screen === 'opening' && chapter.nextAction === 'WRITE_STORY' && (
              <section className="chapter-opening">
                <p className="chapter-kicker">chapter. {chapterNumber}</p><h1>{period}</h1>
                <p className="chapter-opening-copy">우리의 이야기를 먼저 적어주세요.</p>
                <button className="chapter-primary-button" type="button" onClick={()=>setScreen('write')}>이야기 쓰기</button>
              </section>
            )}
            {screen === 'opening' && chapter.nextAction !== 'WRITE_STORY' && (

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

            {screen === 'write' && chapter.nextAction === 'WRITE_STORY' && (
              <section className="chapter-content-screen story-writing-form">
                <p className="chapter-kicker">chapter. {chapterNumber}</p><h1 className="chapter-screen-title">{period} 이야기</h1>
                <label>이야기 제목<input value={storyTitle} maxLength={200} onChange={e=>setStoryTitle(e.target.value)} /></label>
                <label>나의 이야기<textarea value={storyContent} maxLength={20000} onChange={e=>setStoryContent(e.target.value)} /></label>
                <label>가족에게 보낼 미션<textarea value={missionInstruction} maxLength={2000} onChange={e=>setMissionInstruction(e.target.value)} /></label>
                {saveError&&<p role="alert">{saveError}</p>}
                <button className="chapter-primary-button" disabled={saving||!storyTitle.trim()||!storyContent.trim()||!missionInstruction.trim()} onClick={()=>void saveStory(false)}>{saving?'저장 중…':'임시 저장'}</button>
                <button className="chapter-primary-button" disabled={saving||!storyTitle.trim()||!storyContent.trim()||!missionInstruction.trim()} onClick={()=>void saveStory(true)}>{saving?'완료 중…':'작성 완료'}</button>
              </section>
            )}
            {screen === 'stories' && canRead && chapter.myStory && chapter.counterpartStory && (
              <section className="chapter-content-screen">
                <p className="chapter-kicker">chapter. {chapterNumber}</p>
                <h1 className="chapter-screen-title">{period}</h1>
                <div className="story-papers">
                  {activePage==='counterpart'
                    ? <StoryPaper variant="green" label={`가족의 ${storyPeriod}`} story={chapter.counterpartStory} reflection={chapter.myReflection} />
                    : <StoryPaper variant="pink" label={`나의 ${storyPeriod}`} story={chapter.myStory} reflection={chapter.counterpartReflection} />}
                </div>
                <PageNavigation current={activePage==='counterpart'?1:2} onPrevious={() => { if(activePage==='mine') setActivePage('counterpart'); else setScreen('opening') }} onNext={() => { if(activePage==='counterpart') setActivePage('mine'); else setScreen('reflections') }} />
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
  reflection,
}: {
  variant: 'green' | 'pink'
  label: string
  story: Story
  reflection: Reflection | null
}) {
  const [flipped, setFlipped] = useState(false)
  return (
    <article
      className={`memory-paper ${variant} ${flipped ? 'reflection-paper' : ''}`}
      role="button"
      tabIndex={0}
      aria-label={`${label}, ${flipped ? '이야기' : '후기'} 보기`}
      aria-pressed={flipped}
      onClick={() => setFlipped(value => !value)}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          setFlipped(value => !value)
        }
      }}
    >
      <h2><img src={variant === 'green' ? ribbonGreen : ribbonPink} alt="" />{flipped ? `${label}에 남긴 후기` : label}</h2>
      {!flipped && story.title && <h3>{story.title}</h3>}
      <p>{flipped ? reflection?.content || '아직 남긴 감상이 없어요.' : story.content || '아직 작성된 이야기가 없어요.'}</p>
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
      <h2><img src={variant === 'green' ? ribbonGreen : ribbonPink} alt="" />{label}</h2>
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
